<template>
    <div class="toolbar">
        <el-button size="mini" class="command" data-command="undo" icon="iconfont icon-undo"/>
        <el-button size="mini" class="command" data-command="redo" icon="iconfont icon-redo"/>
        <el-divider direction="vertical"/>
        <el-button size="mini" class="command" data-command="copy" icon="iconfont icon-copy-o"/>
        <el-button size="mini" class="command" data-command="paste" icon="iconfont icon-paster-o"/>
        <el-button size="mini" class="command" data-command="delete" icon="iconfont icon-delete-o"/>
        <el-divider direction="vertical"/>
        <el-button size="mini" class="command" data-command="zoomIn" icon="iconfont icon-zoom-in-o"/>
        <el-button size="mini" class="command" data-command="zoomOut" icon="iconfont icon-zoom-out-o"/>
        <el-divider direction="vertical"/>
        <el-button size="mini" class="command" data-command="resetZoom" icon="iconfont icon-actual-size-o"/>
        <el-button size="mini" class="command" data-command="autoFit" icon="iconfont icon-fit"/>
        <el-button size="mini" class="command" data-command="toFront" icon="iconfont icon-to-front"/>
        <el-button size="mini" class="command" data-command="toBack" icon="iconfont icon-to-back"/>
    </div>
</template>

<script>
export default {
    name: "ToolbarPanel"
}
</script>

<style lang="scss" scoped>
.toolbar {
    border-left: 3px solid #2bf;
    padding: 0px 10px;
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
    
    .el-button--mini {
        padding: 5px 5px;
    }
    
    .el-button:hover {
        color: #3a8ee6;
        border: 1px dashed #3a8ee6;
        outline: 0;
    }
}
</style>