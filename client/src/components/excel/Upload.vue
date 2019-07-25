<template>
  <div class="uploadExcel">
    <input
      class="uploadExcel-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
      ref="input"
    />
    <div
      class="uploadExcel-drop"
      :style="dropStyle"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
      @click="handleUpload"
    >
      <span>{{ currentText }}</span>
      <span
        style="display: block;font-size: 14px;padding: 0;margin: 0;"
        >请确保导入Excel的表头与模板保持一致！</span
      >
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'UploadExcel',
  props: {
    /**
     * sheet 名列表，默认读取第一个
     */
    sheetNames: {
      type: Array,
      default () {
        return ['Sheet1']
      }
    },
    /**
     * 上传之前处理
     */
    beforeUpload: Function,
    /**
     * 文字描述
     */
    text: {
      type: String,
      default: '选择excel文件'
    },
    /**
     * loading时候的文字描述
     */
    loadingText: {
      type: String,
      default: '正在读取中...'
    },
    raw: {
      type: Boolean,
      default: false
    },
    dropStyle: {
      type: Object,
      default: () => {
        return {
          width: '600px',
          height: '160px',
          'font-size': '24px'
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  computed: {
    currentText () {
      return this.loading ? this.loadingText : this.text
    }
  },
  methods: {
    generateDate ({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.$emit('onSuccess', this.excelData)
    },
    handleDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('只支持单文件!')
        return
      }
      const rawFile = files[0]
      if (!this.isExcel(rawFile)) {
        this.$message.error('只支持类型为 xlsx, xls, csv 的文件! ')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload () {
      this.$refs.input.click()
    },
    handleClick (e) {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload (rawFile) {
      this.$refs.input.value = null
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 读取数据
    readerData (rawFile) {
      let self = this
      return new Promise((resolve, reject) => {
        self.loading = true
        this.$nextTick(() => {
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const fixedData = this.fixdata(data)
            const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
            // 标题和结果，默认是数组，若传多个sheet名时为对象类型
            let header = {}
            let results = {}
            if (self.sheetNames.length === 0) {
              const firstSheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[firstSheetName]
              console.log(worksheet, 'worksheet')
              header = self.get_header_row(worksheet)
              results = XLSX.utils.sheet_to_json(worksheet, { raw: this.raw })
            } else {
              // 传了多个sheet的名称
              self.sheetNames.forEach(name => {
                let worksheet = workbook.Sheets[name]
                if (worksheet) {
                  header[name] = self.get_header_row(worksheet)
                  results[name] = XLSX.utils.sheet_to_json(worksheet, { raw: this.raw })
                }
              })
            }
            self.generateDate({ header, results })
            self.loading = false
            resolve()
          }
          reader.readAsArrayBuffer(rawFile)
        })
      })
    },
    fixdata (data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    get_header_row (sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel (file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style>
.uploadExcel {
  margin: auto;
}
.uploadExcel-input {
  display: none;
  z-index: -9999;
}

.uploadExcel-drop {
  border: 2px dashed #bbb;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
  width: 600px;
  height: 160px;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
