<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
				<i class="inner icon-remove_circle_outline"></i>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add">
			<i class="add icon-add_circle" @click.stop.prevent="addtoCart($event)"></i>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';

  export default{
    props: {
      food: {
        type: Object
      }
    },
    created() {
      // console.log(this.food);
    },
    methods: {
    	decreaseCart(event) {
        if (!event._constructed) {
           return;
        }
        if(this.food.count) {
          this.food.count--;
        };
	    },
	    addtoCart(event) {
	    	if (!event._constructed) {
           return;
        }
        if (!this.food.count) {
        	// 添加food不存在的字段时 需要调用vue.set方法添加，这样才可以通过vue观测到这个字段的变化
        	Vue.set(this.food, 'count', 1);
        } else {
        	this.food.count++;
        }
        this.$emit('eventCartadd', event.target);
	    }
    }
  };
</script>

<style lang="scss" scoped>
	.cartcontrol{
		font-size: 0;
		.cart-decrease,.cart-count,.cart-add{
			display: inline-block;
			vertical-align: middle;
		}
    .cart-decrease{
      transform: translate3d(0, 0, 0);
      .inner{
        display: inline-block;
        line-height: 24px;
        font-size: 24px;
        color: rgb(0, 160, 220);
        transition: all 0.4s linear;
        transform: rotate(0);
      }
      &.move-enter-active, &.move-leave-active{
        transition: all 0.4s linear;
      }
      &.move-enter, &.move-leave-active{
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner{
          transform: rotate(180deg); 
        }
      }
    }
		.cart-decrease,.cart-add{
			padding: 6px;
			.inner,.add{
				display: inline-block;
				line-height: 24px;
	      color:rgb(0,160,220);
				font-size:24px;
			}
		}
		.cart-count{
      line-height: 24px;
      width: 12px;
      font-size: 10px;
      color: rgb(147,153,159);
      text-align: center;
		}
	}
</style>