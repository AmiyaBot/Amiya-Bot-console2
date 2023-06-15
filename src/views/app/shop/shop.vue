<template>
    <div>
        <div class="header-panel">
            <div>
                <el-button type="primary" @click="$refs.dialog.show()">上传创意插件</el-button>
                <el-button v-if="!batchMode" @click="batchMode = true">批量安装插件</el-button>
                <el-button v-else type="danger" @click="batchMode = false">取消批量安装</el-button>
                <el-button v-if="batchMode" type="success" @click="batchInstall">
                    安装（已选{{ Object.keys(batchList).length }}）
                </el-button>
            </div>
            <el-input style="width: 520px" v-model="searchInput" placeholder="输入任意值搜索创意插件..."
                      @change="searchPlugins()">
                <template #append>
                    <el-button :icon="searchIcon"/>
                </template>
            </el-input>
        </div>

        <div class="shop-panel">
            <shop-official :batch-mode="batchMode" ref="officialShop"
                           @selected="selectPlugin"
                           @unselected="unselectedPlugin"/>

            <template v-for="(list, author) in pluginShowList" :key="author">
                <div class="plugin-author">{{ author }}</div>
                <div class="plugin-list">
                    <plugin-item-card v-for="(item, index) in list"
                                      :key="index"
                                      :item="item"
                                      :author="author"
                                      :batch-mode="batchMode"
                                      :download-count="item.plugin_info.download_num"
                                      @selected="selectPlugin(item)"
                                      @unselected="unselectedPlugin(item)">
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
                            <el-button round type="primary" @click="install(item)" v-if="!item.installed">安装
                            </el-button>
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
                        <div class="el-upload__tip" style="font-size: 14px; display: flex">
                            仅支持通过 zip 打包的插件，大小不超过50MB。上传超大插件请
                            <el-link class="link" type="primary" @click="callAdmin">联系管理员</el-link>
                            获得帮助。
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
                <el-button @click="forgotKey">
                    忘记密钥
                </el-button>
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

        <v-dialog ref="batchInstall" title="批量安装插件" @closed="getPlugins">
            <div class="batch-install-plugins">
                <div :class="batchInstallProcess.status[item.plugin_id]" v-for="(item, index) in batchList"
                     :key="index">
                    {{ item.name }}
                </div>
            </div>
            <el-progress :text-inside="true"
                         :stroke-width="16"
                         :status="batchInstallProcess.percentage >= 100 ? 'success' : ''"
                         :percentage="batchInstallProcess.percentage"></el-progress>
            <div style="margin-top: 20px; text-align: center;">
                总数：{{ Object.keys(batchList).length }}，
                成功：
                <span style="color: #4CAF50">
                    {{ Object.values(batchInstallProcess.status).filter(n => n === 'success').length }}
                </span>，
                失败：
                <span style="color: #F44336">
                    {{ Object.values(batchInstallProcess.status).filter(n => n !== 'success').length }}
                </span>
            </div>
        </v-dialog>
    </div>
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
import ShopOfficial from '@/views/app/shop/shopOfficial.vue'
import Common, { DictArray, StringDict } from '@/lib/common'
import { RequestControl } from '@/lib/http'

interface Authors {
    [key: string]: Array<PluginItem>
}

interface AuthorsSort {
    [key: string]: number
}

interface BatchInstallProcess {
    percentage: number
    status: { [key: string]: string }
}

