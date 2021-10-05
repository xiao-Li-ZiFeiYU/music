<template>
  <view class="recommend_container">
    <!-- 推荐歌曲模块 -->
    <view class="recommend w">
      <!-- 头部 -->
      <navHeader :title="'推荐歌曲'" :tips="'为你精心推荐'"></navHeader>

      <!-- 推荐歌曲内容区域 -->
      <scroll-view class="recommendScroll" enable-flex scroll-x>
        <ul>
          <li v-for="r in recommendMusic" :key="r.id">
            <img :src="r.picUrl" alt="" />
            <text>{{ r.name }}</text>
          </li>
        </ul>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import navHeader from '../navHeader/navHeader.vue'

export default {
  name: 'recommend',
  components: {
    navHeader
  },
  data() {
    return {
      // 滑动推荐歌曲数据
      recommendMusic: []
    }
  },
  methods: {
    // 获取滑动推荐歌曲数据
    async getRecommendMusic() {
      let { data: res } = await this.$request('/personalized', { limit: 15 })
      this.recommendMusic = res.result
    }
  },
  mounted() {
    this.getRecommendMusic()
  }
}
</script>

<style lang="scss" scoped>
// 推荐歌曲
.recommend {
  margin-top: 15rpx;

  // 滑动内容区域
  .recommendScroll {
    margin-top: 10rpx;

    ul {
      display: flex;

      li {
        width: 200rpx;

        &:nth-child(n + 1) {
          margin-right: 15rpx;
        }

        img {
          width: 200rpx;
          height: 200rpx;
          border-radius: 10rpx;
          overflow: hidden;
        }

        text {
          display: block;
          width: 200rpx;
          font-size: 26rpx;

          // 多行文本溢出省略号代替
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}
</style>
