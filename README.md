# node-static-server
Tiny package for serving static files.

Features:
 - Custom routing
 - Basic error handling
 - Zero dependencies

Install:
```
npm install https://github.com/mbenja/node-static-server.git
```

Import package, create endpoint, and serve:
```
const Server = require('node-static-server');

const server = new Server(`${__dirname}/exampleDirectory`);
server.createEndPoint('/myApp', 'applicationDirectory', 'index.html');
server.listen(8080);

// exampleDirectory/
// |- applicationDirectory/
//    |- index.html
```