import loader
import os
import json
import operator

from migration_tool import utils

source_schema_path = 'migration_result/mysql_owf_schema'
target_schema_path = 'migration_result/postgres_postgres_schema'
exclude_starting_with = ('django', 'auth', 'raster', 'spatial', 'geography', 'geometry')

for dirName, subdirList, fileList in os.walk(source_schema_path):
    for file in fileList:
        table_name = file.split('.')[0]

        if table_name.split('_')[0] in exclude_starting_with:
            continue

        with open(source_schema_path + '/' + file) as source_file:
            data = json.load(source_file)
            source_column_names = list(map(operator.itemgetter('column_name'), data))
            source_file.close()

        if os.path.exists(target_schema_path + '/' + file):
            with open(target_schema_path + '/' + file) as target_file:
                data = json.load(target_file)
                target_column_names = list(map(operator.itemgetter('column_name'), data))
                target_file.close()

        combined = {}
        for k, column in enumerate(target_column_names):
            if column in source_column_names:
                # combined[column] = source_column_names[source_column_names.index(column)]
                pass
            else:
                combined[column] = None

        if combined:
            schema_json = json.dumps(combined, indent=2, default=utils.json_serializer)
            utils.file_write(schema_json, f'migration_result/mapping', table_name)
