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
    includeKeywords (str){
      let include = false;
      for(let i=0, ilen=this.filterSetting.keywords.length; i<ilen; i++){
        if(str.includes(this.filterSetting.keywords[i])){
          include = true;
          break;
        }
      }
      return include;
    }

    filter (topics){
      const topicsNames = Object.getOwnPropertyNames(topics);
      topicsNames.forEach(name => {
        const topic = topics[name];
        if(this.includeKeywords(topic.title) || this.includeKeywords(topic.content) || Number(topic.info.comments) > this.filterSetting.maxComments){
          delete topics[name];
        }
      });
      return topics;
    }

  }
  return FilterService;
};
