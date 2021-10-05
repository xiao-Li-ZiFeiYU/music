<template>
  <!-- 导航头部 -->
  <view class="navHeader_container">
    <text class="title">{{ title }}</text>
    <view>
      <text>{{ tips }}</text>
      <text class="more">查看更多</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'navHeader',
  props: ['title', 'tips']
}
</script>

<style lang="scss" scoped>
.navHeader_container {
  .title {
    font-size: 26rpx;
    color: #888;
  }

  view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5rpx 0;
    font-size: 30rpx;

    .more {
      padding: 10rpx 10rpx;
      border: 1px solid #555;
      color: #555;
      font-size: 20rpx;
      border-radius: 15%;
    }
  }
}
</style>
