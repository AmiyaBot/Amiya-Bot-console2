<template>
    <div>
        <v-table ref="table" :load="loadList">
            <template #header>
                <el-button type="primary" @click="$refs.dialog.show()">添加词语替换</el-button>
                <el-button type="warning" @click="syncReplace">同步词语替换</el-button>
                <el-button @click="wordSetting(1)">黑名单设置</el-button>
                <el-button @click="wordSetting(0)">白名单设置</el-button>
            </template>
            <template #cell="{ value, field }">
                <el-tag v-if="field === 'is_global'" :type="value ? 'success' : 'info'">
                    {{ value ? '是' : '否' }}
                </el-tag>
                <el-tag v-if="field === 'is_active'" :type="value ? 'success' : 'danger'">
                    {{ value ? '是' : '否' }}
                </el-tag>
            </template>
            <template #operations="{row}">
                <el-link :underline="false" v-if="row.is_global === 0" type="success" @click="updateReplace(row, 1)">
                    设为全局启用
                </el-link>
                <el-link :underline="false" v-else type="warning" @click="updateReplace(row, 0)">
                    关闭全局启用
                </el-link>
                <el-link :underline="false" type="danger" @click="delReplace(row)">删除</el-link>
            </template>
        </v-table>

        <v-form-dialog title="添加词语替换" :form="form" ref="dialog">
            <el-form-item label="被替换词语">
                <el-input v-model="form.origin"/>
            </el-form-item>
            <el-form-item label="替换词语">
                <el-input v-model="form.replace"/>
            </el-form-item>
            <template #footer>
                <el-button type="primary" @click="submit">保存</el-button>
            </template>
        </v-form-dialog>
        <v-form-dialog :title="'审核词设置：' + (settingMode ? '黑名单' : '白名单')" ref="setting">
            <div class="setting-word">
                <template v-for="(tag, index) in settingWord">
                    <el-tag class="tag" closable :key="index" :disable-transitions="false"
                            v-if="tag.status === settingMode"
                            @close="delReplaceSetting(tag)">
                        {{ tag.text }}
                    </el-tag>
                </template>
                <el-input class="add" size="small" v-show="inputMode" ref="tagInput"
                          v-model="inputValue"
                          @keyup.enter="addSetting"
                          @blur="cancelAddSetting"/>
                <el-button class="add" v-show="!inputMode" size="small" @click="inputMode = true">
                    + 添加词语
                </el-button>
            </div>
        </v-form-dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    getReplaceList, addReplace, updateReplace, delReplace,
    getReplaceSettingList, delReplaceSetting, addReplaceSetting, syncReplace
} from '@/request/replace'
import Common, { DictArray, StringDict } from '@/lib/common'

import VTable, { QueryData } from '@/components/table/v-table.vue'
import VFormDialog from '@/components/v-form-dialog.vue'
import Notice from '@/lib/message'

@Options({
    components: {
        VTable,
        VFormDialog
    },
    computed: {
        table () {
            return this.$refs.table
        },
        dialog () {
            return this.$refs.dialog
        },
        setting () {
            return this.$refs.setting
        }
    },
    watch: {
        inputMode (val) {
            if (val) {
                this.$refs.tagInput.focus()
            }
        }
    },
    mounted () {
        this.table.setColumns({
            user_id: {
                title: '添加用户',
                format: (row: StringDict, value: any) => value === '0' ? '无' : value
            },
            group_id: {
                title: '所在群组',
                format: (row: StringDict, value: any) => value === '0' ? '无' : value
            },
            origin: '被替换词语',
            replace: '替换词语',
            in_time: {
                title: '添加时间',
                format: (row: StringDict, value: any) => Common.formatDate(value)
            },
            is_active: '是否启用',
            is_global: '是否全局启用'
        })
    }
})
export default class Replace extends Vue {
    table!: VTable
    dialog!: VFormDialog
    setting!: VFormDialog

    private form = {
        origin: '',
        replace: ''
    }

    private settingWord: DictArray = []
    private settingMode = 0
    private inputMode = false
    private inputValue = ''

    public async loadList (data: QueryData) {
        const res = await getReplaceList(data)
        if (res) {
            this.table.setPaginationData(res.data)
        }
    }

    public async updateReplace (data: QueryData, isGlobal: number) {
        const update = {
            ...data,
            is_global: isGlobal
        }
        const res = await updateReplace(update)
        if (res) {
            this.table.executeLoad()
        }
    }

    public async delReplace (data: StringDict) {
        const res = await delReplace(data)
        if (res) {
            this.table.executeLoad()
        }
    }

    public async submit () {
        const res = await addReplace(this.form)
        if (res) {
            this.dialog.hide()
            this.table.executeLoad()
            this.form = {
                origin: '',
                replace: ''
            }
        }
    }

    public async getReplaceSettingList () {
        const res = await getReplaceSettingList()
        if (res) {
            this.settingWord = res.data
        }
    }

    public async addSetting () {
        const data = {
            text: this.inputValue,
            status: this.settingMode
        }
        const res = await addReplaceSetting(data)
        if (res) {
            this.settingWord = res.data
        }
        this.cancelAddSetting()
        await this.getReplaceSettingList()
    }

    public async delReplaceSetting (data: StringDict) {
        const res = await delReplaceSetting(data)
        if (res) {
            await this.getReplaceSettingList()
        }
    }

    public async wordSetting (mode: number) {
        await this.getReplaceSettingList()

        this.settingMode = mode
        this.setting.show()
    }

    public async syncReplace () {
        if (await Notice.confirm('同步词语替换将会强制覆盖本地所有词语替换配置，造成自定义的词语替换丢失，是否开始同步？', '警告')) {
            const res = await syncReplace()
            if (res) {
                this.table.executeLoad(true)
            }
        }
    }

    public cancelAddSetting () {
        this.inputMode = false
        this.inputValue = ''
    }
}
</script>

<style scoped lang="scss">
.setting-word {
    display: flex;
    flex-wrap: wrap;

    .tag {
        margin-right: 5px;
    }

    .add {
        width: 100px;
    }
}
</style>
