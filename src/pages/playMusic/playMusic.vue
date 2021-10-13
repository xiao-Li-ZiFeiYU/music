<template>
  <div class="playMusic_container">
    <!-- 摇杆 -->
    <div class="circle"></div>
    <img src="@/static/images/song/needle.png" alt="" class="needle" :style="controlNeedle" />

    <!-- 磁盘 -->
    <div class="disc">
      <!-- 磁盘背景图 -->
      <img src="@/static/images/song/disc.png" alt="" class="discImg" />
      <!-- 歌曲封面 -->
      <img :src="thisIdMusicInfo.al.picUrl" alt="" :class="['albumCover', musicPlayRotate]" />
    </div>

    <!-- 歌曲信息 -->
    <div class="musicInfo">
      <text class="songTitle">{{ thisIdMusicInfo.name }}</text>
      <text class="authorName">{{ thisIdMusicInfo.ar[0].name }}</text>
    </div>

    <!-- 进度条区域 -->
    <div class="progressBar">
      <text>{{ currentMusicTime }}</text>

      <!-- 总进度条 -->
      <div class="general">
        <!-- 实时进度条 -->
        <div class="realTime" :style="realTime"></div>

        <div class="dot"></div>
      </div>

      <text>{{ musicTime }}</text>
    </div>

    <!-- 控制播放区 -->
    <div class="controlPlay">
      <text class="iconfont icon-duomeiti_bofangfangshi_shunxubofang"></text>
      <text class="iconfont icon-shangyishoushangyige" @click="prevMusic"></text>
      <text :class="['iconfont', playIcon]" @click="isNeedleDown = !isNeedleDown"></text>
      <text class="iconfont icon-xiayishou" @click="nextMusic" ref="nextMusicBtn"></text>
      <text class="iconfont icon-127"></text>
    </div>
  </div>
</template>

<script>
export default {
  name: 'playMusic',
  data() {
    return {
      // 是否在播放
      isNeedleDown: false,
      // 当前传进来的音乐的信息
      thisIdMusicInfo: {},
      // 当前音频的播放位置（单位：s）
      currentTime: 0
    }
  },
  computed: {
    // 摇杆抬起与落下
    controlNeedle() {
      return this.isNeedleDown ? 'transform: rotate(0);' : 'transform: rotate(-30deg);'
    },
    // 歌曲图片是否旋转
    musicPlayRotate() {
      return this.isNeedleDown ? 'musicPlayAnimation' : ''
    },
    // 播放图标更换
    playIcon() {
      return this.isNeedleDown ? 'icon-zantingbofang' : 'icon-bofang'
    },
    // 歌曲总时长
    musicTime() {
      let m = Math.floor(this.thisIdMusicInfo.dt / 1000 / 60)
      m = m < 10 ? '0' + m : m

      let s = Math.ceil((this.thisIdMusicInfo.dt / 1000) % 60)
      s = s < 10 ? '0' + s : s

      return m + ':' + s
    },
    // 实时时间
    currentMusicTime() {
      if (this.currentTime === 0) {
        return '00:00'
      } else {
        let m = Math.floor(this.currentTime / 60)
        m = m < 10 ? '0' + m : m

        let s = Math.ceil(this.currentTime % 60)
        s = s < 10 ? '0' + s : s

        return m + ':' + s
      }
    },
    // 实时进度条
    realTime() {
      let percentage = Math.floor((Math.floor(this.currentTime) / Math.floor(this.thisIdMusicInfo.dt / 1000)) * 100)

      return 'width:' + percentage + '%' + ';'
    }
  },
  methods: {
    async getthisIdMusicInfo(musicId) {
      this.isNeedleDown = false

      let { data: res } = await this.$request('/song/detail', { ids: musicId })
      this.thisIdMusicInfo = res.songs[0]

      this.isNeedleDown = true
    },
    // 上一首
    prevMusic() {
      uni.$emit('switchMusic', { switchType: 'prev', MusicId: this.thisIdMusicInfo.id })
      this.getthisIdMusicInfo(this.$store.state.switchMusicId)
    },
    // 下一首
    nextMusic() {
      console.log(1)
      uni.$emit('switchMusic', { switchType: 'next', MusicId: this.thisIdMusicInfo.id })
      this.getthisIdMusicInfo(this.$store.state.switchMusicId)
    }
  },
  watch: {
    // 监听器监听是否在播放
    async isNeedleDown(newVal) {
      // 获取全局唯一的背景音频管理器
      let backgroundAudioManager = uni.getBackgroundAudioManager()
      if (newVal) {
        // 根据id获取音乐url地址
        let { data: res } = await this.$request('/song/url', { id: this.thisIdMusicInfo.id })

        backgroundAudioManager.src = res.data[0].url
        // 如果没有设置这个属性不会播放音乐
        backgroundAudioManager.title = this.thisIdMusicInfo.name

        backgroundAudioManager.startTime = 170
      } else {
        // 点击暂定，音乐暂停
        backgroundAudioManager.pause()
      }
      backgroundAudioManager.onPause(() => {
        this.isNeedleDown = false
      })
      backgroundAudioManager.onPlay(() => {
        this.isNeedleDown = true
      })
      backgroundAudioManager.onTimeUpdate(() => {
        // 实时总时长
        this.currentTime = backgroundAudioManager.currentTime
      })
      backgroundAudioManager.onEnded(() => {
        this.nextMusic()
      })
    }
  },
  onLoad(options) {
    this.getthisIdMusicInfo(options.musicId)
  }
}
</script>

