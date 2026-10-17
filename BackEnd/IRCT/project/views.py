from django.shortcuts import render
import os
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import shutil
from django.views.decorators.csrf import csrf_exempt
import base64
from django.http import JsonResponse
import sys
if sys.platform == "win32":
    import winreg
    import win32clipboard
    import win32con
import json
from .models import *
from django.shortcuts import get_object_or_404
import os
from django.views.decorators.http import require_http_methods
from .models import WorkSpace
import json
from django.utils.timezone import now
from django.utils import timezone
import logging
import ctypes
import struct

logger = logging.getLogger(__name__)


# Constants for clipboard drop effect
DROPEFFECT_COPY = 1
DROPEFFECT_MOVE = 2


def _prepare_clipboard(file_path, move=False):
    abs_path = os.path.abspath(file_path)
    if not os.path.exists(abs_path):
        raise FileNotFoundError("File not found")

    # Encode path as UTF-16LE (Windows Unicode)
    path_bytes = abs_path.encode("utf-16le") + b"\x00\x00"  # null-terminated
    double_null = b"\x00\x00"  # extra null terminator (double-null = end of list)

    # DROPFILES structure: typedef struct { DWORD pFiles; POINT pt; BOOL fNC; BOOL fWide; }
    dropfiles_struct = struct.pack("IiiII", 20, 0, 0, 0, 1)  # fWide=1 for Unicode

    # Combine structure and path
    clipboard_data = dropfiles_struct + path_bytes + double_null

    # Open clipboard
    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()

    # Set CF_HDROP (file list)
    win32clipboard.SetClipboardData(win32con.CF_HDROP, clipboard_data)

    if move:
        # Set "Preferred DropEffect" to DROPEFFECT_MOVE (2)
        format_name = "Preferred DropEffect"
        drop_format = win32clipboard.RegisterClipboardFormat(format_name)
        move_bytes = struct.pack("I", 2)  # 2 = DROPEFFECT_MOVE
        win32clipboard.SetClipboardData(drop_format, move_bytes)

    win32clipboard.CloseClipboard()


def prepare_file_clipboard(file_path, move=False):
    # Prepare file path in DROPFILES structure format
    abs_path = os.path.abspath(file_path)
    if not os.path.exists(abs_path):
        raise FileNotFoundError("File does not exist")

    # Create double null-terminated string of full path (required by CF_HDROP)
    file_list = abs_path + "\0\0"
    encoded = file_list.encode("utf-16le")

    # Allocate global memory for DROPFILES structure + file list
    total_size = ctypes.sizeof(DROPFILES) + len(encoded)
    h_global = ctypes.windll.kernel32.GlobalAlloc(win32con.GHND, total_size)
    ptr = ctypes.windll.kernel32.GlobalLock(h_global)

    # Fill DROPFILES struct
    dropfiles = DROPFILES()
    dropfiles.pFiles = ctypes.sizeof(DROPFILES)
    ctypes.memmove(ptr, ctypes.byref(dropfiles), ctypes.sizeof(DROPFILES))
    ctypes.memmove(ptr + ctypes.sizeof(DROPFILES), encoded, len(encoded))

    ctypes.windll.kernel32.GlobalUnlock(h_global)

    # Open clipboard and set data
    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardData(win32con.CF_HDROP, h_global)

    # Set DropEffect (optional for cut)
    if move:
        drop_effect = (ctypes.c_uint32 * 1)(DROPEFFECT_MOVE)
        drop_effect_ptr = ctypes.cast(drop_effect, ctypes.c_void_p)
        win32clipboard.SetClipboardData(
            win32clipboard.RegisterClipboardFormat("Preferred DropEffect"),
            drop_effect_ptr.value,
        )

    win32clipboard.CloseClipboard()


# DROPFILES structure definition for CF_HDROP
class DROPFILES(ctypes.Structure):
    _fields_ = [
        ("pFiles", ctypes.c_uint),
        ("pt_x", ctypes.c_long),
        ("pt_y", ctypes.c_long),
        ("fNC", ctypes.c_int),
        ("fWide", ctypes.c_int),
    ]

    def __init__(self):
        self.pFiles = 0
        self.pt_x = 0
        self.pt_y = 0
        self.fNC = 0
        self.fWide = 1  # Unicode


