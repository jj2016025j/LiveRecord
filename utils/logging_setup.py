import logging

def setup_logger(name, log_file, level=logging.INFO):
    """Function setup as many loggers as you want"""
    handler = logging.FileHandler(log_file)
    handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(message)s'))

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger

# Example of usage:
app_logger = setup_logger('app_logger', 'app.log')
error_logger = setup_logger('error_logger', 'error.log', level=logging.ERROR)
