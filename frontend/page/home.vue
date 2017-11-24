<template>
  <div id="home">
    <div class="banner">
      <span class="left">
        <span class="button-link site-name" onclick="window.location.href='/';">豆瓣快租</span>
        <span class="slogan">远离中介，帮你快速租房</span>
      </span>
      <span class="right">
        <span class="button-link city" title="点击切换城市" @click="showCitySelector=true;">[{{ (currentCity && currentCity.name) || '未选择城市' }}]</span>
        <span class="button-link login" title="点击登录">登录</span>
        <span class="button-link leave-message" title="留下你的意见">留言</span>
        <span class="button-link about" @click="showAbout=true;" title="建站初衷">关于</span>
      </span>
    </div>
    <div class="container">
      <!-- 过滤器 -->
      <div class="filter-bar">
        <!-- <span class="left">
          <Button type="primary" @click="getTopics()">刷新</Button>
          <Button type="primary" @click="showFilter=true;">过滤器设置</Button>
        </span> -->
        <div class="center">
          <div class="inner">
            <span class="item">
              屏蔽掉仅限女生 
              <Select style="width: 80px;" v-model="filterSetting.femaleOnly">
                <Option :value="0" label="不屏蔽"></Option>
                <Option :value="1" label="屏蔽"></Option>
              </Select>
            </span>
            <span class="item">
              最大评论数 <Input type="text" placeholder="最大评论数" v-model="filterSetting.maxComments" style="width: 80px;"></Input>
            </span>
            <span class="item">
              最大收藏数 <Input type="text" placeholder="最大喜欢数" v-model="filterSetting.maxLikes" style="width: 80px;"></Input>
            </span>
            <span class="item">
              关键词黑名单 <Input type="text" placeholder="关键词以#分隔" v-model="filterSetting.keywords" style="width: 100px;"></Input>
            </span>
            <span class="item">
              用户名黑名单 <Input type="text" placeholder="用户名以#分隔" v-model="filterSetting.userBlackList" style="width: 100px;"></Input>
            </span>
            <Button type="primary" @click="getTopics()">筛选</Button>
          </div>
        </div>
        <span class="right">
          <Input v-model="searcher.keyword" placeholder="输入关键词查找" style="width: 150px"></Input>
          <Button type="text" v-show="searcher.keyword.trim()" @click="cleanSearcher">清空</Button>
          <Button type="primary" :disabled="searcher.btn.disabled" @click="search">{{ searcher.btn.text }}</Button>
        </span>
      </div>
      <div class="main">
        <!-- 帖子列表 -->
        <Table :columns="topicTable.columns" :data="topicTable.data" :loading="loading"></Table>
        <Page :current="paginator.page" :total="paginator.total" :page-size="paginator.numPerPage" show-total class="paginator" @on-change="gotoPage" v-show="!searcher.keyword.trim()">总共为您找到 <b>{{paginator.total}}</b> 条租房帖子</Page>
      </div>
    </div>
    <!-- 过滤器设置 -->
    <!-- <filter-modal v-model="showFilter" @on-confirm="onFilterConfirm"></filter-modal> -->
    <!-- 关于网站 -->
    <about-modal v-model="showAbout"></about-modal>
    <!-- 城市选择 -->
    <city-selector v-model="showCitySelector" @on-confirm="onCitySelect"></city-selector>
  </div>
</template>

