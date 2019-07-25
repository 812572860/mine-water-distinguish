// 菜单组件
<script type="text/jsx">
export default {
  name: 'leftMenu',
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    defaultSelectKey: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'dark'
    },
    mode: {
      type: String,
      default: 'inline'
    },
    inlineCollapsed: {
      type: Boolean,
      default: false
    }
  },
  render () {
    const menuItems = this.menuList && this.menuList.length && this.menuList.map(item => {
      return this.renderItem(item)
    })
    return (<a-menu
      theme={this.theme}
      mode={this.mode}
      defaultSelectedKeys={this.defaultSelectKey}
      inlineCollapsed={this.inlineCollapsed}
    >
      {menuItems}
    </a-menu>)
    // h('a-menu',
    //   {
    //     theme: this.theme,
    //     mode: this.mode,
    //     defaultSelectedKeys: this.defaultSelectKey,
    //     inlineCollapsed: this.inlineCollapsed
    //   },
    //   menuItems
    // )
  },
  methods: {
    renderItem (menu) {
      if (menu.children && menu.children.length) {
        const items = menu.children.map(ele => {
          return this.renderItem(ele)
        })
        return (<a-sub-menu key={menu.id}>
          <span slot="title">
            <a-icon type={menu.icon || 'bars'}></a-icon>
            <span class="nav-text">{menu.name}</span>
          </span>
          {items}
        </a-sub-menu >)
      } else {
        return (<a-menu-item key={menu.id}>
          <a-icon type={menu.icon || 'file'}></a-icon>
          <span class="nav-text" onClick={() => this.menuClick(menu)}>{menu.name}</span>
        </a-menu-item>)
      }
    },
    menuClick (item) {
      console.log(item)
      this.$emit('onMenuClick', item)
    }
  }
}
</script>

<style>
</style>
