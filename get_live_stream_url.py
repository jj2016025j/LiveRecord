import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# def get_live_stream_url(page_url):
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
#     }
#     response = requests.get(page_url, headers=headers)
    
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

def get_live_stream_url(page_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }

    # 配置重试策略
    session = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        response = session.get(page_url, headers=headers, timeout=10)

        if response.status_code == 404:
            return None, "Page not found"

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            for script in soup.find_all('script'):
                if '.m3u8' in script.text:
                    start = script.text.find('https://')
                    end = script.text.find('.m3u8') + 5
                    live_stream_url = script.text[start:end]
                    live_stream_url = live_stream_url.encode('utf-8').decode('unicode-escape')
                    return live_stream_url, "online"

        return None, "offline"

    except requests.exceptions.SSLError as e:
        print(f"SSL error occurred while checking {page_url}: {e}")
        return None, "SSL Error"

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error occurred while checking {page_url}: {e}")
        return None, "Connection Error"

    except requests.exceptions.RequestException as e:
        print(f"Error occurred while checking {page_url}: {e}")
        return None, "Request Error"
def main():
    page_url = 'https://chaturbate.com/vixenp/'  # 替換為實際的直播頁面 URL
    live_stream_url = get_live_stream_url(page_url)
    if live_stream_url:
        print(f'Found live stream URL: {live_stream_url}')
    else:
        print('No live stream URL found.')

if __name__ == '__main__':
    main()
