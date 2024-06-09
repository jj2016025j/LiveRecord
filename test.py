import py_compile

try:
    py_compile.compile("C:\\Users\\User\\AppData\\Local\\Programs\\Python\\Python311\\Lib\\site-packages\\streamlink\\plugins\\chaturbate.py", doraise=True)
    print("Plugin file is correctly formatted.")
except py_compile.PyCompileError as e:
    print(f"Error in plugin file: {e}")