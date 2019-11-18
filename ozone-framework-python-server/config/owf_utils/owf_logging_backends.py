import logging
from socket import gethostname


class HostnameAddingFormatter(logging.Formatter):
    """
    HostnameAddingFormatter adds a hostname, whe it can find one, to the record. The hostname is then available for
    use int he format string when using this formatter class.
    """

    def __init__(self, fmt=None, datefmt=None, style='%'):
        super().__init__(fmt, datefmt, style)

    def format(self, record):
        # Try to add a hostname attribute to every log record
        try:
            record.__dict__['hostname'] = gethostname()
        except:
            record.__dict__['hostname'] = 'exception-getting-hostname'
        return super().format(record)


class MarkDownFilter(logging.Filter):
    def filter(self, record):
        """
        Filters out log records having the word 'markdown' in them.
        :param record: any LogRecord
        :return: False if the record.message has the word 'markdown' in it, else True
        """
        if hasattr(record, 'message'):
            return False if 'markdown' in record.message else True
        else:
            return True


class ReloadFilter(logging.Filter):
    def filter(self, record):
        """
        Filters out log records having the word 'markdown' in them.
        :param record: any LogRecord
        :return: False if the record.message has the word 'markdown' in it, else True
        """
        if hasattr(record, 'message'):
            return False if 'change' in record.message else True
        else:
            return True


class FaviconFilter(logging.Filter):
    def filter(self, record):
        """
        Filters out log records having the word 'markdown' in them.
        :param record: any LogRecord
        :return: False if the record.message has the word 'markdown' in it, else True
        """
        if hasattr(record, 'message'):
            return False if 'favicon.ico' in record.message else True
        else:
            return True
