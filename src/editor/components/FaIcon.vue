<template>
    <i :class="iconName+' fa-icon'"/>
</template>

<script>

export default {
    name: 'FaIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconName() {
            if (!this.className || this.className === '') {
                return `fa ${this.iconClass}`
            } else {
                return `fa ${this.className} ${this.iconClass}`
            }
        }
    }
}
</script>

<style scoped>
.fa-icon {
    width: 1.5em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
    text-align: center;
}
</style>
