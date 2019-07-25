<template>
  <a-layout class="layout-main">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <div class="logo">
        <img src="../assets/water.png" alt />
        <span class="title" v-show="!collapsed">{{ systemName }}</span>
      </div>
      <LeftMenu
        :menuList="menuList"
        :inlineCollapsed="collapsed"
        mode="inline"
        theme="dark"
        @onMenuClick="onMenuClick"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <!-- <Breadcrub class="header-breadcrumb"/> -->
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <Header
          class="headrer-my"
          :name="userInfo && userInfo.name"
          @clickMenu="clickHeaderMenu"
        />
      </a-layout-header>
      <a-layout-content :style="{ margin: '16px 10px 0', height: '100%' }">
        <div :style="{ padding: '24px', background: '#fff', height: '100%' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <!-- <a-layout-footer style="textAlign: center">Ant Design ©2018 Created by Ant UED</a-layout-footer> -->
    </a-layout>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <component
        v-if="dialogVisible"
        :is="componentId"
        :isDetails="isDetails"
        :data="userInfo"
        @onCancel="onCloseDialog"
        @changeInfo="() => (isDetails = false)"
      ></component>
    </el-dialog>
  </a-layout>
</template>
<script>
import axios from '@/utils/axios'

import LeftMenu from '@/components/Menu'
// import Breadcrub from '@/components/Breadcrumb'
import Header from '@/components/Header'
import Password from '@/pages/system/user/Password'
import User from '@/pages/system/user/New'

export default {
  name: 'mainContainer',
  components: {
    LeftMenu,
    // Breadcrub,
    Header,
    Password,
    User
  },
  data () {
    return {
      systemName: '水源识别系统',
      menuList: [// ,
        // {
        //           id: 33,
        //           name: "煤矿名称管理",
        //           code: "mine",
        //           icon: "hdd",
        //           url: "/mineList"
        // },
        // {
        //           id: 34,
        //           name: "开采煤层管理",
        //           code: "miningLayer",
        //           icon: "hdd",
        //           url: "/mineLayerList"
        // },
        // {
        //           id: 35,
        //           name: "开采水平管理",
        //           code: "miningLevel",
        //           icon: "hdd",
        //           url: "/mineLevelList"
        // },
        // {
        //           id: 36,
        //           name: "水样点性状管理",
        //           code: "sampleCharacter",
        //           icon: "hdd",
        //           url: "/sampleCharacterList"
        // },
        // {
        //           id: 37,
        //           name: "含水层管理",
        //           code: "aquifer",
        //           icon: "hdd",
        //           url: "/aquiferList"
        // }
      ],
      collapsed: false,
      dialogVisible: false,
      dialogTitle: '',
      componentId: '',
      isDetails: true
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.systemName = this.$store.state.systemName
    if (this.userInfo) {
      this.initmenu()
      this.$store.dispatch('baseInfo/getList')
      this.$store.dispatch('standardSample/getAllSampleList')
    } else {
      this.$router.push('/login')
      this.$store.commit('showNormalMsg', '当前处于未登录状态，请重新登录！')
    }
  },
  methods: {
    initmenu () {
      axios.get('/data/menu.json').then(result => {
        if (this.userInfo.isManager) {
          this.menuList = result[0]
        } else {
          this.menuList = result[1]
        }

      }).catch(error => {
        console.log(error)
        this.$store.commit('showErrorMsg', '菜单获取失败！')
      })
    },
    onMenuClick (menu) {
      if (menu && menu.url) {
        this.$router.push(menu.url)
      }
    },
    clickHeaderMenu (key) {
      if (key === 'user') {
        this.dialogTitle = '个人中心'
        this.componentId = 'User'
        this.dialogVisible = true
      } else if (key === 'changePwd') {
        this.dialogTitle = '修改密码'
        this.componentId = 'Password'
        this.dialogVisible = true
      } else {
        this.$store.commit('logout')
        this.$router.push('/login')
      }
    },
    onCloseDialog (isSucess, info) {
      this.dialogVisible = false
      if (isSucess && info) {
        this.isDetails = true
        this.$store.commit('setUserInfo', { user: { info: info, token: this.$store.state.token } })
      }
    }
  }
}
</script>

<style  lang="scss">
.layout-main {
  width: 100%;
  height: 100%;

  .logo {
    margin: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
      margin-top: 10px;
    }

    .title {
      font-size: 20px;
      color: lightgrey;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }

  .layout-header {
    background: #fff;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-breadcrumb {
      height: 100%;
    }

    .trigger {
      font-size: 18px;
      line-height: 64px;
      cursor: pointer;
      transition: color 0.3s;
    }
    .trigger:hover {
      color: #1890ff;
    }
  }
}
</style>