@csrf_exempt
def CreateNewFile(request):
    if request.method == "POST":
        try:
            # Step 1: Parse the JSON request body
            data = json.loads(request.body)
            project_name = data.get(
                "Project", "NewProject"
            )  # Default to 'NewProject' if not provided

            # Step 2: Get the current directory of the project
            current_dir = os.path.dirname(os.path.abspath(__file__))

            # Step 3: Go 2 folders back
            parent_dir = os.path.dirname(os.path.dirname(current_dir))

            # Step 4: Define the path for the Projects folder
            projects_folder_path = os.path.join(parent_dir, "Projects")

            # Step 5: Check for existence of the Projects folder
            if not os.path.exists(projects_folder_path):
                os.makedirs(projects_folder_path)

            # Step 6: Create the .IRCT file with the given project name
            irct_file_path = os.path.join(projects_folder_path, f"{project_name}.IRCT")

            # Step 7: Write the project data as structured JSON
            with open(irct_file_path, "w") as irct_file:
                json.dump(
                    data, irct_file, indent=4
                )  # Save the data in JSON format with indentation

            return JsonResponse(
                {"Result": "File Created", "FileName": f"{project_name}.IRCT"}
            )

        except Exception as e:
            return JsonResponse({"Error": str(e)}, status=500)
    else:
        return JsonResponse({"Error": "Invalid request method"}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def delete_file_or_directory(request):
    try:
        data = json.loads(request.body)
        path = data["path"]
        if not isinstance(path, str) or path.strip() == "":
            raise ValueError("Invalid path")
    except (KeyError, json.JSONDecodeError, ValueError) as e:
        logger.error(f"Invalid input: {str(e)}")
        return JsonResponse({"message": "Invalid input.", "isError": True}, status=400)

    abs_path = os.path.abspath(path)

    # Safety checks to prevent deletion of critical system paths
    dangerous_paths = [
        os.path.abspath(os.sep),  # Root directory (e.g., 'C:\\')
        os.path.abspath(os.path.join(os.sep, "Windows")),  # Windows system directory
        os.path.abspath("/etc"),  # Linux system config
        os.path.abspath("/bin"),  # Linux binaries
    ]
    if any(
        abs_path == dangerous_path or abs_path.startswith(dangerous_path + os.sep)
        for dangerous_path in dangerous_paths
    ):
        logger.error(f"Attempted deletion of system-critical path: {abs_path}")
        return JsonResponse(
            {
                "message": "Deletion of system-critical paths is not allowed.",
                "isError": True,
            },
            status=403,
        )

    try:
        if os.path.isfile(abs_path):
            os.remove(abs_path)
            logger.info(f"Deleted file: {abs_path}")
        elif os.path.isdir(abs_path):
            shutil.rmtree(abs_path)
            logger.info(f"Deleted directory: {abs_path}")
        else:
            logger.warning(f"Path does not exist: {abs_path}")
            return JsonResponse(
                {"message": "Path does not exist.", "isError": True}, status=404
            )
        return JsonResponse({"message": "Deleted successfully.", "isError": False})
    except PermissionError:
        logger.error(f"Permission denied: {abs_path}")
        return JsonResponse(
            {"message": "Permission denied.", "isError": True}, status=403
        )
    except Exception as e:
        logger.error(f"Error deleting {abs_path}: {str(e)}")
        return JsonResponse(
            {"message": f"An error occurred: {str(e)}", "isError": True}, status=500
        )


@csrf_exempt
def delete_file(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            file_path = data.get("file_path")
            if not file_path:
                return JsonResponse(
                    {"status": "error", "message": "File path is required"}, status=400
                )
            if os.path.exists(file_path):
                os.remove(file_path)
                return JsonResponse(
                    {
                        "status": "success",
                        "message": "File deleted successfully",
                        "file_path": file_path,
                    }
                )
            else:
                return JsonResponse(
                    {"status": "error", "message": "File not found"}, status=404
                )
        except json.JSONDecodeError:
            return JsonResponse(
                {"status": "error", "message": "Invalid JSON data"}, status=400
            )
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


@csrf_exempt
def copy_file(request):
    if request.method != "POST":
        return JsonResponse(
            {"status": "error", "message": "Invalid request"}, status=400
        )

    try:
        data = json.loads(request.body)
        file_path = data.get("file_path")
        if not file_path:
            return JsonResponse(
                {"status": "error", "message": "File path is required"}, status=400
            )

        if not os.path.exists(file_path):
            return JsonResponse(
                {"status": "error", "message": "File not found"}, status=404
            )

        abs_path = os.path.abspath(file_path)
        path_bytes = abs_path.encode("utf-16le") + b"\x00\x00"

        # DROPFILES structure (20 bytes)
        dropfiles_struct = struct.pack("IiiII", 20, 0, 0, 0, 1)  # fWide = 1 for Unicode

        clipboard_data = (
            dropfiles_struct + path_bytes + b"\x00\x00"
        )  # Double null-terminated

        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardData(win32con.CF_HDROP, clipboard_data)
        win32clipboard.CloseClipboard()

        return JsonResponse(
            {"status": "success", "message": "File copied to clipboard"}
        )

    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@csrf_exempt
def cut_file(request):
    if request.method != "POST":
        return JsonResponse(
            {"status": "error", "message": "Invalid request"}, status=400
        )

    try:
        data = json.loads(request.body)
        file_path = data.get("file_path")
        if not file_path:
            return JsonResponse(
                {"status": "error", "message": "File path is required"}, status=400
            )

        _prepare_clipboard(file_path, move=True)

        return JsonResponse({"status": "success", "message": "File cut to clipboard"})

    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    except FileNotFoundError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@csrf_exempt
def ReadFile(request):
    if request.method == "POST":
        try:
            body_unicode = request.body.decode("utf-8")
            body_data = json.loads(body_unicode)

            file_path = body_data.get("path")

            if not file_path or not os.path.exists(file_path):
                return JsonResponse(
                    {"Error": "File path is invalid or not found"}, status=404
                )

            with open(file_path, "r") as irct_file:
                file_content = irct_file.read()

            return JsonResponse({"Content": file_content, "Path": file_path})

        except Exception as e:
            return JsonResponse({"Error": str(e)}, status=500)

    else:
        return JsonResponse({"Error": "Invalid request method"}, status=400)


def ReadFileWithName(request, project_name):
    try:
        # Step 1: Get the current directory of the project
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # Step 2: Go 2 folders back
        parent_dir = os.path.dirname(os.path.dirname(current_dir))

        # Step 3: Define the path for the Projects folder
        projects_folder_path = os.path.join(parent_dir, "Projects")

        # Step 4: Create the file path for the requested project
        irct_file_path = os.path.join(projects_folder_path, f"{project_name}.IRCT")

        # Step 5: Check if the file exists
        if not os.path.exists(irct_file_path):
            return JsonResponse({"Error": "File not found"}, status=404)

        # Step 6: Open and read the file
        with open(irct_file_path, "r") as irct_file:
            file_content = irct_file.read()

        # Step 7: Return the file content as a JSON response
        return JsonResponse(
            {"Project": project_name, "Content": file_content, "Path": irct_file_path}
        )

    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500)


def GetAllFiles(request):
    try:
        # Step 1: Get the current directory of the project
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # Step 2: Go 2 folders back
        parent_dir = os.path.dirname(os.path.dirname(current_dir))

        # Step 3: Define the path for the Projects folder
        projects_folder_path = os.path.join(parent_dir, "Projects")

        # Step 4: List to store all found .IRCT files
        irct_files = []

        # Step 5: Walk through the Projects folder and look for .IRCT files
        for root, dirs, files in os.walk(projects_folder_path):
            for file in files:
                if file.endswith(".IRCT"):
                    irct_files.append(file)

        # Step 6: Return the list of files in a JsonResponse
        return JsonResponse({"IRCT_Files": irct_files})

    except Exception as e:
        return JsonResponse({"Error": str(e)}, status=500)


from .models import Relay


def relay_hierarchy_view(request):
    # Query all Relay objects and structure data
    relays_data = []
    for relay in Relay.objects.all():
        relay_data = {
            "name": relay.Relay_Name,
            "manufacture": relay.Manufacture.Name if relay.Manufacture else None,
            "relay_types": [],
        }

        for relay_type in relay.relay_types.all():  # Use the custom related name
            relay_type_data = {
                "name": relay_type.Type_Name,  # Adjust attribute names as needed
                "Ith_Ir": relay_type.Ith_Ir,
                "protection_functions": [],
                "cal_Acc_Tos": [],
                "irn_a_values": [],
            }

            for protection_function in relay_type.ProtectionFunction.all():
                protection_function_data = {
                    "name": protection_function.Formula,  # Adjust attribute names as needed
                }
                relay_type_data["protection_functions"].append(protection_function_data)

            for cal_Acc_To in relay_type.Cal_Acc_To.all():
                cal_Acc_To_data = {
                    "name": cal_Acc_To.Value,  # Adjust attribute names as needed
                }
                relay_type_data["cal_Acc_Tos"].append(cal_Acc_To_data)

            for irn_a in relay_type.IrnA.all():
                irn_a_data = {
                    "value": irn_a.Value,  # Adjust attribute names as needed
                    "BurdenPhaseVA": irn_a.BurdenPhaseVA,
                    # "BurdenEarthVA": ir_a.BurdenEarthVA,
                }

                relay_type_data["irn_a_values"].append(irn_a_data)

            relay_data["relay_types"].append(relay_type_data)

        relays_data.append(relay_data)

    return JsonResponse({"relays": relays_data}, safe=False)


@csrf_exempt
def get_ctclass_by_cal_acc_to(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            value = data.get("Value")
            if not value:
                return JsonResponse({"error": "Value is required"}, status=400)

            # Use filter() and take the first match
            cal_acc_to = Cal_Acc_To.objects.filter(Value=value).first()

            if not cal_acc_to:
                return JsonResponse({"error": "Cal_Acc_To not found"}, status=404)

            ct_classes = CTClass.objects.filter(Cal_Acc_To=cal_acc_to).values_list(
                "value", flat=True
            )

            return JsonResponse({"CTClasses": list(ct_classes)})
        except Exception as e:
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(e)
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def build_file_tree(dir_path):
    """بازسازی یک لایه از ساختار درختی فایل‌ها و پوشه‌ها"""
    if not os.path.exists(dir_path):
        return {"error": "Directory does not exist"}

    if not os.path.isdir(dir_path):
        return {"error": "Path is not a directory"}

    try:
        children = []
        for child in os.listdir(dir_path):
            child_path = os.path.join(dir_path, child)
            children.append(
                {
                    "name": child,
                    "path": child_path,
                    "isDirectory": os.path.isdir(child_path),
                    # No 'children' field to prevent recursion
                }
            )
        return {
            "name": os.path.basename(dir_path) or dir_path,
            "path": dir_path,
            "isDirectory": True,
            "children": children,
        }
    except Exception as e:
        return {"error": str(e)}


@csrf_exempt
def filetree(request):
    """دریافت یک لایه از لیست فایل‌ها و پوشه‌ها از طریق POST"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        dir_path = data.get("dir")

        print("filetree :", dir_path)

        if not dir_path:
            return JsonResponse({"error": "No directory path provided"}, status=400)

        tree = build_file_tree(dir_path)
        if "error" in tree:
            return JsonResponse(tree, status=400)

        print("success")
        print(f"\t {tree}")
        return JsonResponse(tree)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def file_content(request):
    """Get file content via POST"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        file_path = data.get("path")

        if not file_path or not os.path.isfile(file_path):
            return JsonResponse({"error": "File not found"}, status=404)

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        return HttpResponse(content, content_type="text/plain")
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Utility function to create a folder
def create_folder(full_path):
    os.makedirs(full_path, exist_ok=True)


# Utility function to create a cfg file
def create_cfg_file(folder_path, name):
    cfg_path = os.path.join(folder_path, f"{name}.cfg")
    with open(cfg_path, "w") as f:
        f.write("")  # create an empty cfg file
    return cfg_path


@csrf_exempt
@require_http_methods(["POST"])
def edit_workspace(request):
    try:
        data = json.loads(request.body)
        name = data["name"]
        oldName = data["oldName"]
        path = data["path"]
        content = data.get("content", "")

        print(oldName)
        print(name)
        print(path)
    except (KeyError, json.JSONDecodeError):
        return JsonResponse({"message": "Invalid input.", "isError": True}, status=400)

    if name == "":
        return JsonResponse(
            {"message": "Project name cannot be empty!", "isError": True}, status=400
        )

    try:
        # Use oldName and path to identify the workspace
        workspace = WorkSpace.objects.get(path=path, name=oldName)
    except WorkSpace.DoesNotExist:
        return JsonResponse(
            {"message": "Workspace does not exist.", "isError": True}, status=404
        )

    # Skip uniqueness check if name and path are unchanged
    if name != oldName or path != workspace.path:
        # Check if another workspace with the new name and path exists (excluding current workspace)
        if (
            WorkSpace.objects.filter(path=path, name=name)
            .exclude(path=workspace.path, name=oldName)
            .exists()
        ):
            return JsonResponse(
                {
                    "message": "Another workspace with this name and path exists.",
                    "isError": True,
                },
                status=400,
            )

    # Use the original folder path (no folder renaming)
    folder_path = path

    try:
        # Determine paths for old and new .cfg files
        old_cfg_path = os.path.join(folder_path, f"{oldName}.cfg")
        new_cfg_path = os.path.join(folder_path, f"{name}.cfg")

        # If name changed, rename the .cfg file
        if name != oldName and os.path.exists(old_cfg_path):
            os.rename(old_cfg_path, new_cfg_path)

        # Update the configuration file with new content
        with open(new_cfg_path, "w") as f:
            f.write(content)

        # Update workspace in database
        workspace.name = name
        workspace.path = path
        workspace.save()

        return JsonResponse(
            {"message": "Workspace updated.", "id": workspace.id, "isError": False}
        )
    except Exception as e:
        print(e)
        return JsonResponse({"message": str(e), "isError": True}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def create_workspace(request):
    try:
        data = json.loads(request.body)
        path = data["path"]
        name = data["name"]
        content = data.get("content", "")  # default to empty if not provided
    except (KeyError, json.JSONDecodeError):
        return JsonResponse({"message": "Invalid input.", "isError": True}, status=400)

    if name == "":
        return JsonResponse(
            {"message": "Project cannot be empty!", "isError": True}, status=400
        )

    full_folder_path = os.path.join(path, name)
    
    if WorkSpace.objects.filter(path=full_folder_path, name=name).exists():
        return JsonResponse(
            {"message": "This name exists, try a different name.", "isError": True},
            status=400,
        )

    try:
        # create folder + cfg file
        create_folder(full_folder_path)
        cfg_path = os.path.join(full_folder_path, f"{name}.cfg")
        with open(cfg_path, "w") as f:
            f.write(content)

        # Store the full project folder path (consistent with fetch_workspace)
        workspace = WorkSpace.objects.create(path=full_folder_path, name=name)

        # ✅ Return the same format as fetch_workspace
        return JsonResponse(
            {
                "message": "Workspace created.",
                "id": workspace.id,
                "content": content,
                "isError": False,
            }
        )
    except Exception as e:
        return JsonResponse({"message": str(e), "isError": True}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def fetch_workspace(request):
    try:
        data = json.loads(request.body)
        cfg_path = data[
            "path"
        ]  # Expect full path like C:/Users/mthzi/OneDrive/Desktop/TestWorkFlow/TestProject_2/TestProject_2.cfg
    except (KeyError, json.JSONDecodeError):
        return JsonResponse({"error": "Invalid input.", "isError": True}, status=400)

    # Extract folder path and name from cfg_path
    folder_path = os.path.dirname(cfg_path)
    name = os.path.basename(cfg_path).split(".")[0]  # Remove .cfg extension

    print("cfg_path cfg_path cfg_path " ,cfg_path)
    print("folder_path folder_path folder_path " ,folder_path)
    print("name name name name ",name)
    # Check if folder and .cfg file exist
    if not os.path.isdir(folder_path) or not os.path.isfile(cfg_path):
        # Try to delete any corresponding Workspace instance
        WorkSpace.objects.filter(path=folder_path, name=name).delete()
        return JsonResponse(
            {
                "error": "Folder or .cfg file does not exist. Workspace removed from database.",
                "isError": True,
            }
        )

    try:
        with open(cfg_path, "r") as f:
            content = f.read()

        print("You made it here")
        workspace, created = WorkSpace.objects.get_or_create(
            path=folder_path, name=name
        )
        workspace.date = timezone.now()
        workspace.save()
        print("You should have it now")

        return JsonResponse({"content": content, "id": workspace.id, "isError": False})
    except Exception as e:
        return JsonResponse({"error": str(e), "isError": True}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def list_workspaces(request):
    workspaces = WorkSpace.objects.all().order_by("-date")
    valid_data = []

    for ws in workspaces:
        full_path = os.path.join(ws.path, ws.name) + ".cfg"
        print("full_pathfull_pathfull_pathfull_path", full_path)
        if os.path.exists(full_path):
            valid_data.append(
                {"id": ws.id, "path": ws.path, "name": ws.name, "date": ws.date}
            )
        else:
            # Delete workspace from DB if folder doesn't exist
            ws.delete()
            pass

    return JsonResponse({"workspaces": valid_data})
