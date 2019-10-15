import os


def file_tree_helper(url, destination):
    arr = []
    for root, dirs, files in os.walk(destination):
        if os.path.basename(root) != 'help_files':
            directory = {
                "text": f"{os.path.basename(root)}",
                "path": f"/{os.path.basename(root)}/",
                "url": f"{url}/help_files/{os.path.basename(root)}",
                "leaf": False,
                "children": []
            }
            for file in files:
                directory['children'].append({
                    "text": f"{file}",
                    "path": f"/{file}",
                    "url": f"{url}/help_files/{os.path.basename(root)}/{file}",
                    "leaf": True,
                })
            arr.append(directory)
        else:
            for file in files:
                f = {
                    "text": f"{file}",
                    "path": f"/{file}",
                    "url": f"{url}/help_files/{file}",
                    "leaf": True,
                }
                arr.append(f)
    return arr
