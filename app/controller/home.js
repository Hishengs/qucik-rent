module.exports = (app) => {

  class HomeController extends app.Controller {

    index (){
      this.ctx.send('quick rent');
    }

    async getTopics (){
      let topics = await this.ctx.redis.get(this.ctx.request.body.group || this.ctx.cities[0]['groups'][0].key);
      topics = topics ? JSON.parse(topics) : {};
      const originalTopicsNum = Object.getOwnPropertyNames(topics).length;
      const filteredTopics = this.ctx.service.filter.filter(topics, this.ctx.request.body.filterSetting || {});
      const filteredTopicsNum = Object.getOwnPropertyNames(filteredTopics).length;
      this.ctx.done({
        originalTopicsNum,
        filteredTopicsNum,
        filteredTopics
      });
    }

    getCities (){
      this.ctx.done(this.ctx.cities);
    }

  }

  return HomeController;
};
