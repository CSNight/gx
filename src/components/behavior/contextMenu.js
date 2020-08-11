import Node from "@antv/g6/lib/item/node";
import Edge from "@antv/g6/lib/item/edge";

export default function (G6) {
    G6.registerBehavior('contextMenu', {
        getDefaultCfg() {
            return {
                multiple: false,
            }
        },
        getEvents() {
            return {
                'node:contextmenu': 'onContextMenu',
                'edge:contextmenu': 'onContextMenu',
                'canvas:contextmenu': 'onContextMenu',
                'node:click': 'onCloseContextMenu',
                'edge:click': 'onCloseContextMenu',
                'node:dragstart': 'onCloseContextMenu',
                'edge:dragstart': 'onCloseContextMenu',
                'canvas:click': 'onCloseContextMenu',
                'canvas:dragstart': 'onCloseContextMenu',
                'wheel': 'onCloseContextMenu',
                'anchor:dragstart': 'onCloseContextMenu'
            }
        },
        onContextMenu(e) {
            e.preventDefault();
            let evt = {
                target: e.target,
                item: e.item,
                type: null,
                eqt: true,//是否在选中对象上打开右键菜单
                x: e.clientX,
                y: e.clientY,
                canvasX: e.canvasX,
                canvasY: e.canvasY
            }
            const items = this.graph.get('selectedItems');
            if (items && items.length > 0) {
                if (e.item && items.indexOf(e.item.get('id')) === -1) {
                    evt.eqt = false;
                }
            }
            if (!e.item) {
                evt.type = 'root'
            } else if (e.item instanceof Node) {
                evt.type = 'node'
            } else if (e.item instanceof Edge) {
                evt.type = 'edge'
            }
            if (evt.eqt) {
                this.graph.emit('editor:contextmenu:open', evt)
            } else {
                this.graph.emit('editor:contextmenu:close')
            }
        },
        onCloseContextMenu(e) {
            e.preventDefault();
            this.graph.emit('editor:contextmenu:close')
        }
    });
}