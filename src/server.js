// Server and external js setup
const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Request handling and server initialization
const onRequest = (request, response) => {
  // console.log(request.url);
  switch (request.url) {
    // Index/page1
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/party.mp4':
      mediaHandler.getParty(request, response);
      break;
    // page2
    case '/page2':
      htmlHandler.getPageTwo(request, response);
      break;
    case '/bling.mp3':
      mediaHandler.getBling(request, response);
      break;
    // page3
    case '/page3':
      htmlHandler.getPageThree(request, response);
      break;
    case '/bird.mp4':
      mediaHandler.getBird(request, response);
      break;
    default:
      htmlHandler.getIndex(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  // console.log(`Listening on 127.0.0.1:${port}`);
});
