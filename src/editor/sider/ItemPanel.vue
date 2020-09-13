<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-collapse class="itemPanel">
            <el-collapse-item v-for="cls in clazz" :key="cls.value">
                <template slot="title">
                    <svg-icon icon-class="keyspace" style="color:#233657;width: 24px;height:24px"/>
                    <span v-if="showLabel">{{ cls.label }}</span>
                </template>
                <el-tree empty-text="" :data="cls.children">
                    <div class="custom-tree-node" draggable="true" slot-scope="{ node,data }"
                         :data-item="JSON.stringify(data)">
                        <el-tooltip :content="node.label" placement="right" effect="light">
                            <fa-icon style="margin-left: 12px;color:#2bf" icon-class="fa fa-cube"/>
                        </el-tooltip>
                        <span v-if="showLabel">{{ node.label }}</span>
                    </div>
                </el-tree>
            </el-collapse-item>
        </el-collapse>
    </el-scrollbar>
</template>

<script>
import G6 from '@antv/g6/lib';
import {getDictByClazz, getShapes} from "@/api/shape_def";
import registerShape from '../lib/shape'

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
            clazz: [], tree: [], shapes: [],
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
            console.log("initialize items panel")
            Promise.all([getDictByClazz('shape'), getShapes()]).then(([dict, resp]) => {
                if (dict.data.status === 200 && dict.data.code === 'OK') {
                    let cls = dict.data.message;
                    for (let i = 0; i < cls.length; i++) {
                        if (cls[i].val === 'node') {
                            this.clazz.push({label: cls[i].name, value: cls[i].code, children: []})
                        }
                    }
                }
                if (resp.data.status === 200 && resp.data.code === 'OK') {
                    this.shapes = resp.data.message;
                    for (let i = 0; i < this.shapes.length; i++) {

                        if (this.shapes[i].labelCfg) {
                            this.shapes[i].labelCfg = JSON.parse(this.shapes[i].labelCfg)
                        }
                        if (this.shapes[i].icon) {
                            this.shapes[i].icon = JSON.parse(this.shapes[i].icon)
                        }
                        this.shapes[i].style = JSON.parse(this.shapes[i].style)
                        if (this.shapes[i].shape_type === "node") {
                            let size = this.shapes[i].style.width + "*" + this.shapes[i].style.height;
                            let nodeDef = {
                                id: this.shapes[i].id,
                                type: this.shapes[i].name,
                                size: size,
                                label: this.shapes[i].label || this.shapes[i].name
                            }
                            for (let j = 0; j < this.clazz.length; j++) {
                                if (this.clazz[j].value === this.shapes[i].clazz) {
                                    this.clazz[j].children.push(nodeDef)
                                }
                            }
                        }
                        registerShape(G6, this.shapes[i])
                    }
                    //TODO register Shape From Database
                    this.$nextTick(() => {
                        this.$emit('init', {})
                    })
                } else {
                    this.$message.error({
                        message: "查询出错!" + resp.data.message
                    });
                }
            }).catch(() => {
                this.$message.error({
                    message: "查询出错!"
                });
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


.sidebar-container {
    .fa-icon {
        margin-right: 4px;
    }

    .svg-icon {
        margin-right: 16px;
        margin-left: 8px;
    }

    .el-icon {
        margin-right: 4px;
    }
}

.hideSidebar {
    .sidebar-container {
        .fa-icon {
            margin-right: 4px;
        }

        .svg-icon {
            margin-right: 4px;
            margin-left: 8px;
        }

        .el-icon {
            margin-right: 4px;
        }
    }
}


</style>