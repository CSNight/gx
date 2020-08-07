<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebar class="sidebar-container"/>
        <div class="main-container">
            <div :class="{'fixed-header':fixedHeader}">
                <navbar/>
            </div>
            <section class="app-main">
                <EditorGraph ref="main"/>
            </section>
        </div>
    </div>
</template>

<script>
import Sidebar from './sider/SideBar'
import Navbar from "./toolbar/Navbar";
import EditorGraph from "./editor/EditorGraph";

export default {
    name: "Index",
    components: {
        EditorGraph,
        Navbar,
        Sidebar,
    }, computed: {
        sidebar() {
            return this.$store.state.app.sidebar
        },
        device() {
            return this.$store.state.app.device
        },
        fixedHeader() {
            return true
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation
            }
        }
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
        }
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh);
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
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