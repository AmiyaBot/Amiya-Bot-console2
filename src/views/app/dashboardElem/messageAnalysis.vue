<template>
    <el-card>
        <template #header>消息统计</template>
        <div class="appid">
            <div>APPID：</div>
            <el-select v-model="appid" placeholder="Select">
                <el-option v-for="appid in this.bots" :key="appid" :label="appid" :value="appid"/>
            </el-select>
        </div>
        <div class="charts" ref="charts"></div>
    </el-card>
</template>

<script lang="ts">
import { StringDict } from '@/lib/common'
import { Options, Vue } from 'vue-class-component'
import { getInstanceList } from '@/request/instance'
import { getMessageRecord } from '@/request/dashboard'

import { graphic, getInstanceByDom, init as initECharts } from 'echarts'

@Options({
    watch: {
        appid (value) {
            this.getRecordByAppid(value)
        },
        chartsData: {
            handler (data) {
                const option: StringDict = {
                    title: {
                        text: '消息数量分析',
                        subtext: '近24小时'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['唤起次数', '使用用户数', '使用群聊/频道数']
                    },
                    axisPointer: {
                        link: [
                            {
                                xAxisIndex: 'all'
                            }
                        ]
                    },
                    grid: [
                        {
                            top: 80,
                            left: '10%',
                            right: '4%',
                            height: '35%'
                        },
                        {
                            top: 285,
                            left: '10%',
                            right: '4%',
                            height: '35%'
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            axisLine: { onZero: true },
                            axisLabel: { show: false },
                            data: []
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            boundaryGap: false,
                            axisLine: { onZero: true },
                            data: [],
                            position: 'top'
                        }
                    ],
                    yAxis: [
                        {
                            name: 't/h',
                            type: 'value',
                            offset: 15
                        },
                        {
                            name: 't/h',
                            type: 'value',
                            inverse: true,
                            gridIndex: 1,
                            offset: 15
                        }
                    ],
                    color: ['#5f75ed', '#ffba31', '#56d47d'],
                    series: [
                        {
                            name: '唤起次数',
                            type: 'line',
                            areaStyle: {
                                opacity: 0.8,
                                color: new graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: 'rgba(0, 221, 255)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(77, 119, 255)'
                                    }
                                ])
                            },
                            label: {
                                show: true
                            },
                            data: [],
                            smooth: true
                        },
                        {
                            name: '使用用户数',
                            type: 'bar',
                            barMaxWidth: 20,
                            stack: 'count',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: [],
                            smooth: true
                        },
                        {
                            name: '使用群聊/频道数',
                            type: 'bar',
                            barMaxWidth: 20,
                            stack: 'count',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: [],
                            smooth: true
                        }
                    ]
                }
                for (const time in data) {
                    option.xAxis[0].data.unshift(time)
                    option.xAxis[1].data.unshift(time)
                    option.series[0].data.unshift(data[time].call)
                    option.series[1].data.unshift(data[time].user)
                    option.series[2].data.unshift(data[time].channel)
                }

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
            this.$nextTick(this.getBotList)
        })
    }
})
export default class MessageAnalysis extends Vue {
    public bots: Array<string> = []
    public appid = ''
    public chartsData: StringDict = {}

    public async getBotList () {
        const bots = await getInstanceList()
        if (bots) {
            this.bots = bots.data.map((n: StringDict) => n.appid)
            if (this.bots.length) {
                this.appid = this.bots[0]
            }
        }
    }

    public async getRecordByAppid (appid: string) {
        const res = await getMessageRecord(appid)
        if (res) {
            this.chartsData = res.data
        }
    }
}
</script>

<style scoped lang="scss">
.appid {
    display: flex;
    align-items: center;
}

.charts {
    height: 500px;
    margin-top: 20px;
}
</style>
