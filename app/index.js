const Heysoo = require('heysoo');
const city = require('./city');
const Redis = require('ioredis');
const redis = new Redis();

const server = new Heysoo();

server.hook(app => {
	app.context.redis = redis;
	app.context.city = city;
});

server.start();