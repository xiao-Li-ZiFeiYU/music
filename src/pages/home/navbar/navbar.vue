<template>
  <view class="navbar_container">
    <!-- 导航栏模块 -->
    <ul class="navbar">
      <li class="navbar_item">
        <text class="iconfont icon-meirituijian-"></text>
        <text>每日推荐</text>
      </li>
      <li class="navbar_item">
        <text class="iconfont icon-gedan"></text>
        <text>歌单</text>
      </li>
      <li class="navbar_item">
        <text class="iconfont icon-paixingbang"></text>
        <text>排行榜</text>
      </li>
      <li class="navbar_item">
        <text class="iconfont icon-diantai"></text>
        <text>电台</text>
      </li>
      <li class="navbar_item">
        <text class="iconfont icon-zhibo"></text>
        <text>直播</text>
      </li>
    </ul>
  </view>
</template>

<script>
export default {
  name: 'navbar'
}
</script>

<style lang="scss" scoped>
// 导航栏
.navbar {
  display: flex;
  justify-content: space-around;

  .navbar_item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .iconfont {
      width: 100rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      background-color: #d43c33;
      border-radius: 50rpx;
      color: #fff;
      font-size: 45rpx;
      margin: 20rpx 0;
    }

    text {
      font-size: 26rpx;
    }
  }
}
</style>
