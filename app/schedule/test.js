require("babel-register");

process.setMaxListeners(Infinity);

const getShenzhenTopics = require('./shenzhen.js');

getShenzhenTopics();