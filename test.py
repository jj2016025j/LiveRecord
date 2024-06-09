import re
import json

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def extract_live_streams(json_data):
    live_streams = []
    for item in json_data['live_list']:
        live_streams.append(item['page_url'])
    return live_streams

json_file_path = 'live_list.json'
json_data = read_json_file(json_file_path)
# print(json_data)
streams = extract_live_streams(json_data)
print(streams)
