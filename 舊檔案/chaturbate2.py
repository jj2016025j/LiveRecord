import re
import uuid
import logging
import requests

from streamlink import Streamlink
from streamlink.plugin import Plugin
from streamlink.plugin.api import validate
from streamlink.stream import HLSStream

API_HLS = "https://chaturbate.com/lusty_freya/"

_url_re = re.compile(r"https?://(\w+\.)?chaturbate\.com/(?P<username>\w+)")

_post_schema = validate.Schema(
    {
        "url": str,
        "room_status": str,
        "success": int
    }
)

class Chaturbate(Plugin):

    def __init__(self, url):
        print(Plugin)
        print(self)
        print(url)
        session = Streamlink()
        super().__init__(session,url)
        self.url = url

    @classmethod
    def can_handle_url(cls, url):
        return _url_re.match(url)

    def _get_streams(self):
        match = _url_re.match(self.url)
        if not match:
            self.logger.error("URL does not match the expected pattern")
            return

        username = match.group("username")
        print(f"Matched: {match}")
        print(f"Username: {username}")

        CSRFToken = str(uuid.uuid4().hex.upper()[0:32])
        print(f"Generated CSRFToken: {CSRFToken}")

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": CSRFToken,
            "X-Requested-With": "XMLHttpRequest",
            "Referer": self.url,
        }

        cookies = {
            "csrftoken": CSRFToken,
        }

        post_data = "room_slug={0}&bandwidth=high".format(username)
        print(f"Post data: {post_data}")
        
        params = {"room_slug": username, "bandwidth": "high"}
        print(f"Params: {params}")

        res = self.session.http.get(API_HLS, headers=headers, cookies=cookies, params=params)
        print(f"Response status code: {res.status_code}")

        if res.status_code != 200:
            raise print(f"Failed to get streams: {res.status_code} {res.reason}")

        print(f"Response self: {self}")
        print(f"Response self.session: {self.session}")
        print(f"Response self.session.http: {self.session.http}")
        print(f"Response res: {res}")
        print(f"Response _post_schema: {_post_schema}")
        print(f"Response self.session.http.json(res, schema=_post_schema): {self.session.http.json(res, schema=_post_schema)}")
        print(f"Response data: {data}")
        data = self.session.http.json(res, schema=_post_schema)

        print("Stream status: {0}".format(data["room_status"]))
        print("Playlist URL : {0}".format(data["url"]))
        self.logger.info("Stream status: {0}".format(data["room_status"]))
        self.logger.debug("Playlist URL : {0}".format(data["url"]))
        
        if (data["success"] == 1 and data["room_status"] == "public" and data["url"]):
            for s in HLSStream.parse_variant_playlist(self.session, data["url"]).items():
                self.logger.debug("HLS Stream: {0}".format(s))
                yield s
        else:
            self.logger.info("No valid stream found for user: {0}".format(username))


__plugin__ = Chaturbate

# 配置日志记录器
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# 测试函数
def test_plugin():
    session = Streamlink()
    plugin_instance = Chaturbate( API_HLS)
    # plugin_instance = Chaturbate()
    # plugin_instance.bind(session, "test_plugin")

    streams = list(plugin_instance._get_streams())
    print(f"Found streams: {streams}")

if __name__ == "__main__":
    test_plugin()
