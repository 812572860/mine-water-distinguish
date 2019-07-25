<template>
  <div :loading="loading">
    <div>
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
        <el-table-column
          prop="sampleNo"
          label="水样编号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="mineName"
          label="矿井名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="mineLayer"
          label="开采煤层"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="mineLevel"
          label="开采水平"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="sampleTime"
          label="取样时间"
          width="120"
        ></el-table-column>
        <el-table-column prop="samplePlace" label="取样地点"></el-table-column>
        <el-table-column
          prop="simpleCharacter"
          label="水样点性状"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="水样判别分析"
              placement="top-start"
            >
              <el-button type="info" size="mini" @click="onDetail(scope.row)">
                <i class="iconfont icon-fenxi"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="水样Piper三线图"
              placement="top-start"
            >
              <el-button
                type="primary"
                size="mini"
                @click="onShowPiper(scope.row)"
              >
                <a-icon type="heat-map"></a-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="水样阴阳离子饼图"
              placement="top-end"
            >
              <el-button
                type="primary"
                size="mini"
                @click="onShowPie(scope.row)"
              >
                <a-icon type="pie-chart"></a-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </Table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
    >
      <component
        v-if="dialogVisible && componentId !== 'Piper'"
        :is="componentId"
        :data="selectInfo"
        showResult
        @onCancel="onCloseDialog"
      ></component>
      <Piper
        v-if="dialogVisible && componentId === 'Piper'"
        :pendingSample="selectInfo"
        :width="800"
        :height="600"
        :sideLength="300"
        :showSamplesOnLoad="false"
        @onCancel="onCloseDialog"
      ></Piper>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPendingSampleListByPager, savePendingSample, deletePendingSample } from '@/api/sample'
import SampleWater from '@/models/SampleWater'
import Details from '../dataManage/pending/Details'
import Piper from '../chart/Piper'
import Pie from '../chart/Pie'
export default {
  components: {
    Details,
    Piper,
    Pie
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
      dialogWidth: '70%',
      componentId: '',
      selectInfo: null
    }
  },
  computed: {
    ...mapGetters({
      mineList: 'baseInfo/mineList'
    })
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
      getPendingSampleListByPager(params).then(res => {
        this.sampleList = (res.result.items && res.result.items.map(item => new SampleWater(item))) || []
        this.total = res.result && res.result.total || 0
      }).catch(err => {
        this.sampleList = []
        this.total = 0
        this.$store.commit('showErrorMsg', err.message || '获取水样数据失败！')
      }).finally(() => {
        this.loading = false
      })
    },
    onDetail (row) {
      this.dialogTitle = `${row.sampleNo}水样识别信息`
      this.componentId = 'Details'
      this.selectInfo = { ...row }
      this.dialogVisible = true
    },
    onShowPiper (row) {
      console.log(row)
      this.dialogTitle = `${row.sampleNo}水样Piper三线图`
      this.componentId = 'Piper'
      this.selectInfo = { ...row }
      this.dialogWidth = '80%'
      this.dialogVisible = true
    },
    onShowPie (row) {
      this.dialogTitle = `${row.sampleNo}水样阴阳离子饼图`
      this.componentId = 'Pie'
      this.dialogWidth = '60%'
      this.selectInfo = { ...row }
      this.dialogVisible = true
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
    const self = this
    window.onresize = () => {
      return () => {
        self.tableHeight = document.documentElement.clientHeight - 230
      }
    }
  },
}
</script>

<style scoped>
.top-form {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 5px 10px;
}
.el-button--mini {
  font-size: 16px;
}
</style>
