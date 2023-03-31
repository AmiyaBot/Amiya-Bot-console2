<template>
    <div class="charts" ref="charts"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getFunctionsUsed } from '@/request/dashboard'

import { getInstanceByDom, init as initECharts } from 'echarts'
import { StringDict } from '@/lib/common'

@Options({
    watch: {
        chartsData: {
            handler (data) {
                const option: StringDict = {
                    title: {
                        text: '功能使用总量',
                        subtext: '自该功能加入统计起'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        top: 60,
                        left: 0,
                        bottom: 20
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    series: {
                        type: 'pie',
                        radius: ['50%', '80%'],
                        center: ['65%', '50%'],
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            fontSize: '20',
                            fontWeight: 'bold',
                            position: 'center',
                            formatter: (data: StringDict) => {
                                return data.name.replace(`（${data.value}）`, '') + '\n\n' + data.value + `（${data.percent}%）`
                            }
                        },
                        minAngle: 5,
                        data: []
                    }
                }

                for (const item of data) {
                    option.series.data.push({
                        name: item.function_id + `（${item.use_num}）`,
                        value: item.use_num
                    })
                }
                option.series.data[0].selected = true
                option.series.data[0].label = { show: true }

                const instance = getInstanceByDom(this.$refs.charts)
                if (instance) {
                    instance.setOption(option)
                }
            },
            deep: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            initECharts(this.$refs.charts)
            this.$nextTick(this.getFunctionsUsed)
        })
    }
})
export default class FuncUsage extends Vue {
    public chartsData: Array<StringDict> = []

    public async getFunctionsUsed () {
        const res = await getFunctionsUsed()
        this.chartsData = res.data.sort((a: StringDict, b: StringDict) => {
            return b.use_num - a.use_num
        })
    }
}
</script>

<style scoped lang="scss">
.charts {
    height: 100%;
}
</style>
