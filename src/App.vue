<template>
  <div class="home">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{ path:'/goods' }">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{ path:'/ratings' }">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{ path:'/seller' }">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from './common/js/until';
  import header from './components/header/header';
  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then(response => {
        if (response.data.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  };

</script>

<style lang="scss" scoped>
  @import "./common/scss/mixin.scss";

  .tab {
    display: flex;
    width: 100%;
    line-height: 40px;
    background-color: #fff;
    z-index: 3;
    /*box-shadow:(0 1px 2px rgba(7,17,27,.1));*/
    /*移动端1px解决方案*/
    @include border-1px(rgba(7, 17, 27, .1));
    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: rgb(77, 85, 93);
      a {
        display: block;
        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
</style>
