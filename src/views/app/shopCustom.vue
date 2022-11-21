<template>
    <el-alert
        title="温馨提示，创意商店为非官方维护的插件商店，由网友上传。您在下载使用该插件时，应考虑它的功能安全性。使用创意插件产生的一切问题，本项目概不负责。"
        type="error" effect="dark" :closable="false"/>
    <div style="margin: 10px 0">
        <el-button type="primary" @click="$refs.dialog.show()">上传创意插件</el-button>
    </div>

    <div class="plugin-list" v-if="pluginsList.length">
        <plugin-item-card v-for="(item, index) in pluginsList" :key="index" :item="item">
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
                <el-link :underline="false" type="danger" @click="uninstall(item)" style="margin-left: 10px" v-else>
                    卸载
                </el-link>
                <el-link :underline="false" type="danger" @click="deletePlugin(item)" style="margin-left: 10px">
                    下架插件
                </el-link>
            </template>
        </plugin-item-card>
    </div>
    <el-empty v-else description="暂无创意插件，敬请期待..."/>

    <v-form-dialog title="上传创意插件" :form="form" ref="dialog" :width="1200">
        <el-upload drag :action="uploadUrl" :show-file-list="false" accept="application/zip"
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
        <el-alert class="upload-status" title="解析成功" show-icon type="success" v-if="isUpload"
                  :closable="false"/>
        <el-alert class="upload-status" title="请上传插件进行解析" show-icon type="info" v-else
                  :closable="false"/>
        <div class="uploaded-plugin">
            <template v-if="isUpload">
                <div>
                    <plugin-item-card :item="uploadedPlugin"></plugin-item-card>
                </div>
                <div class="alert">
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
                </div>
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
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    uploadUrl,
    getInstalledPlugin, getCustomPluginShop,
    commitToCustomShop, delCustomPlugin,
    installPlugin, upgradePlugin, uninstallPlugin
} from '@/request/plugin'
import { CaretTop, CaretBottom, UploadFilled } from '@element-plus/icons-vue'

import Notice from '@/lib/message'
import VFormDialog from '@/components/v-form-dialog.vue'
import PluginItemCard, { PluginItem } from '@/views/app/pluginElem/pluginItemCard.vue'
import { StringDict } from '@/lib/common'

@Options({
    components: {
        CaretTop,
        CaretBottom,
        UploadFilled,
        VFormDialog,
        PluginItemCard
    },
    computed: {
        isUpload () {
            return Object.keys(this.uploadedPlugin).length
        },
        dialog () {
            return this.$refs.dialog
        }
    },
    data () {
        return {
            uploadUrl
        }
    },
    mounted () {
        this.getPlugins()
    }
})
export default class ShopCustom extends Vue {
    dialog!: VFormDialog

    private form = {
        author: '',
        secret_key: '',
        remark: ''
    }

    private pluginsList = []
    private uploadedPlugin: StringDict = {}

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
            this.pluginsList = shop.data.filter((item: PluginItem) => {
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

    public async deletePlugin (item: StringDict) {
        const key = await Notice.prompt('输入插件密钥')
        if (key) {
            const res = await delCustomPlugin({
                ...item,
                force_delete: await Notice.confirm('是否永久下架该插件？永久下架将会删除该插件ID，并删除历史版本。', '请注意', 'warning', ['是', '否']),
                secret_key: key
            })
            if (res) {
                await this.getPlugins()
            }
        }
    }

    public async install (item: StringDict) {
        const res = await installPlugin(item)
        if (res) {
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
.plugin-list {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
}

.upload-status {
    margin: 20px 0 10px 0;
}

.uploaded-plugin {
    margin: 10px 0 20px 0;
    display: flex;

    .alert > div {
        margin-bottom: 5px;
    }
}
</style>
