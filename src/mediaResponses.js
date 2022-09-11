// Setup
const fs = require('fs');
const path = require('path');

// HELPER FUNCTIONS
// returns a stream object using fs.createReadStream
const getStreamPipeline = (file, responseObj, response) => {
  const stream = fs.createReadStream(file, responseObj);

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

// get the information to write to the header
const getHeadInformation = (request, stats) => {
  // send only the bytes requested if they are valid
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  // assemble information for return object
  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  const chunksize = (end - start) + 1;

  return {
    start,
    end,
    total,
    chunksize,
  };
};

// loads in a file
const loadFile = (request, response, filePath, contentType) => {
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    // error handling
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    // returning information
    const headInfo = getHeadInformation(request, stats);
    response.writeHead(206, {
      'Content-Range': `bytes ${headInfo.start}-${headInfo.end}/${headInfo.total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': headInfo.chunksize,
      'Content-Type': contentType,
    });

    // return the stream
    return getStreamPipeline(file, { start: headInfo.start, end: headInfo.end }, response);
  });
};

// MAIN FUNCTIONS
// Return Media
const getParty = (request, response) => {
  loadFile(request, response, '../client/party.mp4', 'video/mp4');
};

const getBling = (request, response) => {
  loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

const getBird = (request, response) => {
  loadFile(request, response, '../client/bird.mp4', 'video/mp4');
};

module.exports = {
  getParty,
  getBling,
  getBird,
};
