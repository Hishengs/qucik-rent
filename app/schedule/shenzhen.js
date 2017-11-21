const schedule = require('node-schedule');
const Fetcher = require('../crawler/fetcher.js');
const Redis = require('ioredis');
const city = require('../city');

const getTopics = function(){
	console.log('>>> [scheduleJob] [fetch shenzhen topics] [start]');
	const redis = new Redis();
	redis.get(city.shenzhen.nanshan.nanshanzufang.key, function (err, result) {
	  if(!err){
	  	const topics = JSON.parse(result) || {};
	  	const fetcher = new Fetcher({
	  		fetchedTopics: topics // 用于 fetcher 判重
	  	});
	  	const fetchPages = 1; // 爬取的页数
	  	fetcher.fetchGroup(city.shenzhen.nanshan.nanshanzufang.url, fetchPages).then(topics => {
				console.log(`>>> All ${Object.getOwnPropertyNames(topics).length} topics fetched`);
				redis.del(city.shenzhen.nanshan.nanshanzufang.key); // 删除旧的数据
				redis.set(city.shenzhen.nanshan.nanshanzufang.key, JSON.stringify(topics)); // 插入新的数据
				redis.quit();
			});	
	  }else throw err;
	});
};

module.exports = function(){
	console.log('>>> [scheduleJob] [fetch shenzhen topics]');
	// 每 20 分钟获取一次
	getTopics(); // 先执行一次
	return schedule.scheduleJob('*/20 * * * *', getTopics);
};
