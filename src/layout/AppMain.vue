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
        async init() {
            const response = await fetch('https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json');
            const remoteData = await response.json();
            let self = this;
            self.Util = G6.Util;
            const grid = new Grid()
            self.net = new G6.Graph({
                container: 'flowChart',      // 容器ID
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'drag-node']  // 允许拖拽画布、放缩画布、拖拽节点
                },
                plugins: [grid],
                width: 1000,
                height: 900,
                fitView: true,
                animate:true,
                fitViewPadding: [ 20, 40, 50, 20 ]
            });
            self.net.data(remoteData)
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