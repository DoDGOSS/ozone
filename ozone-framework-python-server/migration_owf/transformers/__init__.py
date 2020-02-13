from datetime import datetime, timezone

from django.contrib.auth.hashers import make_password

from migration_tool import utils


def configure_settings():
    try:
        from django.conf import settings
        settings.configure()
    except:
        pass


def import_transform(data_set, table_name, target_db, **kwargs):
    results = data_set.copy()

    # lets set default values from our migration field table mappings.
    try:
        mapping = utils.get_mapping_for_table(table_name)
        for k, v in mapping.items():
            results.update({k: v})
    except IOError:
        # file did not exist, we dont have mapping,
        # so lets ignore this table.
        pass

    # We must set a password for users.
    # if table_name == 'person' and 'password' not in results.keys():
    #     configure_settings()
    #     results["password"] = make_password("password")

    # some mappings cannot be defined within json, so lets manipulate them here.
    data_set.update(results)
    for k in data_set.keys():

        # if target db table does not have a field we delete that
        # from dataset because target db does not support that field.
        if not target_db.column_exists(table_name, k):
            del results[k]

        # We dont want to create password for users.
        # if k == 'password' and table_name == 'person':
        #     if results[k] is not None:
        #         configure_settings()
        #         results[k] = make_password(results[k])

        # some values might be null from testing source db
        # fix and assign default value to those.
        if target_db.get_db_adapter_name().lower() in ('mssql',) and table_name == 'person':
            if k.lower() in ('last_login', 'prev_login', 'last_notification'):
                if results[k] is None:
                    results[k] = datetime.now(timezone.utc)

        # Oracle - convert date strings to datetime instances.
        if target_db.get_db_adapter_name().lower() in ('oracle',) and table_name == 'owf_group' and k == 'stack_id':
            del results[k]

        if target_db.get_db_adapter_name().lower() in ('oracle',) and table_name == 'person':
            if k.lower() in ('last_login', 'prev_login', 'last_notification'):
                if results[k] is None:
                    results[k] = str(datetime.now(timezone.utc))

        if target_db.get_db_adapter_name().lower() in ('oracle',):
            if (k.endswith('_date') or k.startswith('prev_') or k.startswith('last_')) and results[k]:
                results[k] = utils.convert_string_to_time(results[k], 'UTC')

        if target_db.get_db_adapter_name().lower() in ('oracle',) and table_name == 'application_configuration':
            if k in ('created_date', 'edited_date') and isinstance(results[k], datetime):
                results[k] = datetime.strptime(str(results[k])[:10], '%Y-%m-%d')

    return results
