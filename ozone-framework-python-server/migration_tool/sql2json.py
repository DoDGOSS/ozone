# coding: utf-8
import json
import os
import subprocess
from . import utils


def transform(data_set):
    if data_set:
        jsoned = json.loads(data_set)
        results = []
        for key, data in enumerate(jsoned):
            temp = {}
            for k, v in data.items():
                if isinstance(v, (str,)) and v.startswith('base64'):
                    v = utils.bin2ascii(v)
                temp[k] = v
            results.append(temp)
        return json.dumps(results, indent=2, default=utils.json_serializer)


class SQLtoJSON(object):
    get_schema = False

    def __init__(self, db_adapter):
        self.db = db_adapter

    def with_tables(self, tables: list = None):
        if tables:
            self.tables = tables
        else:
            self.tables = self.db.get_table_names()
        return self

    def with_schema(self):
        self.get_schema = True
        return self

    def run_post_export_scripts(self, rootdir: list = None):
        if not rootdir:
            rootdir = './post_export'

        for root, subFolders, files in utils.sortedWalk(rootdir):
            for script in files:
                file = os.path.join(root, script)
                print(f'\nExecuting Post Export Script: {file}')
                print('=' * 50)
                argument = '{}_{}'.format(self.db.get_db_adapter_name().lower(), self.db.params.get('database'))
                subprocess.call(f"python {file} {argument}", shell=True)

    def to_json(self, path: str = 'migration_result', schema_only=False):
        assert self.tables, 'No tables found.'

        print('TOTAL TABLES %d' % len(self.tables))
        path = '{}/{}_{}'.format(path, self.db.get_db_adapter_name().lower(),
                                 self.db.params.get('database'))
        for table in self.tables:
            if self.get_schema:
                schema = self.db.get_table_schema(table)
                schema_json = json.dumps(schema, indent=2, default=utils.json_serializer)
                utils.file_write(schema_json, f'{path}_schema', table.lower())

            # total records
            total_records = self.db.get_records_count(table)

            if not schema_only:
                # grab records
                if total_records > 0:
                    output = self.db.get_table_as_json(table, transformer=transform)
                    utils.file_write(output, path, table.lower())
            print(
                '  {} \n    {} records {}'.format(table.upper(), total_records, 'dumped' if total_records > 0 else ''))

        print('Export Finished.')
        self.run_post_export_scripts()
