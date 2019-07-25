<template>
  <div>
    <a-button class="editable-add-btn" @click="addRow">添加</a-button>
    <el-table
      :data="aquiferList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column label="名称">
        <template slot-scope="props">
          <span v-show="!props.row.edit">{{ props.row.name }}</span>
          <el-input v-show="props.row.edit" v-model="props.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="props">
          <span v-show="!props.row.edit">{{ props.row.remark }}</span>
          <el-input
            v-show="props.row.edit"
            v-model="props.row.remark"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column width="150">
        <template slot-scope="props">
          <el-button
            v-show="!props.row.edit"
            type="primary"
            circle
            icon="el-icon-edit"
            size="mini"
            @click="editRow(props.row)"
          ></el-button>
          <el-button
            v-show="props.row.edit"
            type="success"
            circle
            icon="el-icon-check"
            size="mini"
            @click="saveRow(props.row)"
          ></el-button>
          <el-button
            v-show="props.row.edit"
            type="info"
            circle
            icon="el-icon-close"
            size="mini"
            @click="cancleRow(props.row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            icon="el-icon-delete"
            size="mini"
            @click="removeRow(props.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      aquiferList: [],
      isEditing: false,
      originalInfo: null,
      rules: {
        name: { required: true, message: 'name必填', trigger: 'change' }
      }
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
        this.aquiferList = (value && [...value]) || []
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      save: 'baseInfo/saveConfig',
      delete: 'baseInfo/deleteConfig'
    }),
    addRow () {
      const newData = {
        name: '',
        type: 'mine',
        sort: 0,
        remark: '',
        edit: true
      }
      this.aquiferList.push(newData)
      this.isEditing = true
    },
    editRow (row) {
      if (this.isEditing) {
        this.handleError('已有处于编辑状态的信息！')
      } else {
        row.edit = true
        this.originalInfo = { ...row }
      }
    },
    async saveRow (row) {
      console.log(row)
      row.edit = false
      this.isEditing = false
      await this.save(row)
      this.originalInfo = null
    },
    cancleRow (row) {
      const temp = this.originalInfo
      if (temp) {
        row.name = temp.name
        row.time = temp.time
        row.state = temp.state
        row.score = temp.score
        row.content = temp.content
        row.edit = false
      } else {
        
      }
      this.isEditing = false
    },
    async removeRow (row) {
      console.log(row)
      row.edit = false
      this.isEditing = false
      await this.delete(row)
      this.originalInfo = null
    }
  }
}
</script>

<style>
</style>
