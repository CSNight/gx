<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-collapse class="itemPanel">
            <el-collapse-item>
                <template slot="title">
                    <svg-icon icon-class="keyspace" style="color:#233657;width: 24px;height:24px"/>
                    <span v-if="sidebar.opened">基础控件</span>
                </template>
                <el-tree empty-text="" :data="tree">
                    <div class="custom-tree-node" draggable="true" slot-scope="{ node,data }"
                         :data-item="JSON.stringify({type:'tk-node',size:'80*40',label:'Model_'+data.val})">
                        <el-tooltip :content="node.label" placement="right" effect="light">
                            <fa-icon style="margin-left: 12px;color:#2bf" icon-class="fa-cube"/>
                        </el-tooltip>
                        <span v-if="sidebar.opened">{{ node.label }}</span>
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
            this.tree = [{label: 'Model_1', val: 1}, {label: 'Model_2', val: 2}, {label: 'Model_3', val: 3}, {
                label: 'Model_4',
                val: 4
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