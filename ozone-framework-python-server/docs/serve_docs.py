import http.server
import socketserver
import os

PORT = 8002

web_dir = os.path.join(os.path.dirname(__file__), '_build/html/')
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()
print('Close Port')
