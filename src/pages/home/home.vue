<template>
  <view class="home_container">
    <!-- 轮播图模块 -->
    <Banner></Banner>

    <!-- 导航栏模块 -->
    <Navbar></Navbar>

    <!-- 推荐歌曲模块 -->
    <Recommend></Recommend>

    <!-- 排行榜区域 -->
    <Ranking></Ranking>
  </view>
</template>

<script>
import Banner from './banner/banner.vue'
import Navbar from './navbar/navbar.vue'
import Recommend from './recommend/recommend.vue'
import Ranking from './ranking/ranking.vue'

export default {
  name: 'home',
  components: {
    Banner,
    Navbar,
    Recommend,
    Ranking
  }
}
</script>

<style lang="scss" scoped></style>
