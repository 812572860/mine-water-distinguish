// import { Icon } from 'ant-design-vue'
import Table from './Table'
import UploadExcel from './excel/Upload'
import UploadPreviewExcel from './excel/UploadPreview'
import Checkbox from './Checkbox'
import CanvasMap from './canvas/Map'
import CanvasPolygon from './canvas/Polygon'
import CanvasLine from './canvas/Line'
import CanvasMarker from './canvas/Marker'

// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_1269323_j5oq3kzzlga.js'
// })

const components = [
  // {
  //   ...IconFont,
  //   name: 'icon-font'
  // },
  Table,
  UploadExcel,
  UploadPreviewExcel,
  Checkbox,
  CanvasMap,
  CanvasPolygon,
  CanvasLine,
  CanvasMarker
]

export default {
  install(Vue) {
    components.forEach(element => {
      Vue.component(element.name, element)
    })
  }
}
