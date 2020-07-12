<template>
    <div id="flowChart">
    </div>
</template>

<script>
    import G6 from "@antv/g6";
    import Grid from "@antv/g6/lib/plugins/grid";

    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        created() {
            this.$nextTick(() => {
                this.init()
            })
        },
        methods: {
            init() {
                let self = this;
                self.Util = G6.Util;
                const grid = new Grid()
                self.net = new G6.Graph({
                    container: 'flowChart',      // 容器ID
                    mode: 'edit',
                    plugins: [  grid ],
                    width: 1520,    // 画布宽*/
                    height: 900   // 画布高
                });
                self.net.render();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
