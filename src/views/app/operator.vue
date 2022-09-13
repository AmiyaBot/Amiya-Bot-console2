<template>
    <div>
        <v-table ref="table" :load="loadList">
            <template #operations="{row}">
                <el-link :underline="false" type="primary" @click="setOperator(row)">设定干员属性</el-link>
            </template>
            <template #cell="{ value, field }">
                <template v-if="field === 'operator_type'">
                    {{ operatorType[value] || '无' }}
                </template>
            </template>
        </v-table>

        <v-form-dialog title="编辑用户" :form="form" ref="dialog">
            <el-form-item label="干员代号">
                <el-input v-model="form.name" disabled/>
            </el-form-item>
            <el-form-item label="干员英文代号">
                <el-input v-model="form.en_name" disabled/>
            </el-form-item>
            <el-form-item label="卡池属性">
                <el-select v-model="form.operator_type" placeholder="请选择卡池属性">
                    <el-option :label="name" :value="value" v-for="(name, value) in operatorType" :key="name"/>
                </el-select>
            </el-form-item>
            <template #footer>
                <el-button type="primary" @click="submit">保存</el-button>
            </template>
        </v-form-dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getOperator, setOperator } from '@/request/operator'
import Common, { StringDict } from '@/lib/common'

import VTable, { QueryData } from '@/components/table/vTable.vue'
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
            name: '干员代号',
            en_name: '干员英文代号',
            rarity: '星级',
            classes: '职业',
            classes_sub: '分支职业',
            operator_type: '卡池属性'
        })
    }
})
export default class Operator extends Vue {
    table!: VTable
    dialog!: VFormDialog

    private form: StringDict = {}
    public operatorType = {
        0: '可抽取-限定干员',
        1: '可抽取-联动干员',
        2: '不可抽取-非常规途径',
        3: '不可抽取-销售',
        4: '不可抽取-公开招募',
        5: '不可抽取-活动奖励',
        6: '不可抽取-联动奖励',
        7: '不可抽取-危机合约奖励',
        8: '不可抽取-roguelike限定'
    }

    public async loadList (data: QueryData) {
        const res = await getOperator(data)
        if (res) {
            this.table.setPaginationData(res.data)
        }
    }

    public async setOperator (data: StringDict) {
        this.form = Common.deepCopy(data)
        this.dialog.show()
    }

    public async submit () {
        const res = await setOperator(this.form)
        if (res) {
            this.dialog.hide()
            this.table.executeLoad()
        }
    }
}
</script>

<style scoped lang="scss">

</style>
