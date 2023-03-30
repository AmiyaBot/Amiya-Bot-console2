<template>
    <div class="header-panel">
        <el-button type="primary" @click="$refs.dialog.show()">上传创意插件</el-button>
        <el-input style="width: 520px" v-model="searchInput" placeholder="输入任意值搜索创意插件..."
                  @change="searchPlugins()">
            <template #append>
                <el-button :icon="searchIcon"/>
            </template>
        </el-input>
    </div>

    <div class="shop-panel">
        <slot></slot>

        <template v-for="(list, author) in pluginShowList" :key="author">
            <div class="plugin-author">{{ author }}</div>
            <div class="plugin-list">
                <plugin-item-card v-for="(item, index) in list"
                                  :key="index"
                                  :item="item"
                                  :author="author"
                                  :download-count="item.plugin_info.download_num">
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
                        <el-button round type="danger" @click="uninstall(item)" v-else>卸载</el-button>
                        <div class="more-options">
                            <el-link type="primary" @click="downloadPlugin(item)">下载插件</el-link>
                            <el-link type="warning" @click="getHistory(item)">历史版本</el-link>
                            <el-link type="danger" @click="deletePlugin(item)">下架插件</el-link>
                        </div>
                    </template>
                </plugin-item-card>
            </div>
        </template>
    </div>

    <v-form-dialog title="上传创意插件" :form="form" ref="dialog" :width="1200">
        <div class="upload-panel">
            <el-upload drag :action="uploadUrl" :show-file-list="false"
                       :on-success="uploaded"
                       :on-error="uploadFail"
                       :before-upload="beforeUpload">
                <el-icon class="el-icon--upload">
                    <upload-filled/>
                </el-icon>
                <div class="el-upload__text">
                    拖动插件到此处或<em>点击上传</em>解析插件信息
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        仅支持通过 zip 打包的插件，大小不超过50MB。上传超大插件请联系开发者获得帮助。
                    </div>
                </template>
            </el-upload>
            <div class="uploaded-plugin">
                <el-alert class="upload-status" title="解析成功" show-icon type="success" v-if="isUpload"
                          :closable="false"/>
                <el-alert class="upload-status" title="请上传插件进行解析" show-icon type="info" v-else
                          :closable="false"/>
                <plugin-item-card :item="uploadedPlugin" :on-list="false" v-if="isUpload" :detail-mode="true"/>
            </div>
        </div>
        <div class="upload-result">
            <template v-if="isUpload">
                <template v-if="uploadedPlugin.success.length">
                    <el-alert v-for="(item, index) in uploadedPlugin.success" :key="index" :title="item"
                              show-icon type="success" effect="dark" :closable="false"/>
                </template>
                <template v-if="uploadedPlugin.error.length">
                    <el-alert v-for="(item, index) in uploadedPlugin.error" :key="index" :title="item"
                              show-icon type="error" effect="dark" :closable="false"/>
                </template>
                <el-alert v-else title="通过校验，允许上传" show-icon type="success" effect="dark"
                          :closable="false"/>
                <template v-if="uploadedPlugin.warning.length">
                    <el-alert v-for="(item, index) in uploadedPlugin.warning" :key="index" :title="item"
                              show-icon type="warning" effect="dark" :closable="false"/>
                </template>
            </template>
        </div>
        <el-form-item label="作者名称">
            <el-input v-model="form.author" placeholder="请输入插件作者的名称"/>
        </el-form-item>
        <el-form-item label="插件密钥">
            <el-input v-model="form.secret_key"
                      placeholder="密钥用于绑定插件ID，当后续继续上传此ID的插件时需要验证上一次的密钥"/>
        </el-form-item>
        <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea"
                      placeholder="选填..."/>
        </el-form-item>
        <template #footer>
                <span style="margin-right: 10px;font-size: 12px;color: var(--el-color-danger)"
                      v-if="isUpload && !uploadedPlugin.ready">请解决所有问题后提交</span>
            <el-button type="primary" :disabled="!isUpload || !uploadedPlugin.ready" @click="commit">
                确认提交
            </el-button>
        </template>
    </v-form-dialog>

    <v-dialog title="历史版本" ref="history" :append-to-body="true">
        <div class="v-table">
            <el-table :data="pluginsHistory" style="width: 100%" height="250"
                      header-cell-class-name="v-table-header">
                <el-table-column prop="name" label="插件名"/>
                <el-table-column prop="version" label="版本"/>
                <el-table-column prop="upload_time" label="上传时间"/>
                <el-table-column label="操作" fixed="right">
                    <template #default="scope">
                        <el-link :underline="false" type="primary"
                                 v-if="currPlugin.version !== scope.row.installed_version"
                                 @click="install(scope.row)">安装此版本
                        </el-link>
                        <el-link :underline="false" type="info" disabled v-else>已安装</el-link>
                        <el-link :underline="false" type="danger" @click="deleteHistory(scope.row)">
                            下架
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </v-dialog>
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { Options, Vue } from 'vue-class-component'
import {
    getInstalledPlugin,
    installPlugin,
    upgradePlugin,
    uninstallPlugin,
    getPluginPostData
} from '@/request/plugin'
import {
    getCustomPluginShop,
    commitToCustomShop,
    delCustomPlugin,
    getHistoryVersion,
    uploadPluginUrl
} from '@/request/remote/amiyabotServer'
import { CaretTop, CaretBottom, UploadFilled, Search } from '@element-plus/icons-vue'

