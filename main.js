var http = require("http");
var fileReader = require("fs");

var fullFileText = "";
var cfgStrings = fullFileText.split("\r\n");
var isBinary = 0;
var portNumber = 80;
var serverIP = "";

try
{
  fullFileText = fileReader.readFileSync("settings.txt", "UTF8");
}
catch (err)
{
  if (err.code === "ENOENT")
    console.log("settings.txt is required for this server");
  else
    throw err;
  console.log("switching off...");
  process.exit(1);
}

for(var i=0;i<cfgStrings.length;i++)
{
  cfgStrings[i] = cfgStrings[i].replace(/ /g,'');
  console.log(cfgStrings[i]);
  if(cfgStrings[i].startsWith("external_ip="))
    serverIP = cfgStrings[i].split("=")[1].replace(/\n/g,'');
}

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
      //isBinary=1;
      var img = fileReader.readFileSync(__dirname+req);
      response.writeHead(200,{"Content-Type": "image/png"});
      response.end(img, 'binary');
      readStream = fileReader.createReadStream(__dirname+req);
    }
    else if(req.endsWith(".ico"))
    {
      //isBinary=1;
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
    if(isBinary==1)
      response.end(img, 'binary');
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


server.listen(portNumber,serverIP);
console.log("Listening to port "+portNumber);
