<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-collapse class="itemPanel">
            <el-collapse-item v-for="cls in nodeClazz" :key="cls.value">
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
            <el-collapse-item style="text-align: center" v-for="cls in edgeClazz" :key="cls.value">
                <template slot="title">
                    <svg-icon icon-class="connection" style="color:#233657;width: 24px;height:24px"/>
                    <span v-if="showLabel">{{ cls.label }}</span>
                </template>
                <el-tree empty-text="" :data="cls.children">
                    <div class="custom-tree-node" draggable="true" slot-scope="{ node,data }"
                         :data-item="JSON.stringify(data)">
                        <el-tooltip :content="node.label" placement="right" effect="light">
                            <fa-icon style="margin-left: 8px;color:#2bf" icon-class="fa fa-link"/>
                        </el-tooltip>
                        <el-radio v-model="activateEdge" v-for="edge in cls.children"
                                  :key="edge.id" :label="edge.type" size="mini">
                            {{ edge.label }}
                        </el-radio>
                    </div>
                </el-tree>
            
            </el-collapse-item>
        </el-collapse>
    </el-scrollbar>
</template>

<script>
import {getDictByClazz} from "@/api/shape_def";
import registerShape from '../lib/shape'

export default {
    name: 'ItemPanel',
    props: {
        shapes: {
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
            edgeClazz: [], nodeClazz: [], activateEdge: ''
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.shapes.length > 0) {
                this.registerData();
            }
        })
    },
    watch: {
        shapes: {
            handler: function (val) {
                if (val && val.length > 0) {
                    this.registerData();
                }
            }
        }
    },
    methods: {
        registerData() {
            this.nodeClazz = [];
            this.edgeClazz = [];
            console.log("initialize items panel")
            getDictByClazz('shape').then((dict) => {
                if (dict.data.status === 200 && dict.data.code === 'OK') {
                    let cls = dict.data.message;
                    for (let i = 0; i < cls.length; i++) {
                        if (cls[i].val === 'node') {
                            this.nodeClazz.push({label: cls[i].name, value: cls[i].code, children: []})
                        } else {
                            this.edgeClazz.push({label: cls[i].name, value: cls[i].code, children: []})
                        }
                    }
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
                            for (let j = 0; j < this.nodeClazz.length; j++) {
                                if (this.nodeClazz[j].value === this.shapes[i].clazz) {
                                    this.nodeClazz[j].children.push(nodeDef)
                                }
                            }
                        } else {
                            for (let j = 0; j < this.edgeClazz.length; j++) {
                                if (this.edgeClazz[j].value === this.shapes[i].clazz) {
                                    this.edgeClazz[j].children.push({
                                        id: this.shapes[i].id,
                                        type: this.shapes[i].name,
                                        label: this.shapes[i].label || this.shapes[i].name
                                    })
                                }
                            }
                        }
                        registerShape(this.shapes[i])
                    }
                    this.$nextTick(() => {
                        this.$emit('init', {})
                    })
                } else {
                    this.$message.error({
                        message: "查询出错!" + dict.data.message
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