require("babel-register");

process.setMaxListeners(Infinity);

const getShenzhenTopics = require('./shenzhen.js');

getShenzhenTopics();


/*const Redis = require('ioredis');
const cities = require('../city');
const nanshanzufang = cities[0]['groups'][0];
const redis = new Redis();
redis.del(nanshanzufang.key);*/
