<template>
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
          <el-form-item label="原始密码" prop="oldPassword">
            <el-input type="password" v-model="form.oldPassword"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="form.checkPassword"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button @click="$emit('onCancel')">关闭</el-button>
      <el-button @click="onSubmit" v-loading="submiting" type="primary"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import { changePassword, login } from '@/api/auth'
export default {
  data () {
    return {
      form: {
        oldPassword: '',
        password: '',
        checkPassword: ''
      },
      submiting: false,
      rules: {
        oldPassword: [{ required: true, message: '请填写原始密码', trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            login(this.userInfo.username, value).then(res => {
                callback()
            }).catch(err => {
              callback(new Error(err.message || '原始密码输入错误！'))
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
  computed: {
    userInfo () {
      return this.$store.state.user
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submiting = true
          changePassword({id: this.userInfo.id, password: this.form.password}).then(res => {
            this.$store.commit('showSuccessMsg', '用户密码修改成功！')
            this.$emit('onCancel', true)
          }).catch(err => {
            this.$store.commit('showErrorMsg', err.message || '用户密码修改失败！')
          }).finally(() => {
            this.submiting = false
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
