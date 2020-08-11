<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-collapse class="itemPanel">
            <el-collapse-item>
                <template slot="title">
                    <svg-icon icon-class="keyspace" style="color:#233657;width: 24px;height:24px"/>
                    <span v-if="sidebar.opened">基础控件</span>
                </template>
                <el-tree empty-text="" :data="tree">
                <span class="custom-tree-node" slot-scope="{ node }">
                     <img alt="" data-item="{type:'tk-node',size:'80*40',label:'aaa'}"
                          :src="require('../../assets/logo.png')" style="width:24px;height:24px"/>
                     <span>{{ node.label }}</span>
                </span>
                </el-tree>
            </el-collapse-item>
            <el-collapse-item>
            
            </el-collapse-item>
            <el-collapse-item>
            
            </el-collapse-item>
        </el-collapse>
    </el-scrollbar>
</template>

<script>
import {mapGetters} from 'vuex'
import AddItemPanel from "@/components/plugins/AddItemPanel";

export default {
    name: 'ItemPanel',
    props: {
        nodes: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tree: [],
        }
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'globalGraph'
        ]),
    },
    watch: {
        nodes: {
            handler: function (val) {
                if (val && val.length > 0) {
                    this.queryData();
                }
            }
        }
    },
    methods: {
        queryData() {
            this.tree = [{label: 'aaa', val: 1}, {label: 'aaa', val: 1}, {label: 'aaa', val: 1}, {
                label: 'aaa',
                val: 1
            }]
            console.log("initialize items panel")
            this.$nextTick(() => {
                this.initPlugins();
            })
        },
        initPlugins() {
            console.log("initialize items plugins and shapes")
            //TODO register Shape From Database
            const addItem = new AddItemPanel({
                container: this.$el,
                itemsCom: this
            });
            this.globalGraph.addPlugin(addItem);
            this.$emit('loadData', {})
        }
    }
}
</script>
<style lang="scss" scoped>

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 14px;
    
    /deep/ .ins {
        background: transparent;
        border: none;
        height: 25px;
        max-width: 170px;
        padding-left: 0;
        overflow: hidden;
    }
    
    /deep/ .dbBtn {
        width: 60px;
        padding-right: 22px;
    }
    
    /deep/ .fac {
        margin-right: 5px;
    }
}

</style>