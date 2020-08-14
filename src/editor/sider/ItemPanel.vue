<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-collapse class="itemPanel">
            <el-collapse-item>
                <template slot="title">
                    <svg-icon icon-class="keyspace" style="color:#233657;width: 24px;height:24px"/>
                    <span v-if="showLabel">基础控件</span>
                </template>
                <el-tree empty-text="" :data="tree">
                    <div class="custom-tree-node" draggable="true" slot-scope="{ node,data }"
                         :data-item="JSON.stringify({type:'tk-node',size:'80*40',label:'Model_'+data.val})">
                        <el-tooltip :content="node.label" placement="right" effect="light">
                            <fa-icon style="margin-left: 12px;color:#2bf" icon-class="fa fa-cube"/>
                        </el-tooltip>
                        <span v-if="showLabel">{{ node.label }}</span>
                    </div>
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

import registerFlowNode from "../../components/shape/flowNode";
import G6 from "@antv/g6/lib";

export default {
    name: 'ItemPanel',
    props: {
        nodes: {
            type: Array,
            required: true
        },
        showLabel: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            tree: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.nodes.length > 0) {
                this.queryData();
            }
        })
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
            this.tree = [{label: 'Model_1', val: 1}, {label: 'Model_2', val: 2}, {label: 'Model_3', val: 3}, {
                label: 'Model_4',
                val: 4
            }]
            console.log("initialize items panel")
            //TODO register Shape From Database
            registerFlowNode(G6, this.tree);
            this.$nextTick(() => {
                this.$emit('init', {})
            })
        },
    }
}
</script>
<style lang="scss" scoped>
/deep/ .is-leaf {
    display: none;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 14px;
}

</style>