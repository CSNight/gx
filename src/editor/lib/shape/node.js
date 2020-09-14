import editorStyle from "../../utils/defaultStyle";
import Anchor from '../item/anchor';
import {merge} from "lodash";
import G6 from '@antv/g6/lib'

const dashArray = [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 1, 2],
    [0, 2, 1, 2],
    [1, 2, 1, 2],
    [2, 2, 1, 2],
    [3, 2, 1, 2],
    [4, 2, 1, 2]
];
const interval = 9;
const lineDash = [4, 2, 1, 2];

export default function (_userCfg) {
    G6.registerNode(_userCfg.name, {
        options: {
            icon: _userCfg.icon,
            labelCfg: _userCfg.labelCfg,
            label: _userCfg.label,
            style: {
                ..._userCfg.style,
                cursor: 'default',
            },
            stateStyles: {
                hover: {
                    cursor: editorStyle.cursor.hoverNode,
                }
            }
        },
        shapeType: _userCfg.shape_base === 'image' ? 'image' : _userCfg.key_shape,
        getShapeStyle: function (cfg) {
            const width = cfg.size && (cfg.size instanceof Array) ? cfg.size[0] : this.options.style.width;
            const height = (cfg.size && (cfg.size instanceof Array) && cfg.size.length > 1) ? cfg.size[1] : this.options.style.height;
            let model = {
                x: 0 - width / 2,
                y: 0 - height / 2,
                width,
                height,
                ...this.options.style,
            };
            if (_userCfg.key_shape === 'path') {
                try {
                    model.path = JSON.parse(this.options.style.path || '[]');
                } catch (e) {
                    model.path = [];
                }
            }
            switch (_userCfg.shape_base) {
                case"circle":
                    model.r = width / 2
                    break;
                case"diamond":
                    model.path = this.getDiamondPath(width, height)
                    break;
                case"triangle":
                    model.path = this.getTrianglePath(width, height)
                    break;
                case"star":
                    model.path = this.getStarPath(width)
                    break;
                case"image":
                    cfg.clipCfg = {show: false}
                    cfg.img = this.options.style.imgLogo;
                    model.img = this.options.style.imgLogo;
                    break;
                case"ellipse":
                    model.rx = width / 2;
                    model.ry = height / 2;
                    break;
                case"modelRect":
                    cfg.labelCfg = merge({style: {fill: '#595959', fontSize: 14}, offset: 0}, this.options.labelCfg);
                    cfg.descriptionCfg = merge({
                        style: {fill: '#595959', fontSize: 14},
                        offset: 0
                    }, this.options.labelCfg);
                    cfg.preRect = {
                        show: true, width: 4, fill: '#40a9ff', radius: 2
                    }
                    // 节点中icon配置
                    cfg.logoIcon = {
                        // 是否显示icon，值为 false 则不渲染icon
                        show: true, x: -width / 2 + 4, y: 0,
                        img: this.options.style.imgLogo,
                        width: 16, height: 16, offset: 0
                    }
                    // 节点中表示状态的icon配置
                    cfg.stateIcon = {
                        // 是否显示icon，值为 false 则不渲染icon
                        show: true, x: width / 2 - 20, y: 0,
                        // icon的地址，字符串类型
                        img: this.options.style.imgState,
                        width: 16, height: 16, offset: -5
                    };
                    break;
            }
            return model;
        },
        setState(name, value, item) {
            const group = item.getContainer();
            if (name === 'show-anchor') {
                if (value) {
                    group.showAnchor();
                } else {
                    group.clearAnchor();
                }
            } else if (name === 'selected') {
                const rect = group.getChildByIndex(0);
                if (value) {
                    rect.attr('fill', this.options.style.selectFillColor);
                } else {
                    rect.attr('fill', item.get('model').style.fill || this.options.style.fill);
                }
            } else if (name === 'hover') {
                const rect = group.getChildByIndex(0);
                const text = group.getChildByIndex(1);
                if (value) {
                    rect.attr('cursor', this.options.stateStyles.hover.cursor);
                    if (text)
                        text.attr('cursor', this.options.stateStyles.hover.cursor);
                } else {
                    rect.attr('cursor', this.options.style.cursor);
                    if (text)
                        text.attr('cursor', this.options.style.cursor);
                }
            }
        },
        getDiamondPath(w, h) {
            const width = w || 40;
            const height = h || 40;
            //  / 1 \
            // 4     2
            //  \ 3 /
            return [
                ['M', 0, 0 - height / 2], // Top
                ['L', width / 2, 0], // Right
                ['L', 0, height / 2], // Bottom
                ['L', -width / 2, 0], // Left
                ['Z'], // Close the path
            ];
        },
        getTrianglePath(w, h) {
            const width = w || 40;
            const height = h || 40;
            //  / 1 \
            // 2  —— 3
            return [
                ['M', 0, 0 - height / 2], // Top
                ['L', width / 2, 0], // Right
                ['L', 0, height / 2], // Bottom
                ['Z'], // Close the path
            ];
        },
        getStarPath: function getPath(w) {
            let outerR = w / 2;
            let innerR = outerR * 3 / 8
            let path = [];
            
            for (let i = 0; i < 5; i++) {
                let x1 = Math.cos((18 + 72 * i) / 180 * Math.PI) * outerR;
                let y1 = Math.sin((18 + 72 * i) / 180 * Math.PI) * outerR;
                let x2 = Math.cos((54 + 72 * i) / 180 * Math.PI) * innerR;
                let y2 = Math.sin((54 + 72 * i) / 180 * Math.PI) * innerR;
                
                if (i === 0) {
                    path.push(['M', x1, -y1]);
                } else {
                    path.push(['L', x1, -y1]);
                }
                
                path.push(['L', x2, -y2]);
            }
            
            path.push(['Z']);
            return path;
        },
        drawIcon(cfg, group) {
            let style = this.getShapeStyle(cfg);
            if (this.options.icon) {
                let attrs = {
                    x: style.x + this.options.iconStyle.left,
                    y: style.y + this.options.iconStyle.top,
                    width: this.options.iconStyle.width,
                    height: this.options.iconStyle.height,
                };
                if (this.shapeType === 'circle') {
                    attrs = {
                        x: style.x - style.r + this.options.iconStyle.left,
                        y: style.y - style.r + this.options.iconStyle.top,
                        width: this.options.iconStyle.width,
                        height: this.options.iconStyle.height,
                    }
                } else if (this.shapeType === 'path') {
                    attrs = {
                        x: this.options.iconStyle.left,
                        y: this.options.iconStyle.top,
                        width: this.options.iconStyle.width,
                        height: this.options.iconStyle.height,
                    }
                }
                group.icon = group.addShape('image', {
                    attrs: {
                        img: this.options.icon,
                        ...attrs,
                    },
                    draggable: true,
                });
                if (cfg.hideIcon) {
                    group.icon.hide();
                }
            }
        },
        getAnchorPoints() {
            switch (_userCfg.shape_base) {
                case"circle":
                case"single-node":
                case"rect":
                case"modelRect":
                case"diamond":
                case"ellipse":
                default:
                    return [
                        [0.5, 0], // top
                        [1, 0.5], // right
                        [0.5, 1], // bottom
                        [0, 0.5], // left
                    ]
                case"triangle":
                    return [
                        [1, 0.5],
                        [0, 0.5]
                    ]
            }
        },
        drawAnchor(group) {
            const bbox = group.get('children')[0].getBBox();
            this.getAnchorPoints().forEach((p, i) => {
                const anchorContainer = group.addGroup();
                new Anchor({
                    group: anchorContainer,
                    index: i,
                    model: {
                        style: {
                            x: bbox.minX + bbox.width * p[0],
                            y: bbox.minY + bbox.height * p[1]
                        }
                    }
                });
                group.anchorShapes.push(anchorContainer);
            });
        },
        initAnchor(group) {
            group.anchorShapes = [];
            group.showAnchor = () => {
                this.drawAnchor(group);
            };
            group.getAllAnchors = () => {
                return group.anchorShapes.map(c => {
                    c.filter(a => a.isAnchor)
                })
            };
            group.getAnchor = (i) => {
                return group.anchorShapes.filter(a => a.get('index') === i)
            };
            group.clearAnchor = () => {
                group.anchorShapes && group.anchorShapes.forEach(a => a.remove());
                group.anchorShapes = [];
            };
            group.clearHotpotActivated = () => {
                group.anchorShapes && group.anchorShapes.forEach(a => {
                    if (a.isAnchor)
                        a.setHotspotActivated(false);
                });
            };
        },
        runAnimate(cfg, group) {
            if (cfg.active) {
                let totalArray = [];
                let index = 0;
                const shape = group.getFirst();
                shape.animate(
                    () => {
                        for (let i = 0; i < 9; i += interval) {
                            totalArray = totalArray.concat(lineDash);
                        }
                        const cfg = {
                            lineDash: dashArray[index].concat(totalArray)
                        };
                        index = (index + 1) % interval;
                        return cfg;
                    },
                    {
                        repeat: true,
                        duration: 5000
                    });
            }
        },
        afterDraw(cfg, group) {
            this.drawIcon(cfg, group);
            this.initAnchor(group);
            this.runAnimate(cfg, group);
        },
        afterUpdate(cfg, group) {
            const icon = group.get('group').icon;
            if (cfg.hideIcon && icon && icon.get('visible')) {
                icon.hide();
            } else if (!cfg.hideIcon && icon && !icon.get('visible')) {
                icon.show();
            }
        },
    }, _userCfg.shape_base)
}
