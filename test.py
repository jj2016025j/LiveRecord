import re

def extract_name_from_url(url):
    match = re.search(r'amlst:([^:]+?)-sd', url)
    if match:
        return match.group(1)
    return None

streams = [
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:crazybabyyy-sd-ca57b3ca530f366cf10086dbc7d74829c6e13fb6e4cec06f3fcb6b16e1d1619d_trns_h264/chunklist_w738483245_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge11-nrt.live.mmcdn.com/live-edge/amlst:charming_girls-sd-57bb10124016d99c7273225faffa4f7bc2a17eff953f6db3f09cedaf04ed86db_trns_h264/chunklist_w1639753809_b7128000_t64RlBTOjYwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:mariemelons-sd-65dfe7dd48dd5ec616e307709f8197fe89f61cb69bbd7e87091776b800c14576_trns_h264/chunklist_w437752321_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge15-nrt.live.mmcdn.com/live-edge/amlst:haru_blossom-sd-30b228fb532cd061de2898bb063c958bc95853389ac9de78a88e4bbabe2798f4_trns_h264/chunklist_w116063115_b5128000_t64RlBTOjMwLjA=.m3u8',
    'https://edge18-nrt.live.mmcdn.com/live-edge/amlst:haileygrx-sd-05b7af415826f266c57ace8b147fc12e54cade4012c235a768411257f088b1a4_trns_h264/chunklist_w713500881_b7128000_t64RlBTOjUwLjA=.m3u8',
    'https://edge8-nrt.live.mmcdn.com/live-edge/amlst:kerelai-sd-525df226343877ee85f39c2557892f45b335b106f3f5727db8c83f02e6995000_trns_h264/chunklist_w824028657_b5128000_t64RlBTOjMwLjA=.m3u8',
]

for url in streams:
    extracted_name = extract_name_from_url(url)
    print(f"URL: {url}")
    print(f"Extracted Name: {extracted_name}")
    print()