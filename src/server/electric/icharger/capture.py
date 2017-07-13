import struct, os, time
from datetime import datetime


def netfmt_int(value):
    result = struct.pack(">L", value)
    return result


def netfmt_string(value):
    str_format = ">{0}s".format(len(value))
    result = netfmt_int(len(value)) + struct.pack(str_format, value)
    return result


def readnet_dword(buff, offset):
    (value,) = struct.unpack_from(">L", buff, offset)
    return value, offset + 4


def readnet_string(buff, len, offset):
    str_format = ">{0}s".format(len)
    (str_value,) = struct.unpack_from(str_format, buff, offset)
    return str_value.rstrip(), offset + len


class LogRecord:
    '''
    Same thing as in the Win32 app - captures the time, operation, info/data/len etc of the packets
    '''
    timestamp = None
    op = 0
    info = None
    data = None
    datalen = 0
    ms = 0
    result = 0

    def __init__(self, op = 0, info = "", data = None, len = 0, ms = 0, result = 0):
        self.timestamp = time.localtime()
        self.op = op
        self.info = info
        self.data = data
        self.datalen = len
        self.ms = ms
        self.result = result

    def netfmt(self):
        value = netfmt_string(time.asctime(self.timestamp)) + \
                netfmt_int(self.op) + \
                netfmt_string(self.info) + \
                netfmt_string(self.data) + \
                netfmt_int(self.ms) + \
                netfmt_int(self.result)
        return value

    def readfrom(self, buff, offset):
        (time_len, offset) = readnet_dword(buff, offset)
        (self.timestamp, offset) = readnet_string(buff, time_len, offset)
        (self.op, offset) = readnet_dword(buff, offset)
        (info_len, offset) = readnet_dword(buff, offset)
        (self.info, offset) = readnet_string(buff, info_len, offset)
        (data_len, offset) = readnet_dword(buff, offset)
        (self.data, offset) = readnet_string(buff, data_len, offset)
        (self.ms, offset) = readnet_dword(buff, offset)
        (self.result, offset) = readnet_dword(buff, offset)
        return offset

    def json(self):
        v = self.__dict__

        o = v["op"]
        if o == 1:
            v["op"] = "WRITE"
        else:
            v["op"] = "READ"
        return v


class Capture:
    '''
    Makes it a tad easier to write the same binary logging format of USB data for comparison purposes.
    '''

    WRITE = 1
    READ = 0

    log_records = []

    def __init__(self, cap_path = None):
        self.logging_info = None
        self.capture_path = os.environ.get("CAPTURE_PATH", cap_path)

        if self.capture_path is not None:
            if not os.path.exists(self.capture_path):
                os.mkdir(self.capture_path)

    def write_logs(self):
        now = datetime.now()

        path = os.path.join(self.capture_path, now.strftime("%Y-%m-%d_%H-%M-%S-junsi-python.dat"))
        capture_file = open(path, "wb+")

        # fake the number of entries just so the comparison code can be easier
        count = len(self.log_records)
        capture_file.write(netfmt_int(count))
        for rec in self.log_records:
            capture_file.write(rec.netfmt())

        capture_file.close()

    def set_operation(self, info):
        self.logging_info = info

    def log_write(self, data, result):
        assert(type(data) == str)
        l = LogRecord(Capture.WRITE, self.logging_info, data, len(data), 0, result)
        self.log_records.append(l)

    def log_read(self, max_length, ms, expected_len, data_read):
        assert (type(data_read) == str)
        l = LogRecord(Capture.READ, self.logging_info, data_read, expected_len, 0, 0)
        self.log_records.append(l)