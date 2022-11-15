<template>
    <div>
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="官方商店" name="first">
                <div class="plugin-list">
                    <plugin-item-card v-for="(item, index) in officialPlugins" :key="index" :item="item">
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
                            <el-link :underline="false" type="success" @click="upgrade(item)" v-if="item.upgrade">
                                更新
                            </el-link>
                            <el-link :underline="false" type="primary" @click="install(item)" v-if="!item.installed">
                                安装
                            </el-link>
                            <el-link :underline="false" type="danger" @click="uninstall(item)" style="margin-left: 10px"
                                     v-else>
                                卸载
                            </el-link>
                        </template>
                    </plugin-item-card>
                </div>
            </el-tab-pane>
            <el-tab-pane label="创意商店" name="second">
                <el-alert
                    title="温馨提示，创意商店为非官方维护的插件商店，由网友上传。您在下载使用该插件时，应考虑它的功能安全性。使用创意插件产生的一切问题，本项目概不负责。"
                    type="error" effect="dark" :closable="false"/>
                <div style="margin: 10px 0">
                    <el-button type="primary">上传创意插件</el-button>
                </div>
                <el-empty description="暂无创意插件，敬请期待..."/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getPluginShop, getInstalledPlugin, installPlugin, upgradePlugin, uninstallPlugin } from '@/request/plugin'
import { StringDict } from '@/lib/common'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'

import PluginItemCard, { PluginItem } from '@/views/app/pluginElem/pluginItemCard.vue'

@Options({
    components: {
        CaretTop,
        CaretBottom,
        PluginItemCard
    },
    mounted () {
        this.getShopList()
    }
})
export default class Shop extends Vue {
    public activeName = 'first'
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
}
</script>

<style scoped lang="scss">
.plugin-list {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
}
</style>