@Options({
    components: {
        CaretTop,
        CaretBottom,
        UploadFilled,
        VDialog,
        VFormDialog,
        PluginItemCard,
        ShopOfficial
    },
    computed: {
        isUpload () {
            return Object.keys(this.uploadedPlugin).length
        },
        officialShop () {
            return this.$refs.officialShop
        },
        dialog () {
            return this.$refs.dialog
        },
        historyDialog () {
            return this.$refs.history
        },
        batchInstallDialog () {
            return this.$refs.batchInstall
        }
    },
    watch: {
        batchMode () {
            this.batchList = {}
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
    batchInstallDialog!: VDialog

    officialShop!: ShopOfficial

    private form = {
        author: '',
        secret_key: '',
        remark: ''
    }

    private searchIcon = shallowRef(Search)
    private searchInput = ''

    private batchMode = false
    private batchList: { [key: string]: PluginItem } = {}
    private batchInstallProcess: BatchInstallProcess = {
        percentage: 0,
        status: {}
    }

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
        this.batchMode = false

        await this.officialShop.getShopList()

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

    public async uploaded (response: any) {
        if (response.status === 'ok') {
            this.form.author = response.author || ''
            this.uploadedPlugin = response
        } else {
            await Notice.alert('异常信息：<br>' + response.message.replace(/\n/g, '<br>'), '插件解析失败', () => null, 'error')
        }
    }

    public async beforeUpload (file: any) {
        if (file.size >= 50 * 1024 * 1024) {
            if (await Notice.confirm('插件大小不能超过50MB。上传超大插件请联系管理员获得帮助。', '文件体积过大', 'error', ['联系管理员', '不了'])) {
                await this.callAdmin()
            }
            return false
        }
    }

    public async uploadFail () {
        this.uploadedPlugin = {}
        await Notice.alert('插件服务器异常。', '插件上传失败', () => null, 'error')
    }

    public async forgotKey () {
        if (await Notice.confirm('忘记密钥请联系管理员获得帮助。', '忘记密钥', 'info', ['联系管理员', '再想一想'])) {
            await this.callAdmin()
        }
    }

    public async callAdmin () {
        window.open('https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W4sJux&appChannel=share&businessType=9&from=181074&biz=ka&shareSource=5')
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
            if (await Notice.confirm(`确认下架插件【${item.name} v${item.version}】？`)) {
                const res = await delCustomPlugin({
                    ...item,
                    force_delete: !await Notice.confirm('是否仅下架该版本？否则永久下架将会释放该插件ID，并删除历史版本。', '请注意', 'warning', ['仅下架该版本', '永久下架']),
                    secret_key: key
                })
                if (res) {
                    await this.getPlugins()
                }
            }
        }
    }

    public async deleteHistory (item: StringDict) {
        const key = await Notice.prompt('输入插件密钥')
        if (key) {
            if (await Notice.confirm(`确认下架插件【${item.name} v${item.version}】？`)) {
                const res = await delCustomPlugin({
                    ...item,
                    force_delete: false,
                    secret_key: key
                })
                if (res) {
                    await this.getHistory(item)
                    await this.getPlugins()
                }
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

    public async batchInstall () {
        const list = Object.values(this.batchList)

        if (list.length === 0) {
            Notice.toast('未选择插件')
            return
        }

        if (!await Notice.confirm(`将批量安装已选的 ${list.length} 个插件，请确定你已经阅读过它们的文档以确保你符合安装条件，否则安装过程中部分插件可能安装失败。`)) {
            return
        }

        this.batchInstallProcess.status = {}
        this.batchInstallProcess.percentage = 0

        await this.batchInstallDialog.asyncShow()

        await RequestControl.silentRequest(async () => {
            for (const index in list) {
                const item = list[index]

                let res: any
                if (item.upgrade) {
                    res = await upgradePlugin(item)
                } else {
                    res = await installPlugin(item)
                }

                this.batchInstallProcess.status[item.plugin_id] = res ? 'success' : 'error'
                this.batchInstallProcess.percentage = Number(((Number(index) + 1) / list.length * 100).toFixed(0))
            }
        })
    }

    public selectPlugin (item: PluginItem) {
        this.batchList[item.plugin_id] = item
    }

    public unselectedPlugin (item: PluginItem) {
        delete this.batchList[item.plugin_id]
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

.batch-install-plugins {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    & > div {
        width: calc(20% - 10px);
        padding: 2px 10px 2px 5px;
        margin-right: 10px;
        margin-bottom: 5px;
        border: 1px solid #e3e3e3;
        border-radius: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
    }

    & > div.success {
        color: #4CAF50;
        border-color: #4CAF50;
        background-color: #E8F5E9;
    }

    & > div.error {
        color: #F44336;
        border-color: #F44336;
        background-color: #FFEBEE;
    }
}
</style>
