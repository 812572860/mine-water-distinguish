<template>
  <div>
    <el-table :data="tableData" :stripe="stripe" :border="border" :height="height">
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <slot name="columns"></slot>
    </el-table>
    <el-pagination
      class="pagination"
      v-if="paginate"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, -> ,sizes, -> , prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    paginate: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 15
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: () => [10, 15, 30, 50, 100]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    height: {
      type: [String, Number]
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleSizeChange (value) {
      this.$emit('changePageSize', value)
    },
    handleCurrentChange (value) {
      this.$emit('changeCurrentPage', value)
    }
  }
}
</script>

<style>
.el-table th,
.el-table tr {
  background-color: transparent;
}

.el-table__body tr.current-row > td,
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
  background: #d6e0e8;
}

.pagination {
  text-align: left;
  margin: 6px 0;
}
</style>
