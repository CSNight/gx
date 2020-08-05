<template>
    <section class="app-main" id="flowChart">
    </section>
</template>

<script>
import G6 from "@antv/g6";
import Grid from "@antv/g6/lib/plugins/grid";

export default {
    name: 'AppMain',
    props: {
        msg: String
    },
    created() {
        this.$nextTick(() => {
            this.init()
        })
    },
    computed: {
        containerHeight: () => {
            document.querySelector('#flowChart').style.height;
        },
        containerWidth: () => {
            document.querySelector('#flowChart').style.width;
        },
    },
    methods: {
        init() {
            let self = this;
            self.Util = G6.Util;
            const grid = new Grid()
            self.net = new G6.Graph({
                container: 'flowChart',      // 容器ID
                mode: 'edit',
                plugins: [grid],
                
            });
            self.net.render();
        }
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 10px);
    width: 100%;
    position: relative;
    overflow: hidden
}

.fixed-header + .app-main {
    padding-top: 55px;
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