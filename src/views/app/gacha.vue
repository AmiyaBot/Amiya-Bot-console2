<template>
    <div>
        <v-table ref="table" :load="loadList">
            <template #header>
                <el-button type="primary" @click="addPool">添加卡池</el-button>
                <el-button type="warning" @click="syncPool">同步卡池</el-button>
            </template>
            <template #cell="{ value, field }">
                <template v-if="['pickup_6', 'pickup_5', 'pickup_4', 'pickup_s'].indexOf(field) >= 0">
                    <template v-for="(name, index) in (value || '').split(',')">
                        <el-tag :key="index" effect="plain"
                                :type="tagColor[field]" style="margin-right: 3px" v-if="name">
                            {{ name.replace('|', ' x ') }}
                        </el-tag>
                    </template>
                </template>
                <template v-if="field === 'limit_pool'">
                    <el-tag effect="light" v-if="value === 0">普通卡池</el-tag>
                    <el-tag effect="dark" v-else-if="value === 1" type="danger">限定卡池</el-tag>
                    <el-tag effect="dark" v-else-if="value === 2" type="success">联合寻访</el-tag>
                    <el-tag effect="dark" v-else-if="value === 3" type="warning">前路回响</el-tag>
                    <el-tag effect="light" v-else-if="value === 4" type="info">中坚寻访</el-tag>
                </template>
            </template>
            <template #operations="{row}">
                <el-link :underline="false" type="primary" @click="updateGacha(row)">修改</el-link>
                <el-link :underline="false" type="danger" @click="delGacha(row)">删除</el-link>
            </template>
        </v-table>

        <v-form-dialog title="编辑卡池" :form="form" ref="dialog" :append-to-body="true">
            <el-form-item label="卡池名称">
                <el-input v-model="form.pool_name" placeholder="请输入卡池名称"/>
            </el-form-item>
            <el-form-item label="卡池属性">
                <el-select style="width: 100%" v-model="form.limit_pool" placeholder="请选择卡池属性">
                    <el-option label="普通卡池" :value="0"/>
                    <el-option label="限定卡池" :value="1"/>
                    <el-option label="联合寻访" :value="2"/>
                </el-select>
            </el-form-item>
            <template v-for="(field, r) in {'r6': 'pickup_6', 'r5': 'pickup_5', 'r4': 'pickup_4'}" :key="field">
                <el-form-item :label="r[1] + '星概率提升'">
                    <el-select style="width: 100%" v-model="form[field]" multiple filterable
                               :placeholder="`请选择${r[1]}星概率提升的干员`">
                        <template v-for="(item, index) in operatorList">
                            <el-option :label="item.name" :value="item.name" v-if="item.rarity === r[1].toString()"
                                       :key="index"/>
                        </template>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item label="权值" placeholder="输入权值（可选）">
                <el-tag style="margin-right: 3px" v-for="(n, i) in form.pickup_s" :key="i" effect="plain">
                    {{ n.replace('|', ' x ') }}
                </el-tag>
                <el-button size="small" @click="innerDialog.show()">+ 添加权值</el-button>
            </el-form-item>

            <v-form-dialog title="添加权值" :form="innerForm" ref="innerDialog" :width="400">
                <el-form-item label="加权干员">
                    <el-select style="width: 100%" v-model="innerForm.name" placeholder="请选择加权干员">
                        <template v-for="(item, index) in operatorList">
                            <el-option :label="item.name" :value="item.name" v-if="item.rarity === '6'" :key="index"/>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="权重值" placeholder="输入权重值">
                    <el-input-number v-model="innerForm.num"/>
                </el-form-item>
                <template #footer>
                    <el-button type="primary" @click="setPickupS">确定</el-button>
                </template>
            </v-form-dialog>

            <template #footer>
                <el-button type="primary" @click="submit">保存</el-button>
            </template>
        </v-form-dialog>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getGachaList, submitGacha, delGacha, syncPool } from '@/request/gacha'
import { getAllOperator } from '@/request/operator'

import Notice from '@/lib/message'
import Common, { DictArray, StringDict } from '@/lib/common'
import VTable, { QueryData } from '@/components/table/v-table.vue'
import VFormDialog from '@/components/v-form-dialog.vue'

interface PoolForm {
    'pool_name': string
    'limit_pool': string
    'pickup_6': Array<string>
    'pickup_5': Array<string>
    'pickup_4': Array<string>
    'pickup_s': Array<string>
}

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
        innerDialog () {
            return this.$refs.innerDialog
        }
    },
    mounted () {
        this.table.setColumns({
            pool_name: '卡池名称',
            limit_pool: '卡池属性',
            pickup_6: '6星概率提升',
            pickup_5: '5星概率提升',
            pickup_4: '4星概率提升',
            pickup_s: '权值'
        })
        this.getAllOperator()
    }
})
export default class Gacha extends Vue {
    table!: VTable
    dialog!: VFormDialog
    innerDialog!: VFormDialog

    private form: PoolForm = {
        pool_name: '',
        limit_pool: '',
        pickup_6: [],
        pickup_5: [],
        pickup_4: [],
        pickup_s: []
    }

    private innerForm = {
        name: '',
        num: 5
    }

    private tagColor = {
        pickup_6: 'danger',
        pickup_5: 'warning',
        pickup_4: 'info',
        pickup_s: ''
    }

    private operatorList: DictArray = []

    public async loadList (data: QueryData) {
        const res = await getGachaList(data)
        if (res) {
            this.table.setPaginationData(res.data)
        }
    }

    public async getAllOperator () {
        const res = await getAllOperator()
        if (res) {
            this.operatorList = res.data
        }
    }

    public addPool () {
        this.form = {
            pool_name: '',
            limit_pool: '',
            pickup_6: [],
            pickup_5: [],
            pickup_4: [],
            pickup_s: []
        }
        this.dialog.show()
    }

    public updateGacha (data: StringDict) {
        const form = Common.deepCopy(data)

        form.pickup_6 = data.pickup_6 ? data.pickup_6.split(',') : []
        form.pickup_5 = data.pickup_5 ? data.pickup_5.split(',') : []
        form.pickup_4 = data.pickup_4 ? data.pickup_4.split(',') : []
        form.pickup_s = data.pickup_s ? data.pickup_s.split(',') : []

        this.form = form
        this.dialog.show()
    }

    public async delGacha (data: StringDict) {
        const res = await delGacha(data)
        if (res) {
            this.table.executeLoad()
        }
    }

    public async submit () {
        const data = Common.deepCopy(this.form)

        data.pickup_6 = data.pickup_6.join(',')
        data.pickup_5 = data.pickup_5.join(',')
        data.pickup_4 = data.pickup_4.join(',')
        data.pickup_s = data.pickup_s.join(',')

        const res = await submitGacha(data)
        if (res) {
            this.dialog.hide()
            this.table.executeLoad()
        }
    }

    public async syncPool () {
        if (await Notice.confirm('同步卡池将会强制覆盖本地所有卡池配置，造成自定义的卡池丢失，是否开始同步？', '警告')) {
            const res = await syncPool()
            if (res) {
                this.table.executeLoad(true)
            }
        }
    }

    public setPickupS () {
        this.form.pickup_s.push(`${this.innerForm.name}|${this.innerForm.num}`)
        this.innerDialog.hide()
    }
}
</script>

<style scoped lang="scss">

</style>
