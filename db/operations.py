from .connection import execute_query, fetch_query
from models.live_stream import LiveStream

def add_live_stream(data):
    """
    新增直播流資料
    :param data: LiveStream 實例
    """
    query = """
    INSERT INTO live_list (id, name, url, status, isFavorite, auto_record, viewed, live_stream_url, preview_image, createTime, lastViewTime, serial_number)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        data.id, data.name, data.url, data.status, data.isFavorite, data.auto_record,
        data.viewed, data.live_stream_url, data.preview_image, data.createTime,
        data.lastViewTime, data.serial_number
    )
    # print("新增直播流資料:", params)
    execute_query(query, params)

def update_live_stream(data):
    """
    更新直播流資料
    :param data: LiveStream 實例
    """
    query = """
    UPDATE live_list 
    SET name = %s, url = %s, status = %s, isFavorite = %s, auto_record = %s, viewed = %s,
        live_stream_url = %s, preview_image = %s, createTime = %s, lastViewTime = %s, serial_number = %s
    WHERE id = %s
    """
    params = (
        data.name, data.url, data.status, data.isFavorite, data.auto_record, data.viewed,
        data.live_stream_url, data.preview_image, data.createTime, data.lastViewTime,
        data.serial_number, data.id
    )
    # print("更新直播流資料:", params)
    execute_query(query, params)

def delete_live_stream(stream_id):
    """
    刪除直播流資料
    :param stream_id: 直播流 ID
    """
    query = "DELETE FROM live_list WHERE id = %s"
    params = (stream_id,)
    print("刪除直播流資料 ID:", stream_id)
    execute_query(query, params)

def get_live_stream_by_id(stream_id):
    """
    根據 ID 查詢直播流資料
    :param stream_id: 直播流 ID
    :return: LiveStream 實例
    """
    query = "SELECT * FROM live_list WHERE id = %s"
    params = (stream_id,)
    print("根據 ID 查詢直播流資料 ID:", stream_id)
    rows = fetch_query(query, params)
    if rows:
        row = rows[0]
        return LiveStream(**row)
    return None

def get_live_stream_by_url_or_name(url_or_name):
    """
    根據 URL 或名稱查詢直播流資料
    :param url_or_name: 直播流 URL 或名稱
    :return: LiveStream 實例
    """
    query = "SELECT * FROM live_list WHERE url = %s OR name = %s"
    params = (url_or_name, url_or_name)
    print("根據 URL 或名稱查詢直播流資料:", url_or_name)
    rows = fetch_query(query, params)
    print(f"SQL 查詢成功:{len(rows)}")

    if rows:
        row = rows[0]
        return LiveStream(**row)
    return None

def get_live_stream_by_url_or_name_or_id(identifier):
    """
    根據 URL、名稱或 ID 查詢直播流資料
    :param identifier: 直播流 URL、名稱或 ID
    :return: LiveStream 實例
    """
    query = "SELECT * FROM live_list WHERE url = %s OR name = %s OR id = %s"
    params = (identifier, identifier, identifier)
    print("根據 URL、名稱或 ID 查詢直播流資料:", identifier)
    rows = fetch_query(query, params)
    print(f"SQL 查詢成功: {len(rows)} 條記錄")

    if rows:
        row = rows[0]
        # 转换数据库中的 1 和 0 为布尔值
        row['isFavorite'] = bool(row['isFavorite'])
        row['auto_record'] = bool(row['auto_record'])
        row['viewed'] = bool(row['viewed'])
        return LiveStream(**row)
    return None

def get_all_live_streams(order_by=None, filter_by_name=None):
    """
    查詢所有直播流資料，可以按名稱過濾和排序
    :param order_by: 排序字段
    :param filter_by_name: 按名稱過濾
    :return: 所有直播流資料
    """
    query = "SELECT * FROM live_list"
    params = []
    if filter_by_name:
        query += " WHERE name LIKE %s"
        params.append(f"%{filter_by_name}%")
    if order_by:
        query += f" ORDER BY {order_by}"
    print("查詢所有直播流資料")
    rows = fetch_query(query, params)
    return [LiveStream(**row) for row in rows]

def add_search_history(query, search_time):
    """
    新增搜尋記錄
    :param query: 搜尋內容
    :param search_time: 搜尋時間
    """
    query = "INSERT INTO search_history (query, search_time) VALUES (%s, %s)"
    params = (query, search_time)
    execute_query(query, params)

def get_search_history():
    """
    獲取所有搜尋記錄
    :return: 所有搜尋記錄
    """
    query = "SELECT * FROM search_history"
    return fetch_query(query)
