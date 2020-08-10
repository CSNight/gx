<template>
    <div :class="classObj" class="app-wrapper">
        <context-menu ref="contextMenu"/>
        <sidebar ref="sidebar" class="sidebar-container"/>
        <div class="main-container">
            <navbar ref="topBar"/>
            <section class="app-main">
                <div id="flowChart" style="position: relative;box-shadow: 0 0 10px 4px rgba(0,0,0,0.1)"></div>
            </section>
        </div>
    </div>
</template>

<script>
import Sidebar from './sider/SideBar'
import Navbar from "./toolbar/Navbar";
import ContextMenu from "./context/ContextMenu";
import {mapMutations} from "vuex";
import G6 from '@antv/g6/lib';
import registerBehavior from '@/components/behavior'
import registerShape from '@/components/shape'
import Grid from "@antv/g6/lib/plugins/grid";
import Command from "@/components/plugins/Command";
import ContextMenuPlugin from "@/components/plugins/ContextMenu";
import EditorWrapper from "@/components/plugins/EditorWrapper";
import ToolBar from "@/components/plugins/ToolBar";
import {EdgeTooltip, NodeTooltip} from "@/components/behavior/tooltip";

export default {
    name: "Index",
    data() {
        return {
            globalNet: null,
            initData: {
                // 点集
                nodes: [{
                    id: 'node1', // 节点的唯一标识
                    type: 'task-node',
                    x: 100,      // 节点横坐标
                    y: 200,      // 节点纵坐标
                    label: '起始点', // 节点文本
                    meta: {a: '111'}
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
                    {
                        source: 'node1',  // 起始点 id
                        target: 'node2',  // 目标点 id
                        label: '我是连线',   // 边的文本
                        type: 'flow-poly-round'
                    }
                ]
            }
        }
    },
    created() {
        this.$nextTick(() => {
            this.init();
        })
    },
    components: {
        ContextMenu,
        Navbar,
        Sidebar,
    },
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation
            }
        },
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
            registerBehavior(G6);
            registerShape(G6)
            let plugins = this.initPlugins();
            this.globalNet = new G6.Graph({
                container: 'flowChart',      // 容器ID
                modes: {
                    brush: [this.initBrushBehavior()],
                    edit: ['drag-canvas', NodeTooltip, EdgeTooltip, 'drag-node', 'itemAlign', 'deleteItem', 'contextMenu', 'hoverAnchorActivated',
                        'hoverNodeActivated', 'zoom-canvas', 'clickSelected', 'dragEdge', 'dragAddNode']
                },
                plugins: plugins,
                width: this.containerWidth,
                height: this.containerHeight,
                fitView: true,
                fitCenter: true,
                animate: true
            });
            this.globalNet.data(this.initData);
            this.globalNet.render();
            this.globalNet.zoomTo(1);
            this.globalNet.setMode('edit')
            window.addEventListener("resize", () => {
                this.resizeFunc(this)
            });
            this.SET_GRAPH(this.globalNet)
        },
        initPlugins() {
            const grid = new Grid();
            const editorWrapper = new EditorWrapper({container: this.$el});
            const command = new Command();
            const contextMenu = new ContextMenuPlugin({
                container: this.$refs.contextMenu.$el,
                contextCom: this.$refs.contextMenu
            });
            const toolbar = new ToolBar({
                container: this.$refs.topBar.$refs.toolPanel.$el,
                toolbarCom: this.$refs.topBar.$refs.toolPanel
            });
            return [grid, editorWrapper, command, toolbar, contextMenu]
        },
        initBrushBehavior() {
            return {
                type: 'brush-select',
                trigger: 'ctrl',
                onSelect: (selectedNodes) => {
                    this.globalNet.setMode('edit')
                    let selectedItems = [];
                    for (let i = 0; i < selectedNodes.length; i++) {
                        selectedItems.push(selectedNodes[i].get('id'))
                    }
                    this.globalNet.set('selectedItems', selectedItems);
                    this.globalNet.emit('afteritemselected', selectedItems);
                }
            }
        },
        resizeFunc() {
            this.globalNet.changeSize(document.querySelector('.app-main').offsetWidth - 100, document.querySelector('.app-main').offsetHeight - 100);
        }
    }, beforeDestroy() {
        window.removeEventListener("resize", this.resizeFunc);
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
}

.fixed-header + .app-main {
    padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
}
</style>
<style>
.g6-component-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0 0 10px;
}

.tooltip-type {
    padding: 0;
    margin: 0;
}

.tooltip-id {
    color: #531dab;
}
</style>