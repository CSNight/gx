<template>
    <div class="navbar">
        <div class="hamburger-container" style="padding: 0 15px;" @click="toggleSideBar">
            <svg-icon icon-class="hamburger" :class="'hamburger '+ (sideBar?'is-active':'')"/>
        </div>
        <div class="toolbar">
            <el-button :disabled="!barComState.undo" size="mini" class="command" tool-click="undo"
                       icon="iconfont icon-undo"/>
            <el-button :disabled="!barComState.redo" size="mini" class="command" tool-click="redo"
                       icon="iconfont icon-redo"/>
            <el-divider direction="vertical"/>
            <el-button :disabled="!barComState.copy" size="mini" class="command" tool-click="copy"
                       icon="iconfont icon-copy-o"/>
            <el-button :disabled="!barComState.paste" size="mini" class="command" tool-click="paste"
                       icon="iconfont icon-paster-o"/>
            <el-button :disabled="!barComState.delete" size="mini" class="command" tool-click="delete"
                       icon="iconfont icon-delete-o"/>
            <el-divider direction="vertical"/>
            <el-button :disabled="!barComState.zoomIn" size="mini" class="command" tool-click="zoomIn"
                       icon="iconfont icon-zoom-in-o"/>
            <el-button :disabled="!barComState.zoomOut" size="mini" class="command" tool-click="zoomOut"
                       icon="iconfont icon-zoom-out-o"/>
            <el-button :disabled="!barComState.resetZoom" size="mini" class="command" tool-click="resetZoom"
                       icon="iconfont icon-actual-size-o"/>
            <el-button :disabled="!barComState.autoFit" size="mini" class="command" tool-click="autoFit"
                       icon="iconfont icon-fit"/>
            <el-divider direction="vertical"/>
            <el-button :disabled="!barComState.toFront" size="mini" class="command" tool-click="toFront"
                       icon="iconfont icon-to-front"/>
            <el-button :disabled="!barComState.toBack" size="mini" class="command" tool-click="toBack"
                       icon="iconfont icon-to-back"/>
            <el-button :disabled="!barComState.brushSelect" size="mini" class="command" tool-click="brushSelect"
                       icon="fa fa-expand"/>
        </div>
    </div>
</template>

<script>
export default {
    name: "ToolbarPanel",
    props: {
        sideBar: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            barComState: {
                undo: false, redo: false, brushSelect: false,
                copy: false, paste: false, delete: false,
                zoomIn: false, zoomOut: false, resetZoom: false, autoFit: false,
                toFront: false, toBack: false,
            }
        }
    }, methods: {
        toggleSideBar() {
            this.$emit('toggleSide')
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    display: flex;

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }

        .hamburger {
            display: inline-block;
            vertical-align: middle;
            width: 20px;
            height: 20px;
        }

        .hamburger.is-active {
            transform: rotate(180deg);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .toolbar {
        border-left: 3px solid #2bf;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: left;
        width: 100%;
        height: 100%;
        margin-left: 10px;

        .el-button {
            border: 1px solid transparent;
            color: #606266;
            margin-right: 5px;
        }

        .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
            color: #C0C4CC;
            cursor: not-allowed;
            background-image: none;
            background-color: #FFF;
            border: 1px solid transparent;
        }

        .el-button--mini {
            padding: 5px 5px;
        }

        .el-button:hover {
            color: #3a8ee6;
            border: 1px dashed #3a8ee6;
            outline: 0;
        }
    }
}

</style>