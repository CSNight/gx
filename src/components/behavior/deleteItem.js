export default function (G6) {
    G6.registerBehavior('deleteItem', {
        getEvents() {
            return {
                'keydown': 'onKeydown',
                'canvas:mouseleave': 'onCanvasLeave',
                'canvas:mouseenter': 'onCanvasFocus',
            }
        },
        onKeydown(e) {
            console.log(e)
            const items = this.graph.get('selectedItems');
            const focus = this.graph.get('focusGraphWrapper');
            if (e.keyCode === 46 && items && items.length > 0 && focus) {
                this.graph.remove(items[0]);
                this.graph.set('selectedItems', []);
                this.graph.emit('afteritemselected', []);
            }
        },
        onCanvasLeave() {
            this.graph.set('focusGraphWrapper', false);
        },
        onCanvasFocus() {
            this.graph.set('focusGraphWrapper', true);
        }
    });
}
