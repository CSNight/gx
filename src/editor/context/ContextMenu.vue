<template>
    <div class="contextMenu" v-show="isShow" :style="contextMenuStyle" @click.stop.prevent>
        <div v-show="item.show" v-for="(item) in contextMenuList" :key="item.cmd"
             :class="'menu-item '+(item.state?'':'disabled')"
             :tool-click="item.cmd">
            <span :class="'item-icon '+item.icon"/>
            <span class="item-label">{{ item.label }}</span>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "ContextMenu",
    data() {
        return {
            isShow: false,
            options: null,
            menuState: {
                node: ['copy', 'paste', 'editDetail', 'delete', 'toFront', 'toBack'],
                edge: ['editDetail', 'delete', 'toFront', 'toBack'],
                root: ['paste', 'zoomIn', 'zoomOut', 'autoFit', 'resetZoom'],
            },
            contextMenuStyle: {},
            contextMenuList: {
                copy: {
                    cmd: 'copy', icon: 'iconfont icon-copy-o', label: '复制', state: true, show: true
                }, paste: {
                    cmd: 'paste', icon: 'iconfont icon-paster-o', label: '粘贴', state: true, show: true
                }, editDetail: {
                    cmd: 'editDetail', icon: 'el-icon-edit', label: '编辑', state: true, show: true
                }, delete: {
                    cmd: 'delete', icon: 'iconfont icon-delete-o', label: '删除', state: true, show: true
                }, toFront: {
                    cmd: 'toFront', icon: 'iconfont icon-to-front', label: '上移', state: true, show: true
                }, toBack: {
                    cmd: 'toBack', icon: 'iconfont icon-to-back', label: '下移', state: true, show: true
                }, zoomIn: {
                    cmd: 'zoomIn', icon: 'iconfont icon-zoom-in-o', label: '放大', state: true, show: true
                }, zoomOut: {
                    cmd: 'zoomOut', icon: 'iconfont icon-zoom-out-o', label: '缩小', state: true, show: true
                }, autoFit: {
                    cmd: 'autoFit', icon: 'iconfont icon-fit', label: '适应屏幕', state: true, show: true
                }, resetZoom: {
                    cmd: 'resetZoom', icon: 'iconfont icon-actual-size-o', label: '重置画布', state: true, show: true
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'sidebar', 'globalGraph'
        ])
    },
    methods: {
        doShow(data) {
            this.options = data
            this.handleContextList()
            // 处理样式
            this.handleContextMenuStyle()
            this.isShow = true
        },
        doHide() {
            this.options = null
            this.isShow = false
        },
        handleContextList() {
            let contextList = this.menuState[this.options.type] || [];
            for (let key in this.contextMenuList) {
                this.contextMenuList[key].show = contextList.indexOf(key) !== -1;
            }
        },
        handleContextMenuStyle() {
            const style = {}
            if (!this.options) {
                return style
            }
            this.$nextTick(() => {
                const x = this.options.x !== undefined ? (parseInt(this.options.x) > 0 ? parseInt(this.options.x) : 0) : 0
                const y = this.options.y !== undefined ? (parseInt(this.options.y) > 0 ? parseInt(this.options.y) : 0) : 0
                const winHeight = this.$parent.$el.clientHeight
                const winWidth = this.$parent.$el.clientWidth
                const elHeight = this.$el.clientHeight
                const elWidth = this.$el.clientWidth
                if (x + elWidth > winWidth) {
                    style['right'] = '10px'
                } else {
                    style['left'] = x + 10 + 'px'
                }
                if (y + elHeight > winHeight) {
                    style['bottom'] = '42px'
                } else {
                    style['top'] = y + 10 + 'px'
                }
                this.contextMenuStyle = style
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.contextMenu {
    position: absolute;
    min-width: 150px;
    width: auto !important;
    z-index: 9999;
    background: #FFF;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
    padding: 5px 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: flex-start;
    flex-direction: column;
    
    .menu-item {
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        opacity: .6;
        margin: 0 2px;
        
        text-align: left;
        min-width: 100px;
        cursor: pointer;
        
        &:hover {
            color: #233657;
            background: rgba(0, 0, 0, .1);
            
            .tool-box {
                visibility: visible;
            }
        }
        
        &.active {
            opacity: 1;
        }
        
        &.disabled {
            cursor: not-allowed;
            
            .item-icon {
                color: #ccc
            }
            
            .item-label {
                color: #ccc
            }
        }
        
        .item-icon {
            color: #233657;
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 1;
        }
        
        .item-label {
            color: #233657;
            flex: 1 1 auto;
            font-size: 14px;
            margin: 0 10px;
            line-height: 1;
            min-width: 60px;
            white-space: nowrap;
        }
    }
}
</style>