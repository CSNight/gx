<template>
    <el-form-item label="样式">
        <el-row style="margin-bottom: 10px" v-if="shapeClazz==='node'">
            <el-col :span="12" style="display: flex;align-items: center">
                模块宽度：
                <el-input-number :min="1" style="width:100px" controls-position="right"
                                 @change="updateKey" v-model="style.width"/>
            </el-col>
            <el-col :span="12" style="display: flex;align-items: center;padding-left:5px">
                模块高度：
                <el-input-number :min="0" style="width:100px" controls-position="right"
                                 @change="updateKey" v-model="style.height"/>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="12" v-if="shapeClazz==='node'" style="display: flex;align-items: center;">
                填充颜色：
                <color-picker v-model="style" @change="update" type="fill"/>
            </el-col>
            <el-col :span="12" style="display: flex;align-items: center" v-if="style['text-shape']">
                字体颜色：
                <el-color-picker v-model="style['text-shape'].fill" @change="updateKey"/>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="12" style="display: flex;align-items: center">
                边线颜色：
                <color-picker v-model="style" @change="update" type="stroke"/>
            </el-col>
            <el-col :span="12" style="display: flex;align-items: center">
                阴影颜色：
                <el-color-picker v-model="style.shadowColor" @change="updateKey" show-alpha/>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="12" style="display: flex;align-items: center">
                边线宽度：
                <el-input-number :min="1" :max="10" style="width:100px" controls-position="right"
                                 @change="updateKey" v-model="style.lineWidth"/>
            </el-col>
            <el-col :span="12" style="display: flex;align-items: center">
                阴影大小：
                <el-input-number :min="0" :max="10" style="width:100px" controls-position="right"
                                 @change="updateKey" v-model="style.shadowBlur"/>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 10px" v-if="style['text-shape']">
            <el-col :span="12" style="display: flex;align-items: center">
                字体大小：
                <el-input-number :min="1" :max="20" style="width:100px" controls-position="right"
                                 @change="updateKey" v-model="style['text-shape'].fontSize"/>
            </el-col>
            <el-col :span="12" style="display: flex;align-items: center">
                是否粗体：
                <el-select style="width:100px" v-model="style['text-shape'].fontWeight" @change="updateKey">
                    <el-option v-for="weight in ['bold','normal']" :key="weight" :value="weight" :label="weight"/>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 10px" v-if="style['text-shape']">
            <el-col :span="12" style="display: flex;align-items: center">
                文字对齐：
                <el-select style="width:100px" v-model="style['text-shape'].textAlign" @change="updateKey">
                    <el-option v-for="align in ['center','left','right']" :key="align" :value="align" :label="align"/>
                </el-select>
            </el-col>
            <el-col :span="12" style="display: flex;align-items: center">
                垂直对齐：
                <el-select style="width:100px" v-model="style['text-shape'].textBaseline" @change="updateKey">
                    <el-option v-for="align in ['middle','top','bottom']" :key="align" :value="align" :label="align"/>
                </el-select>
            </el-col>
        </el-row>
    </el-form-item>
</template>

<script>
import ColorPicker from "./ColorPicker";

export default {
    name: "StyleEditor",
    components: {ColorPicker},
    props: ['styleModel', 'shapeClazz'],
    model: {
        prop: 'styleModel',//指向props的参数名
        event: 'change'//事件名称
    },
    data() {
        return {
            style: this.styleModel
        }
    },
    methods: {
        update(value) {
            this.$emit('change', value);
        },
        updateKey() {
            this.$emit('change', this.style);
        }
    }
}
</script>

<style scoped>

</style>