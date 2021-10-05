<template>
  <view class="ranking_container">
    <!-- 排行榜区域 -->
    <view class="ranking w">
      <!-- 头部 -->
      <navHeader :title="'排行榜'" :tips="'热歌风向标'"></navHeader>

      <!-- 排行榜内容 -->
      <swiper class="rankingSwiper" next-margin="60rpx">
        <swiper-item v-for="r in rankings" :key="r.id">
          <!-- 头部 -->
          <view class="title">{{ r.name }}</view>

          <!-- 主体 -->
          <ul class="swiper-item">
            <li v-for="(i, index) in r.list" :key="i.al.id">
              <img :src="i.al.picUrl" alt="" />
              <text class="musicIndex">{{ index + 1 }}</text>
              <text class="musicName">{{ i.al.name }}</text>
            </li>
          </ul>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import navHeader from '../navHeader/navHeader.vue'

export default {
  name: 'ranking',
  components: {
    navHeader
  },
  data() {
    return {
      // 排行榜数据
      rankings: []
    }
  },
  methods: {
    // 获取排行榜数据
    async getRanking() {
      for (var i = 0; i < 5; i++) {
        let { data: res } = await this.$request('/top/list', { idx: i })
        this.rankings.push({ id: res.playlist.id, name: res.playlist.name, list: res.playlist.tracks.slice(0, 3) })
      }
    }
  },
  created() {
    this.getRanking()
  }
}
</script>

<style lang="scss" scoped>
// 排行榜
.ranking {
  margin-top: 50rpx;

  // 内容区域
  .rankingSwiper {
    height: 400rpx;
    margin-top: 10rpx;

    .title {
      font-size: 26rpx;
    }

    .swiper-item {
      width: 96%;
    }
  }

  ul li {
    display: flex;
    align-items: center;
    font-size: 30rpx;
    margin-top: 15rpx;

    img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 10rpx;
      overflow: hidden;
    }

    .musicIndex {
      margin: 0 50rpx;
    }
  }
}
</style>
