<template>
  <view class="user_container">
    <!-- 背景图 -->
    <img mode="widthFix" src="../../static/images/personal/bgImg2.jpg" alt="" class="bg" />

    <!-- 用户信息 -->
    <view class="user_info">
      <img class="portrait" :src="avatarUrl" @click="goLogin" />
      <text class="username">{{ nickname }}</text>
    </view>

    <!-- 会员卡片模块 -->
    <view class="vip_card">
      <img src="../../static/images/personal/vip-card-bg.png" alt="" class="vip_card_bg" />

      <!-- 卡片头 -->
      <view class="vip_card_header">
        <view class="header_left">
          <text class="iconfont icon-icon_huiyuan"></text>
          <text class="iconfont_title">网抑云会员</text>
        </view>
        <button class="header_btn">立即开通</button>
      </view>

      <!-- 主体文本 -->
      <text class="tips-t">Hello Vue and Uni-App</text>
      <text class="tips-b">开通畅听所有Vip歌曲！打代码更有劲！</text>
    </view>

    <!-- 导航、记录等主体 -->
    <view class="cover-container" :style="cover_container_moveY" @touchstart="touch_start" @touchmove="touch_move" @touchend="touch_end">
      <img src="../../static/images/personal/arc.png" alt="" class="arc" mode="widthFix" />

      <!-- 个人中心导航 -->
      <ul class="user_navbar">
        <li class="user_navbar_item">
          <text class="iconfont icon-wodexiaoxi"></text>
          <text class="user_icon_tips">我的消息</text>
        </li>
        <li class="user_navbar_item">
          <text class="iconfont icon-wodehaoyou"></text>
          <text class="user_icon_tips">我的好友</text>
        </li>
        <li class="user_navbar_item">
          <text class="iconfont icon-gerenzhuye"></text>
          <text class="user_icon_tips">个人主页</text>
        </li>
        <li class="user_navbar_item">
          <text class="iconfont icon-grab"></text>
          <text class="user_icon_tips">个性装扮</text>
        </li>
      </ul>

      <!-- 个人中心列表 -->
      <view class="user_center_list">
        <view class="recentPlayContainer">
          <text class="title">最近播放</text>
          <!-- 最近播放记录 -->
          <scroll-view v-if="weekDataList.length" class="recordScrollView" scroll-x enable-flex>
            <view class="scroll-view-item" v-for="w in weekDataList" :key="w.song.id">
              <img :src="w.song.al.picUrl" alt="" class="recordMusic" />
            </view>
          </scroll-view>
          <view v-else class="wuRecord">暂无播放记录</view>
        </view>

        <!-- 我的列表 -->
        <ul class="my_list">
          <li class="my_list_item">
            <text class="title">我的音乐</text>
            <text class="more"> > </text>
          </li>
          <li class="my_list_item">
            <text class="title">我的收藏</text>
            <text class="more"> > </text>
          </li>
          <li class="my_list_item">
            <text class="title">我的电台</text>
            <text class="more"> > </text>
          </li>
        </ul>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      // 手指的初始化位置
      touchStartY: 0,
      // 用户主体盒子移动的距离
      cover_container_moveY: '',
      // 用户数据
      avatarUrl: '../../static/images/personal/missing-face.png',
      nickname: '游客',
      userId: '',
      // 最近一周播放的歌曲数据
      weekDataList: []
    }
  },
  methods: {
    touch_start(e) {
      // 手指的初始化位置
      this.touchStartY = e.touches[0].pageY
    },
    touch_move(e) {
      // 手指移动的距离(手指移动后的位置 - 手指的初始位置)
      let touchMoveY = e.touches[0].pageY - this.touchStartY
      // 控制不能向上滑动
      if (touchMoveY <= 0) {
        touchMoveY = 0
      } else if (touchMoveY >= 100) {
        touchMoveY = 100
      }
      // 跟随手指移动
      this.cover_container_moveY = `transform: translateY(${touchMoveY}rpx)`
    },
    touch_end() {
      // 手指离开回弹到原来的位置
      this.cover_container_moveY = `transform: translateY(0rpx); transition: all .2s;`
    },
    // 跳转到登录界面
    goLogin() {
      if (!uni.getStorageSync('userInfo')) {
        uni.redirectTo({
          url: '/pages/login/login'
        })
      }
    },
    // 获得用户数据
    getUserInfo() {
      let userInfo = {}
      if (uni.getStorageSync('userInfo')) {
        userInfo = JSON.parse(uni.getStorageSync('userInfo'))

        this.avatarUrl = userInfo.avatarUrl
        this.nickname = userInfo.nickname
        this.userId = userInfo.userId

        this.getUserRecord()
      }
    },
    // 获取用户最近播放数据
    async getUserRecord() {
      const { data: res } = await this.$request('/user/record', { uid: this.userId })
      this.weekDataList = res.weekData.slice(0, 15)
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.user_container {
  position: relative;
  height: 100%;
  background: #f5f5f5;
}

.bg {
  width: 750rpx;
}

// 用户信息
.user_info {
  position: absolute;
  top: 95rpx;
  left: 30rpx;
  display: flex;
  align-items: center;

  .portrait {
    width: 130rpx;
    height: 130rpx;
    border: 5rpx solid #fff;
    border-radius: 50%;
  }

  .username {
    margin-left: 20rpx;
  }
}

// vip卡片
.vip_card {
  position: absolute;
  left: 50%;
  top: 270rpx;
  transform: translateX(-50%);
  height: 200rpx;
  width: 85%;
  // 不能用opacity否则整个卡片都透明，包括按钮这些
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20rpx 24rpx;
  border-radius: 16rpx 16rpx 0 0;

  .vip_card_bg {
    position: absolute;
    top: 20rpx;
    right: 0;
    width: 380rpx;
    height: 260rpx;
  }

  // 头部
  .vip_card_header {
    display: flex;
    justify-content: space-between;

    // 左边字体图标处
    .header_left {
      font-size: 22rpx;
      color: #f7d680;

      .iconfont_title {
        color: #f6e5a3;
        margin-left: 15rpx;
      }
    }

    // 开通按钮
    .header_btn {
      width: 132rpx;
      height: 40rpx;
      text-align: center;
      line-height: 40rpx;
      font-size: 22rpx;
      padding: 0;
      margin: 0;
      border-radius: 20px;
      background-color: #f9e6af;
      opacity: 1;
    }
  }

  // 主体文本
  .tips-t {
    display: block;
    font-size: 34rpx;
    margin: 30rpx 0 5rpx;
    color: #f7d680;
  }

  .tips-b {
    font-size: 24rpx;
    color: #d8cba9;
  }
}

// 导航、记录等主体
.cover-container {
  margin-top: -100rpx;
  position: relative;
  background: #f5f5f5;

  .arc {
    position: absolute;
    top: -35rpx;
    width: 100%;
  }

  // 个人中心导航
  .user_navbar {
    display: flex;
    justify-content: space-around;
    width: 90%;
    margin: 0 auto;
    border-radius: 15rpx;
    background-color: #fff;
    padding: 15rpx 0;

    .user_navbar_item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .iconfont {
        font-size: 50rpx;
        color: #d43c33;
      }

      .user_icon_tips {
        margin-top: 15rpx;
        font-size: 26rpx;
      }
    }
  }

  // 个人中心列表
  .user_center_list {
    width: 90%;
    margin: 20rpx auto;
    border-radius: 15rpx;
    background-color: #fff;

    .recentPlayContainer {
      .title {
        padding-left: 20rpx;
        font-size: 26rpx;
        color: #333;
        line-height: 80rpx;
      }

      .recordScrollView {
        display: flex;
        height: 160rpx;
        padding-left: 5rpx;

        .recordMusic {
          width: 160rpx;
          height: 160rpx;
          border-radius: 10rpx;
          margin-right: 10rpx;
        }
      }

      .wuRecord {
        padding-left: 20rpx;
        font-size: 24rpx;
        color: #333;
      }
    }

    // 我的列表
    .my_list {
      margin-top: 20rpx;

      .my_list_item {
        border-top: 1rpx solid #eee;
        height: 80rpx;
        line-height: 80rpx;
        padding: 10rpx;
        font-size: 26rpx;
        color: #333;

        .more {
          float: right;
        }
      }
    }
  }
}
</style>
