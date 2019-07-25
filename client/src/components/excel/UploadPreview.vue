<template>
  <div>
    <el-button type="primary" @click="onDownLoad">下载模板</el-button>
    <el-button
      v-if="showPreview"
      type="primary"
      v-loading="submiting"
      @click="onSubmit"
      >保存</el-button
    >
    <div style="display:flex;margin-bottom:5px;">
      <Upload
        v-if="!showPreview"
        :text="uploadText"
        :sheet-names="sheetNames"
        :dropStyle="dropStyle"
        @onSuccess="onExcelReaded"
      />
    </div>
    <Table v-show="showPreview" :tableData="previewData" height="500">
      <template slot="columns">
        <el-table-column
          v-for="(item, index) in previewColumns"
          :key="index"
          :property="item.key"
          :label="item.text"
          :width="item.width || 100"
        ></el-table-column>
      </template>
    </Table>
  </div>
</template>

<script>
import Upload from './Upload'
export default {
  name: 'UploadPreviewExcel',
  components: {
    Upload
  },
  props: {
    sheetNames: {
      type: Array,
      default: () => []
    },
    previewColumns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showPreview: false,
      previewData: [],
      uploadText: '选取或将excel文件拖拽至此',
      submiting: false,
      dropStyle: {
        width: '600px',
        height: '160px',
        margin: '0 auto',
        'font-size': '24px'
      }
    }
  },
  methods: {
    // excel读取完，导入数据
    onExcelReaded (data) {
      const _this = this;
      const cData = []
      // 根据配置信息，导入数据
      // this.sheetNames.forEach(name => {
      let result = data.results
      for (let i = 0; i < result.length; i++) {
        let rItem = result[i];
        let dataItem = {}
        this.previewColumns.forEach(ele => {
          dataItem[ele.key] = rItem[ele.text]
        })
        cData.push(dataItem);
      }
      // })
      this.previewData = cData
      console.log(this.previewData)
      this.showPreview = true
      this.dropStyle = {
        width: '200px',
        height: '60px',
        margin: '0 5px',
        'line-height': '60px',
        'font-size': '18px'
      }
      this.uploadText = '重新选择excel'
    },
    onSubmit () {
      this.submiting = true
      this.$emit('saveData', this.previewData)
    },
    onDownLoad () {
      this.$emit('dowmloadTemplate')
    }
  },
}
</script>

<style>
</style>
