<template>
    <div id="app" class="app">
        <layout/>
    </div>
</template>

<script>
import layout from "./editor"

export default {
    name: 'app',
    components: {layout}
}
</script>
<style>
.app {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}
</style>