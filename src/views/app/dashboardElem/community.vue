<template>
    <div class="community">
        <el-card>
            <div style="display: flex">
                <number-card :value="total.online" color="4caf50">
                    <template #default>
                        <span>在线</span>
                        <span>Bot实例数量</span>
                    </template>
                </number-card>
                <number-card :value="total.count" color="5f75ed">
                    <template #default>
                        <span>社区累计</span>
                        <span>Bot实例数量</span>
                    </template>
                </number-card>
                <number-card :value="total.deploy" color="ff7ea8">
                    <template #default>
                        <span>社区累计</span>
                        <span>部署用户数量</span>
                    </template>
                </number-card>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getBotCommunity } from '@/request/remote/amiyabotServer'
import { StringDict } from '@/lib/common'

import NumberCard from '@/views/app/dashboardElem/numberCard.vue'

@Options({
    components: {
        NumberCard
    },
    mounted () {
        this.getData()
    }
})
export default class Community extends Vue {
    public total: StringDict = {}

    public async getData () {
        const res = await getBotCommunity()
        if (res) {
            this.total = res.data
        }
    }
}
</script>

<style scoped lang="scss">
.community {

}
</style>
