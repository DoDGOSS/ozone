import json
import uuid
import os
import sys


def main():
    """
    Convert legacy (v7) layout config to v8
    """
    ###### Configuration ######
    migration_result_directory = str(sys.argv[1])
    widget_instance_type = "user_widget_instance"  # user_widget_instance or widget_instance
    ###### END Configuration ######

    widgets_file = f"./migration_result/{migration_result_directory}/widget_definition.json"
    dashboards_file = f"./migration_result/{migration_result_directory}/dashboard.json"
    person_widgets_file = f"./migration_result/{migration_result_directory}/person_widget_definition.json"

    def gen_dict_extract(key, var):
        results = []
        if hasattr(var, 'items'):
            for k, v in var.items():
                if k == key:
                    yield v
                    results.append(v)
                if isinstance(v, dict):
                    for result in gen_dict_extract(key, v):
                        # yield result
                        results.append(result)
                elif isinstance(v, list):
                    for d in v:
                        for result in gen_dict_extract(key, d):
                            # yield result
                            results.append(result)

    def generate_layout_config_as_string(user_id=None, widgets=None):
        # construct base configuration
        base_config = dict()
        # note: background widgets appear to be broken in legacy
        base_config["backgroundWidgets"] = []
        base_config["panels"] = []
        base_config["tree"] = None
        # if widgets exist, add them to the layout configuration
        if widgets:
            panel = dict()
            panel["id"] = str(uuid.uuid4())
            panel["title"] = "New Accordion Panel"
            panel["type"] = "accordion"
            panel["widgets"] = []
            panel["collapsed"] = []
            for widget in widgets:
                widget_guid = widget.get("widgetGuid", None)
                widget_id = get_widget_id(widget_guid)
                if user_id and widget_id:
                    user_widget_id = get_user_widget_id(user_id, widget_id)
                    if user_widget_id:
                        if widget_instance_type == "user_widget_instance":
                            user_widget = {
                                "id": widget.get("uniqueId", uuid.uuid4),
                                "userWidgetId": user_widget_id
                            }
                            panel["widgets"].append(user_widget)
                            panel["collapsed"].append(True)
            if widget_instance_type == "widget_instance":
                widget_instance = {
                    "id": widget.get("uniqueId", uuid.uuid4),
                    "widgetId": widget_id
                }
                panel["widgets"].append(widget_instance)
                panel["collapsed"].append(True)
            base_config["panels"].append(panel)
            base_config["tree"] = panel["id"]
        print(f'New layout config: {json.dumps(base_config)}')
        return json.dumps(base_config)

    def get_widget_id(widget_guid, widgets_file=widgets_file):
        """
        Return widget id from widget guid
        """
        with open(widgets_file) as widgets:
            widgets = json.load(widgets)
            for widget in widgets:
                try:
                    if widget['widget_guid'] == widget_guid:
                        return widget['id']
                except Exception as e:
                    continue

    def get_user_widget_id(user_id, widget_id, person_widgets_file=person_widgets_file):
        """
        Return a user widget id if a PWD entry exists
        """
        with open(person_widgets_file) as person_widgets:
            person_widgets = json.load(person_widgets)
            for pwd in person_widgets:
                try:
                    if pwd["person_id"] == user_id and pwd["widget_definition_id"] == widget_id:
                        return pwd["id"]
                except Exception as e:
                    continue

    def generate_new_layout_config(dashboard_file=dashboards_file):
        with open(dashboard_file) as dashboards:
            dashboards_rewritten = []
            dashboards = json.load(dashboards)
            for dashboard in dashboards:
                try:
                    layout_config = json.loads(dashboard['layout_config'])
                except json.decoder.JSONDecodeError:
                    layout_config = dict()
                user_id = dashboard.get("user_id", None)
                widgets = None
                print("-" * 50)
                print(f"\nDashboard: {dashboard}")
                print(f"\nLegacy Layout config: {layout_config}")
                # if there are no widgets - we should generate anyways
                widgets_generator = gen_dict_extract("widgets", layout_config)
                for widgets in widgets_generator:
                    # for widgets in widgets_generator(layout_config):
                    print("widgets found in layout config..")
                    print(f'widgets       *******: {widgets}')
                    print(f'widgets count *******: {len(widgets)}')
                    print(f'user id       *******: {user_id}')
                # generate converted layout config even if there are no widgets
                dashboard['layout_config'] = generate_layout_config_as_string(user_id, widgets)
                dashboards_rewritten.append(dashboard)

        # Delete .old files if any.
        rootdir = f"./migration_result/{migration_result_directory}"
        for root, subFolders, files in os.walk(rootdir):
            for script in files:
                if script.endswith('_old.json'):
                    file = os.path.join(root, script)
                    os.remove(file)

        # Rename the previous dashboard.json file to old.dashboard.json
        try:
            old_dashboard_file = dashboard_file.replace('.json', '_old.json')
            os.rename(dashboard_file, old_dashboard_file)
        except FileNotFoundError:
            pass

        # # Re-write dashboards json file with updated layout config.
        with open(dashboard_file, 'w') as f:
            json.dump(dashboards_rewritten, f)

    generate_new_layout_config()


if __name__ == '__main__':
    main()
