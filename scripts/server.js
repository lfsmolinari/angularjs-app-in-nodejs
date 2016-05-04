#!/bin/env node


var util = require('util'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    events = require('events');
var finalhandler = require('finalhandler')
var apiRoutes = require('../api/routes');
var staticServlet = require('./StaticServlet');

// var express = require('express');
// var bodyParser = require('body-parser');
// var methodOverride = require('method-override');

var DEFAULT_PORT =  process.env.OPENSHIFT_NODEJS_PORT || 8080;

function main(argv) {
    new HttpServer({
        'GET':createServlet(staticServlet),
        'POST':createServlet(staticServlet),
        'HEAD':createServlet(staticServlet)
    }).start(Number(argv[2]) || DEFAULT_PORT);
}

function createServlet(Class) {
    var servlet = staticServlet.newInstance();
    return servlet.handleRequest.bind(servlet);

}


function HttpServer(handlers) {

    // this.server = express();
    // this.server.use(bodyParser.urlencoded({ extended: false }));
    // this.server.use(bodyParser.json());
    //
    // this.server.use(methodOverride('X-HTTP-Method'));          // Microsoft
    // this.server.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
    // this.server.use(methodOverride('X-Method-Override'));      // IBM
    // this.server.use(methodOverride('_method'));
    // this.server.use(function (req, res, next) {
    //
    //     // Website you wish to allow to connect
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //
    //     // Request methods you wish to allow
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //
    //     // Request headers you wish to allow
    //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //
    //     // Set to true if you need the website to include cookies in the requests sent
    //     // to the API (e.g. in case you use sessions)
    //     res.setHeader('Access-Control-Allow-Credentials', true);
    //
    //     // Pass to next layer of middleware
    //     next();
    // });

    //this.server.use(staticServlet.handleRequest.bind(staticServlet));
    //this.server.use(staticServlet.findAndSendTarget.bind(staticServlet));
    //this.server.use(staticServlet.attemptingToAccessOutsideLocalAppPath.bind(staticServlet));
    //this.server.use(staticServlet.sendError_.bind(staticServlet));
    //this.server.use(staticServlet.sendMissing_.bind(staticServlet));
    //this.server.use(staticServlet.sendForbidden_.bind(staticServlet));
    //this.server.use(staticServlet.sendRedirect_.bind(staticServlet));
    //this.server.use(staticServlet.sendDefault_.bind(staticServlet));
    //this.server.use(staticServlet.sendFile_.bind(staticServlet));
    //this.server.use(staticServlet.sendAllJsonFilesAppended_.bind(staticServlet));
    //this.server.use(staticServlet.writeFile_.bind(staticServlet));
    //this.server.use(staticServlet.writeSuccessHeader.bind(staticServlet));
    //this.server.use(staticServlet.sendDirectory_.bind(staticServlet));
    //this.server.use(staticServlet.writeDirectoryIndex_.bind(staticServlet));
    //this.server.use(this.handleRequest_.bind(this));
    this.handlers = handlers;
    this.server = http.createServer(this.handleRequest_.bind(this));

}

HttpServer.prototype.start = function (port) {

    this.port = process.env.OPENSHIFT_NODEJS_PORT;
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP
    if (typeof ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            ipaddress = "127.0.0.1";
        };
    this.server.listen(port, ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
        });

};

HttpServer.prototype.parseUrl_ = function (urlString) {
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('./app/', parsed.pathname);
    return url.parse(url.format(parsed), true);
};

HttpServer.prototype.handleRequest_ = function (req, res) {
    var logEntry = req.method + ' ' + req.url;
    if (req.headers['user-agent']) {
        logEntry += ' ' + req.headers['user-agent'];
    }
    util.puts(logEntry);
    if(req.url.indexOf("api") > -1){
      apiRoutes(req, res, finalhandler(req, res))
    }else{
      req.url = this.parseUrl_(req.url);
      var handler = this.handlers[req.method];
      if (!handler) {
          res.writeHead(501);
          res.end();
      } else {
          handler.call(this, req, res);
      }
    }
};



var path = require('path');

fs.fileExistsSync = function (filePath) {
    try {
        var stats = fs.lstatSync(filePath);

        return stats.isFile();
    }
    catch (e) {
        return false;
    }
}

fs.mkdirSyncRecursive = function(dirPath) {

    try{
        fs.mkdirSync(dirPath)
    } catch(e) {

        fs.mkdirSyncRecursive(path.dirname(dirPath));

        fs.mkdirSyncRecursive(dirPath);

    }

};

main(process.argv);
