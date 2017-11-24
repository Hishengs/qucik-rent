const puppeteer = require('puppeteer');

// test for browsers
const runBrowser = (index) => {
	puppeteer.launch().then(browser => {
		console.log(`browser ${index} will be closed after 5s`);

		setTimeout(() => {
			browser.close();
		}, 5000);
	});
};

// Promise.all((Array.from({length:20}, (v,k) => k)).map((value) => runBrowser(value+1)));


// test for pages
// let browser = null;
// const runPage = (index) => {
// 	return new Promise((r, j) => {
// 		browser.newPage().then(page => {
// 			page.goto('https://baidu.com').then(() => {
// 				console.log(`page ${index} will be closed after 5s`);
// 				setTimeout(() => {
// 					page.close().then(() => {
// 						r();
// 					});
// 				}, 5000);
// 			});
// 		});
// 	});
// };

// puppeteer.launch().then(browserIns => {
// 	browser = browserIns;
// 	return Promise.all((Array.from({length:200}, (v,k) => k)).map((value) => runPage(value+1)));
// }).then(() => {
// 	console.log('all pages closed');
// 	browser.close();
// }).catch(() => {
// 	console.log('catch');
// 	browser.close();
// });

// test for page goto
let browser = null;
let page = null;
const gotoPage = (index) => {
	const url = index % 2 === 0 ? 'https://www.baidu.com' : 'https://www.sogou.com/';
	return new Promise((r, j) => {
		page.goto(url).then(() => {
			setTimeout(() => {
				console.log(`page ${index} redirect to ${url}`);
				r();
			}, 2000);
		});
	});
};

puppeteer.launch().then(browserIns => {
	browser = browserIns;
	return browser.newPage();
}).then(pageIns => {
	page = pageIns;
	return Promise.all((Array.from({length:200}, (v,k) => k)).map((value) => gotoPage(value+1)));
}).then(() => {
	console.log('page closed');
	return page.close();
}).then(() => {
	console.log('browser closed');
	browser.close();
}).catch(() => {
	console.log('catch');
	browser.close();
});
