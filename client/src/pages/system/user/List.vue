<template>
  <div :loading="loading">
    <div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="onCreate"
      ></el-button>
      <el-form :inline="true" :model="searchForm" style="float:right">
        <el-form-item label="名称"> </el-form-item>
      </el-form>
    </div>
    <Table
      paginate
      stripe
      border
      :tableData="userList"
      :total="total"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @changePageSize="onChangePageSize"
      @changeCurrentPage="onChangeCurrentPage"
    >
      <template slot="columns">
        <el-table-column
          prop="username"
          label="用户名"
          width="150"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="显示名"
          width="150"
          header-align="center"
        ></el-table-column>
        <el-table-column prop="gender" label="性别" width="80" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.gender ? "女" : "男" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="电话"
          width="180"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="mailbox"
          label="邮箱"
          width="200"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="现住址"
          header-align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="onEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="onDelete(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </template>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <component
        v-if="dialogVisible"
        :is="componentId"
        :data="selectInfo"
        @onCancel="onCloseDialog"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, removeUser } from '@/api/auth'
import New from './New'
export default {
  components: {
    New
  },
  data () {
    return {
      loading: false,
      searchForm: {},
      userList: [],
      total: 0,
      pageSize: 15,
      currentPage: 1,
      dialogTitle: '',
      dialogVisible: false,
      componentId: '',
      selectInfo: null
    }
  },
  methods: {
    onSearch () {
      this.loading = true
      const params = {
        pager: {
          pageSize: this.pageSize,
          current: this.currentPage
        },
        keyword: this.searchForm.keyword
      }
      getUserList(params).then(res => {
        console.log(res)
        this.userList = res.result && res.result.items || []
        this.total = res.result && res.result.total || 0
      }).catch(err => {
        this.userList = []
        this.total = 0
        this.$store.commit('showErrorMsg', err.message || '获取用户列表失败！')
      }).finally(() => {
        this.loading = false
      })
    },
    onCreate () {
      this.dialogTitle = '新增用户信息'
      this.componentId = 'New'
      this.selectInfo = {
        username: '',
        name: '',
        password: '',
        telephoneL: '',
        email: '',
        address: '',
        gender: false
      }
      this.dialogVisible = true
    },
    onEdit (row) {
      this.dialogTitle = '修改用户信息'
      this.componentId = 'New'
      this.selectInfo = { ...row }
      this.dialogVisible = true
    },
    onDelete (row) {
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        removeUser({ ...row }).then(res => {
          this.onSearch()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '删除失败!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    onChangePageSize (size) {
      this.pageSize = size
      this.onSearch()
    },
    onChangeCurrentPage (val) {
      this.currentPage = val
      this.onSearch()
    },
    onCloseDialog (reload) {
      if (reload) this.onSearch()
      this.dialogVisible = false
    }
  },
  mounted () {
    this.onSearch()
  },
}
</script>

<style>
.top-form {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
</style>
