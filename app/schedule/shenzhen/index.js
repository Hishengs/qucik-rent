const schedule = require('node-schedule');
const { find } = require('lodash');
const Fetcher = require('../../crawler/fetcher.js');
const Redis = require('ioredis');
const cities = require('../../city');
const config = require('./config.js');

const shenzhen = find(cities, { key: 'shenzhen' });

const fetchGroupTopics = function(group){
	return new Promise((resolve, reject) => {
		console.log(`\n>>> group: ${group.name} start fetching`);
		const redis = new Redis();
		redis.get(group.key, function (err, result) {
		  if(!err){
		  	const fetcher = new Fetcher({
		  		fetchedTopics: JSON.parse(result) || {}, // 用于 fetcher 判重
		  	});
		  	fetcher.fetchGroup(group.url, config.pageNum).then(topics => {
					console.log(`>>> group: ${group.name} fetched done, topics: [${Object.getOwnPropertyNames(topics).length}]`);
					redis.del(group.key); // 删除旧的数据
					redis.set(group.key, JSON.stringify(topics)); // 插入新的数据
					redis.quit();
					resolve();
				});	
		  }else throw err;
		}).catch(reject);
	});
};

// 爬取该城市各个租房小组
const fetchGroups = function(){
	return Promise.all(shenzhen.groups.map(group => {
		return fetchGroupTopics(group);
	}));
};

module.exports = function(){
	console.log('\n>>> [scheduleJob] [fetch shenzhen topics]');
	fetchGroups(); // 先执行一次
	return schedule.scheduleJob(`*/${config.interval} * * * *`, fetchGroups);
};
