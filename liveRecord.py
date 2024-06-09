import cv2
import subprocess
import streamlink
import re
import multiprocessing
from streamlink.plugins.chaturbate import Chaturbate
from datetime import datetime

def generate_filename(url):
    fixed_path = r"C:\Users\User\Desktop\新增資料夾\錄影"
    match = re.search(r'amlst:([^:]+?)-sd', url)
    file_name = '_'
    if match:
        file_name = match.group(1)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{fixed_path}\\{file_name}_{timestamp}.mp4"

def get_stream_url(page_url):
    session = streamlink.Streamlink()
    session.set_option('http-headers', {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    streams = streamlink.streams(page_url)
    # print('======================streams: ',streams)
    if "best" in streams:
        return streams["best"].url
    else:
        raise Exception("No stream available")

def record_stream(stream_url, filename, duration):
    command = [
        'ffmpeg',
        '-i', stream_url,
        '-c', 'copy',
        '-c:a', 'aac',
        '-bsf:a', 'aac_adtstoasc',
        '-f', 'mpegts',  # 指定輸出格式為 .ts
        # '-t', duration,  # 設定錄製時長
        # '-re', # 可以拿掉
        # '-strict', '-2',
        # '-f', 'hls',
        # '-hls_time', '600',
        # '-hls_list_size', '0',
        # '-f', 'segment',
        # '-segment_time', '600',  # 每10分钟一个片段
        filename
    ]
    subprocess.run(command)
    
    # process = subprocess.Popen(command)
    # return process
    
    # if duration:
    #     command.insert(4, '-t')
    #     command.insert(5, duration)
    # process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # return process


def convert_ts_to_mp4(input_file, filename):
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c', 'copy',
        filename
    ]
    subprocess.run(command)
    # subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def remux_file(input_file, filename):
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c', 'copy',
        filename
    ]
    subprocess.run(command)
    
def show_preview(stream_url):
    cap = cv2.VideoCapture(stream_url)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow('Preview', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):  # 按 'q' 鍵退出預覽
            break
    cap.release()
    cv2.destroyAllWindows()

def extract_name_from_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None


