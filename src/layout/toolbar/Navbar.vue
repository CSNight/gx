<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
        <toolbar-panel/>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Hamburger from "./Hamburger";
import ToolbarPanel from "./ToolbarPanel";

export default {
    name: 'navbar',
    components: {ToolbarPanel, Hamburger},
    computed: {
        ...mapGetters([
            'sidebar', 'globalGraph'
        ])
    },
    data() {
        return {
            head: '',
            full: false
        }
    },
    created() {
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        toggleFullScreen() {
            if (this.full) {
                this.full = false;
                this.exitFullscreen();
            } else {
                this.full = true;
                this.fullScreen();
            }
        },
        fullScreen() {
            let element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        },
        
        //退出全屏
        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    display: flex;
    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;
        
        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }
    
    .breadcrumb-container {
        float: left;
    }
    
    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        
        &:focus {
            outline: none;
        }
        
        .tim-icons {
            display: inline-block;
            vertical-align: middle;
            speak: none;
            font-size: 18px;
            text-transform: none;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .icon-sound-wave::before {
            content: "\ea4b";
        }
        
        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;
            
            &.hover-effect {
                cursor: pointer;
                transition: background .3s;
                
                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }
        
        .avatar-container {
            margin-right: 30px;
            
            .avatar-wrapper {
                margin-top: 5px;
                position: relative;
                
                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid #5a5e66;
                }
                
                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
