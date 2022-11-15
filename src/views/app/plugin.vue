<template>
    <div>
        <div class="plugin-list" v-if="pluginList.length">
            <plugin-item-card v-for="(item, index) in pluginList" :key="index" :item="item">
                <template #button>
                    <el-button type="primary" link @click="checkDoc(item)">插件文档</el-button>
                    <el-button type="danger" link @click="uninstall(item)">卸载</el-button>
                </template>
            </plugin-item-card>
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
import PluginItemCard, { PluginItem } from '@/views/app/pluginElem/pluginItemCard.vue'

@Options({
    components: {
        VFormDialog,
        PluginItemCard
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
}
</style>
