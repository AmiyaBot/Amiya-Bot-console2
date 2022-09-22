<template>
    <div style="height: calc(100% - 20px)">
        <router-view/>
    </div>
    <div class="icp">
        <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2021107697号-1</a>
    </div>
</template>

<style scoped lang="scss">
.icp {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
        font-size: 12px;
        color: var(--el-color-info);
    }
}
</style>
<style lang="scss">
@font-face {
    font-family: 'Harmony';
    font-weight: normal;
    font-style: normal;
    src: url('https://cos.amiyabot.com/resource/HarmonyOS_Sans_SC.ttf');
}

* {
    box-sizing: border-box;
    font-family: 'Harmony', Helvetica, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-overflow: initial !important;

    &:not(svg) {
        font-size: 14px;
    }
}

html, body {
    margin: 0;
    overflow: hidden;
}

#app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    z-index: 0;
}

:root {
    scroll-behavior: smooth;
    --c-main: var(--el-color-primary);
    --c-main-light: var(--el-color-primary-light-8);
}

.el-notification__content {
    word-break: break-all;
    word-wrap: break-word;
    text-align: inherit;
}

.v-loading {
    background-color: transparent !important;
    backdrop-filter: blur(10px);
}
</style>