import Notice from '@/lib/message'
import VDialog from '@/components/v-dialog.vue'
import VFormDialog from '@/components/v-form-dialog.vue'
import { PluginItem } from '@/views/app/plugin/pluginDetail.vue'
import PluginItemCard from '@/views/app/plugin/pluginItemCard.vue'
import Common, { DictArray, StringDict } from '@/lib/common'

interface Authors {
    [key: string]: Array<PluginItem>
}

interface AuthorsSort {
    [key: string]: number
}

@Options({
    components: {
        CaretTop,
        CaretBottom,
        UploadFilled,
        VDialog,
        VFormDialog,
        PluginItemCard
    },
    computed: {
        isUpload () {
            return Object.keys(this.uploadedPlugin).length
        },
        dialog () {
            return this.$refs.dialog
        },
        historyDialog () {
            return this.$refs.history
        }
    },
    data () {
        return {
            uploadUrl: uploadPluginUrl
        }
    },
    mounted () {
        this.getPlugins()
    }
})
export default class ShopCustom extends Vue {
    dialog!: VFormDialog
    historyDialog!: VDialog

    private form = {
        author: '',
        secret_key: '',
        remark: ''
    }

    private searchIcon = shallowRef(Search)
    private searchInput = ''

    private pluginAuthors: Authors = {}
    private pluginShowList: Authors = {}
    private pluginsHistory: DictArray = []
    private currPlugin: StringDict = {}
    private uploadedPlugin: StringDict = {}

    public searchPlugins () {
        const authors: Authors = {}
        const value = this.searchInput.toLowerCase()

        if (value === '') {
            this.pluginShowList = this.pluginAuthors
        }

        for (const name in this.pluginAuthors) {
            if (name.toLowerCase().indexOf(value) >= 0) {
                authors[name] = this.pluginAuthors[name]
            } else {
                for (const item of this.pluginAuthors[name]) {
                    if (item.name.toLowerCase().indexOf(value) >= 0) {
                        if (!authors[name]) {
                            authors[name] = []
                        }
                        authors[name].push(item)
                    }
                }
            }
        }

        this.pluginShowList = authors
    }

