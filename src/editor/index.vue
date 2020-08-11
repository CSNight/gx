<template>
    <div :class="classObj" class="app-wrapper">
        <context-menu ref="contextMenu"/>
        <div class="sidebar-container" :class="{'has-logo':showLogo}">
            <div v-if="showLogo" class="sidebar-logo-container" :class="{'collapse':isCollapse}">
                <transition name="sidebarLogoFade">
                    <div v-if="isCollapse" key="collapse" class="sidebar-logo-link">
                        <img v-if="logo" :src="logo" class="sidebar-logo" alt="">
                        <h1 v-else class="sidebar-title">{{ title }} </h1>
                    </div>
                    <div v-else key="expand" class="sidebar-logo-link">
                        <img v-if="logo" :src="logo" class="sidebar-logo" alt="">
                        <h1 class="sidebar-title">{{ title }} </h1>
                    </div>
                </transition>
            </div>
            <item-panel ref="sidebar" :nodes="nodeShapes" @loadData="loadData"/>
        </div>
        <div class="main-container">
            <navbar ref="topBar"/>
            <section class="app-main">
                <div id="flowChart" style="position: relative;box-shadow: 0 0 10px 4px rgba(0,0,0,0.1)"></div>
            </section>
        </div>
    </div>
</template>

<script>
import ItemPanel from './sider/ItemPanel'
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
            title: 'Oxygen',
            logo: require('../assets/logo.png'),
            globalNet: null,
            nodeShapes: [],
            initData: {
                // 点集
                nodes: [{
                    id: 'node1', // 节点的唯一标识
                    type: 'tk-node',
                    x: 100,      // 节点横坐标
                    y: 200,      // 节点纵坐标
                    label: '起始点', // 节点文本
                    meta: {a: '111'}
                }, {
                    id: 'node2',
                    type: 'tk-node',
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
            this.nodeShapes.push(1)
        })
    },
    components: {
        ContextMenu,
        Navbar,
        ItemPanel,
    },
    watch: {
        nodeShapes: {
            handler: function (val) {
                if (val && val.length > 0) {
                    this.init();
                }
            }
        }
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
        showLogo() {
            return true
        },
        isCollapse() {
            return !this.sidebar.opened
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
            console.log('initializing graph editor')
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
            this.globalNet.render();
            this.globalNet.zoomTo(1);
            this.globalNet.setMode('edit')
            window.addEventListener("resize", () => {
                this.resizeFunc(this)
            });
            this.globalNet.on('editor:contextmenu:open', this.$refs.contextMenu.doShow)
            this.globalNet.on('editor:contextmenu:close', this.$refs.contextMenu.doHide)
            this.SET_GRAPH(this.globalNet)
        },
        initPlugins() {
            console.log('initializing graph plugins')
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
                onSelect: (selectedNodes, selectedEdges) => {
                    this.globalNet.setMode('edit')
                    let selectedItems = [];
                    for (let i = 0; i < selectedNodes.length; i++) {
                        selectedItems.push(selectedNodes[i].get('id'))
                    }
                    for (let i = 0; i < selectedEdges.length; i++) {
                        selectedItems.push(selectedEdges[i].get('id'))
                    }
                    this.globalNet.set('selectedItems', selectedItems);
                    this.globalNet.emit('afteritemselected', selectedItems);
                }
            }
        },
        loadData() {
            console.log('loading data')
            setTimeout(() => {
                this.globalNet.changeData(this.initData);
            }, 3000);
            this.$emit('loadData', this.globalNet)
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

.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #233657;
    text-align: center;
    overflow: hidden;
    
    & .sidebar-logo-link {
        height: 100%;
        width: 100%;
        
        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }
        
        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 50px;
            font-size: 20px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }
    
    &.collapse {
        .sidebar-logo {
            margin-right: 0;
        }
    }
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