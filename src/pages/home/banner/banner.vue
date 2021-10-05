<template>
  <view class="banner_container">
    <!-- 轮播图模块 -->
    <swiper class="swiper" indicator-dots indicator-color="ivory" indicator-active-color="#d43c33" autoplay interval="2000" circular>
      <swiper-item v-for="b in banners" :key="b.encodeId">
        <img :src="b.imageUrl" alt="" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'banner',
  data() {
    return {
      // 首页轮播图数组
      banners: []
    }
  },
  methods: {
    // 获取首页轮播图数据
    async getBanner() {
      let { data: res } = await this.$request('/banner')
      this.banners = res.banners
    }
  },
  mounted() {
    this.getBanner()
  }
}
</script>

<style lang="scss" scoped>
// 轮播图
.swiper {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
