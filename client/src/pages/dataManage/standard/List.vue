<template>
  <div :loading="loading">
    <div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="onCreate"
        v-if="isManager"
        >添加</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-download"
        @click="onImport"
        v-if="isManager"
        >导入</el-button
      >
      <el-form :inline="true" :model="searchForm" style="float:right">
        <!-- <el-form-item label="矿井名称">
          <el-select v-model="searchForm.mineName">
            <el-option
              v-for="(item, index) in mineList"
              :key="index"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-input placeholder="请输入关键字" v-model="searchForm.keyword">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="onSearch"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <Table
      paginate
      stripe
      border
      :tableData="sampleList"
      :total="total"
      :pageSize="pageSize"
      :currentPage="currentPage"
      :height="tableHeight"
      @changePageSize="onChangePageSize"
      @changeCurrentPage="onChangeCurrentPage"
    >
      <template slot="columns">
        <el-table-column prop="sampleNo" label="水样编号"></el-table-column>
        <el-table-column prop="mineName" label="矿井名称"></el-table-column>
        <el-table-column prop="mineLayer" label="开采煤层"></el-table-column>
        <el-table-column prop="mineLevel" label="开采水平"></el-table-column>
        <el-table-column
          prop="sampleCharacter"
          label="水样点性状"
        ></el-table-column>
        <el-table-column prop="sampleSource" label="水源类型"></el-table-column>
        <el-table-column prop="sampleTime" label="取样时间"></el-table-column>
        <el-table-column
          prop="samplePlace"
          label="取样地点"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看水样详情"
              placement="top-start"
            >
              <el-button
                type="info"
                icon="el-icon-view"
                size="mini"
                @click="onDetail(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改水样数据"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                v-if="isManager"
                @click="onEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除水样数据"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                v-if="isManager"
                @click="onDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%">
      <component
        v-if="dialogVisible"
        :is="componentId"
        :data="selectInfo"
        :previewColumns="previewColumns"
        @onCancel="onCloseDialog"
        @saveData="onSave"
        @dowmloadTemplate="dowmloadTemplate"
      >
      </component>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {downloadTemplateFile} from '@/api'
import { getStandardSampleListByPager, saveStandardSample, deleteStandardSample } from '@/api/sample'
import New from '../pending/New'
import Details from '../pending/Details'
export default {
  components: {
    New,
    Details
  },
  data () {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 230,
      searchForm: {},
      sampleList: [],
      total: 0,
      pageSize: 15,
      currentPage: 1,
      dialogTitle: '',
      dialogVisible: false,
      componentId: '',
      selectInfo: null,
      previewColumns: [
        { key: 'sampleNo', text: '水样编号' },
        { key: 'originalNo', text: '原编号' },
        { key: 'mineName', text: '矿井名称', width: '120' },
        { key: 'sampleTime', text: '取样时间', width: '120' },
        { key: 'mineLayer', text: '主采煤层', width: '100' },
        { key: 'sampleCharacter', text: '水样点性状' },
        { key: 'mineLevel', text: '开采水平' },
        { key: 'aquifer', text: '充水层' },
        { key: 'sampleSource', text: '水源类型' },
        { key: 'samplePlace', text: '取样位置', width: '120' },
        { key: 'waterTemperature', text: '水温' },
        { key: 'ca', text: 'Ca（mg/L）' },
        { key: 'mg', text: 'Mg(mg/L)' },
        { key: 'kna', text: 'K+Na(mg/L)' },
        { key: 'co3', text: 'CO3(mg/L）' },
        { key: 'hco3', text: 'HCO3(mg/L）' },
        { key: 'cl', text: 'CL(mg/L)' },
        { key: 'so4', text: 'SO4(mg/L)' },
        { key: 'tds', text: 'TDS(mg/L)' },
        { key: 'ph', text: 'PH' },
        { key: 'dataSource', text: '数据来源', width: '120' },
        { key: 'remark', text: '备注' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      mineList: 'baseInfo/mineList'
    }),
    isManager () {
      return this.$store.state.user && this.$store.state.user.isManager || false
    }
  },
  mounted () {
    this.onSearch()
    const self = this
    window.onresize = () => {
      return () => {
        self.tableHeight = document.documentElement.clientHeight - 230
      }
    }
  },
  methods: {
    onSearch () {
      this.loading = true
      let params = {
        pageSize: this.pageSize,
        current: this.currentPage,
        keyword: this.searchForm.keyword
      }
      getStandardSampleListByPager(params).then(res => {
        console.log(res)
        this.sampleList = res.result && res.result.items || []
        this.total = res.result && res.result.total || 0
      }).catch(err => {
        this.sampleList = []
        this.total = 0
        this.$store.commit('showErrorMsg', err.message || '获取标准数据失败！')
      }).finally(() => {
        this.loading = false
      })
    },
    onCreate () {
      this.dialogTitle = '添加水样数据'
      this.componentId = 'New'
      this.dialogVisible = true
    },
    onEdit (row) {
      this.dialogTitle = `修改${row.sampleNo}水样数据`
      this.componentId = 'New'
      this.selectInfo = { ...row }
      this.dialogVisible = true
    },
    onDetail (row) {
      this.dialogTitle = `${row.sampleNo}水样详细信息`
      this.componentId = 'Details'
      this.selectInfo = { ...row }
      this.dialogVisible = true
    },
    onDelete (row) {
      this.$confirm('此操作将删除该水样数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStandardSample({ ...row }).then(() => {
          this.onSearch()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '删除失败!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    onSave (info) {
      console.log(info)
      saveStandardSample(info).then(() => {
        this.$store.commit('showSuccessMsg', '水样保存成功！')
        // 重新获取标准水样数据
        this.$store.dispatch('standardSample/getAllSampleList')
        this.onSearch()
        this.dialogVisible = false
      }).catch(err => {
        this.$store.commit('showErrorMsg', err.message || '水样保存失败！')
      })
    },
    onImport () {
      this.dialogTitle = '批量导入标准水样数据'
      this.componentId = 'UploadPreviewExcel'
      this.dialogVisible = true
    },
    async dowmloadTemplate() {
      try {
        await downloadTemplateFile()
      } catch (err) {
        this.$store.commit('showErrorMsg', err.message || '水样模板下载失败！')
      }
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
  }
}
</script>

<style>
.top-form {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
</style>
