import {each} from '@antv/util';

export default function (G6) {
    G6.registerBehavior('itemAlign', {
        getDefaultCfg() {
            return {
                maxDistance: 2,
                alignLineStyle: {stroke: '#FA8C16', lineWidth: 1},
                tolerance: 5,
                originModel: null,
                _alignLines: [],
            };
        },
        getEvents() {
            return {
                'node:dragstart': 'onDragStart',
                'node:drag': 'onDrag',
                'node:dragend': 'onDragEnd',
            };
        },
        onDragStart(e) {
            this.originModel = Object.assign({}, e.item.getModel());
        },
        onDrag(e) {
            this._clearAlignLine();
            this._itemAlign(e.item);
        },
        onDragEnd(e) {
            this._updateCommand(e.item);
            this._clearAlignLine();
            this.originModel = null;
        },
        _itemAlign(item) {
            const bbox = item.getBBox()
            // FIXME bbox 中x、y坐标为图形左上角坐标
            // 中上
            const ct = {x: bbox.x + bbox.width / 2, y: bbox.y}
            // 中心
            const cc = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2}
            // 中下
            const cb = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height}
            // 左中
            const lc = {x: bbox.x, y: bbox.y + bbox.height / 2}
            // 右中
            const rc = {x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2}
            // 遍历节点
            const nodes = this.graph.getNodes()
            nodes.forEach(node => {
                let horizontalLines = []
                let verticalLines = []
                // 对齐线信息
                const info = {
                    horizontals: [],
                    verticals: []
                }
                const bbox1 = node.getBBox()
                // 水平线
                const horizontalInfo = [
                    // 左上 右上 tltr
                    [bbox1.minX, bbox1.minY, bbox1.maxX, bbox1.minY],
                    // 左中 右中 lcrc
                    [bbox1.minX, bbox1.centerY, bbox1.maxX, bbox1.centerY],
                    // 左下 右下 blbr
                    [bbox1.minX, bbox1.maxY, bbox1.maxX, bbox1.maxY]
                ]
                // 垂直线
                const verticalInfo = [
                    // 左上 左下 tlbl
                    [bbox1.minX, bbox1.minY, bbox1.minX, bbox1.maxY],
                    // 上中 下中 tcbc
                    [bbox1.centerX, bbox1.minY, bbox1.centerX, bbox1.maxY],
                    // 上右 下右 trbr
                    [bbox1.maxX, bbox1.minY, bbox1.maxX, bbox1.maxY]
                ]
                horizontalInfo.forEach(line => {
                    horizontalLines.push(this.getDistance(line, ct))
                    horizontalLines.push(this.getDistance(line, cc))
                    horizontalLines.push(this.getDistance(line, cb))
                })
                verticalInfo.forEach(line => {
                    verticalLines.push(this.getDistance(line, lc))
                    verticalLines.push(this.getDistance(line, cc))
                    verticalLines.push(this.getDistance(line, rc))
                })
                horizontalLines.sort((a, b) => a.dis - b.dis)
                verticalLines.sort((a, b) => a.dis - b.dis)
                // 过滤掉距离为0的线条
                horizontalLines = horizontalLines.filter(lineItem => lineItem.dis !== 0)
                if (horizontalLines.length && horizontalLines[0].dis < this.maxDistance) {
                    // 取前3个距离相等的线条
                    for (let i = 0; i < 3; i++) {
                        if (horizontalLines[0].dis === horizontalLines[i].dis) {
                            info.horizontals.push(horizontalLines[i])
                        }
                    }
                }
                // 过滤掉距离为0的线条
                verticalLines = verticalLines.filter(lineItem => lineItem.dis !== 0)
                if (verticalLines.length && verticalLines[0].dis < this.maxDistance) {
                    // 取前3个距离相等的线条
                    for (let i = 0; i < 3; i++) {
                        if (verticalLines[0].dis === verticalLines[i].dis) {
                            info.verticals.push(verticalLines[i])
                        }
                    }
                }
                // 添加对齐线
                const group = this.graph.get('group')
                // 对齐线样式
                const lineStyle = this.alignLineStyle;
                // 处理水平线
                if (info.horizontals.length) {
                    info.horizontals.forEach(lineObj => {
                        const line = lineObj.line
                        const point = lineObj.point
                        const lineHalf = (line[0] + line[2]) / 2
                        let x1
                        let x2
                        if (point.x < lineHalf) {
                            x1 = point.x - bbox.width / 2
                            x2 = Math.max(line[0], line[2])
                        } else {
                            x1 = point.x + bbox.width / 2
                            x2 = Math.min(line[0], line[2])
                        }
                        const shape = group.addShape('line', {
                            name: 'alignLineHorizontal',
                            attrs: {
                                x1,
                                y1: line[1],
                                x2,
                                y2: line[1],
                                ...lineStyle
                            },
                            // 是否拾取及触发该元素的交互事件
                            capture: false
                        })
                        this._alignLines.push(shape)
                    })
                }
                // 处理垂直线
                if (info.verticals.length) {
                    info.verticals.forEach(lineObj => {
                        const line = lineObj.line
                        const point = lineObj.point
                        const lineHalf = (line[1] + line[3]) / 2
                        let y1
                        let y2
                        if (point.y < lineHalf) {
                            y1 = point.y - bbox.height / 2
                            y2 = Math.max(line[1], line[3])
                        } else {
                            y1 = point.y + bbox.height / 2
                            y2 = Math.min(line[1], line[3])
                        }
                        const shape = group.addShape('line', {
                            name: 'alignLineVertical',
                            attrs: {
                                x1: line[0],
                                y1,
                                x2: line[0],
                                y2,
                                ...lineStyle
                            },
                            capture: false
                        })
                        this._alignLines.push(shape)
                    })
                }
            })
        },
        getDistance(line, point) {
            // 归一向量
            function normalize(out, a) {
                const x = a[0]
                const y = a[1]
                let len = x * x + y * y
                if (len > 0) {
                    // TODO: evaluate use of glm_invsqrt here?
                    len = 1 / Math.sqrt(len)
                    out[0] = a[0] * len
                    out[1] = a[1] * len
                }
                return out
            }

            function dot(a, b) {
                return a[0] * b[0] + a[1] * b[1]
            }

            const pointLineDistance = function (lineX1, lineY1, lineX2, lineY2, pointX, pointY) {
                const lineLength = [lineX2 - lineX1, lineY2 - lineY1]
                if (lineLength[0] === 0 && lineLength[1] === 0) {
                    return NaN
                }
                const s = [-lineLength[1], lineLength[0]]
                normalize(s, s)
                return Math.abs(dot([pointX - lineX1, pointY - lineY1], s))
            }
            return {
                line,
                point,
                dis: pointLineDistance(line[0], line[1], line[2], line[3], point.x, point.y)
            }
        },
        _clearAlignLine() {
            each(this._alignLines, (line) => {
                line.remove();
            });
            this._alignLines = [];
            this.graph.paint();
        },
        _updateCommand(item) {
            if (this.graph.executeCommand) {
                this.graph.executeCommand('update', {
                    itemId: item.get('id'),
                    updateModel: Object.assign({}, item.getModel()),
                    originModel: Object.assign({}, this.originModel)
                });
            }
        }
    });
}
