<template>
    <div>
        <el-card class="log">
            <template #header>
                <div class="log-header">
                    <div style="display: flex;align-items: center;">
                        <span>运行日志&nbsp;&nbsp;</span>
                        <el-icon style="color: var(--el-color-success); font-size: 18px; cursor: pointer"
                                 v-if="!refresh"
                                 @click="getLog">
                            <VideoPlay/>
                        </el-icon>
                        <el-icon style="color: var(--el-color-danger); font-size: 18px; cursor: pointer"
                                 v-else
                                 @click="refresh = false">
                            <VideoPause/>
                        </el-icon>
                    </div>
                </div>
            </template>
            <div class="log-pad" ref="pad">
                <div v-for="(line, index) in logList" :key="index" v-html="logFormat(line)"></div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getLog } from '@/request/dashboard'
import { VideoPause, VideoPlay } from '@element-plus/icons-vue'

import $ from 'jquery'

let loopLog: any = null

@Options({
    components: {
        VideoPause,
        VideoPlay
    },
    computed: {
        pad () {
            return this.$refs.pad
        }
    },
    watch: {
        refresh (value: boolean) {
            if (!value) {
                clearInterval(loopLog)
            } else {
                this.getLog()
            }
        }
    },
    mounted () {
        this.getLog()

        $(this.$refs.pad).on('scroll', (e) => {
            this.refresh = e.target.scrollTop + 400 >= e.target.scrollHeight
        })
    }
})
export default class Dashboard extends Vue {
    pad!: HTMLElement

    public logList = []
    public refresh = true

    public async getLog () {
        clearInterval(loopLog)

        if (this.$route.fullPath !== '/') {
            this.refresh = false
            return
        }

        const res = await getLog()
        if (res) {
            this.refresh = true
            this.logList = res.data
            await this.$nextTick(() => {
                this.pad.scrollTop = this.pad.scrollHeight
            })
            loopLog = setInterval(this.getLog, 10000)
        } else {
            this.refresh = false
        }
    }

    public logFormat (line: string): string {
        return line
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace(/\s/g, '&nbsp;')
            .replace(/&nbsp;\[(.*)]\[(.+?)]&nbsp;/, (res, r1, r2) => {
                const main = r1.replace(/&nbsp;/g, '')
                const level = r2.replace(/&nbsp;/g, '')

                return `<span class="tag-main ${main}">${main}</span><span class="tag-level ${level}">${level}</span>`
            })
    }
}
</script>

<style scoped lang="scss">
.log {
    width: 1200px;

    .log-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .log-pad {
        height: 400px;
        overflow: auto;
        padding: 5px;

        & > div {
            font-size: 12px;
            white-space: nowrap;
        }
    }

}
</style>
<style lang="scss">
.log-pad {
    span {
        width: 60px;
        margin-right: 5px;
        font-size: 12px;
        background: var(--el-color-info-light-9);
        padding: 0 5px;
        display: inline-block;
        text-align: right;
    }

    .tag-main {
        margin-left: 5px;
    }

    .tag-main.CQHttp {
        background-color: var(--el-color-warning-light-5);
    }

    .tag-main.Mirai {
        background-color: var(--el-color-success-light-5);
    }

    .tag-main.Tencent {
        background-color: var(--el-color-primary-light-5);
    }

    .tag-level.ERROR {
        background-color: var(--el-color-danger-light-5);
    }
}
</style>
