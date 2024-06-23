from datetime import datetime

class LiveStream:
    def __init__(self, id, name, url, status, isFavorite=False, auto_record=False, viewed=False, live_stream_url=None, preview_image=None, createTime=None, lastViewTime=None, serial_number=None):
        self.id = id
        self.name = name
        self.url = url
        self.status = status
        self.isFavorite = isFavorite
        self.auto_record = auto_record
        self.viewed = viewed
        self.live_stream_url = live_stream_url
        self.preview_image = preview_image
        self.createTime = createTime
        self.lastViewTime = lastViewTime
        self.serial_number = serial_number
