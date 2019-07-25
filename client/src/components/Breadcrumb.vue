<template>
  <div>
    <a-breadcrumb :routes="routes">
      <template slot="itemRender" slot-scope="{route, params, routes, paths}">
        <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
        <router-link v-else :to="`${basePath}/${paths.join('/')}`">{{route.breadcrumbName}}</router-link>
      </template>
    </a-breadcrumb>
    <br>
    {{$route.path}}
  </div>
</template>
<script>
export default {
  data () {
    const { lang } = this.$route.params
    return {
      basePath: `/${lang}/components/breadcrumb`,
      routes: [{
        path: 'index',
        breadcrumbName: '首页'
      }, {
        path: 'first',
        breadcrumbName: '一级面包屑'
      }, {
        path: 'second',
        breadcrumbName: '当前页面'
      }]
    }
  }
}
</script>
