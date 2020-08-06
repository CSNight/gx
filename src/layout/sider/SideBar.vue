<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse"/>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-collapse>
                <el-collapse-item>
                    <template slot="title">
                        <svg-icon icon-class="keyspace" style="color:#233657;width: 24px;height:24px"/>
                        <span v-if="sidebar.opened">基础控件</span>
                    </template>
                    <el-tree empty-text="">
                    
                    </el-tree>
                </el-collapse-item>
                <el-collapse-item>
                
                </el-collapse-item>
                <el-collapse-item>
                
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import variables from '@/styles/variables.scss'
import Logo from "@/layout/sider/Logo";

export default {
    components: {Logo},
    computed: {
        ...mapGetters([
            'sidebar'
        ]),
        showLogo() {
            return true
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    }
}
</script>
