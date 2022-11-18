<template>
    <div>
        <div class="plugin-list" v-if="pluginList.length">
            <plugin-item-card v-for="(item, index) in pluginList" :key="index" :item="item">
                <template #button>
                    <el-button type="danger" link @click="uninstall(item)">卸载</el-button>
                </template>
            </plugin-item-card>
        </div>
        <div v-else>
            <el-empty description="未安装任何插件"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getInstalledPlugin, uninstallPlugin } from '@/request/plugin'

import PluginItemCard, { PluginItem } from '@/views/app/pluginElem/pluginItemCard.vue'

@Options({
    components: {
        PluginItemCard
    },
    mounted () {
        this.getPlugin()
    }
})
export default class Plugin extends Vue {
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

    public async uninstall (item: PluginItem) {
        const res = await uninstallPlugin(item)
        if (res) {
            await this.getPlugin()
        }
    }
}
</script>

<style scoped lang="scss">
.plugin-list {
    display: flex;
    flex-wrap: wrap;
}
</style>