<style lang="scss" scoped>
// 歌曲封面旋转动画
@keyframes musicPlayRotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.musicPlayAnimation {
  // 旋转动画配置
  // 摇杆落下要0.2s
  animation-name: musicPlayRotate;
  animation-delay: 0.2s;
  animation-timing-function: linear;
  animation-duration: 10s;
  animation-iteration-count: infinite;
}

.playMusic_container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: rgb(127, 127, 127);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20rpx;
  box-sizing: border-box;

  // 摇杆
  .circle {
    position: relative;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: #fff;
    z-index: 999;
  }
  .needle {
    position: relative;
    left: 55rpx;
    width: 192rpx;
    height: 274rpx;
    margin-top: -32rpx;
    z-index: 3;
    transform-origin: 50rpx 0rpx;
    transition: all 0.2s;
  }

  // 磁盘
  .disc {
    position: relative;
    width: 598rpx;
    height: 598rpx;
    margin-top: -145rpx;
    z-index: 2;

    // 磁盘背景
    .discImg {
      width: 598rpx;
      height: 598rpx;
    }

    // 歌曲图片
    .albumCover {
      position: absolute;
      left: 50%;
      top: 50%;
      // transform: translate(-50%, -50%);因为要用transform做旋转   所以被层叠掉了
      margin: -185rpx 0 0 -185rpx;
      width: 370rpx;
      height: 370rpx;
      border-radius: 50%;
    }
  }

  // 歌曲信息
  .musicInfo {
    margin-top: 50rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .songTitle {
      font-size: 40rpx;
      margin-bottom: 40rpx;
    }
  }

  // 进度条
  .progressBar {
    position: absolute;
    bottom: 180rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .general {
      width: 65%;
      height: 5rpx;
      background-color: rgba($color: #000000, $alpha: 0.5);
      margin: 0 20rpx;
      display: flex;
      align-items: center;

      .realTime {
        height: 5rpx;
        background-color: #fff;
      }

      .dot {
        width: 15rpx;
        height: 15rpx;
        border-radius: 50%;
        background-color: #fff;
      }
    }
  }

  // 控制播放区
  .controlPlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 150rpx;
    border-top: 1px solid #fff;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    padding-top: 40rpx;

    .iconfont {
      flex: 1;
      text-align: center;
      font-size: 55rpx;
      color: #fff;
    }
  }
}
</style>
