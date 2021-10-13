<template>
  <div class="recommendMusic_container">
    <!-- 日期头部 -->
    <div class="recommendMusic_header">
      <img src="@/static/images/recommendSong/recommendSong.jpg" alt="" />
      <text class="today_date">{{ today_date }}</text>
    </div>

    <!-- 音乐列表 -->
    <div class="musicList w">
      <!-- 头部 -->
      <div class="musicList_header">
        <text class="playAll">播放全部</text>
        <text class="checkbox">多选</text>
      </div>

      <!-- 列表区 -->
      <scroll-view class="musicListScroll" scroll-y>
        <div class="scroll-view-item" v-for="r in recommendMusicList" :key="r.id" @click="goPlayMusic(r.id)">
          <img :src="r.album.picUrl" alt="" />
          <div class="musicInfo">
            <text class="songTitle">{{ r.name }}</text
            ><br />
            <text class="authorName">{{ r.artists[0].name }}</text>
          </div>
          <text class="iconfont icon-sandian"></text>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recommendMusic',
  data() {
    return {
      // 音乐列表
      recommendMusicList: [],
      userCookie: ''
    }
  },
  computed: {
    // 日期
    today_date() {
      let today_date = new Date()
      let m = today_date.getMonth()
      m = m + 1
      let d = today_date.getDate()
      return m + ' / ' + d
    }
  },
  methods: {
    // 获取音乐列表
    async getrecommendMusicList() {
      let { data: res } = await this.$request('/recommend/songs', {}, this.userCookie)
      this.recommendMusicList = res.recommend
    },
    goPlayMusic(id) {
      uni.navigateTo({
        // url不能有js的对象   只能是字符串
        url: '/pages/playMusic/playMusic?musicId=' + id
      })
    }
  },
  created() {
    this.userCookie = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')).userCookies.find(item => item.indexOf('MUSIC_U') !== -1) : ''
    if (!this.userCookie) {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }
  },
  mounted() {
    this.getrecommendMusicList()

    // 切换音乐播放
    uni.$on('switchMusic', data => {
      // 获得当前播放的音乐在this.recommendMusicList中的索引
      let playMusicId = this.recommendMusicList.findIndex(item => item.id == data.MusicId)

      if (data.switchType === 'prev') {
        // 上一首
        playMusicId--
        if (playMusicId == -1) {
          playMusicId = this.recommendMusicList.length - 1
        }
      } else {
        // 下一首
        playMusicId++
        if (playMusicId == this.recommendMusicList.length - 1) {
          playMusicId = 0
        }
      }
      this.$store.commit('updateSwitchMusicId', this.recommendMusicList[playMusicId].id)
    })
  }
}
</script>

<style lang="scss" scoped>
.recommendMusic_container {
  height: 100%;
}

.recommendMusic_header {
  width: 100%;
  position: relative;

  img {
    width: 100%;
    height: 300rpx;
  }

  .today_date {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-45%, -45%);
    width: 300rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 50rpx;
    color: #fff;
  }
}

.musicList {
  // 头部
  .musicList_header {
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 32rpx;
    box-sizing: border-box;

    .checkbox {
      float: right;
    }
  }

  // 列表区域
  .musicListScroll {
    height: calc(100vh - 360rpx);
  }

  .scroll-view-item {
    position: relative;
    width: 100%;
    height: 140rpx;
    display: flex;
    align-items: center;

    img {
      float: left;
      width: 120rpx;
      height: 120rpx;
      border-radius: 10rpx;
      margin-right: 15rpx;
    }

    .musicInfo {
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      .authorName {
        font-size: 26rpx;
      }
    }

    .iconfont {
      position: absolute;
      top: 50%;
      right: 20rpx;
      transform: translateY(-50%);
    }
  }
}
</style>
