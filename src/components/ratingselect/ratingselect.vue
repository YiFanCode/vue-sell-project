<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" @click="select(2,$event)" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click="select(0,$event)" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" @click="select(1,$event)" :class="{'active':selectType===1}">{{desc.nagative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent" :class="{'on': onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const ALL = 2;
  const POSITIVE = 0;
  const NEGATIVE = 1;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            nagative: '不满意'
          };
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter(rating => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter(rating => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type, event) {
        if(!event._constructed) {
          return;
        }
        this.$emit('eventSelectType', type);
      },
      toggleContent(event) {
        if(!event._constructed) {
          return;
        }
        // 事件通知food组件我点击改变了onlyContent
        this.$emit('eventToggle');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';

  .ratingselect{
    .rating-type{
      margin: 0 18px;
      padding: 18px 0;
      font-size: 0;
      @include border-1px(rgba(7,17,27,.1));
      .block{
        display: inline-block;
        vertical-align: top;
        width: 64px;
        height: 32px;
        line-height: 32px;
        margin-right: 8px;
        font-size: 12px;
        text-align: center;
        color: #4d555d;
        border-radius: 1px;
        &.active{
          color: #fff;
        }
        &.positive{
          background: rgba(0,160,220,.2);
          &.active{
            background: rgb(0, 160, 220);
          }
        }
        &.negative{
          background: rgba(77,85,93,0.2);
          &.active{
            background: rgb(77, 85, 93);
          }
        }
        .count{
          margin-left: 2px;
          font-size: 8px;
        }
      }
    }
    .switch{
      padding: 12px 18px;
      line-height: 24px;
      color: #93999f;
      font-size: 0;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      &.on{
        .icon-check_circle{
          color: #00c850;
        }
      }
      .icon-check_circle{
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text{
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>