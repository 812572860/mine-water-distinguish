<!-- 煤矿列表 -->
<template>
  <div>
    <a-button class="editable-add-btn" @click="handleAdd">添加</a-button>
    <a-table :columns="columns" :dataSource="mineList" rowKey="id" bordered>
      <template
        v-for="col in ['name', 'description']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.id, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a-button
              type="primary"
              shape="circle"
              icon="check"
              :loading="loading"
              @click="() => save(record.id)"
            />
              <a-button shape="circle" icon="close" @click="() => cancel(record.id)" />
          </span>
          <span v-else>
            <a-button type="primary" shape="circle" icon="edit" @click="() => edit(record.id)"/>
          </span>
          <a-popconfirm
            v-if="data.length"
            title="确认删除?"
            @confirm="() => onDelete(record)"
          >
            <a-button shape="circle" type="danger" icon="delete" style="margin-left:8px;"/>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      columns: [{
        title: '名称',
        dataIndex: 'name',
        width: '35%',
        scopedSlots: { customRender: 'name' }
      // }, {
      //   title: '排序',
      //   dataIndex: 'sort',
      //   width: '10%',
      //   align: 'center',
      //   scopedSlots: { customRender: 'sort' }
      }, {
        title: '描述',
        dataIndex: 'description',
        width: '50%',
        scopedSlots: { customRender: 'description' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }],
      loading: false,
      cacheData: null,
      mineList: [],
      tempId: 0
    }
  },
  computed: {
    ...mapGetters({
      data: 'baseInfo/mineList'
    })
  },
  watch: {
    data: {
      handler (value) {
        this.mineList = (value && [...value]) || []
      },
      deep: true
    }
  },
  mounted () {
    this.cacheData = this.data.map(item => ({ ...item }))
  },
  methods: {
    ...mapActions({
      saveConfig: 'baseInfo/saveConfig',
      deleteConfig: 'baseInfo/deleteConfig'
    }),
    handleAdd () {
      const newData = {
        id: this.tempId,
        name: '',
        type: 'mine',
        sort: 0,
        remark: '',
        editable: true
      }
      this.mineList.push(newData)
      this.tempId --
    },
    handleChange (value, key, column) {
      const newData = [...this.mineList]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        target[column] = value
        this.mineList = newData
      }
    },
    edit (key) {
      const newData = [...this.mineList]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        target.editable = true
        this.mineList = newData
      }
    },
    async save (key) {
      debugger
      const newData = [...this.mineList]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        target.editable = false
        this.saveConfig(target)
      }
    },
    cancel (key) {
      const newData = [...this.mineList]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.id)[0])
        delete target.editable
        this.mineList = [...this.data]
      }
    },
    async onDelete (record) {
      const newData = [...this.mineList]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        await this.deleteConfig(target)
      } else {
        this.mineList = [...this.data]
      }
    }
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.editable-add-btn {
  margin-bottom: 8px;
}
</style>
