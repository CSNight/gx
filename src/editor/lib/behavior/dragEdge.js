import editorStyle from "../../utils/defaultStyle";
import {Marker} from '@antv/g-canvas/lib/shape';
import {guid2} from "../../utils/utils";

export default function (G6) {
    G6.registerBehavior('dragEdge', {
        getDefaultCfg() {
            return {
                updateEdge: true,
                delegate: true,
                delegateStyle: {},
                dragEdge: false,
            };
        },
        getEvents() {
            return {
                'anchor:dragstart': 'onDragStart',
                'anchor:drag': 'onDrag',
                'anchor:dragend': 'onDragEnd',
                'anchor:dragenter': 'onDragEnter',
                'anchor:dragleave': 'onDragLeave',
            };
        },
        onDragEnter(e) {
            if (!this.origin) {
                return;
            }
            if (!this.sameNode(e)) {
                e.item.setHotspotActivated(true);
                this.origin.targetNode = e.target.getParent().getParent().get('item');
                this.origin.targetAnchor = e.item.get('index');
            }
        },
        onDragLeave(e) {
            if (!this.origin) {
                return;
            }
            if (!this.sameNode(e)) {
                e.item.setHotspotActivated(false);
                this.origin.targetNode = null;
                this.origin.targetAnchor = null;
            }
        },
        onDragStart(e) {
            const node = e.target.getParent().getParent().get('item');
            const anchorIndex = e.item.get('index');
            const point = node.getAnchorPoints()[anchorIndex];
            this.target = e.item;
            this.origin = {
                x: point.x,
                y: point.y,
                sourceNode: node,
                sourceAnchor: anchorIndex
            };
            this.dragEdgeBeforeShowAnchor();
            this.graph.set('edgeDragging', true);
        },
        onDrag(e) {
            if (!this.origin) {
                return;
            }
            this._updateEdge(this.target, e);
        },
        onDragEnd(e) {
            if (!this.origin) {
                return;
            }
            const delegateShape = e.item.get('edgeDelegate');
            if (delegateShape) {
                delegateShape.remove();
                this.target.set('edgeDelegate', null);
            }
            this._updateEdge(this.target, e, true);
            this.graph.setItemState(this.origin.sourceNode, 'show-anchor', false);
            this.target = null;
            this.origin = null;
            this.graph.set('edgeDragging', false);
        },
        sameNode(e) {
            return e.target instanceof Marker && e.target.getParent() && e.target.getParent().getParent().get('item').get('id') === this.origin.sourceNode.get('id')
        },
        dragEdgeBeforeShowAnchor() {
            const sourceGroupId = this.origin.sourceNode.getModel().groupId;
            this.graph.getNodes().forEach(node => {
                const targetGroupId = node.getModel().groupId;
                if (!sourceGroupId && targetGroupId || sourceGroupId && !targetGroupId || sourceGroupId !== targetGroupId)
                    return;
                const group = node.getContainer();
                group.showAnchor();
                group.anchorShapes.forEach(a => a.get('item').showHotpot())
            });
        },
        _updateEdge(item, e, force) {
            const x = e.x;
            const y = e.y;
            if (this.delegate && !force) {
                this._updateEdgeDelegate(item, x, y);
                return;
            }
            this._addEdge();
            this._clearAllAnchor();
            this.graph.paint();
        },
        _updateEdgeDelegate(item, x, y) {
            const self = this;
            let edgeShape = item.get('edgeDelegate');
            if (!edgeShape) {
                const parent = self.graph.get('group');
                edgeShape = parent.addShape('line', {
                    attrs: {
                        x1: this.origin.x,
                        y1: this.origin.y,
                        x2: x,
                        y2: y,
                        ...editorStyle.edgeDelegationStyle,
                    }
                });
                edgeShape.set('capture', false);
                item.set('edgeDelegate', edgeShape);
            }
            edgeShape.attr({x2: x, y2: y});
            this.graph.paint();
        },
        _clearAllAnchor() {
            this.graph.getNodes().forEach(node => {
                const group = node.getContainer();
                group.clearAnchor();
            });
        },
        _addEdge() {
            let selectedEdgeDom = document.querySelector(".el-radio .is-checked>input")
            let edgeType = selectedEdgeDom ? selectedEdgeDom.value : "flow-poly-round"
            if (this.origin.targetNode) {
                const addModel = {
                    id: 'flow$' + guid2(),
                    type: edgeType,
                    source: this.origin.sourceNode.get('id'),
                    target: this.origin.targetNode.get('id'),
                    sourceAnchor: this.origin.sourceAnchor,
                    targetAnchor: this.origin.targetAnchor,
                };
                if (this.graph.executeCommand) {
                    this.graph.executeCommand('add', {
                        type: 'edge',
                        addModel: addModel
                    });
                } else {
                    this.graph.addItem('edge', addModel);
                }
                
            }
        }
    });
}
