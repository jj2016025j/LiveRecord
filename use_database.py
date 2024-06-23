from db.initialize import initialize_database, initialize_tables
from db.operations import add_live_stream, get_all_live_streams
from utils.utils import generate_unique_id, current_timestamp

def main():
    # 初始化資料庫和資料表
    initialize_database()
    initialize_tables()

    # 新增測試資料
    new_stream = {
        'id': generate_unique_id(),
        'name': 'test_stream',
        'url': 'http://example.com/stream',
        'status': 'offline',
        'isFavorite': False,
        'autoRecord': False,
        'viewed': False,
        'live_stream_url': '',
        'preview_image': '',
        'createTime': current_timestamp(),
        'lastViewTime': current_timestamp(),
        'serial_number': 1
    }
    add_live_stream(new_stream)
    print("新增測試直播流資料")

    # 獲取並列印所有直播流資料
    streams = get_all_live_streams(order_by='name', filter_by_name='test')
    print("所有直播流資料：", streams)

if __name__ == "__main__":
    main()
