import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# def get_live_stream_url(url):
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
#     }
#     response = requests.get(url, headers=headers)
    
#     if response.status_code == 404:
#         return None, "Page not found"
    
#     if response.status_code == 200:
#         soup = BeautifulSoup(response.content, 'html.parser')
#         for script in soup.find_all('script'):
#             if '.m3u8' in script.text:
#                 start = script.text.find('https://')
#                 end = script.text.find('.m3u8') + 5
#                 live_stream_url = script.text[start:end]
#                 live_stream_url = live_stream_url.encode('utf-8').decode('unicode-escape')
#                 return live_stream_url, "online"
    
#     return None, "offline"

def get_live_stream_url(url):
    """
    獲取直播流 URL 並返回狀態。
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }

    # 配置重試策略
    session = requests.Session()
    retries = Retry(
        total=15,  # 重試次數
        backoff_factor=1,  # 重試間隔時間指數增長因子
        status_forcelist=[500, 502, 503, 504],  # 遇到這些狀態碼時重試
        raise_on_status=False  # 遇到指定狀態碼時不拋出異常
    )
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        response = session.get(url, headers=headers, timeout=10)

        # print('狀態碼:', response.status_code)
        if response.status_code == 404:
            print(f"找不到頁面: {url}")
            return None, "Page not found"

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            for script in soup.find_all('script'):
                if '.m3u8' in script.text:
                    start = script.text.find('https://')
                    end = script.text.find('.m3u8') + 5
                    live_stream_url = script.text[start:end]
                    live_stream_url = live_stream_url.encode('utf-8').decode('unicode-escape')
                    # print(f"找到直播流: {live_stream_url}")
                    return live_stream_url, "online"

        """
        429 200 已離線
        """
        # print(f"直播流離線：{url}")
        return None, "offline"

    except requests.exceptions.SSLError as e:
        print(f"監聽 {url} 時發生 SSL 錯誤：{e}")
        return None, "SSL Error"

    except requests.exceptions.ConnectionError as e:
        print(f"監聽 {url} 時發生連接錯誤：{e}")
        return None, "Connection Error"

    except requests.exceptions.RequestException as e:
        print(f"監聽 {url} 時發生請求錯誤：{e}")
        return None, "Request Error"
    
def main():
    url = 'https://chaturbate.com/vixenp/'  # 替換為實際的直播頁面 URL
    live_stream_url = get_live_stream_url(url)
    if live_stream_url:
        print(f'Found live stream URL: {live_stream_url}')
    else:
        print('No live stream URL found.')

if __name__ == '__main__':
    main()
