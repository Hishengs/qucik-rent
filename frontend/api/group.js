const { http, urlPrefix } = require('./config.js');

module.exports = {
	// 获取帖子列表
  getTopics() {
    return new Promise((resolve, reject) => {
      console.log('>>> [api.postData] 获取帖子列表');
      http.post(urlPrefix + '/topics').then(res => {
        resolve(res);
      }).catch(reject);
    });
  },
};