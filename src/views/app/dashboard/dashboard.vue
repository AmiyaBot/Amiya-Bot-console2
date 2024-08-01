<template>
    <div>
        <community/>
        <el-card class="content-area" :class="{ 'no-notice': !notice }">
            <el-tabs v-model="page">
                <el-tab-pane label="运行日志" name="1"/>
                <el-tab-pane label="消息统计" name="2"/>
                <el-tab-pane label="功能使用统计" name="3"/>
            </el-tabs>
            <div class="switch-pane">
                <div :style="pagePosition()">
                    <div>
                        <logger/>
                    </div>
                    <div>
                        <message-analysis/>
                    </div>
                    <div>
                        <func-usage/>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import Logger from '@/views/app/dashboard/elem/logger.vue'
import Community from '@/views/app/dashboard/elem/community.vue'
import MessageAnalysis from '@/views/app/dashboard/elem/messageAnalysis.vue'
import FuncUsage from '@/views/app/dashboard/elem/funcUsage.vue'

@Options({
    components: {
        Logger,
        Community,
        MessageAnalysis,
        FuncUsage
    },
    methods: {
        pagePosition () {
            return {
                transform: `translateX(-${100 / 3 * (parseInt(this.page) - 1)}%)`
            }
        }
    }
})
export default class Dashboard extends Vue {
    private page = '1'
}
</script>

<style scoped lang="scss">
.content-area {
    height: calc(100% - 117px - 70px);

    &.no-notice {
        height: calc(100% - 117px);
    }

    .switch-pane {
        width: 100%;
        height: calc(100% - 54px);
        overflow: hidden;

        & > div {
            width: 300%;
            height: 100%;
            display: flex;
            transition: transform var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);

            & > div {
                width: calc(100% / 3);
                height: 100%;
            }
        }
    }
}
</style>
<style lang="scss">
.content-area {
    & > .el-card__body {
        height: 100%;
    }
}
</style>
