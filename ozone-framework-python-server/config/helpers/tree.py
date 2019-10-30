from os import walk, path
from django.conf import settings


def file_to_dict(fpath):
    if not settings.DEBUG:
        return {
            'text': path.basename(fpath),
            'leaf': True,
            'path': path.relpath(fpath, start=settings.HELP_FILES),
        }
    else:
        return {
            'text': path.basename(fpath),
            'leaf': True,
            'path': path.relpath(fpath, start=settings.BASE_DIR),
        }


def folder_to_dict(rootpath):
    if not settings.DEBUG:
        return {
            'text': path.basename(rootpath),
            'leaf': False,
            'path': path.relpath(rootpath, start=settings.HELP_FILES),
            'children': [],
        }
    else:
        return {
            'text': path.basename(rootpath),
            'leaf': False,
            'path': path.relpath(rootpath, start=settings.BASE_DIR),
            'children': [],
        }


def tree_to_dict(rootpath):
    root_dict = folder_to_dict(rootpath)
    root, folders, files = walk(rootpath).__next__()
    root_dict['children'] = [file_to_dict(path.sep.join([root, fpath])) for fpath in files]
    root_dict['children'] += [tree_to_dict(path.sep.join([root, folder])) for folder in folders]
    return root_dict


def tree_to_json(rootdir):
    root, folders, files = walk(rootdir).__next__()
    root_dict = [tree_to_dict(path.sep.join([root, folder])) for folder in folders]
    root_dict += [file_to_dict(path.sep.join([root, fpath])) for fpath in files]
    return root_dict
