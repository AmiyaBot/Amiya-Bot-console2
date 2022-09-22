<template>
    <div>
        <v-table ref="table" :load="getShopList">
            <template #header>
                <el-button type="primary">发布插件</el-button>
            </template>
            <template #cell="{ value, field, row }">
                <div style="display: flex;align-items: center;" v-if="field === 'name'">
                    {{ value }}&nbsp;
                    <el-icon style="color: var(--el-color-warning)" v-if="row.upgrade">
                        <WarningFilled/>
                    </el-icon>
                    <el-icon style="color: var(--el-color-success)" v-else-if="row.installed">
                        <SuccessFilled/>
                    </el-icon>
                </div>
                <div style="display: flex;align-items: center;" v-if="field === 'version'">
                    {{ row.curr_version }}{{ value }}
                    <el-icon style="color: var(--el-color-success)" v-if="row.upgrade">
                        <CaretTop/>
                    </el-icon>
                </div>
                <el-tag v-if="field === 'plugin_type'" :type="value ? 'success' : 'danger'">
                    {{ value === 'official' ? '官方' : '第三方' }}
                </el-tag>
            </template>
            <template #operations="{row}">
                <el-link :underline="false" type="primary" @click="install(row)" v-if="!row.installed">安装</el-link>
                <template v-else-if="row.upgrade">
                    <el-link :underline="false" type="success" @click="upgrade(row)">更新</el-link>
                </template>
                <template v-else>
                    <el-link :underline="false" type="danger" @click="uninstall(row)">卸载</el-link>
                </template>
            </template>
        </v-table>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getPluginShop, getInstalledPlugin, installPlugin, upgradePlugin, uninstallPlugin } from '@/request/plugin'
import { StringDict } from '@/lib/common'
import { PluginItem } from '@/views/app/plugin.vue'
import { CaretTop, WarningFilled, SuccessFilled } from '@element-plus/icons-vue'

import VTable, { QueryData } from '@/components/table/vTable.vue'

@Options({
    components: {
        VTable,
        CaretTop,
        WarningFilled,
        SuccessFilled
    },
    computed: {
        table () {
            return this.$refs.table
        }
    },
    mounted () {
        this.table.setColumns({
            name: '插件名',
            version: {
                title: '版本',
                width: 150
            },
            plugin_type: {
                title: '插件类型',
                width: 150
            },
            description: '描述'
        })
    }
})
export default class Shop extends Vue {
    table!: VTable

    public async getShopList (data: QueryData) {
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
            this.table.setData(shop.filter((item: PluginItem) => {
                item.installed = item.plugin_id in installedPlugin
                item.upgrade = installedPlugin[item.plugin_id] ? item.version !== installedPlugin[item.plugin_id] : false
                if (item.upgrade) {
                    item.curr_version = installedPlugin[item.plugin_id] + ' >> '
                }

                if (data.search) {
                    if (item.name.indexOf(data.search) >= 0) {
                        return true
                    }
                    if (item.plugin_id.indexOf(data.search) >= 0) {
                        return true
                    }
                    return item.description.indexOf(data.search) >= 0
                }
                return true
            }))
        }
    }

    public async install (item: StringDict) {
        const res = await installPlugin(item)
        if (res) {
            this.table.executeLoad()
        }
    }

    public async upgrade (item: StringDict) {
        const res = await upgradePlugin(item)
        if (res) {
            this.table.executeLoad()
        }
    }

    public async uninstall (item: StringDict) {
        const res = await uninstallPlugin(item)
        if (res) {
            this.table.executeLoad()
        }
    }
}
</script>

<style scoped lang="scss">

</style>
