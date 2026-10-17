from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("CreateNewFile", views.CreateNewFile, name="CreateNewFile"),
    path("ReadFile/", views.ReadFile, name="ReadFile"),
    path(
        "ReadFileWithName/<str:project_name>/",
        views.ReadFileWithName,
        name="ReadFileWithName",
    ),  # New URL for reading the file
    path(
        "GetAllFiles/", views.GetAllFiles, name="GetAllFiles"
    ),  # New URL for reading the file
    path(
        "relayHierarchy", views.relay_hierarchy_view, name="relayHierarchy"
    ),  # New entry for the relay hierarchy view
    path(
        "get_ctclass_by_cal_acc_to",
        views.get_ctclass_by_cal_acc_to,
        name="get_ctclass_by_cal_acc_to",
    ),
    path("build_file_tree", views.build_file_tree, name="build_file_tree"),
    path("filetree", views.filetree, name="filetree"),
    path("file_content", views.file_content, name="file_content"),
    path("create-workspace/", views.create_workspace, name="create_workspace"),
    path("edit-workspace/", views.edit_workspace, name="edit-workspace"),
    path("fetch_workspace/", views.fetch_workspace, name="fetch_workspace"),
    path("f_workspace/", views.fetch_workspace, name="f"),
    path("list_workspaces/", views.list_workspaces, name="list_workspaces"),
    path("delete_file/", views.delete_file_or_directory, name="delete_file"),
    path("copy_file/", views.copy_file, name="copy_file"),
    path("cut_file/", views.cut_file, name="cut_file"),
]
