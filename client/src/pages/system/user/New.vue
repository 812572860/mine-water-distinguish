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
          <el-form-item label="用户名" prop="username">
            <span v-if="isDetails" class="detail-item">{{form.username}}</span>
            <el-input v-else v-model="form.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="真是姓名" prop="name">
            <span v-if="isDetails" class="detail-item">{{form.name}}</span>
            <el-input v-else v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isEdit">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isEdit">
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="form.checkPassword"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="性别" prop="gender">
            <span v-if="isDetails" class="detail-item">{{form.gender ? '女' : '男'}}</span>
            <el-select v-else v-model="form.gender">
              <el-option :value="false" label="男"></el-option>
              <el-option :value="true" label="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系方式" prop="telephone">
            <span v-if="isDetails" class="detail-item">{{form.telephone}}</span>
            <el-input v-else v-model="form.telephone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="邮箱" prop="email">
            <span v-if="isDetails" class="detail-item">{{form.email}}</span>
            <el-input v-else v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="现住址" prop="address">
            <span v-if="isDetails" class="detail-item">{{form.address}}</span>
            <el-input v-else v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否为管理员" prop="address">
            <span v-if="isDetails" class="detail-item">{{form.isManager ? '是' : '否'}}</span>
            <el-switch v-else v-model="form.isManager"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button @click="$emit('onCancel')">关闭</el-button>
      <el-button v-if="!isDetails" @click="onSubmit" v-loading="submiting" type="primary"
        >提交</el-button
      >
      <el-button v-else @click="onEdit" v-loading="submiting" type="primary"
        >修改</el-button
      >
    </div>
  </div>
</template>

<script>
import { saveUser, checkUsername } from '@/api/auth'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          username: '',
          name: '',
          password: '',
          telephoneL: '',
          email: '',
          address: '',
          gender: false
        }
      }
    },
    isDetails: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: Object.assign({}, this.data),
      submiting: false,
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
  computed: {
    isEdit () {
      return this.form.id && this.form.id > 0
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submiting = true
          saveUser(this.form).then(res => {
            this.$store.commit('showSuccessMsg', '用户信息保存成功！')
            this.$emit('onCancel', true, res.result)
          }).catch(err => {
            this.$store.commit('showErrorMsg', err.message || '用户信息保存失败！')
          }).finally(() => {
            this.submiting = false
          })
        }
      })
    },
    onEdit () {
      this.$emit('changeInfo')
    }
  }
}
</script>

<style scoped>
.detail-item {
  margin-left: 30px;
}
</style>
