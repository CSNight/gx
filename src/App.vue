<template>
    <div id="app" class="app">
        <layout ref="editor">
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
    methods: {
        save() {
            this.$refs.editor.onItemCfgChange()
            this.$refs.editor.showDetail = false
        },
        cancel() {
            this.$refs.editor.onItemCfgCancel()
        }
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