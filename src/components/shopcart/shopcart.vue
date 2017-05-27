<template>
  <div class="shopcart-wrapper">
     <div class="shopcart" @click="toggleList">
       <div class="content">
         <div class="content-left">
           <div class="logo-wrapper">
             <div class="logo" :class="{'highlight':totalCount>0}">
               <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
             </div>
             <div class="num" v-show="totalCount>0">{{totalCount}}</div>
           </div>
           <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
           <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
         </div>
         <div class="content-right" @click.stop.prevent="pay" :class="payClass">
           <div class="pay">{{payDesc}}</div>
         </div>
       </div>
       <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
       <transition name="fold">
         <div class="shopcart-list" v-show="listShow">
           <div class="list-header">
             <h1 class="title">购物车</h1>
             <span class="empty" @click="empty">清空</span>
           </div>
           <div class="list-content" ref="listContent">
             <ul>
               <li v-for="food in selectFoods" class="food">
                 <span class="name">{{food.name}}</span>
                 <div class="price">
                   <span>￥{{food.price*food.count}}</span>
                 </div>
                 <div class="cartcontrol-wrapper">
                   <cartcontrol @eventCartadd="addFood" :food="food"></cartcontrol>
                 </div>
               </li>
             </ul>
           </div>
         </div>
       </transition>
     </div>
     <transition name="mask">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default{
    components: {
      cartcontrol
    },
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 20
      },
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              count: 1,
              price: 10
            }
          ];
        }
      }
    },
    data() {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        var total = 0;
        this.selectFoods.forEach((food) => {
          total += food.count * food.price;
        });
        return total;
      },
      totalCount() {
        var count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let dif = this.minPrice - this.totalPrice;
          return `还差￥${dif}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass() {
        if (this.totalPrice >= this.minPrice) {
          return 'enough';
        } else {
          return 'no-engough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        // 触发游览器重绘
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        // 拿到所有的小球
        let ball = this.dropBalls.shift();
          if(ball) {
            ball.show = false;
            el.style.display = 'none';
          }
      },
      addFood(target) {
        this.drop(target);
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      pay() {
        if (this.totalPrice >= this.minPrice) {
          window.alert(`支付${this.totalPrice + this.deliveryPrice}元；包含配送费${this.deliveryPrice}元`);
        }
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';

  .shopcart{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 48px;
    z-index: 50;
    .content{
      display: flex;
      background: #141d27;
      font-size: 0;
      color: rgba(255, 255, 255, 0.4);
      .content-left{
        flex: 1;
        .logo-wrapper,.price,.desc{
          display: inline-block;
          vertical-align: top;
          box-sizing: border-box;
        }
        .logo-wrapper{
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          background: #141d27;
          border-radius: 50%;
          @media only screen and (max-width: 320px){
            margin: 0 8px;
          }
          .logo{
            width: 100%;
            height: 100%;
            text-align: center;
            background: #2b343c;
            border-radius: 50%;
            &.highlight{
              background: #00a0dc;
            }
            .icon-shopping_cart{
              font-size: 24px;
              color: #80858a;
              line-height: 44px;
              &.highlight{
                color: #fff;
              }
            }
          }
          .num{
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            font-size: 9px;
            font-weight: 700;
            color: #fff;
            text-align: center;
            background: #f01414;
            border-radius: 16px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
          }
        }
        .price{
          margin-top: 12px;
          padding-right: 12px;
          line-height: 24px;
          border-right: 1px solid rgba(255,255,255,.1);
          font-size: 16px;
          font-weight: 700;
          color: #80858a;
          @media only screen and (max-width: 320px){
            padding-right: 8px;
          }
          &.highlight{
            color: #fff;
          }
        }
        .desc{
          margin: 12px 0 0 12px;
          line-height: 24px;
          font-size: 12px;
          color: rgba(255, 255, 255, .4);
          @media only screen and (max-width: 320px){
            margin: 12px 0 0 8px;
          }
        }
      }
      .content-right{
        flex: 0 0 105px;
        width: 105px;
        background: #2b343c;
        color: rgba(255, 255, 255, .4);
        @media only screen and (max-width: 320px){
          flex: 0 0 85px;
          width: 85px;
        }
        &.enough{
         background: #00b43c;
         color: #fff;
        }
        &.no-enough{
          background: #2b343c;
        }
        .pay{
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          height: 48px;
          line-height: 48px
        }
      }
    }
    .ball-container{
      .ball{
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner{
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all 0.4s linear;
        }
      }
    }
    .shopcart-list{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0,-100%,0);
      &.fold-enter-active,
      &.fold-leave-active{
        transition: all .5s ease;
      }
      &.fold-enter,
      &.fold-leave-active{
        transform: translate3d(0, 0, 0);
      }
      .list-header{
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(1,17,27,.1);
        .title{
          float: left;
          font-size: 14px;
          color: rgb(7,17,27);
        }
        .empty{
          float: right;
          font-size: 12px;
          color: rgb(1,160,220);
        }
      }
      .list-content{
        padding: 0 18px;
        max-height: 217px;
        background: #fff;
        overflow: hidden;
        .food{
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-1px(rgba(7, 17, 27, .1));
          .name{
            line-height: 24px;
            font-size: 14px;
            color: rgb(7,17,37);
          }
          .price{
            position: absolute;
            right: 90px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700; 
            color: rgb(240,20,20);
          }
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: 6px; 
          }
        }
      }
    }
  }
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: rgba(7, 17, 27, .6);
    backdrop-filter: blur(10px);
    &.mask-enter-active,
    &.mask-leave-active {
      transition: all 0.5s ease;
    }
    &.mask-enter,
    &.mask-leave-active{
      opacity: 0;
    }
  }
</style>