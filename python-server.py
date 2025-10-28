#!/usr/bin/env python3
import http.server
import socketserver
from pathlib import Path

class SPARoutingHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to avoid any potential issues
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Add content-type for HTML
        if self.path.endswith('.html') or self.path == '/' or '.' not in self.path.split('/')[-1]:
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()
    
    def do_GET(self):
        # If the requested path doesn't have a file extension, serve index.html
        if '.' not in self.path.split('/')[-1] and self.path != '/':
            # This makes it work for SPA routing (e.g., /dashboard, /matches, etc.)
            self.path = '/index.html'
        
        # Handle the request
        if self.path == '/' or self.path.endswith('.html'):
            # Special handling for HTML files to make sure they're served correctly
            filepath = Path(self.path.lstrip('/'))
            if not filepath.exists():
                filepath = Path('index.html')
            
            try:
                with open(filepath, 'rb') as file:
                    content = file.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                self.send_error(404, "File not found")
        else:
            # For other files (CSS, JS, etc.), use default behavior
            super().do_GET()

# Change to the current directory
import os
os.chdir(os.path.dirname(__file__))

PORT = 8080
Handler = SPARoutingHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"TK999 Betting Platform server running at http://localhost:{PORT}")
    print("All routes will serve the SPA application.")
    httpd.serve_forever()