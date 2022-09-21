<template>
    <div>
        <div class="plugin-list" v-if="pluginList.length">
            <div class="plugin-item" v-for="(item, index) in pluginList" :key="index">
                <div>
                    <div class="plugin-title">
                        <div class="plugin-icon"></div>
                        <div class="plugin-info">
                            <div style="display: flex;align-items: center;">
                                {{ item.name }}&nbsp;
                                <el-tag v-if="item.plugin_type === 'official'" size="small" type="success"
                                        effect="dark">
                                    <span style="font-size: 12px">官方</span>
                                </el-tag>
                            </div>
                            <div>{{ item.version }}</div>
                        </div>
                    </div>
                    <div class="plugin-desc">
                        <div v-if="item.description"><span>描述：</span>{{ item.description }}</div>
                    </div>
                </div>
                <div class="plugin-opt">
                    <el-button type="primary" link @click="checkDoc(item)">插件文档</el-button>
                    <el-button type="danger" link @click="uninstall(item)">卸载</el-button>
                </div>
            </div>
        </div>
        <div v-else>
            <el-empty description="未安装任何插件"/>
        </div>

        <v-form-dialog :title="'插件文档：' + plugin.name" ref="dialog">
            <div class="markdown-body" v-html="pluginDoc()"></div>
        </v-form-dialog>
    </div>
</template>

<script lang="ts">
import { marked } from 'marked'
import { Options, Vue } from 'vue-class-component'
import { getInstalledPlugin, uninstallPlugin } from '@/request/plugin'

import VFormDialog from '@/components/v-form-dialog.vue'
import { StringDict } from '@/lib/common'

export interface PluginItem extends StringDict {
    'name': string
    'version': string
    'plugin_id': string
    'plugin_type': string
    'description': string
    'document': string
}

@Options({
    components: {
        VFormDialog
    },
    computed: {
        dialog () {
            return this.$refs.dialog
        }
    },
    mounted () {
        this.getPlugin()
    }
})
export default class Plugin extends Vue {
    dialog!: VFormDialog

    public pluginList = []
    public plugin: PluginItem = {
        name: '',
        version: '',
        plugin_id: '',
        plugin_type: '',
        description: '',
        document: ''
    }

    public async getPlugin () {
        const res = await getInstalledPlugin()
        if (res) {
            this.pluginList = res.data
        }
    }

    public async checkDoc (item: PluginItem) {
        this.plugin = item
        this.dialog.show()
    }

    public async uninstall (item: PluginItem) {
        const res = await uninstallPlugin(item)
        if (res) {
            await this.getPlugin()
        }
    }

    public pluginDoc () {
        return marked.parse(this.plugin.document)
    }
}
</script>

<style scoped lang="scss">
.plugin-list {
    display: flex;
    flex-wrap: wrap;

    .plugin-item {
        width: 300px;
        border: 1px solid var(--el-card-border-color);
        box-shadow: var(--el-box-shadow-light);
        border-radius: var(--el-card-border-radius);
        margin: 0 10px 10px 0;
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .plugin-title {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .plugin-icon {
                width: 35px;
                height: 35px;
                margin-right: 10px;
                border-radius: 4px;
                background: var(--el-color-info-light-9) url(../../assets/icon/plugin.svg) center / 20px no-repeat;
            }

            .plugin-info {
                display: flex;
                flex-direction: column;

                & > div:last-child {
                    font-size: 12px;
                    color: var(--el-color-info-dark-2);
                }
            }
        }

        .plugin-desc > div > span:first-child {
            color: var(--el-color-info-dark-2);
        }

        .plugin-opt {
            margin-top: 20px;
            text-align: right;
        }
    }
}
</style>
