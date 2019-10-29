# coding: utf-8
from abc import ABCMeta


class DatabaseAdapter(object):
    QUERIES = NotImplemented
    __metaclass__ = ABCMeta

    def __init__(self, params=None, dsn=None, *args, **kwargs):
        self.dsn = dsn
        self.params = params
        self.connection = None
        self.cursor = None

    def get_connection(self):
        raise NotImplementedError

    def foreign_keys_freeze(self):
        raise NotImplementedError

    def foreign_keys_unfreeze(self):
        raise NotImplementedError

    def insert(self, table_name, dict_data):
        raise NotImplementedError

    def query(self, q: str, args: {} or ()):
        if not self.connection:
            self.connection = self.get_connection()
            self.cursor = self.connection.cursor()
        # raise NotImplementedError

    def column_exists(self, table_name, column_name):
        raise NotImplementedError

    def table_exists(self, table_name):
        return NotImplementedError

    def get_table_names(self):
        raise NotImplementedError

    def get_table_schema(self, table):
        raise NotImplementedError

    def get_records_count(self, table):
        raise NotImplementedError

    def get_table_as_json(self, table_name, transformer=None):
        raise NotImplementedError

    def fetchone(self):
        raise NotImplementedError

    def fetchall(self):
        raise NotImplementedError

    def get_db_adapter_name(self):
        return self.__class__.__name__.replace('Adapter', '').lower()

    def reset(self):
        raise NotImplementedError

    def drop_all(self):
        raise NotImplementedError
