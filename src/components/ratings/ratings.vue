<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
    	<div class="overview">
    		<div class="overview-left">
    			<h1 class="score">{{seller.score}}</h1>
    			<div class="title">综合评分</div>
    			<div class="rank">高于周边商家{{seller.rankRate}}%</div>
    		</div>
    		<div class="overview-right">
    			<div class="score-wrapper">
    				<span class="title">服务态度</span>
    				<star :size="36" :score="seller.serviceScore"></star>
    				<span class="score">{{seller.serviceScore}}</span>
    			</div>
    			<div class="score-wrapper">
    				<span class="title">商品评分</span>
    				<star :size="36" :score="seller.foodScore"></star>
    				<span class="score">{{seller.foodScore}}</span>
    			</div>
    			<div class="delivery-wrapper">
    				<span class="title">送达时间</span>
    				<span class="delivery">{{seller.deliveryTime}}分钟</span>
    			</div>
    		</div>
    	</div>
    	<split></split>
    	<ratingselect @eventSelectType="selectRating" @eventToggle="toggleContent" :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"></ratingselect>
    	<div class="rating-wrapper">
    		<ul>
    			<li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
    				<div class="avatar">
    					<img :src="rating.avatar" width="28" height="28">
    				</div>
    				<div class="content">
    					<h1 class="name">{{rating.username}}</h1>
    					<div class="star-wrapper">
    						<star :size="24" :score="rating.score"></star>
    						<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
    					</div>
    					<p class="text">{{rating.text}}</p>
    					<div class="recommend" v-show="rating.recommend && rating.recommend.length">
    						<span class="icon-thumb_up"></span>
    						<span v-for="item in rating.recommend" class="item">{{item}}</span>
    					</div>
    					<div class="time">
                {{rating.rateTime | formatDate}}
              </div>
    				</div>
    			</li>
    		</ul>
    	</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	import star from 'components/star/star';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	import BScroll from 'better-scroll';
	import {formatDate} from 'common/js/date';

  const ALL = 2;
  const ERR_OK = 0;
  export default {
  	components: {
  		star, split, ratingselect
  	},
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			ratings: [],
  			selectType: ALL,
  			onlyContent: false
  		};
  	},
  	created() {
  		this.$http.get('/api/ratings').then((response) => {
  			if (response.data.errno === ERR_OK) {
  				this.ratings = response.data.data;
  				this.$nextTick(() => {
  					if (!this.scroll) {
  						this.scroll = new BScroll(this.$refs.ratings, {
  							click: true
  						});
  					} else {
  						this.scroll.refresh();
  					}
  				});
  			}
  		});
  	},
    methods: {
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
  	filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';
  .ratings{
  	position: fixed;
		top: 174px;
		left: 0;
		bottom: 0;
		width: 100%;
		overflow: hidden;
  	.overview{
  		display: flex;
  		padding: 18px 0;
  		.overview-left{
				flex: 0 0 137px;
				width: 137px;
				padding: 6px 0;
				text-align: center;
				border-right: 1px solid rgba(7, 17, 27, 0.1);
				@media only screen and (max-width: 320px){
  				flex: 0 0 120px;
					width: 120px;
  			}
				.score{
					margin-bottom: 6px;
					line-height: 28px;
					font-size: 24px;
					color: #f90;
				}
				.title{
					margin-bottom: 8px;
					line-height: 12px;
					font-size: 12px;
					color: #07111b;
				}
				.rank{
					line-height: 10px;
					font-size: 10px;
					color: #93999f;
				}
  		}
  		.overview-right{
  			flex: 1;
  			padding: 6px 0 6px 24px;
  			@media only screen and (max-width: 320px){
  				padding-left: 6px
  			}
  			.score-wrapper{
  				margin-bottom: 8px;
  				font-size: 0;
  			}
  			.score-wrapper{
  				.title, .score, .star{
  					display: inline-block;
  					vertical-align: top;
  				}
  				.title{
  					line-height: 18px;
  					font-size: 12px;
  					color: #07111b;
  				}
					.star{
						margin: 0 12px;
					}
  				.score{
  					line-height: 18px;
  					font-size: 12px;
  					color: #f90;
  				}
  			}
  			.delivery-wrapper{
  				font-size: 0;
  				.title{
  					line-height: 18px;
  					font-size: 12px;
  					color: #07111b;
  				}
  				.delivery{
  					margin-left: 12px;
  					font-size: 12px;
  					color: #93999f;
  				}
  			}
  		}
  	}
  	.rating-wrapper{
  		padding: 0 18px;
  		.rating-item{
  			display: flex;
  			padding: 18px 0;
  			@include border-1px(rgba(7,17,27,.1));
  			.avatar{
  				flex: 0 0 28px;
  				width: 28px;
  				margin-right: 12px;
  				img{
  					border-radius: 50%;
  				}
  			}
  			.content{
  				flex: 1;
  				position: relative;
  				.name{
  					line-height: 12px;
            font-size: 10px;
            color: rgb(7,17,27);
            margin-bottom: 4px;
  				}
  				.star-wrapper{
  					margin-bottom: 6px;
  					font-size: 0;
  					.star{
  						display: inline-block;
  						vertical-align: top;
  						margin-right: 6px;
  					}
  					.delivery{
  						display: inline-block;
  						vertical-align: top;
              line-height: 12px;
  						font-size: 10px;
  						color: rgb(147,153,159);
  					}
  				}
  				.text{
  					line-height: 18px;
            font-size: 12px;
            color: rgb(7,17,27);
            margin-bottom: 8px;
  				}
  				.recommend{
  					line-height: 16px;
  					font-size: 0px;
  					.icon-thumb_up, .item{
              display: inline-block;
              vertical-align: top;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
  					.icon-thumb_up{
  						color: rgb(0,160,220);
  					}
  					.item{
  						padding: 0 6px;
              border: 1px solid rgba(7,17,27,.1);
              border-radius: 1px;
              color: rgb(147,153,159);
              background: #fff;
  					}
  				}
  				.time{
  					position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147,153,159);
  				}
  			}
  		}
  	}
  }
</style>