def main():
    streams = [
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:crazybabyyy-sd-ca57b3ca530f366cf10086dbc7d74829c6e13fb6e4cec06f3fcb6b16e1d1619d_trns_h264/chunklist_w738483245_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:charming_girls-sd-57bb10124016d99c7273225faffa4f7bc2a17eff953f6db3f09cedaf04ed86db_trns_h264/chunklist_w1639753809_b7128000_t64RlBTOjYwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:mariemelons-sd-65dfe7dd48dd5ec616e307709f8197fe89f61cb69bbd7e87091776b800c14576_trns_h264/chunklist_w437752321_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge15-nrt.live.mmcdn.com/live-edge/amlst:haru_blossom-sd-30b228fb532cd061de2898bb063c958bc95853389ac9de78a88e4bbabe2798f4_trns_h264/chunklist_w116063115_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge18-nrt.live.mmcdn.com/live-edge/amlst:haileygrx-sd-05b7af415826f266c57ace8b147fc12e54cade4012c235a768411257f088b1a4_trns_h264/chunklist_w713500881_b7128000_t64RlBTOjUwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:kerelai-sd-525df226343877ee85f39c2557892f45b335b106f3f5727db8c83f02e6995000_trns_h264/chunklist_w824028657_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge5-nrt.live.mmcdn.com/live-edge/amlst:coreybae-sd-fe0a51bbd2af6e9161925dec733e007da5e3e683067d07bbc97383bbc86b42d1_trns_h264/chunklist_w189444713_b5128000_t64RlBTOjU5Ljk0.m3u8',
    'https://edge15-nrt.live.mmcdn.com/live-edge/amlst:6horny_as_fuck9-sd-caff2b63fdc102e642b1f9dd1634b56dfb9d2966ff738115c927c7c8cfd302b6_trns_h264/chunklist_w326044551_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge6-nrt.live.mmcdn.com/live-edge/amlst:angels_kiss-sd-9bfdccbba8de8cb8ff00a4de03b4940f56ff608c03b458723fe1a5c778bbaf78_trns_h264/chunklist_w1265126969_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge16-nrt.live.mmcdn.com/live-edge/amlst:jackandjill-sd-76f65362c755d8cfddbe903a42e05fe0edb68fbec62924ffcdacff716546b682_trns_h264/chunklist_w1316927351_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge4-nrt.live.mmcdn.com/live-edge/amlst:hollyextra-sd-a62dec4350a380c54606c5f2f63c3e20036cfd933dfe4b57f0883559cd931ee1_trns_h264/chunklist_w1421281542_b8128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge14-nrt.live.mmcdn.com/live-edge/amlst:ellamilano-sd-69615b5db1cfd0181433c38b1080c0986ba1c38b9333a9ed3339f50887e99efd_trns_h264/chunklist_w675518926_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge6-nrt.live.mmcdn.com/live-edge/amlst:jalevakitties2-sd-54e157155e53c7d0959963553cf79c94777217719b207d7613fb156a5840df70_trns_h264/chunklist_w661397408_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge7-nrt.live.mmcdn.com/live-edge/amlst:_alice__g-sd-e706c3efc87e2268a8fb5503c8a9be89d4cc2f6f1ca17b43a733f81b393e2cd2_trns_h264/chunklist_w1364271165_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge15-nrt.live.mmcdn.com/live-edge/amlst:antonia_savatto_-sd-de953b6b6221883b4eb4223c09542e4f9a995e233bfaa4e8fc569f2c78625e3a_trns_h264/chunklist_w192782756_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge4-nrt.live.mmcdn.com/live-edge/amlst:_chatur_babe-sd-9605c46d077d3634b91acdc4654ee1cb56060517633335846020efa94597c77b_trns_h264/chunklist_w103549090_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge6-nrt.live.mmcdn.com/live-edge/amlst:honeyyykate-sd-1044b7098303def50823e36571bb7c9e8532bee39b0bdf8630040311e993b670_trns_h264/chunklist_w908213768_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge4-nrt.live.mmcdn.com/live-edge/amlst:innocentchurchgirl-sd-8235f9e5ae18c8372fe48e9d5ca59f370ddde0fd537f7461f150857b670a3e95_trns_h264/chunklist_w518628334_b2796000_t64RlBTOjI5Ljk3MDAyOTk3MDAyOTk3.m3u8',
    'https://edge1-sin.live.mmcdn.com/live-edge/amlst:snowww_white-sd-b4579a8ee77cf6dfd2444ff1d58cea7f7af117aa669b64178d0b9bd100037964_trns_h264/chunklist_w1643360138_b13192000_t64RlBTOjMwLjA=.m3u8',
    'https://edge9-nrt.live.mmcdn.com/live-edge/amlst:abiee__-sd-59a6016527fa1021316985cd8727e531b69edbbee79d130ab7e8685f079be9e0_trns_h264/chunklist_w729316788_b4596000_t64RlBTOjYwLjA=.m3u8',
    'https://edge11-sin.live.mmcdn.com/live-edge/amlst:pixie_pie-sd-84c93ea2b3acac77c9ad3af5a66279e940a6f12efd8e17ec54946be304c31cd8_trns_h264/chunklist_w313377938_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge3-nrt.live.mmcdn.com/live-edge/amlst:christiewells22-sd-d6caeb26dada1556440c1298f99379bd906ff2f1f63c8cd4b46a81157c3072bc_trns_h264/chunklist_w704326718_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:zt0_-sd-c7a3088d667a89585a27619d55fc65a120d48c1ee7be99f015cb8bce9651c590_trns_h264/chunklist_w1580418352_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:evasaff-sd-2ba68e1958f09b4651906aafceca2060c4b240620b6601cb1ecbb65845c043da_trns_h264/chunklist_w757127255_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge12-nrt.live.mmcdn.com/live-edge/amlst:checkmypeach-sd-c58e256fda01f9abc923d6cb348905ded24bd865e2bc480c3a57000f39c7805e_trns_h264/chunklist_w336867719_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge9-nrt.live.mmcdn.com/live-edge/amlst:tastypoint-sd-39d93dc9f8b2cc58ac5e88ea63c63d6d2ccc047dee74accfb77b7f2aecea1a86_trns_h264/chunklist_w1157469597_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:girlswannasex-sd-7f36cd02a3ce89fafadd44220c78caf00e68acec55b96aa74b3e2160edbef5a0_trns_h264/chunklist_w1696440936_b4596000_t64RlBTOjYwLjA=.m3u8',
    'https://edge16-nrt.live.mmcdn.com/live-edge/amlst:rosyemily-sd-98c0c0113e57586e1044d14e0cf07b4f0d8c35718a59beb8a145d4ad14b61685_trns_h264/chunklist_w2093799957_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge14-nrt.live.mmcdn.com/live-edge/amlst:diana_alison-sd-4fe160a0ce1a90a0d2c895b1fa66f6147916dab97113f7a5f6b54119eb04b610_trns_h264/chunklist_w710310371_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge1-sin.live.mmcdn.com/live-edge/amlst:secrets_eli-sd-b991ce925e67f244a2946a1d8a3537898cdef5c15b2b98875deb365fbf366d73_trns_h264/chunklist_w1025663122_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge7-nrt.live.mmcdn.com/live-edge/amlst:menasaurio_-sd-2be906c3575f1cf49b16e8e844d43f3e5bb70613b241b7f8cef9e328cdda529f_trns_h264/chunklist_w1966378146_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge12-sin.live.mmcdn.com/live-edge/amlst:allotropp-sd-d0953f9cd37649b6425500a0bcdca04b15d4b718961d44bedb15619a77f4fb64_trns_h264/chunklist_w943953298_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge17-nrt.live.mmcdn.com/live-edge/amlst:la_seductrice-sd-03cc800953b42311c2a5fdc40a48e357d2d1aa2406e8cf17c7f8cc19d40f1fb5_trns_h264/chunklist_w349086252_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge13-sin.live.mmcdn.com/live-edge/amlst:vikkyy_love-sd-86766b40ecfd9f950ecf48a94a24b4bcd6d413c21d9a45c341d6fb761b44a34c_trns_h264/chunklist_w1638813998_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:bunnydollstella-sd-f95e179bf389727ab4ec86da9cbbba1fd665ba65988e31de32c545d24a586c66_trns_h264/chunklist_w77456931_b7128000_t64RlBTOjYwLjA=.m3u8',
    'https://edge1-nrt.live.mmcdn.com/live-edge/amlst:eliza_bad-sd-74a732670c0b4bf1ac92f72c6b8b48a80aa7dab41d980e765a2b37d2241d4ef3_trns_h264/chunklist_w777375818_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge12-nrt.live.mmcdn.com/live-edge/amlst:notfallenangel-sd-b8a227ca89b24b054401a48aa858c4fe7cdf8f3378f10aba29858559100cdf22_trns_h264/chunklist_w766029794_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:kittessa-sd-6527051c83d79ed41d7f0d25d747c0d01f732954c5641e5f8c87f99f077e0480_trns_h264/chunklist_w1236624527_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-sin.live.mmcdn.com/live-edge/amlst:angelsuitlove-sd-0af00d81faa2fcee5bf51d205e9a9548bbf088a37282a2ac69e2acf04a4202b5_trns_h264/chunklist_w900030624_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge13-sin.live.mmcdn.com/live-edge/amlst:thebrokebabe-sd-ccbfe89ca76981bb9a29387eb32295007d7245f3716266a418b4dd73adaae40a_trns_h264/chunklist_w656269847_b3096000_t64RlBTOjMwLjA=.m3u8',
    'https://edge16-nrt.live.mmcdn.com/live-edge/amlst:blue_eye_twinkle-sd-cf7a1a30465a6b58a0924ae70379d3afd6151e11870b986caae423f4c2472ef6_trns_h264/chunklist_w1238261676_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:mariemelons-sd-65dfe7dd48dd5ec616e307709f8197fe89f61cb69bbd7e87091776b800c14576_trns_h264/chunklist_w1655035229_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:sloppy_wine_420-sd-72614e55d51d5db997f5b44109efc51736e3f91a7f5f3c13aea5fa343590d120_trns_h264/chunklist_w482507386_b5128000_t64RlBTOjMwLjA=.m3u8',
]   

    # streams = {
    #     # 'https://www.youtube.com/watch?v=21X5lGlDOfg': 'youtube_test1.mp4',
    #     # 'https://www.youtube.com/watch?v=gp2K_xfEDoU': 'youtube_test.mp4',
    #     # 'https://www.twitch.tv/iitifox': 'twitch_test.mp4',        
    #     # 'https://chaturbate.com/haileygrx/': 'chaturbate_test.mp4',
    #     # 'https://chaturbate.com/6b4090fc-e7f0-487c-a31a-e8d28f078401': 'chaturbate_test2.mp4',
    #     'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:crazybabyyy-sd-ca57b3ca530f366cf10086dbc7d74829c6e13fb6e4cec06f3fcb6b16e1d1619d_trns_h264/chunklist_w738483245_b5128000_t64RlBTOjMwLjA=.m3u8': 
    #         'crazybabyyy',
    #     'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:charming_girls-sd-57bb10124016d99c7273225faffa4f7bc2a17eff953f6db3f09cedaf04ed86db_trns_h264/chunklist_w1639753809_b7128000_t64RlBTOjYwLjA=.m3u8': 
    #         'charming_girls',
    #     'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:mariemelons-sd-65dfe7dd48dd5ec616e307709f8197fe89f61cb69bbd7e87091776b800c14576_trns_h264/chunklist_w437752321_b5128000_t64RlBTOjMwLjA=.m3u8': 
    #         'mariemelons',
    #     'https://edge15-nrt.live.mmcdn.com/live-edge/amlst:haru_blossom-sd-30b228fb532cd061de2898bb063c958bc95853389ac9de78a88e4bbabe2798f4_trns_h264/chunklist_w116063115_b5128000_t64RlBTOjMwLjA=.m3u8': 
    #         'haru_blossom',
    #     'https://edge18-nrt.live.mmcdn.com/live-edge/amlst:haileygrx-sd-05b7af415826f266c57ace8b147fc12e54cade4012c235a768411257f088b1a4_trns_h264/chunklist_w713500881_b7128000_t64RlBTOjUwLjA=.m3u8': 
    #         'haileygrx',
    #     'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:kerelai-sd-525df226343877ee85f39c2557892f45b335b106f3f5727db8c83f02e6995000_trns_h264/chunklist_w824028657_b5128000_t64RlBTOjMwLjA=.m3u8': 
    #         'kerelai',
    #     'https://edge6-nrt.live.mmcdn.com/live-edge/amlst:one_more_cum-sd-b7f40d0c6d3d8b2909daf9a4ab8b77bb64683c78e8ce1e4d6e24051f5b11c2b7_trns_h264/chunklist_w651470336_b5128000_t64RlBTOjMwLjA=.m3u8': 
    #         'one_more_cum',
    #     # 'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:kerelai-sd-525df226343877ee85f39c2557892f45b335b106f3f5727db8c83f02e6995000_trns_h264/chunklist_w824028657_b5128000_t64RlBTOjMwLjA=.m3u8': 
    #     #     'kerelai',
    # }
    duration = "1:00:00"
    processes = []

    for page_url in streams:
        try:
            # print(f"Fetching stream URL for {page_url}...")
            stream_url = get_stream_url(page_url)
            # print('URL: ',stream_url)
            
            # # 開啟新的進程來顯示預覽畫面
            if(False):
                preview_process = multiprocessing.Process(target=show_preview, args=(stream_url,))
                preview_process.start()
                process.start()
                processes.append(preview_process)

            # 
            filename = generate_filename(page_url)
            # print(f"Recording stream from {stream_url} to {filename}...")
            # record_process  = record_stream(stream_url, generate_filename(filename), duration) 
            record_process  = multiprocessing.Process(target=record_stream, args=(stream_url, filename, duration))
            record_process .start()
            processes.append(record_process)

            # 轉檔
            if(False):
                fixed_filename = f"fixed_{filename}"
                print(f"Remuxing {filename} to {fixed_filename}...")
                remux_file(filename, fixed_filename)
                print(f"Finished remuxing {filename} to {fixed_filename}")
            
        except Exception as e:
            print(f"Error recording {page_url}: {e}")
    try:
        while True:
            for process in processes:
                if not process.is_alive():
                    processes.remove(process)
            if not processes:
                break
    except KeyboardInterrupt:
        print("Stopping recording...")
        for process in processes:
            process.terminate()
        for process in processes:
            process.join()
            
    # try:
    #     while True:
    #         time.sleep(1)  # 每秒檢查一次
    # except KeyboardInterrupt:
    #     print("Stopping recording...")
    #     for process in processes:
    #         process.terminate()
    #     for process in processes:
    #         process.wait()
    #     for ts_filename in streams.values():
    #         mp4_filename = ts_filename.replace('.ts', '.mp4')
    #         print(f"Converting {ts_filename} to {mp4_filename}...")
    #         convert_ts_to_mp4(ts_filename, mp4_filename)
    #         print(f"Finished converting {ts_filename} to {mp4_filename}")

if __name__ == '__main__':
    main()
    
# 解決方法一：使用 -re 選項進行實時錄製
# 在錄製直播流時，使用 -re 選項來告訴 FFmpeg 以實時速度處理流數據，這可能有助於防止文件損壞。
# 解決方法二：使用 HLS 流錄製
# 如果使用 HLS 流錄製，可以有效避免這些問題。Streamlink 支持將直播流轉換為 HLS 流。
