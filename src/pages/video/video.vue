<template>
  <view class="video_container">
    <!-- 头部搜索框 -->
    <view class="video_header">
      <img src="../../static/images/logo.png" alt="" class="video_logo" />
      <view class="video_search">点击搜索视频</view>
      <text class="iconfont icon-sousuoshipin"></text>
    </view>

    <!-- 视频导航栏 -->
    <scroll-view class="videoNavScroll w" scroll-x enable-flex :scroll-into-view="'scroll' + navId" scroll-with-animation>
      <view :class="['scroll-view-item', v.id === navId ? '.video_active' : '']" v-for="v in videoNavList" :key="v.id" @click="click_NavItem(v.id)" :id="'scroll' + v.id">{{ v.name }}</view>
    </scroll-view>

    <!-- 视频列表 -->
    <template v-if="thisNavVideoList">
      <scroll-view v-if="thisNavVideoList" class="thisNavVideoList w" scroll-y refresher-enabled @refresherrefresh="reFreshScroll" :refresher-triggered="isReFresh" @scrolltolower="scrolltolower">
        <!-- 点击下一个视频的时候再点回本次视频在真机上不会出现问题的 -->
        <view class="scroll-view-item" v-for="v in thisNavVideoList" :key="v.data.urlInfo.id">
          <video v-if="videoID === v.data.vid" :src="v.data.urlInfo.url" :id="v.data.vid" loop :poster="v.data.coverUrl" @timeupdate="timeupdate(v.data.vid, $event)"></video>
          <image v-show="videoID !== v.data.vid" :src="v.data.coverUrl" @click="playVideo(v.data.vid)" />
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'video',
  data() {
    return {
      // 视频导航栏数据
      videoNavList: [],
      // 当前点击的导航id
      navId: '',
      // 当前导航的视频数据
      thisNavVideoList: [],
      // 当前播放视频的id
      videoID: 0,
      // 当前播放视频的videoContext对象
      videoContextObj: 0,
      // 是否在下拉刷新
      isReFresh: false,
      // 存储视频播放进度对象
      videoTimetableArr: []
    }
  },
  methods: {
    // 获取视频导航栏数据
    async getvideoNavList() {
      let { data: res } = await this.$request('/video/group/list')
      // 截取20条
      this.videoNavList = res.data.slice(0, 20)
      // 默认第一个导航选中
      this.navId = this.videoNavList[0].id

      this.getActiveNavVideo()
    },
    // 获取当前点击的导航的id
    click_NavItem(id) {
      this.navId = id

      this.getActiveNavVideo()
    },
    // 获取当前点击的导航的id的视频
    async getActiveNavVideo() {
      // 需要携带的cookie 防止未登录没有storage报错
      let usercookie = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')).userCookies.find(item => item.indexOf('MUSIC_U') !== -1) : ''
      // 发起请求
      let { data: res } = await this.$request('/video/group', { id: this.navId }, usercookie)
      this.thisNavVideoList = res.datas
      //为什么会报错呢？究其原因，还是因为异步请求需要一定的时间，而小程序一进页面就开始加载，请求速度没跟上，这时页面显示加载的时候image里面的值是空的，就会出现渲染层、网络层错误。
      this.isReFresh = false
    },
    // 点击图片播放对应的视频
    playVideo(id) {
      // 如果本次点击的视频和上一个点击的视频是一样的   不再进行以下操作
      if (this.videoID == id) return
      this.videoID = id
      // 切换视频的时候,上一次点击的视频暂停(防止初始化的时候没有上一次videoContextObj)
      this.videoContextObj && this.videoContextObj.stop()

      // 获取本次点击播放的videoContext对象
      this.videoContextObj = uni.createVideoContext(id)

      let videoTimetableObj = this.videoTimetableArr.find(item => item.vid === id)
      // 如果之前有播放过
      if (videoTimetableObj) {
        this.videoContextObj.seek(videoTimetableObj.videoTime)
      }

      // 播放本次点击的视频
      this.videoContextObj.play()
    },
    // 下拉刷新
    reFreshScroll() {
      this.isReFresh = true
      this.getActiveNavVideo()
    },
    // 触底加载更多数据
    async scrolltolower() {
      // 需要携带的cookie 防止未登录没有storage报错
      let usercookie = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')).userCookies.find(item => item.indexOf('MUSIC_U') !== -1) : ''
      // 发起请求
      let { data: res } = await this.$request('/video/group', { id: this.navId }, usercookie)
      this.thisNavVideoList.push(...res.datas)
    },
    // 视频播放进度
    timeupdate(vid, event) {
      // 如果数组里面有这个对象，则修改对应时间属性
      let videoTimetableObj = this.videoTimetableArr.find(item => item.vid === vid)
      if (videoTimetableObj) {
        // 此处有bug   不知道为什么在手机再次点击计时归零
        videoTimetableObj.videoTime = event.detail.currentTime
      } else {
        // 没则添加进去
        this.videoTimetableArr.push({ vid: vid, videoTime: event.detail.currentTime })
      }
    }
  },
  onLoad() {
    this.getvideoNavList()
  }
}
</script>

<style lang="scss" scoped>
.video_container {
  // 头部搜索框
  .video_header {
    position: relative;
    display: flex;
    align-items: center;
    height: 100rpx;

    .video_logo {
      position: absolute;
      left: 40rpx;
      height: 60rpx;
      width: 60rpx;
    }

    .video_search {
      flex: 1;
      height: 60rpx;
      text-align: center;
      line-height: 60rpx;
      border: 1rpx solid #ccc;
      border-radius: 30rpx;
      margin: 0 40rpx;
      color: #aaa;
      font-size: 26rpx;
      background-color: #f5f5f5;
      box-shadow: 2rpx 3rpx 3rpx #ccc;
    }

    .iconfont {
      position: absolute;
      right: 60rpx;
      font-size: 50rpx;
      color: #d43c33;
    }
  }

  // 视频导航栏
  .videoNavScroll {
    display: flex;
    height: 80rpx;
    line-height: 80rpx;

    .scroll-view-item {
      white-space: nowrap;
      margin-right: 40rpx;
    }
  }

  // 当前选中的导航的视频列表
  .thisNavVideoList {
    margin-top: 30rpx;
    height: calc(100vh - 220rpx);

    .scroll-view-item {
      width: 100%;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

      video,
      image {
        width: 100%;
        height: 420rpx;
      }
    }
  }
}

// 选中的视频导航
.video_active {
  color: #d43c33;
  border-bottom: 2px solid #d43c33;
}
</style>
