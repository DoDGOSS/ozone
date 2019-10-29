from datetime import datetime, timezone

from django.contrib.auth.hashers import make_password

from migration_tool import utils


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

    # some mappings cannot be defined within json, so lets manipulate them here.
    data_set.update(results)
    for k in data_set.keys():

        # if target db table does not have a field we delete that
        # from dataset because target db does not support that field.
        if not target_db.column_exists(table_name, k):
            del results[k]

        if k == 'password' and table_name == 'person':
            if results[k] is None:
                password = utils.generate_password()
                results[k] = make_password(password)

        # some values might be null from testing source db
        # fix and assign default value to those.
        if target_db.get_db_adapter_name().lower() in ('oracle', 'mssql') and table_name == 'person':
            if k in ('last_login', 'prev_login', 'last_notification'):
                if results[k] is None:
                    results[k] = datetime.now(timezone.utc)

        # string to timezone, oracle throws ORA-01843 otherwise.
        if target_db.get_db_adapter_name().lower() in ('oracle',) and table_name == 'dashboard':
            if k in ('edited_date', 'created_date'):
                results[k] = utils.convert_string_to_time(results[k], 'UTC')

    return results
