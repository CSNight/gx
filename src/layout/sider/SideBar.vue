<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse"/>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <item-panel ref="itemPanel"/>
        </el-scrollbar>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import variables from '@/styles/variables.scss'
import Logo from "@/layout/sider/Logo";
import ItemPanel from "@/layout/sider/ItemPanel";

export default {
    components: {ItemPanel, Logo},
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
