module.exports = (app) => {
  class FilterService extends app.Service {

    constructor(ctx) {
      super(ctx);
      this.filterSetting = {
        femaleOnly: 0,      // 是否仅限女生
        maxComments: 100,    // 最大评论数
        maxLikes: 100,      // 最大喜欢数
        keywords: [         // 关键词黑名单
          // '自如',
          // '蛋壳',
          // '急转',
        ],
        userBlackList: []   // 用户黑名单
      };
    }

    // 检查是否包含关键词
    includeKeywords (str, keywords){
      let include = false;
      for(let i=0, ilen=keywords.length; i<ilen; i++){
        if(str.includes(keywords[i])){
          include = true;
          break;
        }
      }
      return include;
    }

    filter (topics, setting = {}){
      const filterSetting = Object.assign({}, this.filterSetting, setting);
      const topicsNames = Object.getOwnPropertyNames(topics);
      // 是否仅限女生
      if(filterSetting.femaleOnly == '1'){
        filterSetting.keywords = filterSetting.keywords.concat(['仅限女生', '限女', '只接受女生', '要求女生']);
      }
      console.log('>>> filter', filterSetting);
      topicsNames.forEach(name => {
        const topic = topics[name];
        if(
          this.includeKeywords(topic.user.name, filterSetting.userBlackList) || 
          this.includeKeywords(topic.title, filterSetting.keywords) || 
          this.includeKeywords(topic.content, filterSetting.keywords) || 
          (Number(topic.info.comments) > filterSetting.maxComments || 99999) || 
          (Number(topic.info.likes) > filterSetting.maxLikes || 99999)
        ){
          delete topics[name];
        }
      });
      return topics;
    }

  }
  return FilterService;
};
