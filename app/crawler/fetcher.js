const puppeteer = require('puppeteer');

class Fetcher {
	constructor (opt = {}){
		this.opt = Object.assign({
			fetchedTopics: {}
		}, opt);
		this.browser = null;
		this.page = null;
		this.inited = false;
		// 随机值，用于设置header
		this.agents = [];
		this.referers = ['https://baidu.com', 'https://58.com'];
	}

	async init (){
		if(!this.inited){
			this.browser = await puppeteer.launch();
			this.page = await this.browser.newPage();
		}
	}

	async close (){
		await this.page.close();
		await this.browser.close();
	}

	// async close (){
	// 	await this.browser.close();
	// }

	/*
		desc: 			反反爬虫 随机休眠 0-3000 ms
	*/
	async randomSleep (multiple = 1){
		const ms = parseInt(Math.random() * 3000 * multiple);
		this.printLog(`sleep for ${ms} ms`);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	/*
		desc: 			反反爬虫机制
		page: 			页面
	*/
	async antiAnti (){
		this.printLog('start antiAnti');
		// 清除 cookie
		await this.page.deleteCookie();
		// 设置随机 header
		await this.page.setExtraHTTPHeaders({
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
		});
	}

	printLog (msg){
		console.log(`>>> ${msg}`);
	}

	/*
		desc: 			爬取豆瓣租房小组帖子
		url: 				租房小组网址
		pageNum: 		爬取页数
		numPerPage: 每页帖子数
	*/
	async fetchGroup (url = 'https://www.douban.com/group/nanshanzufang/', pageNum = 10, numPerPage = 25, ){
		await this.init();
		this.printLog('fetching group: ' + url + '\n');
		// 1. fetch pages
		let topics = [];
		for(let i=0; i<pageNum; i++){
			let startUrl = url + 'discussion?start=' + (i * numPerPage || 1);
			this.printLog(`fetching page[${i+1}]: \n` + startUrl);
			let tempTopics = await this.fetchPage(startUrl);
			if(tempTopics !== null){
				topics = topics.concat(tempTopics);
			}
			this.printLog(`fetching page[${i+1}]: done\n`);
			await this.randomSleep(1.5);
		}
		// 2. transfer to map
		const topicsMap = {};
		topics.forEach(topic => {
			topicsMap[topic.id] = topic;
		});
		await this.close();
		this.printLog('fetching group: done\n');
		return topicsMap;
	}

	/*
		desc: 			爬取豆瓣租房小组指定页帖子
		url: 				指定页网址
	*/
	async fetchPage(url = 'https://www.douban.com/group/nanshanzufang/discussion?start=1', ){
		await this.init();
	  await this.antiAnti();
	  const response = await this.page.goto(url);
	  if(this.pageAvailable(url, response)){
	  	// 获取所有的帖子
		  const tempTopics = await this.page.evaluate(function(){
		  	const topics = [];
		  	const trs = $('.article').find('tr').slice(1);
		  	for(let i=0, ilen=trs.length; i<ilen; i++){
		  		const tr = trs[i];
		  		topics.push({
		  			id: $(tr).find('.title > a').attr('href').match(/\d+/)[0],
		  			title: $(tr).find('.title > a').text().trim(),
		  			link: $(tr).find('.title > a').attr('href'),
		  			comments: $($(tr).find('td')[2]).text().trim(),
		  			lastReplyTime: $(tr).find('.time').text().trim(),
		  		});
		  	}
		  	return topics;
		  });
		  // fetch topics
			const topics = [];
			for(let j=0, jlen=tempTopics.length; j<jlen; j++){
		  	if(tempTopics[j] === null)continue;
		  	if(this.opt.fetchedTopics[tempTopics[j]['id']]){ // 已存在就没必要再爬取
		  		topics.push(this.opt.fetchedTopics[tempTopics[j]['id']]);
		  	}else {
		  		const topic = await this.fetchTopic(tempTopics[j].link, tempTopics[j].comments, tempTopics[j].lastReplyTime);
			  	if(topic !== null){
			  		topics.push(topic);
			  	}
		  	}
		  	await this.randomSleep();
		  }
		  return topics;
	  }else {
	  	return null;
	  }
	}

	/*
		desc: 					爬取豆瓣租房小组指定帖子
		url: 						帖子网址
		comments: 			评论数
		lastReplyTime: 	最新回复时间
	*/
	async fetchTopic(url, comments = 0, lastReplyTime){
		await this.init();
		await this.antiAnti();
		this.printLog('fetching topic: \n' + url);
		const id = url.match(/\d+/)[0];
		if(this.opt.fetchedTopics[id]){
			this.printLog('topic has been fetched');
			return null;
		}
	  const response = await this.page.goto(url);
	  if(this.pageAvailable(url, response)){
	  	// 获取所有的帖子链接
		  const topic = await this.page.evaluate(function(){
		  	const title = $('#content').find('h1').text().trim();
		  	const user = {
		  		link: $('#content').find('.topic-doc > h3 > .from > a').attr('href'),
		  		id: $('#content').find('.topic-doc > h3 > .from > a').attr('href').split('/people/')[1].replace('/', ''),
		  		name: $('#content').find('.topic-doc > h3 > .from > a').text().trim(),
		  	};
		  	const publishTime = $('#content').find('.topic-doc > h3 > .color-green').text().trim();
		  	const content = $('.topic-doc').html();
		  	// const content = '';
		  	const group = {
		  		name: $('#g-side-info').find('.title').text().trim(),
		  		link: $('#g-side-info').find('.title > a').attr('href')
		  	};
		  	// 其他相关信息
		  	const info = {
		  		likes: parseInt($('.fav-num > a').text().trim()) || 0, // 帖子被喜欢的数目
		  	};
		  	return {
		  		title, user, publishTime, content, group, info
		  	};
		  });
		  // 加上已有信息
		  topic.link = url;
		  topic.id = id;     // 帖子 id
		  topic.info.comments = comments;   // 帖子评论数
		  topic.lastReplyTime = lastReplyTime || topic.publishTime; // 最新回帖时间
		  this.printLog('fetching topic done: \n' + url);
		  return topic;
	  }else {
	  	return null;
	  }
	}

	/*
		desc: 					检测所爬去的网页是否可用(剔除 403 等页面)
		originalUrl: 		原本的请求地址
		response: 			请求返回数据
	*/
	pageAvailable (originalUrl, response){
		const available = response.status === 200 && response.url === originalUrl;
		// console.log('>>> available', response.status, response.url, originalUrl, available);
		return available;
	}

};

module.exports = Fetcher;