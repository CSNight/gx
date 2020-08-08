<template>
    <div class="contextMenu" v-show="isShow" :style="contextMenuStyle" @click.stop.prevent>
        <div class="menu-item">
            <span class="item-icon iconfont icon-copy-o"/>
            <span class="item-label">复制</span>
        </div>
        <div class="menu-item">
            <span class="item-icon iconfont icon-copy-o"/>
            <span class="item-label">复制</span>
        </div>
        <div class="menu-item">
            <span class="item-icon iconfont icon-copy-o"/>
            <span class="item-label">复制</span>
        </div>
        <div class="menu-item">
            <span class="item-icon iconfont icon-copy-o"/>
            <span class="item-label">复制</span>
        </div>
        <div class="menu-item">
            <span class="item-icon iconfont icon-copy-o"/>
            <span class="item-label">复制</span>
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
            contextMenuStyle: {},
            contextMenuList: []
        }
    },
    computed: {
        ...mapGetters([
            'sidebar', 'globalGraph'
        ])
    },
    mounted() {
        this.$nextTick(() => {
            this.globalGraph.on('editor:contextmenu:open', this.doShow)
            this.globalGraph.on('editor:contextmenu:close', this.doHide)
        })
    }, methods: {
        doShow(data) {
            this.options = data
            //_t.handleContextMenuList()
            // 处理样式
            this.handleContextMenuStyle()
            this.isShow = true
        },
        doHide() {
            this.options = null
            this.contextMenuList = []
            this.isShow = false
        },
        handleContextMenuStyle() {
            const style = {}
            if (!this.options) {
                return style
            }
            this.$nextTick(function () {
                const x = this.options.x !== undefined ? (parseInt(this.options.x) > 0 ? parseInt(this.options.x) : 0) : 0
                const y = this.options.y !== undefined ? (parseInt(this.options.y) > 0 ? parseInt(this.options.y) : 0) : 0
                // 判断是否超出边界
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    const winHeight = document.documentElement.clientHeight
                    const winWidth = document.documentElement.clientWidth
                    const elHeight = this.$el.clientHeight
                    const elWidth = this.$el.clientWidth
                    if (x + elWidth > winWidth) {
                        style['right'] = '10px'
                    } else {
                        style['left'] = x + 'px'
                    }
                    if (y + elHeight > winHeight) {
                        style['bottom'] = '42px'
                    } else {
                        style['top'] = y + 'px'
                    }
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
        color: #233657;
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
        }

        .item-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 1;
        }

        .item-label {
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