<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse"/>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                class="el-menu-vertical"
               
                :collapse="isCollapse"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :unique-opened="false"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical">
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import variables from '@/styles/variables.scss'
import Logo from "@/layout/sider/Logo";

export default {
    components: {Logo },
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
