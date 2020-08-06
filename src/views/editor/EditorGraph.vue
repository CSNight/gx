<template>
    <div id="flowChart" style="position: relative"></div>
</template>

<script>
import G6 from "@antv/g6";
import Grid from "@antv/g6/lib/plugins/grid";
import EditorWrapper from "@/components/plugins/EditorWrapper";
import registerBehavior from '../../components/behavior'
import registerShape from '../../components/shape'

export default {
    name: "EditorGraph",
    data() {
        return {
            globalNet: null,
        }
    },
    created() {
        this.$nextTick(() => {
            this.init();
        })
    },
    methods: {
        init() {
            const initData = {
                // 点集
                nodes: [{
                    id: 'node1', // 节点的唯一标识
                    
                    type: 'task-node',
                    x: 100,      // 节点横坐标
                    y: 200,      // 节点纵坐标
                    label: '起始点' // 节点文本
                }, {
                    id: 'node2',
                    
                    type: 'task-node',
                    x: 300,
                    y: 200,
                    label: '目标点'
                }],
                // 边集
                edges: [
                    // 表示一条从 node1 节点连接到 node2 节点的边
                    {
                        source: 'node1',  // 起始点 id
                        target: 'node2',  // 目标点 id
                        label: '我是连线',   // 边的文本
                        type: 'flow-polyline-round'
                    }
                ]
            };
            registerBehavior(G6);
            registerShape(G6)
            const grid = new Grid();
            const editorWrapper = new EditorWrapper({container: this.$el});
            this.globalNet = new G6.Graph({
                container: 'flowChart',      // 容器ID
                modes: {
                    edit: ['drag-canvas', 'hoverAnchorActivated', 'hoverNodeActivated', 'zoom-canvas','clickSelected','dragEdge']  // 允许拖拽画布、放缩画布、拖拽节点
                },
                mode: 'edit',
                plugins: [grid, editorWrapper],
                width: this.$parent.$el.clientWidth,
                height: this.$parent.$el.clientHeight - 10,
                animate: true,
                fitView: true
            });
            this.globalNet.data(initData);
            this.globalNet.render();
            this.globalNet.zoomTo(1);
            this.globalNet.setMode('edit')
            window.addEventListener("resize", this.resizeFunc);
        },
        resizeFunc: () => {
            this.globalNet.changeSize(this.$parent.$el.clientWidth, this.$parent.$el.clientHeight - 10);
        }
    }, beforeDestroy() {
        window.removeEventListener("resize", this.resizeFunc);
    }
}
</script>

<style scoped>

</style>