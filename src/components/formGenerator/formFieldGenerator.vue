<template>
    <template v-for="(item, key) in items" :key="key">
        <el-form-item :label="itemLabel(item)" :style="itemStyle(item)" class="v-table">

            <!-- 输入框 -->
            <template v-if="item.type === 'input' || item.type === 'number'">
                <el-input v-model="form[item.field]"
                          :placeholder="(item.value || `请输入${itemLabel(item)}`).toString()"/>
            </template>

            <!-- 切换按钮 -->
            <template v-if="item.type === 'boolean'">
                <el-switch v-model="form[item.field]"/>
            </template>

            <!-- 子表单 -->
            <template v-if="item.type === 'form'">
                <el-card style="width: 100%">
                    <form-field-generator :form="form[item.field]" :items="item.formItems"/>
                </el-card>
            </template>

            <!-- 字符串/数字数组编辑 -->
            <template v-if="item.type === 'values'">
                <div v-if="form[item.field] && form[item.field].length">
                    <template v-for="(n, index) in form[item.field]" :key="index">
                        <div style="display: flex">
                            <el-input v-model="form[item.field][index]" :class="item.field + index"
                                      v-if="form[item.field][index] !== undefined"
                                      style="width: calc(100% - 51px)">
                                <template #append>
                                    <el-button @click="delValue(item, index)" :icon="delIcon"/>
                                </template>
                            </el-input>
                            <el-button v-if="index === form[item.field].length - 1" @click="addValue(item)"
                                       style="margin-left: 5px"
                                       :icon="addIcon"/>
                        </div>
                    </template>
                </div>
                <el-button v-else @click="addValue(item)" :icon="addIcon"/>
            </template>

            <!-- 对象数组编辑 -->
            <template v-if="item.type === 'table'">
                <el-card style="width: 100%">
                    <el-table border header-cell-class-name="v-table-header" :data="form[item.field]"
                              style="width: 100%">
                        <template #empty>
                            <el-link type="primary" @click="addRow(item)">添加</el-link>
                        </template>
                        <template v-for="(n, index) in item.tableForm.formItems" :key="index">
                            <el-table-column v-if="n.type === 'input' || n.type === 'number'"
                                             :prop="n.field"
                                             :label="$t(n.field)">
                                <template #default="scope">
                                    <el-input style="border: none" v-model="form[item.field][scope.$index][n.field]"
                                              size="small"/>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-link type="danger" @click="delRow(item, scope.$index)">删除</el-link>
                                <el-link type="primary" v-if="scope.$index === form[item.field].length - 1"
                                         @click="addRow(item)">
                                    添加
                                </el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </template>

            <template v-if="item.type === 'unsupported'">
                不支持的编辑类型
            </template>

        </el-form-item>
    </template>
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { FormGroup, FormItem } from '@/components/formGenerator/formGenerator'
import { Plus, Minus } from '@element-plus/icons-vue'
import { StringDict } from '@/lib/common'

@Options({
    name: 'formFieldGenerator',
    props: {
        form: Object,
        items: Array
    },
    data () {
        return {
            addIcon: shallowRef(Plus),
            delIcon: shallowRef(Minus)
        }
    }
})
export default class FormFieldGenerator extends Vue {
    form!: StringDict

    public itemLabel (item: StringDict) {
        return this.$t(item.title || item.name || item.field || 'undefined')
    }

    public itemStyle (item: FormItem | FormGroup) {
        return {
            width: item.type === 'form' || item.type === 'table' ? '100%' : '60%',
            marginBottom: '10px'
        }
    }

    public addValue (item: FormItem) {
        this.form[item.field].push(item.factory(''))
        this.$nextTick(() => {
            const target = item.field + (this.form[item.field].length - 1)

            document.querySelector('.' + target)?.scrollIntoView({
                behavior: 'smooth'
            })
        })
    }

    public delValue (item: FormItem, index: number) {
        this.form[item.field].splice(index, 1)
    }

    public addRow (item: FormItem) {
        const newRow: StringDict = {}

        for (const n of item.tableForm.formItems) {
            newRow[n.field] = n.factory('')
        }

        this.form[item.field].push(newRow)
    }

    public delRow (item: FormItem, index: number) {
        this.form[item.field].splice(index, 1)
    }
}
</script>

<style scoped lang="scss">

</style>
