<template>
  <view class="index_container">
    <!-- 头像 -->
    <view class="headPortrait">
      <img :src="headPortrait" alt=""/>
      <button open-type="getUserInfo" @getuserinfo="getuserinfo"></button>
    </view>

    <!-- 用户名 -->
    <text class="userName">{{ userName }}</text>

    <!-- 按钮 -->
    <view class="greetings">
      <text>Hello World</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  methods: {
    // 获取授权
    getuserinfo(res) {
      this.userInfo = res.detail.userInfo
    }
  },
  computed: {
    // 头像
    headPortrait() {
      return this.userInfo.avatarUrl || '../../static/images/logo.png'
    },
    // 用户名
    userName() {
      return this.userInfo.nickName || '音乐，给生活打打气'
    }
  },
  beforeCreate() {
    // 再次登录的时候，获取是否已经授权的信息
    uni.getUserInfo({
      success: res => {
        this.userInfo = res.userInfo
      },
      fail: err => {
        console.log(err)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.index_container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .headPortrait {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border-radius: 100rpx;
    overflow: hidden;
    margin-top: 150rpx;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }
    
    button {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .userName {
    font-size: 32rpx;
    margin-top: 80rpx;
  }

  .greetings {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    border: 1px solid #ccc;
    border-radius: 10rpx;
    margin-top: 400rpx;
  }
}
</style>
