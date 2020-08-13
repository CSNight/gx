<template>
    <div id="app" class="app">
        <layout ref="editor" :model-data="modelData" :node-shapes="nodeShapes">
            <template v-slot:default="slotProps">
                <el-form size="mini" label-width="90px">
                    <el-form-item label="模块ID">
                        <el-input readonly v-model="slotProps.detail.id"/>
                    </el-form-item>
                    <el-form-item label="模块名">
                        <el-input v-model="slotProps.detail.label"/>
                    </el-form-item>
                    <el-form-item label="模块类型">
                        <el-input readonly v-model="slotProps.detail.type"/>
                    </el-form-item>
                    <el-form-item>

                    </el-form-item>
                </el-form>
            </template>
        </layout>
    </div>
</template>

<script>
import layout from "./editor"

export default {
    name: 'app',
    components: {layout},
    data() {
        return {
            modelData: {}, nodeShapes: [1]
        }
    },
    mounted() {
        setTimeout(() => {
            this.modelData = {
                // 点集
                nodes: [{
                    id: 'node1', // 节点的唯一标识
                    type: 'tk-node',
                    x: 100,      // 节点横坐标
                    y: 200,      // 节点纵坐标
                    label: '起始点', // 节点文本
                    meta: {a: '111'}
                }, {
                    id: 'node2',
                    type: 'tk-node',
                    x: 300,
                    y: 200,
                    label: '目标点'
                }],
                // 边集
                edges: [
                    // // 表示一条从 node1 节点连接到 node2 节点的边
                    {
                        source: 'node1',  // 起始点 id
                        target: 'node2',  // 目标点 id
                        label: '我是连线',   // 边的文本
                        type: 'flow-poly-round'
                    }
                ]
            }
        },100);

    }
}
</script>
<style>
.app {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}
</style>