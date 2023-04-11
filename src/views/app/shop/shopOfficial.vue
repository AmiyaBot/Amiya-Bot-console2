<template>
    <div class="plugin-author">官方插件</div>
    <div class="plugin-list">
        <plugin-item-card v-for="(item, index) in officialPlugins" :key="index" :item="item" :batch-mode="batchMode"
                          @selected="() => this.$emit('selected', item)"
                          @unselected="() => this.$emit('unselected', item)">
            <template #version>
                <div style="display: flex;align-items: center;">
                    {{ item.curr_version }}{{ item.version }}
                    <el-icon style="color: var(--el-color-success)" v-if="item.upgrade">
                        <CaretTop/>
                    </el-icon>
                    <el-icon style="color: var(--el-color-danger)" v-if="item.higher">
                        <CaretBottom/>
                    </el-icon>
                </div>
            </template>
            <template #button>
                <el-button round type="success" @click="upgrade(item)" v-if="item.upgrade">更新</el-button>
                <el-button round type="primary" @click="install(item)" v-if="!item.installed">安装</el-button>
                <el-button round type="danger" @click="uninstall(item)" style="margin-left: 10px" v-else>
                    卸载
                </el-button>
                <div class="more-options">
                    <el-link type="primary" @click="downloadPlugin(item)">下载插件</el-link>
                </div>
            </template>
        </plugin-item-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    getPluginShop,
    getInstalledPlugin,
    installPlugin,
    upgradePlugin,
    uninstallPlugin,
    getPluginPostData
} from '@/request/plugin'
import { StringDict } from '@/lib/common'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'

import { PluginItem } from '@/views/app/plugin/pluginDetail.vue'
import PluginItemCard from '@/views/app/plugin/pluginItemCard.vue'

@Options({
    emits: [
        'selected',
        'unselected'
    ],
    props: {
        batchMode: Boolean
    },
    components: {
        CaretTop,
        CaretBottom,
        PluginItemCard
    }
})
export default class ShopOfficial extends Vue {
    public officialPlugins = []

    public async getShopList () {
        const shop = await getPluginShop()
        if (shop) {
            const res = await getInstalledPlugin()
            const installedPlugin: StringDict = {}
            if (res) {
                const list: Array<PluginItem> = res.data
                for (const item of list) {
                    installedPlugin[item.plugin_id] = item.version
                }
            }
            this.officialPlugins = shop.filter((item: PluginItem) => {
                item.installed = item.plugin_id in installedPlugin
                item.upgrade = installedPlugin[item.plugin_id] ? item.version > installedPlugin[item.plugin_id] : false
                item.higher = installedPlugin[item.plugin_id] ? item.version < installedPlugin[item.plugin_id] : false
                if (item.upgrade) {
                    item.curr_version = installedPlugin[item.plugin_id] + ' >> '
                }
                if (item.higher) {
                    item.curr_version = installedPlugin[item.plugin_id] + ' << '
                }
                return true
            })
        }
    }

    public async install (item: StringDict) {
        const res = await installPlugin(item)
        if (res) {
            await this.getShopList()
        }
    }

    public async upgrade (item: StringDict) {
        const res = await upgradePlugin(item)
        if (res) {
            await this.getShopList()
        }
    }

    public async uninstall (item: StringDict) {
        const res = await uninstallPlugin(item)
        if (res) {
            await this.getShopList()
        }
    }

    public async downloadPlugin (item: StringDict) {
        const data = getPluginPostData(item)
        location.href = data.url
    }
}
</script>

<style scoped lang="scss">
.plugin-author {
    font-size: 16px;
    border-left: 3px solid var(--el-color-success);
    padding-left: 10px;
    margin-top: 20px;
}

.plugin-list {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
}

.more-options {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > a:not(:last-child) {
        margin-bottom: 2px;
    }
}
</style>
