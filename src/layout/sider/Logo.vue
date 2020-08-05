<template>
    <div class="sidebar-logo-container" :class="{'collapse':collapse}">
        <transition name="sidebarLogoFade">
            <div v-if="collapse" key="collapse" class="sidebar-logo-link">
                <img v-if="logo" :src="logo" class="sidebar-logo" alt="">
                <h1 v-else class="sidebar-title">{{ title }} </h1>
            </div>
            <div v-else key="expand" class="sidebar-logo-link" >
                <img v-if="logo" :src="logo" class="sidebar-logo" alt="">
                <h1 class="sidebar-title">{{ title }} </h1>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            title: 'Oxygen',
            // eslint-disable-next-line no-undef
            logo: require('../../assets/logo.png')
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #233657;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 50px;
            font-size: 20px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0;
        }
    }
}
</style>
