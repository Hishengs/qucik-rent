require("babel-register");

// 爬取深圳的租房帖子
const fetchShenzhenTopics = require('./shenzhen/index.js');
fetchShenzhenTopics();

/*const Redis = require('ioredis');
const cities = require('../city');
const nanshanzufang = cities[0]['groups'][0];
const redis = new Redis();
redis.del(nanshanzufang.key);*/
