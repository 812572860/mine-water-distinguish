import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../layouts/Login.vue')
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: () => import('../layouts/Sign.vue')
    },
    {
      path: '/main',
      name: 'main',
      redirect: '/distinguishModel',
      component: () => import('../layouts/Main.vue'),
      children: [
        {
          path: '/chart',
          name: 'chart',
          component: () => import('../pages/chart/Piper.vue')
        },
        {
          path: '/pendingData',
          name: 'pendingData',
          component: () => import('../pages/dataManage/pending/List.vue')
        },
        {
          path: '/standardData',
          name: 'standardData',
          component: () => import('../pages/dataManage/standard/List.vue')
        },
        {
          path: '/distinguishModel',
          name: 'distinguishModel',
          component: () => import('../pages/distinguish/Container.vue')
        },
        {
          path: '/mineList',
          name: 'mineList',
          component: () => import('../pages/dataManage/configuration/Mine.vue')
        },
        {
          path: '/aquiferList',
          name: 'aquiferList',
          component: () =>
            import('../pages/dataManage/configuration/Aquifer.vue')
        },
        {
          path: '/mineLayerList',
          name: 'mineLayerList',
          component: () =>
            import('../pages/dataManage/configuration/MineLayer.vue')
        },
        {
          path: '/mineLevelList',
          name: 'mineLevelList',
          component: () =>
            import('../pages/dataManage/configuration/MiningLevel.vue')
        },
        {
          path: '/sampleCharacterList',
          name: 'sampleCharacterList',
          component: () =>
            import('../pages/dataManage/configuration/SampleCharacter.vue')
        },
        {
          path: '/sampleSourceList',
          name: 'sampleSourceList',
          component: () =>
            import('../pages/dataManage/configuration/SampleSource.vue')
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('../pages/system/user/List.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
