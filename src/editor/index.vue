<template>
    <div :class="classObj" class="app-wrapper">
        <context-menu ref="contextMenu"/>
        <div class="sidebar-container has-logo">
            <div class="sidebar-logo-container" :class="{'collapse':isCollapse}">
                <transition name="sidebarLogoFade">
                    <div v-if="isCollapse" class="sidebar-logo-link">
                        <img v-if="logo" :src="logo" class="sidebar-logo" alt="">
                        <h1 v-else class="sidebar-title">{{ title }}</h1>
                    </div>
                    <div v-else class="sidebar-logo-link">
                        <img v-if="logo" :src="logo" class="sidebar-logo" alt="">
                        <h1 class="sidebar-title">{{ title }}</h1>
                    </div>
                </transition>
            </div>
            <item-panel ref="sidebar" :nodes="nodeShapes" :show-label="!isCollapse" @init="initItemPanel"/>
        </div>
        <div class="main-container">
            <ToolbarPanel ref="topBar" :side-bar.sync="sidebar" @toggleSide="toggleSideBar"/>
            <section class="editor-main">
                <div id="flowChart" style="position: relative;box-shadow: 0 0 10px 4px rgba(0,0,0,0.1)"></div>
            </section>
            <el-drawer
                v-if="selectedModel!==null"
                title="Model Detail"
                size="25%"
                :visible.sync="showDetail"
                direction="rtl" @save="onItemCfgChange" @cancel="onItemCfgCancel">
                <el-collapse style="height:85%;overflow:auto;" accordion value="1">
                    <el-collapse-item title="基本信息" name="1">
                        <el-form size="mini" label-width="90px">
                            <el-form-item label="模块ID">
                                <el-input readonly v-model="selectedModel.id" style="width: 100%"/>
                            </el-form-item>
                            <el-form-item label="模块名">
                                <el-input v-model="selectedModel.label"/>
                            </el-form-item>
                            <el-form-item label="模块类型">
                                <el-input style="width: 100%" v-if="selectedModel.shapeClazz==='node'" readonly
                                          v-model="selectedModel.type"/>
                                <el-select style="width: 100%" v-else v-model="selectedModel.type">
                                    <el-option v-for="item in edgeFactory" :key="item.name" :value="item.name"
                                               :label="item.label"/>
                                </el-select>
                            </el-form-item>
                            <style-editor :shape-clazz="selectedModel.shapeClazz" v-model="selectedItemStyle"/>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="模块详情" name="2">
                        <slot v-bind="{detail:selectedModel}"></slot>
                    </el-collapse-item>
                </el-collapse>
                <div class="btn">
                    <el-button size="mini" type="primary" @click="onItemCfgChange">Save</el-button>
                    <el-button size="mini" @click="onItemCfgCancel">Cancel</el-button>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
import ItemPanel from './sider/ItemPanel'
import ToolbarPanel from "./toolbar/ToolbarPanel";
import ContextMenu from "./context/ContextMenu";
import StyleEditor from "../editor/components/StyleEditor";
import G6 from '@antv/g6/lib';
import {clone, deepMix, each} from '@antv/util';
import registerBehavior from './lib/behavior'
import registerShape from './lib/shape'
import Grid from "@antv/g6/lib/plugins/grid";
import Command from "./lib/plugins/Command";
import ContextMenuPlugin from "./lib/plugins/ContextMenu";
import EditorWrapper from "./lib/plugins/EditorWrapper";
import ToolBar from "./lib/plugins/ToolBar";
import {EdgeTooltip, NodeTooltip} from "./lib/behavior/tooltip";
import {createDom} from "@antv/dom-util";
import {objDiff} from "../editor/utils/utils";


