<template>
    <div>
        <v-table ref="table" :load="loadList">
            <template #header>
                <el-button type="primary" @click="$refs.dialog.show()">添加管理员</el-button>
            </template>
            <template #operations="{row}">
                <el-link :underline="false" type="danger" @click="delAdmin(row)">删除</el-link>
            </template>
        </v-table>

        <v-form-dialog title="添加管理员" :form="form" ref="dialog">
            <el-form-item label="管理员ID">
                <el-input v-model="form.account"/>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark"/>
            </el-form-item>
            <template #footer>
                <el-button type="primary" @click="submit">保存</el-button>
            </template>
        </v-form-dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getAdminList, addAdmin, delAdmin } from '@/request/admin'
import { StringDict } from '@/lib/common'

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
            account: '管理员ID',
            remark: '备注'
        })
    }
})
export default class Admin extends Vue {
    table!: VTable
    dialog!: VFormDialog

    private form = {
        account: '',
        remark: ''
    }

    public async loadList (data: QueryData) {
        const res = await getAdminList(data)
        if (res) {
            this.table.setPaginationData(res.data)
        }
    }

    public async delAdmin (data: StringDict) {
        const res = await delAdmin(data)
        if (res) {
            this.table.executeLoad()
        }
    }

    public async submit () {
        const res = await addAdmin(this.form)
        if (res) {
            this.dialog.hide()
            this.table.executeLoad()
            this.form = {
                account: '',
                remark: ''
            }
        }
    }
}
</script>

<style scoped lang="scss">

</style>
