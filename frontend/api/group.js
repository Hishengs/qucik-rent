const { http, urlPrefix } = require('./config.js');

module.exports = {
	// 获取帖子列表
  getTopics (condition){
    return new Promise((resolve, reject) => {
      console.log('>>> [api.postData] 获取帖子列表');
      http.post(urlPrefix + '/topics', condition).then(res => {
        resolve(res);
      }).catch(reject);
    });
  },
  // 获取城市列表
  getCities (){
  	return new Promise((resolve, reject) => {
      console.log('>>> [api.postData] 获取城市列表');
      http.post(urlPrefix + '/cities').then(res => {
        resolve(res);
      }).catch(reject);
    });
  }
};