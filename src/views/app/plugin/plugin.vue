<template>
    <div>
        <div v-if="pluginList.length" class="plugin-manager">
            <el-scrollbar class="plugin-list">
                <template v-for="(item, index) in pluginList" :key="index">
                    <div class="plugin-head" @click="plugin = item">
                        <div class="plugin-icon">
                            <img :src="pluginLogo(item)" alt="logo" v-if="pluginLogo(item)">
                        </div>
                        <div style="width: calc(100% - 50px)">
                            <div class="plugin-title" :class="{ selected: plugin.plugin_id === item.plugin_id }">
                                {{ item.name }}
                            </div>
                            <div style="font-size: 12px; color: var(--el-color-primary)">{{ item.version }}</div>
                        </div>
                    </div>
                </template>
            </el-scrollbar>
            <div class="plugin-page">
                <template v-for="(item, index) in pluginList" :key="index">
                    <el-tabs type="border-card" v-if="plugin.plugin_id === item.plugin_id" style="height: 100%"
                             class="plugin-card-body">
                        <el-tab-pane label="插件详情" class="plugin-panel">
                            <plugin-detail :item="item">
                                <template #button>
                                    <el-button round type="danger" @click="uninstall(item)">卸载</el-button>
                                </template>
                            </plugin-detail>
                        </el-tab-pane>
                        <el-tab-pane class="plugin-panel" v-if="item.allow_config">
                            <template #label>
                                <span style="padding-right: 5px">插件配置</span>
                                <el-tag size="small" type="danger" effect="dark" v-if="pluginChanged">updated</el-tag>
                            </template>
                            <plugin-config-editor :item="item" @change="value => pluginChanged = value"/>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <div v-else>
            <el-empty description="未安装任何插件"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { onBeforeRouteLeave } from 'vue-router'
import { getInstalledPlugin, uninstallPlugin } from '@/request/plugin'
import { Warning } from '@element-plus/icons-vue'

import PluginDetail, { PluginItem, pluginLogo } from '@/views/app/plugin/pluginDetail.vue'
import PluginConfigEditor from '@/views/app/plugin/pluginConfigEditor.vue'
import VDialog from '@/components/v-dialog.vue'

import Notice from '@/lib/message'

@Options({
    components: {
        PluginDetail,
        PluginConfigEditor,
        VDialog,
        Warning
    },
    watch: {
        plugin: {
            handler () {
                this.pluginChanged = false
            },
            deep: true
        }
    },
    mounted () {
        this.getPlugin()

        onBeforeRouteLeave((to, from, next) => {
            if (this.pluginChanged) {
                Notice.confirm('当前配置尚未保存，是否放弃修改？', '注意', 'warning', ['放弃', '再想一想']).then(next)
            } else {
                next()
            }
        })
    }
})
export default class Plugin extends Vue {
    public pluginList = []
    public plugin: PluginItem = {
        logo: '',
        name: '',
        version: '',
        plugin_id: '',
        plugin_type: '',
        description: '',
        document: '',
        instruction: '',
        allow_config: false
    }

    private pluginChanged = false

    pluginLogo (item: PluginItem) {
        return pluginLogo(item)
    }

    async getPlugin () {
        const res = await getInstalledPlugin()
        if (res) {
            this.pluginList = res.data
            if (res.data.length) {
                this.plugin = res.data[0]
            }
        }
    }

    async uninstall (item: PluginItem) {
        const res = await uninstallPlugin(item)
        if (res) {
            await this.getPlugin()
        }
    }

    async checkUpdated () {
        if (this.pluginChanged) {
            return await Notice.confirm('当前配置尚未保存，是否放弃修改？', '注意', 'warning', ['放弃', '再想一想'])
        }
        return true
    }
}
</script>

<style scoped lang="scss">
.plugin-manager {
    height: 100%;
    display: flex;

    .plugin-list {
        width: 260px;
        height: 100%;
        overflow: auto;
    }

    .plugin-page {
        width: 100%;
        height: 100%;

        .plugin-panel {
            height: 100%;
            overflow: hidden;
            padding-right: 20px;
        }
    }
}
</style>
<style>
.plugin-card-body .el-tabs__content {
    height: calc(100% - 39px);
}
</style>