export default {
    name: "Index",
    data() {
        return {
            title: 'GraphX',
            logo: require('../assets/logo.png'),
            sidebar: true,
            globalNet: null,
            selectedModel: null,
            detailUpdate: false,
            initialized: false,
            selectedItemStyle: null,
            edgeFactory: [],
            nodeFactory: []
        }
    },
    components: {StyleEditor, ContextMenu, ToolbarPanel, ItemPanel},
    props: {
        nodeShapes: {
            type: Array,
            required: true
        },
        modelData: {
            type: Object,
            required: true
        }
    },
    created() {
        this.$nextTick(() => {
            this.init();
        })
    },
    watch: {
        detailUpdate: {
            handler: function (val) {
                if (val) {
                    this.onItemCfgChange();
                    this.detailUpdate = false;
                } else {
                    this.onItemCfgCancel();
                }
            }
        },
        modelData: {
            handler: function (val) {
                console.log("data change")
                if (val && this.initialized) {
                    this.globalNet.changeData(clone(val));
                }
            }
        },
        nodeShapes: {
            handler: function (val) {
                if (val && val.length > 0) {
                    this.updateShapeFactory();
                }
            }
        }
    },
    computed: {
        showDetail: {
            get: function () {
                return this.selectedModel != null;
            },
            set: function (val) {
                if (!val) {
                    this.selectedModel = null
                }
            }
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar,
                openSidebar: this.sidebar,
                withoutAnimation: false
            }
        },
        isCollapse() {
            return !this.sidebar
        },
        containerWidth: () => {
            return document.querySelector('.editor-main').offsetWidth - 100
        },
        containerHeight: () => {
            return document.querySelector('.editor-main').offsetHeight - 100
        },
    },
    methods: {
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
            this.initEvent();
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
                container: this.$refs.topBar.$el,
                toolbarCom: this.$refs.topBar
            });
            return [grid, editorWrapper, command, toolbar, contextMenu]
        },
        initItemPanel() {
            console.log("initialize items plugins and shapes")
            const parentNode = this.$refs.sidebar.$el;
            const ghost = createDom('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"' + ' style="opacity:0" alt=""/>');
            const children = parentNode.querySelectorAll('div[data-item]');
            each(children, (child) => {
                const addModel = (new Function("return " + child.getAttribute('data-item')))();
                child.ondragstart = (e) => {
                    this._dragAddNodeItem(e, ghost, addModel)
                }
                child.ondragend = this._dragEndNodeItem;
            })
            this.initialized = true;
            if (this.modelData) {
                this.globalNet.changeData(clone(this.modelData));
            }
        },
        _dragAddNodeItem(e, ghost, addModel) {
            e.dataTransfer.setDragImage(ghost, 0, 0);
            this.globalNet.set('addNodeDragging', true);
            this.globalNet.set('addModel', addModel);
        },
        _dragEndNodeItem(e) {
            this.globalNet.emit('canvas:mouseup', e);
            this.globalNet.set('addNodeDragging', false);
            this.globalNet.set('addModel', null);
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
        initEvent() {
            this.globalNet.on('editor:contextmenu:open', this.$refs.contextMenu.doShow)
            this.globalNet.on('editor:contextmenu:close', this.$refs.contextMenu.doHide)
            this.globalNet.on('editDetail', (items) => {
                if (items && items.length > 0) {
                    let item = this.globalNet.findById(items[0]);
                    this.selectedModel = deepMix({shapeClazz: item.get('type')}, {...item.getModel()});
                    this.selectedItemStyle = deepMix({}, item.get('originStyle'));
                } else {
                    this.selectedModel = null;
                    this.selectedItemStyle = null;
                }
            });
        },
        onItemCfgChange() {
            this.$confirm('将修改该模块，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const items = this.globalNet.get('selectedItems');
                if (items && items.length > 0) {
                    let item = this.globalNet.findById(items[0]);
                    this.checkStyleChange();
                    if (this.globalNet.executeCommand) {
                        this.globalNet.executeCommand('update', {
                            itemId: items[0],
                            updateModel: {...this.selectedModel}
                        });
                    } else {
                        this.globalNet.updateItem(item, {...this.selectedModel});
                    }
                    this.selectedModel = {...item.getModel()};
                } else {
                    this.$message.warning("未选中任何模块")
                }
            }).catch(() => {

            })
        },
        onItemCfgCancel() {
            this.showDetail = false;
        },
        checkStyleChange() {
            if (this.selectedModel && this.selectedItemStyle) {
                let item = this.globalNet.findById(this.selectedModel.id);
                if (item) {
                    let originStyle = item.get('originStyle')
                    let diff = {};
                    objDiff(this.selectedItemStyle, originStyle, diff)
                    if (diff && Object.keys(diff).length > 0) {
                        this.selectedModel.style = {...diff}
                    }
                }
            }
        },
        updateShapeFactory() {
            this.edgeFactory = [];
            this.nodeFactory = [];
            for (let i = 0; i < this.nodeShapes.length; i++) {
                let shapeDef = this.nodeShapes[i];
                if (shapeDef.shapeType === 'node') {
                    this.nodeFactory.push(shapeDef)
                } else if (shapeDef.shapeType === 'edge') {
                    this.edgeFactory.push(shapeDef)
                }
            }
        },
        resizeFunc() {
            this.globalNet.changeSize(document.querySelector('.editor-main').offsetWidth - 100, document.querySelector('.editor-main').offsetHeight - 100);
        },
        toggleSideBar() {
            this.sidebar = !this.sidebar
            setTimeout(() => {
                this.resizeFunc()
            }, 200)
        },
    }, beforeDestroy() {
        window.removeEventListener("resize", this.resizeFunc);
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__header {
    margin-bottom: 0;
    padding: 10px 20px 0;
}

/deep/ .el-drawer__body {
    overflow: hidden;
    min-height: 100px;
    position: relative;
    padding: 10px;

    .btn {
        margin: 30px;
    }
}

.main-container {
    min-height: 100%;
    transition: margin-left .28s;
    margin-left: 210px;
    position: relative;
}

.sidebar-container {
    transition: width 0.28s;
    width: 210px !important;
    background-color: #fff;
    border-right: 1px solid #ccc;
    height: 100%;
    position: fixed;
    font-size: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    // reset element-ui css
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }

    .el-scrollbar__bar.is-vertical {
        right: 0;
    }

    .el-scrollbar {
        height: 100%;
    }

    &.has-logo {
        .el-scrollbar {
            height: calc(100% - 50px);
        }
    }

    .is-horizontal {
        display: none;
    }

    a {
        display: inline-block;
        width: 100%;
        overflow: hidden;
    }
}

.hideSidebar {
    .sidebar-container {
        width: 50px !important;
    }

    .main-container {
        margin-left: 50px;
    }
}

.withoutAnimation {

    .main-container,
    .sidebar-container {
        transition: none;
    }
}

.editor-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
}

.fixed-header + .editor-main {
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

@mixin clearfix {
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: auto;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 210px);
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}

.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.40em;
    fill: currentColor;
    overflow: hidden;
}

.fa-icon {
    width: 1.5em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
    text-align: center;
}


::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
}

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