    public async getPlugins () {
        const shop = await getCustomPluginShop()
        if (shop) {
            const res = await getInstalledPlugin()
            const installedPlugin: StringDict = {}
            if (res) {
                const list: Array<PluginItem> = res.data
                for (const item of list) {
                    installedPlugin[item.plugin_id] = item.version
                }
            }
            const authorsSort: AuthorsSort = {}
            const pluginsList: Array<PluginItem> = shop.data.filter((item: PluginItem) => {
                item.installed = item.plugin_id in installedPlugin
                item.upgrade = installedPlugin[item.plugin_id] ? item.version > installedPlugin[item.plugin_id] : false
                item.higher = installedPlugin[item.plugin_id] ? item.version < installedPlugin[item.plugin_id] : false
                item.installed_version = installedPlugin[item.plugin_id]
                if (item.upgrade) {
                    item.curr_version = installedPlugin[item.plugin_id] + ' >> '
                }
                if (item.higher) {
                    item.curr_version = installedPlugin[item.plugin_id] + ' << '
                }

                const author = item.plugin_info.author
                const lastUpdate = new Date(item.upload_time).getTime()

                if (author in authorsSort) {
                    if (lastUpdate > authorsSort[author]) {
                        authorsSort[author] = lastUpdate
                    }
                } else {
                    authorsSort[author] = lastUpdate
                }

                return true
            })

            const authors: Authors = {}
            const sorted = Object.keys(authorsSort).sort((a, b) => {
                return authorsSort[b] - authorsSort[a]
            })

            for (const name of sorted) {
                authors[name] = []
            }
            for (const item of pluginsList) {
                authors[item.plugin_info.author].push(item)
            }

            this.pluginAuthors = authors
            this.pluginShowList = Common.deepCopy(authors)
        }
    }

    public async getHistory (item: StringDict) {
        const res = await getHistoryVersion(item)
        if (res) {
            this.currPlugin = item
            this.pluginsHistory = res.data
            this.historyDialog.show()
        }
    }

    public uploaded (response: any) {
        this.uploadedPlugin = response
    }

    public beforeUpload (file: any) {
        if (file.size >= 50 * 1024 * 1024) {
            Notice.alert('插件大小不能超过50MB。上传超大插件请联系开发者获得帮助。')
            return false
        }
    }

    public async uploadFail () {
        this.uploadedPlugin = {}
        await Notice.alert('请通过官方项目测试你的插件是否能正常加载，或打包的时候是否缺少相关第三方依赖。', '插件解析失败', () => null, 'error')
    }

    public async commit () {
        const res = await commitToCustomShop({
            ...this.uploadedPlugin,
            ...this.form
        })
        if (res) {
            this.dialog.hide()
            this.uploadedPlugin = {}
            this.form.author = ''
            this.form.secret_key = ''
            this.form.remark = ''
            await this.getPlugins()
        }
    }

    public async downloadPlugin (item: StringDict) {
        const data = getPluginPostData(item)
        location.href = data.url
    }

    public async deletePlugin (item: StringDict) {
        const key = await Notice.prompt('输入插件密钥')
        if (key) {
            const res = await delCustomPlugin({
                ...item,
                force_delete: await Notice.confirm('是否永久下架该插件？永久下架将会释放该插件ID，并删除历史版本。', '请注意', 'warning', ['是', '否']),
                secret_key: key
            })
            if (res) {
                await this.getPlugins()
            }
        }
    }

    public async deleteHistory (item: StringDict) {
        const key = await Notice.prompt('输入插件密钥')
        if (key) {
            const res = await delCustomPlugin({
                ...item,
                force_delete: false,
                secret_key: key
            })
            if (res) {
                await this.getHistory(item)
            }
        }
    }

    public async install (item: StringDict) {
        const res = await installPlugin(item)
        if (res) {
            this.historyDialog.hide()
            await this.getPlugins()
        }
    }

    public async upgrade (item: StringDict) {
        const res = await upgradePlugin(item)
        if (res) {
            await this.getPlugins()
        }
    }

    public async uninstall (item: StringDict) {
        const res = await uninstallPlugin(item)
        if (res) {
            await this.getPlugins()
        }
    }
}
</script>

<style scoped lang="scss">
.header-panel {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
}

.shop-panel {
    height: calc(100% - 42px);
    overflow: auto;

    .plugin-author {
        font-size: 16px;
        border-left: 3px solid var(--el-color-danger);
        padding-left: 10px;
        margin-top: 20px;
    }

    .plugin-list {
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
    }
}

.upload-panel {
    display: flex;

    & > div {
        width: 50%;
    }

    .uploaded-plugin {
        padding: 0 20px;

        & > div {
            margin-bottom: 10px;
        }

        .upload-status {
            width: 100%;
        }
    }
}

.upload-result {
    margin: 10px 0 20px 0;

    & > div {
        margin-bottom: 5px;
    }
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
