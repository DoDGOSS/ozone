import re
import os
import json
import types


class JSONtoSQL(object):
    def __init__(self, target_db):
        self.target_db = target_db

    def reset(self):
        self.target_db.reset()
        return self

    def drop_all(self):
        self.target_db.drop_all()
        return self

    def to_sql(self, json_db_path, schema_path, transformer=None):
        print('IMPORTING {}'.format(json_db_path))

        self.target_db.foreign_keys_freeze()
        for dirName, subdirList, fileList in os.walk(json_db_path):
            print('TOTAL TABLES %d' % len(fileList))

            for file in fileList:

                table_name = file.split('.')[0]
                if not self.target_db.table_exists(table_name):
                    print(f'  Table {table_name} does not exists... skipping')
                    continue

                with open(dirName + '/' + file) as json_file:
                    data = json.load(json_file)

                    total_records = len(data)
                    for row in data:
                        try:
                            if isinstance(transformer, types.FunctionType):
                                row = transformer(row,
                                                  table_name=table_name,
                                                  target_db=self.target_db,
                                                  json_db_path=json_db_path, schema_path=schema_path)
                            self.target_db.insert(table_name, row)
                        except (Exception,) as e:
                            if not re.search(r'duplicate\skey', str(e)):
                                print(e)
                            total_records -= 1
                    print('  {} \n    {} of {} records {}'.format(table_name.upper(), total_records, len(data),
                                                                  'dumped' if total_records > 0 else ''))
        self.target_db.foreign_keys_unfreeze()
