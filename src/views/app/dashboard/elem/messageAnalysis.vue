<template>
    <div class="appid">
        <div>APPID：</div>
        <el-select v-model="appid" placeholder="Select">
            <el-option v-for="appid in this.bots" :key="appid" :label="appid" :value="appid"/>
        </el-select>
    </div>
    <div class="charts" ref="charts1"></div>
    <div class="charts" ref="charts2"></div>
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
                const option1: StringDict = {
                    title: {
                        text: '唤起次数统计',
                        subtext: '近24小时'
                    },
                    legend: {
                        data: ['唤起次数']
                    },
                    grid: {
                        right: '4%',
                        bottom: 30
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        name: 'times/hour',
                        type: 'value'
                    },
                    series: {
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
                    }
                }
                const option2: StringDict = {
                    title: {
                        text: '用户/频道数统计',
                        subtext: '近24小时'
                    },
                    legend: {
                        data: ['使用用户数', '使用群聊/频道数']
                    },
                    grid: {
                        right: '4%',
                        bottom: 30
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        name: 'times/hour',
                        type: 'value'
                    },
                    color: ['#ffba31', '#56d47d'],
                    series: [
                        {
                            name: '使用用户数',
                            type: 'bar',
                            barMaxWidth: 20,
                            data: [],
                            label: {
                                show: true,
                                position: 'top'
                            },
                            itemStyle: {
                                borderRadius: [20, 20, 0, 0]
                            }
                        },
                        {
                            name: '使用群聊/频道数',
                            type: 'bar',
                            barMaxWidth: 20,
                            data: [],
                            label: {
                                show: true,
                                position: 'top'
                            },
                            itemStyle: {
                                borderRadius: [20, 20, 0, 0]
                            }
                        }
                    ]
                }

                for (const time in data) {
                    option1.xAxis.data.unshift(time)
                    option2.xAxis.data.unshift(time)
                    option1.series.data.unshift(data[time].call)
                    option2.series[0].data.unshift(data[time].user)
                    option2.series[1].data.unshift(data[time].channel)
                }

                const instance1 = getInstanceByDom(this.$refs.charts1)
                if (instance1) {
                    instance1.setOption(option1)
                }
                const instance2 = getInstanceByDom(this.$refs.charts2)
                if (instance2) {
                    instance2.setOption(option2)
                }
            },
            deep: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            initECharts(this.$refs.charts1)
            initECharts(this.$refs.charts2)
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
    margin-bottom: 20px;
}

.charts {
    height: calc((100% - 52px) / 2);
}
</style>
