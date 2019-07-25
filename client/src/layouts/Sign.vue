<template>
  <a-card
    title="新用户注册"
    style="margin: auto;width: 70%;height: auto;padding: 30px 20px;"
  >
    <a href="#" slot="extra" @click="onClose"><i class="iconfont icon-back" />返回</a>
    <div class="l-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        style="margin: 15px"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="真是姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="form.checkPassword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender">
                <el-option :value="false" label="男"></el-option>
                <el-option :value="true" label="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系方式" prop="telephone">
              <el-input v-model="form.telephone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="现住址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="onClose">关闭</el-button>
        <el-button @click="onSubmit" v-loading="submiting" type="primary">{{
          backToLogin ? "返回登录" : "注册"
        }}</el-button>
      </div>
    </div>
  </a-card>
</template>

<script>
import { saveUser, checkUsername } from '@/api/auth'
export default {
  data () {
    return {
      form: {
        username: '',
        name: '',
        password: '',
        telephoneL: '',
        email: '',
        address: '',
        gender: false
      },
      submiting: false,
      backToLogin: false,
      rules: {
        username: [{ required: true, message: '请填写用户名', trigger: ['blur', 'change'] }, { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            checkUsername({ id: this.form.id || '', username: value }).then(res => {
              if (res.result.isDuplicate) {
                callback(new Error(res.result.message || '用户名已被使用'))
              } else {
                callback()
              }
            }).catch(err => {
              callback(new Error(err.message || '用户信息对比失败！'))
            })
          }, trigger: 'blur'
        }],
        password: [{ required: true, message: '请填写密码', trigger: ['blur', 'change'] }, { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }],
        checkPassword: [{ required: true, message: '请填写密码', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }
        }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.backToLogin) {
        this.$router.push('/login')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submiting = true
            saveUser(this.form).then(res => {
              this.$store.commit('showSuccessMsg', '用户信息保存成功！')
              this.backToLogin = true
            }).catch(err => {
              this.$store.commit('showErrorMsg', err.message || '用户信息保存失败！')
            }).finally(() => {
              this.submiting = false
            })
          }
        })
      }
    },
    onClose () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.sigin {
  margin: auto;
  width: 70%;
  height: 100%;
  padding: 30px 20px;
}
</style>
