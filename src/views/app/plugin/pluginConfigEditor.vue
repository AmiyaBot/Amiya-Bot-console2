<template>
    <div v-if="(channelGenerator || globalGenerator) && channelList.length">
        <el-form label-width="auto">
            <el-form-item label="选择配置">
                <el-select v-model="selectedSource" @change="getSourceConfig" ref="selectSource">
                    <template #prefix>
                        <el-tag v-if="selectedSource" type="success" disable-transitions>群组</el-tag>
                        <el-tag v-else type="danger" disable-transitions>全局</el-tag>
                    </template>
                    <el-option v-for="item in channelList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                        <template #default>
                            <div class="config-option">
                                <span>{{ item.label }}</span>
                                <el-tag v-if="item.value" type="success" disable-transitions>群组</el-tag>
                                <el-tag v-else type="danger" disable-transitions>全局</el-tag>
                            </div>
                        </template>
                    </el-option>
                </el-select>
                <el-button style="margin-left: 10px" :type="hasChanged ? 'success' : ''" :disabled="!hasChanged"
                           @click="save">
                    保存
                </el-button>
                <template v-if="channelGenerator">
                    <el-button v-if="selectedSource" @click="saveAs">另存为...</el-button>
                    <el-button v-if="selectedSource" type="danger" @click="deleteConfig">删除</el-button>
                    <el-button type="primary" @click="newChannel">新建群组配置</el-button>
                </template>
            </el-form-item>
            <form-field-generator v-if="selectedSource" :form="channelFormData"
                                  :items="channelGenerator.form.formItems"/>
            <form-field-generator v-else-if="globalGenerator" :form="globalFormData"
                                  :items="globalGenerator.form.formItems"/>
            <el-empty v-else>
                <template #description>
                    <div style="display: flex">
                        该插件无全局配置选项，请
                        <el-link type="primary"
                                 @click="() => $refs.selectSource.focus()">选择
                        </el-link>
                        或
                        <el-link type="primary"
                                 @click="newChannel">新建群组配置
                        </el-link>
                    </div>
                </template>
            </el-empty>
        </el-form>
    </div>
    <el-empty v-else description="无法配置插件"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getPluginConfig, getPluginDefaultConfig, setPluginConfig, delPluginConfig } from '@/request/plugin'
import Common, { StringDict } from '@/lib/common'
import { PluginItem } from '@/views/app/plugin/pluginDetail.vue'

import FormGenerator from '@/components/formGenerator/formGenerator'
import FormFieldGenerator from '@/components/formGenerator/formFieldGenerator.vue'

import Notice from '@/lib/message'

@Options({
    props: {
        item: Object
    },
    components: {
        FormFieldGenerator
    },
    watch: {
        globalFormData: {
            handler () {
                this.hasChanged = true
            },
            deep: true
        },
        channelFormData: {
            handler () {
                this.hasChanged = true
            },
            deep: true
        },
        hasChanged (value) {
            this.$emit('change', value)
        }
    },
    data () {
        return {
            globalGenerator: null,
            channelGenerator: null
        }
    },
    mounted () {
        this.initConfig()
    }
})
export default class PluginConfigEditor extends Vue {
    item!: PluginItem
    globalGenerator!: FormGenerator
    channelGenerator!: FormGenerator

    private globalFormData: StringDict = {}
    private globalFormDefaultData: StringDict = {}
    private channelFormData: StringDict = {}
    private channelFormDefaultData: StringDict = {}
    private channelConfigSaved: StringDict = {}

    private selectedSource = ''
    private channelList: Array<StringDict> = []

    private hasChanged = false

    async initConfig () {
        const template = await getPluginDefaultConfig({
            plugin_id: this.item.plugin_id
        })

        if (template.data) {
            /**
             * 加载全局配置
             */
            if (template.data.global_config_default !== 'null') {
                this.globalFormData = JSON.parse(template.data.global_config_default)
                this.globalFormDefaultData = JSON.parse(template.data.global_config_default)

                if (template.data.global_config_schema !== 'null') {
                    this.globalGenerator = new FormGenerator(
                        JSON.parse(template.data.global_config_schema),
                        true
                    )
                } else {
                    this.globalGenerator = new FormGenerator(
                        this.globalFormData
                    )
                }
            }
            /**
             * 加载频道配置
             */
            if (template.data.channel_config_default !== 'null') {
                this.channelFormData = JSON.parse(template.data.channel_config_default)
                this.channelFormDefaultData = JSON.parse(template.data.channel_config_default)

                if (template.data.channel_config_schema !== 'null') {
                    this.channelGenerator = new FormGenerator(
                        JSON.parse(template.data.channel_config_schema),
                        true
                    )
                } else {
                    this.channelGenerator = new FormGenerator(
                        this.channelFormData
                    )
                }
            }
        }

        await this.getConfig()
    }

    async getConfig () {
        const res = await getPluginConfig({
            plugin_id: this.item.plugin_id
        })
        if (res) {
            const channelList = [
                { label: '全局配置', value: '' }
            ]

            for (const cid in res.data) {
                if (!cid) {
                    continue
                }
                channelList.push({ label: cid, value: cid })
            }
            this.channelList = channelList
            this.channelConfigSaved = res.data

            await this.getSourceConfig(this.selectedSource)
        }
        this.hasChanged = false
    }

    async getSourceConfig (value: string) {
        if (value) {
            if (value in this.channelConfigSaved) {
                this.channelFormData = JSON.parse(this.channelConfigSaved[value])
                await this.$nextTick(() => this.hasChanged = false)
                return
            }
            this.channelFormData = Common.deepCopy(this.channelFormDefaultData)
            await this.$nextTick(() => this.hasChanged = false)
            return
        }
        this.globalFormData = this.channelConfigSaved[''] ? JSON.parse(this.channelConfigSaved['']) : Common.deepCopy(this.globalFormDefaultData)
        await this.$nextTick(() => this.hasChanged = false)
    }

    async save () {
        await setPluginConfig({
            plugin_id: this.item.plugin_id,
            channel_id: this.selectedSource,
            config_json: JSON.stringify(
                this.selectedSource ? this.channelFormData : this.globalFormData
            )
        })
        await this.getConfig()
    }

    async saveAs () {
        const res = await Notice.prompt('请输入频道/群组号', '另存为新群组配置')
        if (res) {
            this.channelList.push({
                label: res,
                value: res
            })
            this.selectedSource = res
            await this.save()
        }
    }

    async deleteConfig () {
        const res = await Notice.confirm(`确定删除群号【${this.selectedSource}】的配置`, '删除配置')
        if (res) {
            await delPluginConfig({
                plugin_id: this.item.plugin_id,
                channel_id: this.selectedSource
            })

            let index = null
            for (const i in this.channelList) {
                if (this.channelList[i].value === this.selectedSource) {
                    index = parseInt(i)
                    break
                }
            }

            if (index !== null) {
                this.channelList.splice(index, 1)
                if (this.channelList.length) {
                    this.selectedSource = this.channelList[0].value
                } else {
                    this.selectedSource = ''
                }
            }

            await this.getConfig()
        }
    }

    async newChannel () {
        const res = await Notice.prompt('请输入频道/群组号', '新建配置')
        if (res) {
            this.selectedSource = res
            this.channelFormData = Common.deepCopy(this.channelFormDefaultData)
        }
    }
}
</script>

<style scoped lang="scss">
.config-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
