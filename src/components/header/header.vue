<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="support">
          <hot :size="1" :type="seller.supports[0].type"></hot>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <div v-if="seller.supports" @click="showDetail" class="support-count">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="datailShow" class="detail" ref="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(support,index) in seller.supports" class="support-item">
                <hot :size="2" :type="seller.supports[index].type"></hot>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import hot from 'components/hot/hot';
  import star from 'components/star/star';

  export default {
    components: {
      hot, star
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        datailShow: false
      };
    },
    methods: {
      showDetail() {
        this.datailShow = true;
      },
      hideDetail() {
        this.datailShow = false;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../common/scss/mixin';

  .header{
    position: relative;
    color: #fff;
    background: rgba(7,17,27,0.5);
    .content-wrapper{
      position: relative;
      padding: 24px 12px 18px 24px;
      font-size: 0;
      .avatar{
        display: inline-block;
        vertical-align: top;
        margin-right: 16px;
        img{
          border-radius: 2px;
        }
      }
      .content{
        display: inline-block;
        .title{
          margin: 2px 0 8px 0;
          .brand{
            display: inline-block;
            vertical-align: middle;
            width: 30px;
            height: 18px;
            @include bg-image('brand');
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name{
            display: inline-block;
            vertical-align: middle;
            margin-left: 6px;
            font-size: 16px;
            line-height: 18px;
            font-weight: 700;
          }
        }
        .description{
          font-size: 12px;
          line-height: 12px;
          font-weight: 200;
          margin-bottom: 10px;
        }
        .support{
          .text{
            display: inline-block;
            vertical-align: middle;
            font-size: 10px;
            line-height: 12px;
            font-weight: 200;
          }
        }
        .support-count{
          position: absolute;
          right: 12px;
          bottom: 14px;
          padding: 0 8px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 14px;
          background: rgba(0,0,0,.2);
          .count{
            vertical-align: top;
            font-size: 10px;
          }
          .icon-keyboard_arrow_right{
            margin-left: 2px;
            line-height: 24px;
            font-size: 10px;
          }
        }
      }
    }
    .bulletin-wrapper{
      position: relative;
      padding: 0 26px 0 12px;
      height: 28px;
      line-height: 28px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(7,17,27,.2);
      .bulletin-title{
        display: inline-block;
        vertical-align: middle;
        width: 22px;
        height: 12px;
        margin-right: 4px;
        @include bg-image('bulletin');
        background-size: 22px 12px;
        background-repeat: no-repeat;
      }
      .bulletin-text{
        
        font-size: 10px;
        font-weight: 200;
      }
      .icon-keyboard_arrow_right{
        position: absolute;
        top: 8px;
        right: 12px;
        margin-left: 4px;
        font-size: 10px;
      }
    }
    .background{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      -webkit-filter: blur(10px);
      filter: blur(10px);
    }
    .detail{
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      z-index: 100;
      background: rgba(7, 17, 27, .8);
      backdrop-filter: blur(10px);
      &.fade-enter-active, &.fade-leave-active{
        transition: all .5s ease;
      }
      &.fade-enter, &.fade-leave-active{
        transform: translateY(-100%);
      }
      .detail-wrapper{
        min-height: 100%;
        border-top: 1px solid transparent;
        box-sizing: border-box;
        .detail-main{
          margin-top: 64px;
          padding-bottom: 64px;
          .name{
            line-height: 16px;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
          }
          .star-wrapper{
            margin-top: 18px;
            padding: 2px 0;
            text-align: center;
          }
          .title{
            width: 80%;
            display: flex;
            margin: 28px auto 24px auto;
            .line{
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, .2);
            }
            .text{
              padding: 0 12px;
              font-size: 14px;
              font-weight: 700;
            }
          }
          .supports{
            width: 80%;
            margin: 0 auto;
            .support-item{
              padding: 0 12px;
              margin-bottom: 12px;
              font-size: 0;
              &:last-child{
                margin-bottom: 0;
              }
              .text{
                display: inline-block;
                vertical-align: middle;
                line-height: 16px;
                font-size: 10px;
              }
            }
          }
          .bulletin{
            width: 80%;
            margin: 0 auto;
            .content{
              padding: 0 12px;
              font-size: 12px;
              line-height: 24px;
            }
          }
        }
      }
      .detail-close{
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        clear: both;
        font-size: 32px;
      }
    }
  }
</style>
