<template>
    <div id="flowChart" style="position: relative;box-shadow: 0 0 10px 4px rgba(0,0,0,0.1)"></div>
</template>

<script>
import G6 from '@antv/g6/lib';
import Grid from "@antv/g6/lib/plugins/grid";
import EditorWrapper from "@/components/plugins/EditorWrapper";
import registerBehavior from '../../components/behavior'
import registerShape from '../../components/shape'
import {mapMutations} from "vuex";
import ToolBar from "@/components/plugins/ToolBar";
import Command from "@/components/plugins/Command";
import ContextMenu from "@/components/plugins/ContextMenu";

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
    computed: {
        containerWidth: () => {
            return document.querySelector('.app-main').offsetWidth - 100
        },
        containerHeight: () => {
            return document.querySelector('.app-main').offsetHeight - 100
        },
    },
    methods: {
        ...mapMutations('app', ['SET_GRAPH']),
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
                    // // 表示一条从 node1 节点连接到 node2 节点的边
                    // {
                    //     source: 'node1',  // 起始点 id
                    //     target: 'node2',  // 目标点 id
                    //     label: '我是连线',   // 边的文本
                    //     type: 'flow-polyline-round'
                    // }
                ]
            };
            registerBehavior(G6);
            registerShape(G6)
            const grid = new Grid();
            const editorWrapper = new EditorWrapper({container: this.$el});
            const command = new Command();
            const contextMenu = new ContextMenu({
                container: this.$parent.$refs.contextMenu.$el,
                contextCom: this.$parent.$refs.contextMenu
            })
            const toolbar = new ToolBar({
                container: this.$parent.$refs.topBar.$refs.toolPanel.$el,
                toolbarCom: this.$parent.$refs.topBar.$refs.toolPanel
            })
            this.globalNet = new G6.Graph({
                container: 'flowChart',      // 容器ID
                modes: {
                    brush: ['brush-select'],
                    edit: ['drag-canvas', 'drag-node', 'itemAlign', 'deleteItem', 'contextMenu', 'hoverAnchorActivated', 'hoverNodeActivated', 'zoom-canvas', 'clickSelected', 'dragEdge']  // 允许拖拽画布、放缩画布、拖拽节点
                },
                mode: 'edit',
                plugins: [grid, editorWrapper, command, toolbar, contextMenu],
                width: this.containerWidth,
                height: this.containerHeight,
                animate: true,
                fitView: true
            });
            this.globalNet.data(initData);
            this.globalNet.render();
            this.globalNet.zoomTo(1);
            this.globalNet.setMode('edit')
            window.addEventListener("resize", () => {
                this.resizeFunc(this)
            });
            this.SET_GRAPH(this.globalNet)
        },
        resizeFunc() {
            this.globalNet.changeSize(document.querySelector('.app-main').offsetWidth - 100, document.querySelector('.app-main').offsetHeight - 100);
        }
    }, beforeDestroy() {
        window.removeEventListener("resize", this.resizeFunc);
    }
}
</script>

<style scoped>

</style>