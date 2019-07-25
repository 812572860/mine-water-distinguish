<template>
  <div class="login_page">
    <div class="logo">
      <img src="../assets/water.png" :alt="systemName" />
      <span>{{ systemName }}</span>
    </div>
    <transition name="form-fade" mode="in-out">
      <section :class="['form_contianer']">
        <a-form layout="horizontal" :form="form" @submit="handleSubmit">
          <a-form-item>
            <a-input v-decorator="rules.username" placeholder="用户名">
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="rules.password"
              type="password"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-decorator="['remember']" style="float:left;"
              >记住我</a-checkbox
            >
            <!-- <a class="login-form-forgot" href>忘记密码</a> -->
            <a-button type="primary" html-type="submit" class="submit_btn" :loading="submitting"
              >登 录</a-button
            >
            <a style="color:black;float:right;" @click="onSigin"
              ><i class="iconfont icon-sigin" /> 注册账号</a
            >
          </a-form-item>
        </a-form>
      </section>
    </transition>
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64
import { getStore } from '@/utils/localStorage'
import { login } from '@/api/auth'
export default {
  data () {
    return {
      systemName: this.$store.state.systemName,
      form: this.$form.createForm(this),
      rules: {
        username: [
          'username',
          { rules: [{ required: true, message: '请输入用户名!' }] }
        ],
        password: [
          'password',
          { rules: [{ required: true, message: '请输入密码!' }, { min: 6, message: '密码长度不能少于6位！' }] }
        ]
      },
      submitting: false
    }
  },
  mounted () {
    // 在页面加载时从cookie获取登录信息
    let user = getStore("currentUser")
    // 如果存在赋值给表单，并且将记住密码勾选
    if (user) {
      let password = Base64.decode(user.password)
      this.form.setFieldsValue({ username: user.username })
      this.form.setFieldsValue({ password: password })
      this.form.setFieldsValue({ remember: true })
      this.handleSubmit()
    }
  },
  methods: {
    handleSubmit (e) {
      e && e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitting = true
          login(values.username, values.password).then(res => {
            // base64加密密码
            let passWord = Base64.encode(values.password)
            // 储存登录信息
            this.$store.commit('setUserInfo', { user: res.result.user, password: passWord, isRemember: values.remember })
            // 路由跳转
            this.$router.push('/main')
          }).catch(err => {
            this.$store.commit('showErrorMsg', err.message || '登录失败')
          }).finally(() => {
            this.submitting = false
          })
        }
      })
    },
    onSigin () {
      this.$router.push('/signIn')
    }
  }
}
</script>

<style
    lang="scss"
    scoped>
.login_page {
  height: 100%;
  background: url("../assets/login_bg.png");
  background-size: cover;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  .quit-unity {
    cursor: pointer;
    font-size: 30px;
    color: #d82826;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .logo {
    text-align: center;
    padding: 0 0 20px;
    font-size: 30px;

    img {
      width: 150px;
    }
    span {
      display: block;
      font-size: 48px;
      font-weight: 400;
      color: #183138fc;
      letter-spacing: 6px;
    }
  }

  .form_contianer {
    width: 389px;
    height: 300px;
    text-align: center;
    background-color: rgba(186,231,255,0.52);
    /* background: url(../assets/form-container.png); */
    margin: 0 auto;

    form {
      margin: 60px 42px;
    }
    .login-form-forgot {
      float: right;
    }
    .submit_btn {
      width: 100%;
      font-size: 16px;
      background-color: #175386;
      border: 1px solid #175386;
      color: #ffffff;
    }
  }
}
</style>
