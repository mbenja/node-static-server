const fs = require('fs');
const http = require('http');
const path = require('path');

module.exports = function Server(workingDirectory) {
    this.workingDirectory = workingDirectory;
    this.endPoints = {};
    this.currentEndpoint = {};

    this.createEndPoint = (endPoint, path, entryPoint) => {
        this.endPoints[endPoint] = { path, entryPoint};
    }

    this.listen = (port) => {
        http.createServer(this.requestListener).listen(port);
        console.log(`Listening on port: ${port}`);
    }

    this.isKnownReferenceEndPoint = (headers) => {
        if (headers.referer) {
            const referenceEndPoint = `/${headers.referer.split('/').pop()}`;
            return this.endPoints[referenceEndPoint] ? true : false;
        }

        return false;
    }

    this.requestListener = (req, res) => {
        if (this.endPoints[req.url]) { // Is this endpoint registered?
            this.currentEndpoint = this.endPoints[req.url];
        } else {
            if (!this.isKnownReferenceEndPoint(req.headers)) { // Is the referer registered?
                return this.sendFourOhFour(res);
            }
        }

        const url = this.endPoints[req.url] ? this.currentEndpoint.entryPoint : req.url;
        const filePath = `${this.workingDirectory}/${this.currentEndpoint.path}/${url}`;
        const fileExtension = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[fileExtension] || 'application/octet-stream';
        this.fileHandler(req, res, filePath, contentType);
    }

    this.fileHandler = (req, res, filePath, contentType) => {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    this.sendFourOhFour(res);
                }
                res.writeHead(500);
                res.end(fiveHundred, 'utf-8');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }

    this.sendFourOhFour = (res) => {
        res.writeHead(404);
        res.end(fourOhFour, 'utf-8');
    }
}

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
};

const fourOhFour = '<html><h1>404</h1><h3>:/</h3></html>';
const fiveHundred = '<html><h1>500</h1><h3>:(</h3></html>';
