var http = require("http");
var fileReader = require("fs");

var server = http.createServer(function(request, response)
{
  var req = request.url;
  console.log("Request:",req);
  var readStream;
  var openFileResult;
  switch(req)
  {
  case "/":
    response.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
    readStream = fileReader.createReadStream(__dirname+"/index.html","utf-8");
    break;
  case "/css/main.css":
    response.writeHead(200,{"Content-Type": "text/css; charset=utf-8"});
    readStream = fileReader.createReadStream(__dirname+req,"utf-8");
    break;
  case "/js/main.js":
    response.writeHead(200,{"Content-Type": "text/js; charset=utf-8"});
    readStream = fileReader.createReadStream(__dirname+req,"utf-8");
    break;
  // case .png:
  //   console.log("png");
  //   response.writeHead(200,{"Content-Type": "image/png; charset=utf-8"});
  //   readStream = fileReader.createReadStream(__dirname+req,"utf-8");
  //   break;
  // case "*.ico":
  //   response.writeHead(200,{"Content-Type": "image/ico; charset=utf-8"});
  //   readStream = fileReader.createReadStream(__dirname+req,"utf-8");
  //   break;
  default:
    if(req.endsWith(".png"))
    {
      var img = fileReader.readFileSync(__dirname+req);
      response.writeHead(200,{"Content-Type": "image/png"});
      response.end(img, 'binary');
      readStream = fileReader.createReadStream(__dirname+req);
    }
    else if(req.endsWith(".ico"))
    {
      var img = fileReader.readFileSync(__dirname+req);
      response.writeHead(200,{"Content-Type": "image/ico"});
      response.end(img, 'binary');
      readStream = fileReader.createReadStream(__dirname+req);
    }
    else
    {
      response.writeHead(404,{"Content-Type": "text/html; charset=utf-8"});
      readStream = fileReader.createReadStream(__dirname+"/404.html","utf-8");
    }
    break;
  }
  // response.writeHead(200,{"Content-Type": "text/html; charset=utf-8"});
  // var readStream = fileReader.createReadStream(__dirname+"/index.html","utf-8");
  readStream.on('open', function ()
  {
    readStream.pipe(response);
  });
  readStream.on('error', function ()
  {
    console.log("error opening file");
    response.writeHead('Content-Type', 'text/plain');
    response.statusCode = 404;
    response.end('Not found');
  });
  //readStream.pipe(response);
  //response.end("Пока заебал");
});

var portNumber = 80;
server.listen(portNumber,"172.16.3.3");
console.log("Listening to port "+portNumber);
