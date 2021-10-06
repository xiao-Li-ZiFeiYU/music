<template>
  <view class="login_container">
    <text class="welcome">欢迎回来!</text>

    <!-- 登录表单区域 -->
    <form class="loginform">
      <label for="username" class="username"><text class="iconfont icon-yonghuming"></text></label>
      <input type="text" name="username" id="username" placeholder="请输入账号" v-model="username" />

      <label for="password" class="password"><text class="iconfont icon-ai-password"></text></label>
      <input type="password" name="password" id="password" placeholder="请输入密码" v-model="password" />

      <button class="submitBtn" @click="submitLoginForm">登录</button>
    </form>

    <!-- 忘记密码 -->
    <text class="forgetPassword">忘记密码?</text>

    <!-- 底部注册区域 -->
    <view class="bottom_register">
      <text class="tips">还没有账号?</text>
      <text class="register">马上注册</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      username: '15975957961',
      password: '3121646005..'
    }
  },
  methods: {
    async submitLoginForm(e) {
      // 手机格式的正则
      let phoneRex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      // 密码
      let passwordRex = /(?=.*?\w).{8,}/

      // 手机号验证
      if (this.username === '') {
        uni.showToast({
          title: '账号不能为空',
          icon: 'error'
        })
        return
      } else if (!phoneRex.test(this.username)) {
        uni.showToast({
          title: '手机号不存在',
          icon: 'error'
        })
        return
      }

      // 密码验证
      if (this.password === '') {
        uni.showToast({
          title: '密码不能为空',
          icon: 'error'
        })
        return
      } else if (!passwordRex.test(this.password)) {
        uni.showToast({
          title: '密码格式不正确',
          icon: 'error'
        })
        return
      }

      // 验证通过调接口
      const { data: res } = await this.$request('/login/cellphone', { phone: this.username, password: this.password })

      // 没有登录成功
      if (res.code !== 200) {
        uni.showToast({
          title: res.msg,
          icon: 'error'
        })
        this.password = ''
        return
      }
      // 登录成功，存储用户数据，再返回原界面
      uni.setStorageSync('userInfo', JSON.stringify({ avatarUrl: res.profile.avatarUrl, nickname: res.profile.nickname, userId: res.profile.userId }))
      uni.switchTab({
        url: '/pages/user/user'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

// 欢迎词
.welcome {
  font-size: 46rpx;
  color: #555;
  margin: 90rpx 0 160rpx 50rpx;
  align-self: flex-start;
}

// 登录表单
.loginform {
  position: relative;
  width: 82%;
  margin: 0 auto;

  .submitBtn {
    margin-top: 40rpx;
    color: #fff;
    background-color: #d43c33;
    font-size: 32rpx;
    height: 76rpx;
    line-height: 76rpx;
    border-radius: 50rpx;
  }

  input {
    height: 100rpx;
    border: 1px solid #d43c33;
    border-radius: 10rpx;
    font-size: 36rpx;
    padding: 0 30rpx 0 80rpx;
  }

  #password {
    display: block;
    margin-top: 40rpx;
  }
}

.iconfont {
  position: absolute;
  left: 20rpx;
  font-size: 50rpx;
  color: #d43c33;
}

.username {
  .iconfont {
    top: 26rpx;
  }
}

.password {
  .iconfont {
    top: 170rpx;
  }
}

// 忘记密码
.forgetPassword {
  font-size: 28rpx;
  color: #4399fc;
  text-align: center;
  margin-top: 40rpx;
}

// 底部注册区域
.bottom_register {
  position: absolute;
  left: 0;
  bottom: 50rpx;
  width: 100%;
  font-size: 28rpx;
  color: #606266;
  text-align: center;

  .register {
    color: #4399fc;
    margin-left: 20rpx;
  }
}
</style>
