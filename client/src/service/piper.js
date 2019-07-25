// piper三线图绘制服务
import Point from '@/models/Point'
// import Line from '@/models/Line'
import { convertToMeqPercent } from './unitTranform'

const colorList = [
  '#930000',
  '#9F0050',
  '#ef5309',
  '#ffaad5',
  '#F9F900',
  '#00DB00',
  '#00FFFF',
  '#6A6AFF',
  '#B766AD',
  '#FF0080',
  '#0B61A4',
  '#ADADAD'
]

let leftPoints //左侧三角形三个顶点，左下角为0，逆时针编号
let rightPoints //右侧三角形，左下角为0，逆时针编号
let topPoints //顶部菱形，最下角为0，逆时针编号

// 计算三个边框的顶点坐标集合
export const getBorderPoints = (startPoint, side, space) => {
  // 左侧三角形
  leftPoints = [
    {
      x: startPoint.x,
      y: startPoint.y + Math.sqrt(3) * (side + space / 2)
    },
    {
      x: startPoint.x + side,
      y: startPoint.y + Math.sqrt(3) * (side + space / 2)
    },
    {
      x: startPoint.x + side / 2,
      y: startPoint.y + (Math.sqrt(3) * (side + space)) / 2
    }
  ]
  // 右侧三角形
  rightPoints = [
    {
      x: startPoint.x + side + space,
      y: startPoint.y + Math.sqrt(3) * (side + space / 2)
    },
    {
      x: startPoint.x + side * 2 + space,
      y: startPoint.y + Math.sqrt(3) * (side + space / 2)
    },
    {
      x: startPoint.x + (side * 3) / 2 + space,
      y: startPoint.y + (Math.sqrt(3) * (side + space)) / 2
    }
  ]
  // 顶部菱形
  topPoints = [
    {
      x: startPoint.x + side + space / 2,
      y: startPoint.y + Math.sqrt(3) * side
    },
    {
      x: startPoint.x + (side * 3) / 2 + space / 2,
      y: startPoint.y + (Math.sqrt(3) * side) / 2
    },
    {
      x: startPoint.x + side + space / 2,
      y: startPoint.y
    },
    {
      x: startPoint.x + (side + space) / 2,
      y: startPoint.y + (Math.sqrt(3) * side) / 2
    }
  ]
  return { leftPoints, rightPoints, topPoints }
}

