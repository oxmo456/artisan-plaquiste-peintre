const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const DEFAULT_PORT = 9000;

port = process.env.PORT || DEFAULT_PORT;

http.createServer(function (request, response) {
    const uri = url.parse(request.url).pathname;
    var filePath = path.join(process.cwd(), "public", uri);
    fs.exists(filePath, function (exists) {
        if (exists) {
            if (fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, "index.html");
            }
            fs.readFile(filePath, "binary", function (error, file) {
                if (error) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(error + "\n");
                    response.end();
                    return;
                }
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        } else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
        }
    });
}).listen(parseInt(port, 10));