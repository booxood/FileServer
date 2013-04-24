/**
 * Created by JetBrains WebStorm.
 * User: Administrator
 * Date: 12-12-24
 * Time: 下午7:13
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');


var mime = require('./mime').types;
var config = require('./config');

var PORT = 8080;

var server = http.createServer(function(request,response){
    var pathname = url.parse(request.url).pathname;
    if(pathname.slice(-1) === '/'){
        pathname += config.Welcome.file;
    };
    var realPath = path.join('assets',path.normalize(pathname.replace(/\.\./g,'')));
    console.log('request path :' + realPath);
    var pathHandle = function(realPath){
        fs.stat(realPath,function(err,stats){
            if(err){
                response.writeHead(404,{
                    'Context-Type':'text/plain'
                });
                response.write('This request URL:' + pathname + ' was not found.');
                response.end();
            }else{
                if(stats.isDirectory()){
                    realPath = path.join(realPath,'/',config.Welcome.file);
                    pathHandle(realPath);
                }else{
                    var ext = path.extname(realPath);
                    ext = ext ? ext.slice(1):'unknown';
                    var contentType = mime[ext] || 'text/plain';
                    response.setHeader('Content-Type',contentType);
                    response.setHeader('Content-Length',stats.size);
                    //设置过期时间
                    if(ext.match(config.Expires.fileMatch)){
                        var expires = new Date();
                        expires.setTime(expires.getTime() + config.Expires.maxAge*1000);
                        response.setHeader('Expires',expires.toUTCString());
                        response.setHeader('Cache-Control','max-age=' + config.Expires.maxAge);
                    }
                    var lastModified = stats.mtime.toUTCString();
                    var ifModifiedSince = "If-Modified-Since".toLowerCase();//这个header浏览器默认发送的嘛？
                    response.setHeader("Last-Modified", lastModified);
                    if(request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]){
                        response.writeHead(304, "Not Modified");//如果不存在也返回304请求，会怎么样？
                        response.end();
                    }else{
                        var raw = fs.createReadStream(realPath);
                        response.writeHead(200,'ok');
                        raw.pipe(response);
                    }

                }

            }

        });

    }
    pathHandle(realPath);
});

server.listen(PORT);
console.log('server running at port:' + PORT + '.');