// 计算三个多边形内部的虚线标尺端点坐标集合
export const getScaleplatePoints = side => {
  let dashLines = [] // 虚线端点
  let labelPoints = [] // 标注坐标

  const picth = side / 5

  // 左侧三角形
  let leftScaleplatePoints = getLeftScaleplatePoints(leftPoints, picth)
  let scale = 20
  for (let i = 0; i < 4; i++) {
    dashLines.push([
      leftScaleplatePoints.bottomPoints[i],
      leftScaleplatePoints.rightPoints[3 - i]
    ])
    dashLines.push([
      leftScaleplatePoints.bottomPoints[i],
      leftScaleplatePoints.leftPoints[3 - i]
    ])
    dashLines.push([
      leftScaleplatePoints.rightPoints[i],
      leftScaleplatePoints.leftPoints[3 - i]
    ])
    labelPoints.push({
      label: scale.toString(),
      point: {
        x: leftScaleplatePoints.bottomPoints[i].x,
        y: leftScaleplatePoints.bottomPoints[i].y + picth / 4
      }
    })
    labelPoints.push({
      label: scale.toString(),
      point: {
        x: leftScaleplatePoints.leftPoints[i].x - picth / 6,
        y: leftScaleplatePoints.leftPoints[i].y + picth / 12
      }
    })
    scale += 20
  }
  // 右侧三角形
  let rightScaleplatePoints = getRightScaleplatePoints(rightPoints, picth)
  scale = 20
  for (let i = 0; i < 4; i++) {
    dashLines.push([
      rightScaleplatePoints.bottomPoints[i],
      rightScaleplatePoints.rightPoints[3 - i]
    ])
    dashLines.push([
      rightScaleplatePoints.bottomPoints[i],
      rightScaleplatePoints.leftPoints[3 - i]
    ])
    dashLines.push([
      rightScaleplatePoints.rightPoints[i],
      rightScaleplatePoints.leftPoints[3 - i]
    ])

    labelPoints.push(
      {
        label: scale.toString(),
        point: {
          x: rightScaleplatePoints.bottomPoints[i].x,
          y: rightScaleplatePoints.bottomPoints[i].y + picth / 4
        }
      },
      {
        label: scale.toString(),
        point: {
          x: rightScaleplatePoints.rightPoints[i].x + picth / 6,
          y: rightScaleplatePoints.rightPoints[i].y + picth / 12
        }
      }
    )
    scale += 20
  }
  // 顶部菱形
  let topScaleplatePoints = getTopScaleplatePoints(topPoints, picth)
  scale = 20
  for (let i = 0; i < 4; i++) {
    dashLines.push(
      [topScaleplatePoints.lbPoints[i], topScaleplatePoints.rtPoints[3 - i]],
      [topScaleplatePoints.rbPoints[i], topScaleplatePoints.ltPoints[3 - i]]
    )
    labelPoints.push(
      {
        label: scale.toString(),
        point: {
          x: topScaleplatePoints.ltPoints[i].x - picth / 6,
          y: topScaleplatePoints.ltPoints[i].y + picth / 12
        }
      },
      {
        label: scale.toString(),
        point: {
          x: topScaleplatePoints.rtPoints[i].x + picth / 6,
          y: topScaleplatePoints.rtPoints[i].y + picth / 12
        }
      }
    )
    scale += 20
  }
  return {
    dashLines,
    labelPoints
  }
}
// 计算左侧三角形标注的坐标点
const getLeftScaleplatePoints = (leftP, picth) => {
  let bottomPoints = new Array(4).fill(0).map(() => new Point()) //左侧三角形底边内部4个点
  let rightPoints = new Array(4).fill(0).map(() => new Point()) //左侧三角形右侧边内部4个点
  let leftPoints = new Array(4).fill(0).map(() => new Point()) //左侧三角形左侧边内部4个点

  bottomPoints[3].x = leftP[0].x + picth
  bottomPoints[3].y = leftP[0].y
  bottomPoints[2].x = leftP[0].x + 2 * picth
  bottomPoints[2].y = leftP[0].y
  bottomPoints[1].x = leftP[0].x + 3 * picth
  bottomPoints[1].y = leftP[0].y
  bottomPoints[0].x = leftP[0].x + 4 * picth
  bottomPoints[0].y = leftP[0].y
  rightPoints[3].x = leftP[1].x - picth / 2
  rightPoints[3].y = parseInt(leftP[1].y - (Math.sqrt(3) * picth) / 2)
  rightPoints[2].x = leftP[1].x - picth
  rightPoints[2].y = parseInt(leftP[1].y - Math.sqrt(3) * picth)
  rightPoints[1].x = leftP[1].x - (3 * picth) / 2
  rightPoints[1].y = parseInt(leftP[1].y - (3 * Math.sqrt(3) * picth) / 2)
  rightPoints[0].x = leftP[1].x - 2 * picth
  rightPoints[0].y = parseInt(leftP[1].y - 2 * Math.sqrt(3) * picth)
  leftPoints[0].x = leftP[0].x + picth / 2
  leftPoints[0].y = parseInt(leftP[0].y - (Math.sqrt(3) * picth) / 2)
  leftPoints[1].x = leftP[0].x + picth
  leftPoints[1].y = parseInt(leftP[0].y - Math.sqrt(3) * picth)
  leftPoints[2].x = leftP[0].x + (3 * picth) / 2
  leftPoints[2].y = parseInt(leftP[0].y - (3 * Math.sqrt(3) * picth) / 2)
  leftPoints[3].x = leftP[0].x + 2 * picth
  leftPoints[3].y = parseInt(leftP[0].y - 2 * Math.sqrt(3) * picth)

  return {
    bottomPoints,
    rightPoints,
    leftPoints
  }
}
// 计算右侧三角形标注的坐标点
const getRightScaleplatePoints = (rightP, picth) => {
  let bottomPoints = new Array(4).fill(0).map(() => new Point()) //右侧三角形底边内部4个点
  let rightPoints = new Array(4).fill(0).map(() => new Point()) //右侧三角形右侧边内部4个点
  let leftPoints = new Array(4).fill(0).map(() => new Point()) //右侧三角形左侧边内部4个点

  bottomPoints[0].x = rightP[0].x + picth
  bottomPoints[0].y = rightP[0].y
  bottomPoints[1].x = rightP[0].x + 2 * picth
  bottomPoints[1].y = rightP[0].y
  bottomPoints[2].x = rightP[0].x + 3 * picth
  bottomPoints[2].y = rightP[0].y
  bottomPoints[3].x = rightP[0].x + 4 * picth
  bottomPoints[3].y = rightP[0].y
  rightPoints[0].x = rightP[1].x - picth / 2
  rightPoints[0].y = parseInt(rightP[1].y - (Math.sqrt(3) * picth) / 2)
  rightPoints[1].x = rightP[1].x - picth
  rightPoints[1].y = parseInt(rightP[1].y - Math.sqrt(3) * picth)
  rightPoints[2].x = rightP[1].x - (3 * picth) / 2
  rightPoints[2].y = parseInt(rightP[1].y - (3 * Math.sqrt(3) * picth) / 2)
  rightPoints[3].x = rightP[1].x - 2 * picth
  rightPoints[3].y = parseInt(rightP[1].y - 2 * Math.sqrt(3) * picth)
  leftPoints[3].x = rightP[0].x + picth / 2
  leftPoints[3].y = parseInt(rightP[0].y - (Math.sqrt(3) * picth) / 2)
  leftPoints[2].x = rightP[0].x + picth
  leftPoints[2].y = parseInt(rightP[0].y - Math.sqrt(3) * picth)
  leftPoints[1].x = rightP[0].x + (3 * picth) / 2
  leftPoints[1].y = parseInt(rightP[0].y - (3 * Math.sqrt(3) * picth) / 2)
  leftPoints[0].x = rightP[0].x + 2 * picth
  leftPoints[0].y = parseInt(rightP[0].y - 2 * Math.sqrt(3) * picth)

  return {
    bottomPoints,
    rightPoints,
    leftPoints
  }
}
// 计算顶部菱形标注的坐标点
const getTopScaleplatePoints = (topP, picth) => {
  let lbPoints = new Array(4).fill(0).map(() => new Point()) //顶部菱形左下边内部4个点
  let rbPoints = new Array(4).fill(0).map(() => new Point()) //顶部菱形右下边内部4个点
  let rtPoints = new Array(4).fill(0).map(() => new Point()) //顶部菱形右上边内部4个点
  let ltPoints = new Array(4).fill(0).map(() => new Point()) //顶部菱形左上边内部4个点

  lbPoints[0].x = topP[3].x + picth / 2
  lbPoints[0].y = parseInt(topP[3].y + (Math.sqrt(3) * picth) / 2)
  lbPoints[1].x = topP[3].x + picth
  lbPoints[1].y = parseInt(topP[3].y + Math.sqrt(3) * picth)
  lbPoints[2].x = topP[3].x + (3 * picth) / 2
  lbPoints[2].y = parseInt(topP[3].y + (3 * Math.sqrt(3) * picth) / 2)
  lbPoints[3].x = topP[3].x + 2 * picth
  lbPoints[3].y = parseInt(topP[3].y + 2 * Math.sqrt(3) * picth)
  rbPoints[0].x = topP[0].x + 2 * picth
  rbPoints[0].y = parseInt(topP[0].y - 2 * Math.sqrt(3) * picth)
  rbPoints[1].x = topP[0].x + (3 * picth) / 2
  rbPoints[1].y = parseInt(topP[0].y - (3 * Math.sqrt(3) * picth) / 2)
  rbPoints[2].x = topP[0].x + picth
  rbPoints[2].y = parseInt(topP[0].y - Math.sqrt(3) * picth)
  rbPoints[3].x = topP[0].x + picth / 2
  rbPoints[3].y = parseInt(topP[0].y - (Math.sqrt(3) * picth) / 2)
  rtPoints[0].x = topP[1].x - picth / 2
  rtPoints[0].y = parseInt(topP[1].y - (Math.sqrt(3) * picth) / 2)
  rtPoints[1].x = topP[1].x - picth
  rtPoints[1].y = parseInt(topP[1].y - Math.sqrt(3) * picth)
  rtPoints[2].x = topP[1].x - (3 * picth) / 2
  rtPoints[2].y = parseInt(topP[1].y - (3 * Math.sqrt(3) * picth) / 2)
  rtPoints[3].x = topP[1].x - 2 * picth
  rtPoints[3].y = parseInt(topP[1].y - 2 * Math.sqrt(3) * picth)
  ltPoints[0].x = topP[3].x + picth / 2
  ltPoints[0].y = parseInt(topP[3].y - (Math.sqrt(3) * picth) / 2)
  ltPoints[1].x = topP[3].x + picth
  ltPoints[1].y = parseInt(topP[3].y - Math.sqrt(3) * picth)
  ltPoints[2].x = topP[3].x + (3 * picth) / 2
  ltPoints[2].y = parseInt(topP[3].y - (3 * Math.sqrt(3) * picth) / 2)
  ltPoints[3].x = topP[3].x + 2 * picth
  ltPoints[3].y = parseInt(topP[3].y - 2 * Math.sqrt(3) * picth)

  return {
    lbPoints,
    rbPoints,
    rtPoints,
    ltPoints
  }
}
// 计算端点处离子标注坐标点
export const getIconLabelPoints = points => {
  let iconPoints = [
    {
      label: 'Ca',
      point: points.leftPoints[0],
      anchor: [1.5, -0.5]
    },
    {
      label: 'NaK',
      point: points.leftPoints[1],
      anchor: [1, -1]
    },
    {
      label: 'Mg',
      point: points.leftPoints[2],
      anchor: [0.8, 0.8]
    },
    {
      label: 'HCO3',
      point: points.rightPoints[0],
      anchor: [1, -1]
    },
    {
      label: 'Cl',
      point: points.rightPoints[1],
      anchor: [-0.5, -0.5]
    },
    {
      label: 'SO4',
      point: points.rightPoints[2],
      anchor: [0.8, 0.8]
    }
  ]
  return iconPoints
}
// 计算水样点的三个投点坐标
export const getSamplePoint = (sample, startPoint, side, space, sourceList) => {
  let leftPoint = new Point()
  let rightPoint = new Point()
  let topPoint = new Point()

  const info = convertToMeqPercent(sample)

  if (info.ca < 2) {
    leftPoint.x = Math.floor(
      startPoint.x + side - (side * (100 - info.kna)) / 200
    )
    leftPoint.y = Math.floor(
      startPoint.y +
        (Math.sqrt(3) * (side * 2 + space - (side * (100 - info.kna)) / 200)) /
          2
    )
  } else {
    leftPoint.x = Math.floor(
      startPoint.x + (side * (info.kna + info.mg / 2)) / 100
    )
    leftPoint.y = Math.floor(
      startPoint.y +
        (Math.sqrt(3) * (side * 2 + space - (side * info.mg) / 100)) / 2
    )
  }

  rightPoint.x = Math.floor(
    startPoint.x + side * 2 + space - (side * (info.hco3 + info.so4 / 2)) / 100
  )
  rightPoint.y = Math.floor(
    startPoint.y +
      (Math.sqrt(3) * (side * 2 + space - (side * info.so4) / 100)) / 2
  )

  topPoint.x = Math.floor(
    startPoint.x +
      (side * 2 + space + (side * (info.kna - info.hco3)) / 100) / 2
  )
  topPoint.y = Math.floor(
    startPoint.y + Math.sqrt(3) * ((side * (info.kna + info.hco3)) / 200)
  )
  let fillColor = getWaterSourceColor(sourceList, sample)

  return {
    info: sample,
    leftPoint,
    rightPoint,
    topPoint,
    fillColor: fillColor.fillColor
  }
}

export const getWaterSourceColor = (sourceList = [], sample = {}) => {
  let temp = sourceList.find(
    item =>
      sample.sampleSource === item.name || sample.sampleSource === item.code
  )
  return {
      ...sample,
      fillColor:
        (temp && temp.color) || (sourceList.length && [sourceList.length - 1].color || 'grey')
    }
}
