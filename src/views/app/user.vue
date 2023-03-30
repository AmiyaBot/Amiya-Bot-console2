<template>
    <div>
        <v-table ref="table" :load="loadList">
            <template #operations="{row}">
                <el-link :underline="false" type="primary" @click="editUser(row)">编辑</el-link>
            </template>
            <template #cell="{ value, field }">
                <el-tag v-if="field === 'black'" :type="value ? 'danger' : 'info'">{{ value ? '是' : '否' }}</el-tag>
            </template>
        </v-table>

        <v-form-dialog title="编辑用户" :form="form" ref="dialog">
            <el-form-item label="用户ID">
                <el-input v-model="form.user_id" disabled/>
            </el-form-item>
            <el-form-item label="用户昵称">
                <el-input v-model="form.nickname" disabled/>
            </el-form-item>
            <el-form-item label="寻访凭证数量">
                <el-input-number v-model="form.coupon"/>
            </el-form-item>
            <el-form-item label="合成玉数量">
                <el-input-number v-model="form.jade_point"/>
            </el-form-item>
            <el-form-item label="黑名单用户">
                <el-switch v-model="form.black" :active-value="1" :inactive-value="0"/>
            </el-form-item>
            <template #footer>
                <el-button type="primary" @click="submit">保存</el-button>
            </template>
        </v-form-dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getUserList, editUser } from '@/request/user'
import Common, { StringDict } from '@/lib/common'

import VTable, { QueryData } from '@/components/table/v-table.vue'
import VFormDialog from '@/components/v-form-dialog.vue'

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
        }
    },
    mounted () {
        this.table.setColumns({
            user_id: '用户ID',
            nickname: '用户昵称',
            user_feeling: '信赖值',
            coupon: '寻访凭证数量',
            jade_point: '合成玉数量',
            message_num: '累计互动数',
            sign_times: '累计签到次数',
            sign_date: '最近签到日',
            black: '黑名单用户'
        })
    }
})
export default class User extends Vue {
    table!: VTable
    dialog!: VFormDialog

    private form: StringDict = {}

    public async loadList (data: QueryData) {
        const res = await getUserList(data)
        if (res) {
            this.table.setPaginationData(res.data)
        }
    }

    public async editUser (data: StringDict) {
        this.form = Common.deepCopy(data)
        this.dialog.show()
    }

    public async submit () {
        const res = await editUser(this.form)
        if (res) {
            this.dialog.hide()
            this.table.executeLoad()
        }
    }
}
</script>

<style scoped lang="scss">

</style>
