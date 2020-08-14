<template>
    <el-color-picker size="mini" v-model="value" color-format="hex" @change="update" show-alpha/>
</template>

<script>
export default {
    name: "ColorPicker",
    model: {
        prop: 'modelVal',//指向props的参数名
        event: 'change'//事件名称
    },
    props: ['modelVal', 'type'],
    data() {
        return {
            value: this.initValue()
        }
    },
    methods: {
        //监听值变化，再赋值给modelVal
        update(value) {
            let rgba = value.replace('rgba(', '').replace(')', '').replace(/\s/g, '').split(',')
            let rgbHex = this.rgb2hex(...rgba);
            let val = Object.assign({}, this.modelVal);
            let opacity = parseFloat(rgba[3])
            val[this.type] = rgbHex;
            val[this.type + 'Opacity'] = opacity
            this.$emit('change', val);
        },
        rgb2hex(r, g, b) {
            let hex = r << 16 | g << 8 | b;
            return "#" + hex.toString(16).toUpperCase();
        },
        hexToRgba(hex) {
            return parseInt("0x" + hex.slice(1, 3), 16) + "," + parseInt("0x" + hex.slice(3, 5), 16) + "," + parseInt("0x" + hex.slice(5, 7), 16);
        },
        initValue() {
            let val = 'rgba(';
            if (this.modelVal[this.type] && this.modelVal[this.type].indexOf('#') !== -1) {
                val += this.hexToRgba(this.modelVal[this.type])
            } else if (this.modelVal[this.type] && this.modelVal[this.type].indexOf('rgb(') !== -1) {
                val += this.modelVal[this.type].replace(')', '').replace('rgb(')
            } else if (this.modelVal[this.type] && this.modelVal[this.type].indexOf('rgba(') !== -1) {
                let rgba = this.modelVal[this.type].replace('rgba(', '').replace(')', '').replace(/\s/g, '').split(',')
                val += rgba[0] + ',' + rgba[1] + ',' + rgba[2]
            } else {
                val += '255,255,255'
            }
            if (this.modelVal[this.type + 'Opacity']) {
                val += ',' + this.modelVal[this.type + 'Opacity'] + ')'
            } else {
                val += ',1)'
            }
            return val
        }
    }
}
</script>

<style scoped>

</style>