# gx
对接后台数据格式
```
{
    "id": "ec94b2dd-36ed-4603-b664-51cf0ff78dfb",
    "name": "ts-edge",
    "label": "传输连线",
    "clazz": "trans_link",
    "key_shape": "",
    "shape_type": "edge",
    "shape_base": "polyline",
    "icon": null,
    "label_style": "{\"position\":\"middle\",\"autoRotate\":true,\"refX\":0,\"refY\":0,\"style\":{\"stroke\":\"#000000\",\"shadowColor\":\"rgba(0,0,0,0)\",\"shadowBlur\":0,\"lineWidth\":0,\"lineAppendWidth\":0,\"strokeOpacity\":1,\"fillOpacity\":1,\"fontSize\":12,\"fontWeight\":\"normal\",\"textAlign\":\"center\",\"textBaseline\":\"middle\",\"fill\":\"#595959\"}}",
    "style": "{\"offset\":15,\"lineWidth\":1,\"lineAppendWidth\":0,\"strokeOpacity\":0.7,\"radius\":4,\"stroke\":\"#2286E4\",\"hoverStrokeColor\":\"#F70404\",\"selectStrokeColor\":\"#FF25FF\",\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowBlur\":0,\"shadowColor\":\"rgba(0,0,0,0)\",\"_startArrow\":\"diamond\",\"_endArrow\":\"vee\",\"lineDash\":[],\"startArrow\":{\"path\":\"M 0,0 \\n        L 6,-3 \\n        L 12,0 \\n        L 6,3 Z\",\"d\":0,\"strokeOpacity\":0.7,\"fill\":\"#2286E4\",\"stroke\":\"#2286E4\"},\"endArrow\":{\"path\":\"M 0,0 L 12,-3\\n        L 8,0 L 12,3 Z\",\"d\":0,\"strokeOpacity\":0.7,\"fill\":\"#2286E4\",\"stroke\":\"#2286E4\"}}",
    "details": "{}"
  },
  {
    "id": "ef824c59-f593-4638-95d7-2738d1892a1f",
    "name": "dt-node",
    "label": "数据节点",
    "clazz": "data_node",
    "key_shape": "rect",
    "shape_type": "node",
    "shape_base": "single-node",
    "icon": null,
    "label_style": null,
    "style": "{\"lineWidth\":1,\"lineAppendWidth\":0,\"strokeOpacity\":0.7,\"fillOpacity\":1,\"width\":80,\"height\":40,\"radius\":4,\"stroke\":\"#1890FF\",\"fill\":\"#E7F7FE\",\"shadowOffsetX\":0,\"shadowOffsetY\":4,\"shadowBlur\":10,\"shadowColor\":\"rgba(13, 26, 38, 0.08)\",\"selectFillColor\":\"#5589FF\"}",
    "details": "{}"
  }
 ```
## 功能

| 功能       | 默认启用 | 快捷键            | 工具栏 | 右键菜单 | 备注   |
| :--------- | :--- | :--------------- | :----- | :----- | :---- |
| undo       | ✔   |                   | ✔     | ✔      | 撤销 | 
| redo       | ✔   |                   | ✔     | ✔      | 重做 | 
| copy       | ✔   |                   | ✔     | ✔      | 复制 | 
| paste      | ✔   |                   | ✔     | ✔      | 粘贴 | 
| delete     | ✔   |                   | ✔     | ✔      | 删除 | 
| clear      | ✔   |                   | ✔     | ✔      | 清空画布 |
| zoom       | ✔   |                   | ✔     | ✔      | 缩放 |
| zoomIn     | ✔   |                   | ✔     | ✔      | 放大 |
| zoomOut    | ✔   |                   | ✔     | ✔      | 缩小 |
| fit        | ✔   |                   | ✔     | ✔      | 适应屏幕 |
| actualSize | ✔   |                   | ✔     | ✔      | 实际大小 |
| fill       | ✔   |                   | ✔     | ✔      | 填充颜色 |
| lineColor  | ✔   |                   | ✔     | ✔      | 线条颜色 |
| lineWidth  | ✔   |                   | ✔     | ✔      | 线条宽度 |
| lineDash   | ✔   |                   | ✔     | ✔      | 线条样式 |
| lineType   | ✔   |                   | ✔     | ✔      | 线条类型 |
| toFront    | ✔   |                   | ✔     | ✔      | 置于顶层 |
| toBack     | ✔   |                   | ✔     | ✔      | 置于底层 |
| selectAll  | ✔   |                   | ✔     | ✔      | 全选 |
| alignItem  | ✔   |                   | ✔     | ✔      | 对齐线 |
