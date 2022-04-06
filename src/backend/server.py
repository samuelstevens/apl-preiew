import argparse
import functools
import http.server
import json
import os
import urllib.parse
from http import HTTPStatus

PORT = 8888


class RequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Basic file server EXCEPT for the /api/update path, which will read some files and return some new JSON.
    """

    def do_GET(self, *args, **kwargs):
        if not self.path.startswith("/api"):
            super().do_GET(*args, **kwargs)
            return

        filelist = parse_api_headers(self.path)

        if not filelist:
            self.send_error(HTTPStatus.BAD_REQUEST)
            return

        visuals = list(get_visuals(filelist, self.directory))
        jsonb = jsonbytes(visuals)

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-type", "application/json")
        self.send_header("Content-Length", len(jsonb))

        self.wfile.write(jsonb)


def parse_api_headers(path):
    url = urllib.parse.urlparse(path)
    query = urllib.parse.parse_qs(url.query)
    if "files" not in query:
        return None

    return query["files"]


def get_visuals(filelist, root):
    """
    Gets all updated visual files as dictionaries.
    """
    for partialpath in filelist:
        path = os.path.join(root, partialpath)
        if not os.path.isfile(path):
            yield {"error": f"file '{path}' does not exist"}
            continue

        with open(path) as fd:
            yield json.load(fd)


def jsonbytes(obj):
    return bytes(json.dumps(obj), "utf8")


def make_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--directory", default=os.getcwd(), help="Specify alternative directory"
    )
    parser.add_argument(
        "--port",
        default=8000,
        type=int,
        help="Specify alternate port",
    )
    return parser


def main():
    parser = make_parser()
    args = parser.parse_args()

    handler_class = functools.partial(RequestHandler, directory=args.directory)

    with http.server.ThreadingHTTPServer(("localhost", args.port), handler_class) as httpd:
        host, port = httpd.server_address
        print(f"starting server at http://{host}:{port}...")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
