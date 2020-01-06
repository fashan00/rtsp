const Koa = require('koa');
const Router = require('koa-router');
// const Stream = require('node-rtsp-stream');
const Stream = require('../node-rtsp-stream-master/index');
const uniqid = require('uniqid');
var http = require('http');
var url = require('url');

const app = new Koa();
const router = new Router();

// stream = new Stream({
//   name: 'name',
//   streamUrl: 'rtsp://58.99.33.8:1935/ipcam/172.28.0.130.stream',
//   wsPort: 9999,
//   ffmpegOptions: { // options ffmpeg flags
//     '-stats': '', // an option with no neccessary value uses a blank string
//     '-r': 30, // options with required values specify the value after the key
//     '-s': '960x540',
//     '-q': 4,
//   }
// })

var ClientSteams = {};

const server = http.createServer(app.callback()).listen(80);

//On a secure websocket request from the front end, this gets hit
server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  var splitPath = pathname.split('/')

  console.log('\npathname', pathname, splitPath[1], splitPath[2]);
  const action = splitPath[1];
  const id = splitPath[2];
  const stream = ClientSteams[id];

  //Check to make sure it is correct ws request and check if the stream of id is exist 
  if (action === 'play' && stream) {
    //This is the key, it finds the wsServer and then emits it to my current connection
      stream.wsServer.handleUpgrade(request, socket, head, function done(ws) {
        stream.wsServer.emit('connection', ws, request);
      });

  } else {
    socket.destroy();
  }
});

router.get('/api/play/1', (ctx, next) => {
  const url = ctx.request.query.url;

  const id = 1;

  var stream = new Stream({
    id: id,
    streamUrl: 'rtsp://58.99.33.8:1935/ipcam/172.28.0.130.stream'
  });


  ClientSteams[id] = stream;

  ctx.body = `play rtsp ...${id}`;
});


router.get('/api/play/2', (ctx, next) => {
  const url = ctx.request.query.url;

  const id = 2;

  var stream = new Stream({
    id: id,
    streamUrl: 'rtsp://58.99.33.8:1935/ipcam/172.28.0.122.stream'
  });


  ClientSteams[id] = stream;

  ctx.body = `play rtsp ...${id}`;
});

/*
var dict = {}; // create an empty array

let port=9999;

router.get('/api/play/', (ctx, next) => {
  const url = ctx.request.query.url;
  if (!url || Object.keys(dict).find(key => dict[key].url === url))
  {
    ctx.body = `${listDict()}`;
    return;
  }
    
  const id = uniqid();

  const stream = new Stream({
    name: 'name',
    streamUrl: url,
    // wsPort: port,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30, // options with required values specify the value after the key
      '-s': '960x540',
      '-q': 4,
    }
  })

  stream.onSocketConnect = (socket, request)=>{

    console.log('onSocketConnect',socket, request)
  }

  dict[id] =
  {
    url: url,
    value: stream
  }

  ctx.body = `play rtsp ... \n ${listDict()} `;
});

router.get('/api/stop/:id', (ctx, next) => {
  const id = ctx.params.id;
  if (!id)
    return;

  ctx.body = `stop ${id}`;

  const stream = dict[id].value;
  if (stream)
    stream.stop();
    delete dict[id];
});

function listDict() {
  let list = ''

  Object.keys(dict).forEach(item => list += `id: ${item} url: ${dict[item].url}\n`);

  return list;
}

*/

app.use(router.routes()).use(router.allowedMethods());
app.listen(5000);
