import os

# Saving the provided SVG content into an SVG file that the user can download.

svg_content = """
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0,0,256,256"><g fill="none" fill-rule="none" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M6.001,40.999v-33.998c0,-0.551 0.448,-1 1,-1h33.999c0.551,0 1,0.449 1,1v33.999c0,0.552 -0.449,1 -1,1h-33.999c-0.552,-0.001 -1,-0.449 -1,-1.001zM39.999,39.999v-31.998h-31.998v31.999h31.998z" fill="#1976d2" fill-rule="evenodd"></path><path d="M3.997,4.001v6h6.004v-6z" fill="#1976d2" fill-rule="evenodd"></path><path d="M37.995,4.001v6h6.004v-6z" fill="#1976d2" fill-rule="evenodd"></path><path d="M3.999,38.001v6h6.004v-6z" fill="#1976d2" fill-rule="evenodd"></path></g></g></svg>
"""

# Saving it as an SVG file
# Create folders if they don't exist
file_path = "./src/assets/icons/custom_icon.svg"

os.makedirs(os.path.dirname(file_path), exist_ok=True)

# Only write if the file does not already exist
if not os.path.exists(file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(svg_content)
    print(f"SVG file created at: {file_path}")
else:
    print(f"File already exists at: {file_path}")
