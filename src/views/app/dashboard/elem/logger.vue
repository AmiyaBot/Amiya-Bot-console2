<template>
    <div class="log-pad">
        <div v-for="(line, index) in logList" :class="'line' + (index + 1)" :key="index" v-html="logFormat(line)"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getLog } from '@/request/dashboard'

let loopLog: any = null

@Options({
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
    }
})
export default class Logger extends Vue {
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
                document.querySelector('.line' + res.data.length)?.scrollIntoView({
                    behavior: 'smooth'
                })
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
.log-pad {
    height: 100%;
    overflow: auto;

    & > div {
        height: 16px;
        font-size: 12px;
        white-space: nowrap;
        display: flex;
        align-items: center;
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
