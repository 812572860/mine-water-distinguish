<template>
  <div>
    <a-dropdown class="account">
      <div>
        <a-icon type="user" class="account_avatar"/>
        <span class="account_name">{{name}}</span>
      </div>
      <a-menu slot="overlay" @click="item => $emit('clickMenu', item.key)">
        <a-menu-item key="user">
          <a-icon type="user"/>个人中心
        </a-menu-item>
        <a-menu-item key="changePwd">
          <i class="iconfont icon-change-pwd" style="margin-right:8px;"></i>修改密码
        </a-menu-item>
         <a-menu-item key="logout">
          <i class="iconfont icon-logout" style="margin-right:8px;"></i>退出登录
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '未知'
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss">
.account {
  cursor: pointer;
  padding: 0 12px;
  display: inline-block;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  height: 100%;

  &_avatar {
    margin: 20px 8px 20px 0;
    color: #1890ff;
    background: hsla(0, 0%, 100%, 0.85);
  }
  &_name {
    box-sizing: border-box;
  }
}
</style>
