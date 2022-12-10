<template>
    <div>
        <el-alert type="warning" v-if="notice">
            <template #title>
                <div style="display: flex;align-items: center;">
                    <el-icon>
                        <BellFilled/>
                    </el-icon>
                    <span style="padding-left: 5px">公告</span>
                </div>
            </template>
            <div v-html="notice"></div>
        </el-alert>
        <br>
        <community/>
        <br>
        <logger/>
        <br>
        <message-analysis/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { BellFilled } from '@element-plus/icons-vue'

import Logger from '@/views/app/dashboardElem/logger.vue'
import Community from '@/views/app/dashboardElem/community.vue'
import MessageAnalysis from '@/views/app/dashboardElem/messageAnalysis.vue'

import { getNotice } from '@/request/remote/cosServer'

@Options({
    components: {
        Logger,
        Community,
        MessageAnalysis,
        BellFilled
    },
    mounted () {
        this.getNotice()
    }
})
export default class Dashboard extends Vue {
    public notice = ''

    public async getNotice () {
        const res = await getNotice()
        if (res) {
            this.notice = res
        }
    }
}
</script>

<style scoped lang="scss">

</style>
