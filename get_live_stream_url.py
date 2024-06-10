import requests
from bs4 import BeautifulSoup

def get_live_stream_url(page_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    }
    response = requests.get(page_url, headers=headers)
    
    if response.status_code == 404:
        return None, "Page not found"
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        for script in soup.find_all('script'):
            if '.m3u8' in script.text:
                start = script.text.find('https://')
                end = script.text.find('.m3u8') + 5
                stream_url = script.text[start:end]
                stream_url = stream_url.encode('utf-8').decode('unicode-escape')
                return stream_url, "Online"
    
    return None, "Offline"

def main():
    page_url = 'https://chaturbate.com/vixenp/'  # 替換為實際的直播頁面 URL
    stream_url = get_live_stream_url(page_url)
    if stream_url:
        print(f'Found live stream URL: {stream_url}')
    else:
        print('No live stream URL found.')

if __name__ == '__main__':
    main()
