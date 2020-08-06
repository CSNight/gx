<template>
    <section class="app-main">
        <EditorGraph ref="main"/>
    </section>
</template>

<script>

import EditorGraph from "@/views/editor/EditorGraph";

export default {
    name: 'AppMain',
    components: {EditorGraph},
    beforeDestroy() {
        this.$refs.main.$el.remove()
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden
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