<template>
  <div class="goods-wrapper">
    <div class="goods">
    	<div class="menu-wrapper" ref="menuWrapper">
    		<ul>
    			<li v-for="(item,index) in goods" :key="index" :class="{'current':currentIndex===index}" @click="selecteMenu(index,$event)" class="menu-item">
    				<span class="text border-1px">
	    				<template v-if="item.type>0">
	    					<hot :size="3" :type="item.type"></hot>
	    				</template>
    					<span class="name">{{item.name}}</span>
    				</span>
    			</li>
    		</ul>
    	</div>
    	<div class="food-wrapper" ref="foodsWrapper">
    		<ul>
    			<li v-for="(item,index) in goods" class="food-list food-list-hook">
    				<h1 class="title">{{item.name}}</h1>
    				<ul>
    					<li v-for="(food,index) in item.foods" @click="selectFood(food,$event)" class="food-item border-1px">
    						<div class="icon">
    							<img :src="food.icon" width="57" height="57">
    						</div>
    						<div class="content">
    							<h2 class="name">{{food.name}}</h2>
    							<p class="desc">{{food.description}}</p>
    							<div class="extra">
    								<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
    							</div>
    							<div class="price">
    								<span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
    							</div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @eventCartadd="addFood" :food="food"></cartcontrol>
                  </div>
    						</div>
    					</li>
    				</ul>
    			</li>
    		</ul>
    	</div>
      <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    </div>
    <food @eventCartadd="addFood" :food="selectedFood" ref="food"></food>
  </div>  
</template>

<script type="text/ecmascript-6">
	import hot from 'components/hot/hot';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
	import BScroll from 'better-scroll';

	const ERR_OK = 0;

  export default {
  	components: {
  		hot, shopcart, cartcontrol, food
  	},
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			goods: [],
  			listHeight: [],
  			scrollY: 0,
        selectedFood: {}
  		};
  	},
  	created() {
  		this.$http.get('/api/goods').then((res) => {
  			if (res.data.errno === ERR_OK) {
  				this.goods = res.data.data;
  				this.$nextTick(() => {
  					this._initScroll();
  					this._calculateHeight();
  				});
  			}
  		});
  	},
  	computed: {
      // 滚动坐标与区间高度映射
  		currentIndex() {
        for(let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
  	methods: {
      addFood(target) {
        this._drop(target);
      },
      selecteMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        // 拿到foodList列表，与点击的menu菜单栏下标对应，滚动到foodlist对应的位置
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
  		_initScroll() {
  			this.meunScroll = new BScroll(this.$refs.menuWrapper, {
  				click: true
  			});
  			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
  				click: true,
          probeType: 3
  			});
        // food滚动高度
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
  		},
      // 拿到每个区间的高度
  		_calculateHeight() {
  			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
  			let height = 0;
  			this.listHeight.push(height);
  			for(let i = 0, len = foodList.length; i < len; i++) {
  				let item = foodList[i];
  				height += item.clientHeight;
  				this.listHeight.push(height);
  			}
  		}
  	}
  };
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';
  .goods{
  	display: flex;
  	position: absolute;
  	top: 174px;
  	bottom: 46px;
  	width: 100%;
  	overflow: hidden;
  	.menu-wrapper{
  		flex: 0 0 80px;
  		width: 80px;
  		background: #f3f5f7;
  		.menu-item{
  			display: table;
  			width: 56px;
  			height: 54px;
  			line-height: 14px;
  			padding: 0 12px;
        &.current{
          position: relative;
          margin-top: -1px;
          z-index: 10;
          font-weight: 700;
          background: #fff;
          .text{
            @include border-none();
          }
        }
  			.text{
  				display: table-cell;
  				vertical-align: middle;
  				width: 56px;
  				font-size: 0;
  				@include border-1px(rgba(7,17,27,.1));
  				.name{
  					vertical-align: middle;
  					font-size: 12px;
  				}
  			}
  		}
  	}
  	.food-wrapper{
  		flex: 1;
  		background: #fff;
  		.title{
  			padding-left: 14px;
  			height: 26px;
  			line-height: 26px;
  			border-left: 2px solid #d9dde1;
  			font-size: 12px;
  			color: #93999f;
  			background: #f3f5f7;
  		}
  		.food-item{
  			display: flex;
  			margin: 18px;
  			padding-bottom: 18px;
  			@include border-1px(rgba(7,17,27,.1));
  			&:last-child{
  				margin-bottom: 0;
  				@include border-none();
  			}
  			.icon{
  				flex: 0 0 57px;
  				margin-right: 10px;
  			}
  			.content{
  				flex: 1;
  				.name{
  					margin: 2px 0 8px 0; 
  					line-height: 14px;
  					font-size: 14px;
  					color: #07111b;
  				}
  				.desc,.extra{
  					line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
  				}
  				.desc{
  					margin-bottom: 8px;
  					line-height: 12px;
  				}
  				.extra{
  					margin-bottom: 2px;
  					.count{
  						margin-right: 12px;
  					}
  				}
  				.price{
  					font-weight: 700;
  					line-height: 24px;
  					.now{
  						margin-right: 8px;
  						font-size: 14px;
  						color: rgb(240, 20, 20);
  					}
  					.old{
  						text-decoration: line-through;
  						font-size:10px;
  						color: rgb(147, 153, 159);
  					}
  				}
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
  			}
			}
  	}
  }
</style>