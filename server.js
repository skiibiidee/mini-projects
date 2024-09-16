require('dotenv').config();
const path = require('path');
const fs = require('fs');
if (!fs.existsSync(path.join(process.cwd(), 'appsenv'))) {
  console.log(
    `appsenv file not found. Run "npm run dev" if developing. If in production, add a plain text file named "appsenv" containing app secrets.\n Format(json):\n'{\n    "AppName":"API_KEY=AQWUHASUH@BB#B$I\\nPORT=880",\n    "AppWithoutAnyDotEnvNeeds":""\n}'\n Note: use \\n instead of actual linebreaks.`
  );
  process.exit(1);
}

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const minimist = require('minimist');

const expressapp = express();
const server = http.createServer(expressapp);
const io = socketIo(server);

const port = process.env.PORT;
const processargs = minimist(process.argv.slice(2));
const appUrl = process.env['RENDER_EXTERNAL_URL'];

expressapp.use(express.json());
expressapp.use(bodyParser.urlencoded({ extended: true }));

require('./setup')({
  expressapp,
  appUrl,
  processargs,
  io,
});

expressapp.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

server.listen(port, () => {
  console.log(
    `Apps listening at ${process.env['RENDER_EXTERNAL_URL']} at port ${port}`
  );
});
