from functools import wraps
from flask import jsonify
from utils.logging_setup import error_logger

def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except KeyError as e:
            error_logger.error(f"鍵錯誤: {e}")
            return jsonify({"message": f"鍵錯誤: {e}"}), 500
        except TypeError as e:
            error_logger.error(f"類型錯誤: {e}")
            return jsonify({"message": f"類型錯誤: {e}"}), 500
        except ValueError as e:
            error_logger.error(f"值錯誤: {e}")
            return jsonify({"message": f"值錯誤: {e}"}), 500
        except Exception as e:
            error_logger.error(f"發生未知錯誤: {e}")
            return jsonify({"message": f"發生未知錯誤: {e}"}), 500
    return decorated_function
