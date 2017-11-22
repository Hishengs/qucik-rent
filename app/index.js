const Heysoo = require('heysoo');
const cities = require('./city');
const Redis = require('ioredis');
const redis = new Redis();

const server = new Heysoo();

server.hook(app => {
	app.context.redis = redis;
	app.context.cities = cities;
});

server.start();