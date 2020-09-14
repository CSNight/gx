<template>
    <div id="app" class="app">
        <layout ref="editor" :model-data="modelData">
            <template v-slot:default="slotProps">
                <el-form size="mini" label-width="90px">
                    <el-form-item label="模块信息">
                        <el-input readonly v-model="slotProps.detail.id"/>
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
            modelData: {}
        }
    },
    mounted() {
        setTimeout(() => {
            this.modelData = {
                // 点集
                nodes: [],
                // 边集
                edges: []
            }
        }, 100);
        
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