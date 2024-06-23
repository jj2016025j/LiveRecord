from datetime import datetime

class LiveStream:
    def __init__(self, id, name, url, status, isFavorite=False, autoRecord=False, viewed=False,
                 live_stream_url=None, preview_image=None, createTime=None, lastViewTime=None, serial_number=None):
        self.id = id
        self.name = name
        self.url = url
        self.status = status
        self.isFavorite = isFavorite
        self.autoRecord = autoRecord
        self.viewed = viewed
        self.live_stream_url = live_stream_url
        self.preview_image = preview_image
        self.createTime = createTime or datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.lastViewTime = lastViewTime or datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.serial_number = serial_number