<script>
  import citySelector from './modal/city-selector.vue';
  import aboutModal from './modal/about.vue';
  // import filterModal from './modal/filter-modal.vue';
  export default {
    name: 'home',
    components: {
      citySelector,
      aboutModal,
      // filterModal,
    },
    data (){
      return {
        totalTopics: [],
        paginator: {
          page: 1,
          total: 0,
          numPerPage: 15
        },
        searcher: {
          keyword: '',
          btn: {
            text: '搜索',
            disabled: false,
          },
          originalList: [], // 用于保存原先列表
          result: [], // 查找结果
        },
        topicTable: {
          columns: [
            {
              title: '标题',
              key: 'title',
              render: (h, params) => {
                return h('a', {
                  attrs: {
                    href: params.row.link,
                    target: '_blank'
                  },
                  'class': {
                    'button-link': true
                  }
                }, params.row.title);
              }
            },
            {
              title: '发布者',
              key: 'user',
              render: (h, params) => {
                return h('a', {
                  attrs: {
                    href: params.row.user.link,
                    target: '_blank'
                  },
                  'class': {
                    'button-link': true
                  }
                }, params.row.user.name);
              },
              width: 100
            },
            {
              title: '发布时间',
              key: 'publishTime',
              width: 155
            },
            {
              title: '最新回复时间',
              key: 'lastReplyTime',
              width: 120
            },
            {
              title: '评论数',
              key: 'comments',
              width: 75
            },
            {
              title: '点赞数',
              key: 'likes',
              width: 75
            },
            {
              title: '小组',
              key: 'group',
              render: (h, params) => {
                return h('a', {
                  attrs: {
                    href: params.row.group.link,
                    target: '_blank'
                  },
                  'class': {
                    'button-link': true
                  }
                }, params.row.group.name);
              },
              width: 150
            },
          ],
          data: []
        },
        loading: false,
        // 当前已选的城市
        currentCity: {},
        // 过滤器
        showFilter: false,
        filterSetting: {
          femaleOnly: 0,
          maxComments: 50,
          maxLikes: 100,
          keywords: '',
          userBlackList: ''
        },
        // 可选小组
        showAbout: false,
        // 显示城市选择
        showCitySelector: false,
      };
    },
    activated (){
      this.getTopics();
    },
    methods: {
      getTopics (condition = {}){
        condition = Object.assign({}, {
          city: 'shenzhen',
          group: 'city.shenzhen.nanshan.nanshanzufang',
          filterSetting: Object.assign({}, this.filterSetting)
        }, condition);
        condition.filterSetting.keywords = condition.filterSetting.keywords.split('#').filter(item => item !== '');
        condition.filterSetting.userBlackList = condition.filterSetting.userBlackList.split('#').filter(item => item !== '');
        this.loading = true;
        this.api.group.getTopics(condition).then(res => {
          this.loading = false;
          console.log(res);
          if(res.data.err.level < 3){
            const topicNames = Object.getOwnPropertyNames(res.data.data.filteredTopics);
            this.totalTopics = topicNames.map((name) => {
              return {
                title: res.data.data.filteredTopics[name].title,
                content: res.data.data.filteredTopics[name].content,
                link: res.data.data.filteredTopics[name].link,
                user: res.data.data.filteredTopics[name].user,
                publishTime: res.data.data.filteredTopics[name].publishTime,
                lastReplyTime: res.data.data.filteredTopics[name].lastReplyTime,
                comments: res.data.data.filteredTopics[name].info.comments,
                likes: res.data.data.filteredTopics[name].info.likes,
                group: res.data.data.filteredTopics[name].group,
              };
            });
            this.paginator.total = this.totalTopics.length;
            this.gotoPage(1);
            window.localStorage.setItem('topics', this.totalTopics);
          }
        }).catch(e => {
          this.loading = false;
        })
      },
      gotoPage (page){
        this.paginator.page = page || 1;
        this.topicTable.data = 
        this.totalTopics.slice((this.paginator.page -1) * this.paginator.numPerPage, this.paginator.page * this.paginator.numPerPage);
      },
      search (){
        if(!this.searcher.keyword.trim())return;
        this.searcher.originalList = this.topicTable.data;
        this.searcher.result = this.totalTopics.filter(topic => {
          return topic.title.includes(this.searcher.keyword) || topic.content.includes(this.searcher.keyword);
        });
        this.topicTable.data = this.searcher.result;
      },
      // 清空搜索
      cleanSearcher (){
        this.searcher.keyword = '';
        this.topicTable.data = this.searcher.originalList;
      },
      // 选择城市和小组
      onCitySelect (params){
        console.log('onCitySelect', params);
        // 重新请求列表
        this.getTopics(params);
      },
      // 过滤器
      onFilterConfirm (filterSetting){
        console.log('onFilterConfirm', filterSetting);
        // 重新请求列表
        this.getTopics({
          filterSetting,
        });
      },
    }
  };
</script>

<style lang= "less">
  #home {
    height: 100%;
    position: relative;
    .banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 99;
      background-color: #ffffff;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dfdfdf;
      padding: 0 20px;
      .left {
        float: left;
        .site-name {
          font-weight: bold;
          font-size: 22px;
          display: inline-block;
        }
        .slogan {
          margin-left: 5px;
          color: #777;
        }
      }
      .right {
        float: right;
        .button-link {
          font-size: 14px;
          margin-left: 10px;
        }
      }
    }
    .container {
      padding-top: 101px;
      height: 100%;
      .filter-bar {
        position: fixed;
        top: 50px;
        left: 0;
        right: 0;
        z-index: 99;
        background-color: #ffffff;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #dfdfdf;
        padding: 0 20px;
        &:after {
          clear: both;
          content: '';
          display: block;
        }
        .left {
          float: left;
          .ivu-btn {
            margin-right: 5px;
          }
        }
        .center {
          position: absolute;
          left: 15px;
          right: 200px;
          display: inline-block;
          clear: both;
          .inner {
            display: block;
            /*margin: 0 auto;*/
            width: 1000px;
            .item {
              margin: 0 5px;
            }
          }
        }
         @media screen and (max-width: 1200px) {
          .center {
            .inner {
              width: 500px;
            }
          }
        } 
        .right {
          float: right;
          .ivu-btn {
            margin-left: 5px;
          }
        }
      }
      .main {
        width: 1024px;
        margin: 0 auto;
        padding: 20px 0;
        height: 100%;
        .paginator {
          float: right;
          margin-top: 15px;
          margin-bottom: 15px;
        }
      }
    }
    .button-link {
      &:hover {
        color: #2d8cf0;
      }
      text-decoration: none;
      color: #495060;
      cursor: pointer;
    }
  }
</style>