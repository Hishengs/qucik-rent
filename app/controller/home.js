module.exports = (app) => {

  class HomeController extends app.Controller {

    index (){
      this.ctx.send('quick rent');
    }

    async getTopics (){
      let topics = await this.ctx.redis.get(this.ctx.city.shenzhen.nanshan.nanshanzufang.key);
      topics = topics ? JSON.parse(topics) : {};
      const originalTopicsNum = Object.getOwnPropertyNames(topics).length;
      const filteredTopics = this.ctx.service.filter.filter(topics);
      const filteredTopicsNum = Object.getOwnPropertyNames(filteredTopics).length;
      this.ctx.done({
        originalTopicsNum,
        filteredTopicsNum,
        filteredTopics
      });
    }

  }

  return HomeController;
};
