from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time

# 设置Chrome驱动路径
service = Service('/path/to/chromedriver')

# 设置Chrome选项
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--disable-gpu")

# 启动Chrome浏览器
driver = webdriver.Chrome(service=service, options=options)

# 访问目标页面
page_url = "https://chaturbate.com/haileygrx/"
driver.get(page_url)

# 等待页面加载和视频元素出现
time.sleep(10)

# 获取视频元素的src属性
video_element = driver.find_element(By.TAG_NAME, "video")
video_src = video_element.get_attribute("src")

print(f"Video source URL: {video_src}")

# 关闭浏览器
driver.quit()
