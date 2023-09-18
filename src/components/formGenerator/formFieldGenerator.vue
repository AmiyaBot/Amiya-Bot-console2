<template>
    <template v-for="(item, key) in items" :key="key">
        <!--
        <el-form-item :style="itemStyle(item)" class="v-table"
                      :rules="{ required: item.required, message: itemLabel(item) + '为必填项' }">
                      -->
        <el-form-item :style="itemStyle(item)" class="v-table" :class="{ 'is-required': item.required }">
            <template #label>
                <div class="item-label">
                    <span style="padding-right: 5px">{{ itemLabel(item) }}</span>
                    <el-tooltip placement="top" v-if="item.description">
                        <template #content>
                            {{ item.description }}
                        </template>
                        <el-icon style="cursor: help">
                            <QuestionFilled/>
                        </el-icon>
                    </el-tooltip>
                </div>
            </template>

            <!-- 子表单 -->
            <template v-if="item.type === 'form'">
                <el-card style="width: 100%">
                    <form-field-generator :form="form[item.field]" :items="item.formItems"/>
                </el-card>
            </template>

            <!-- 字符串/数字数组编辑 -->
            <template v-else-if="item.type === 'values'">
                <div v-if="form[item.field] && form[item.field].length" style="width: 100%">
                    <template v-for="(n, index) in form[item.field]" :key="index">
                        <div class="array-input">
                            <form-field-type :form="form[item.field]" :bind="index.toString()" :item="item"
                                             :item-label="itemLabel"
                                             :class="item.field + index"
                                             v-if="form[item.field][index] !== undefined">
                                <template #append>
                                    <el-button @click="delValue(item, Number(index))" :icon="delIcon"/>
                                </template>
                            </form-field-type>
                            <el-button v-if="index === form[item.field].length - 1" @click="addValue(item)"
                                       style="margin-left: 5px"
                                       :icon="addIcon"/>
                        </div>
                    </template>
                </div>
                <el-button v-else @click="addValue(item)" :icon="addIcon"/>
            </template>

            <!-- 对象数组编辑 -->
            <template v-else-if="item.type === 'table'">
                <el-card style="width: 100%">
                    <el-table border header-cell-class-name="v-table-header" :data="form[item.field]"
                              style="width: 100%">
                        <template #empty>
                            <el-link type="primary" @click="addRow(item)">添加</el-link>
                        </template>
                        <template v-for="(n, index) in item.tableForm.formItems" :key="index">
                            <el-table-column :prop="n.field">
                                <template #header>
                                    <div class="table-header">
                                        <span>{{ $t(n.title || n.field) }}</span>
                                        <el-tooltip placement="top" v-if="n.description">
                                            <template #content>
                                                {{ n.description }}
                                            </template>
                                            <el-icon style="cursor: help; margin-left: 5px">
                                                <QuestionFilled/>
                                            </el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template #default="scope">
                                    <form-field-type style="border: none" size="small" :item="n" :item-label="itemLabel"
                                                     :form="form[item.field][scope.$index]"
                                                     :bind="n.field"/>
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

            <template v-else-if="item.type === 'unsupported'">
                不支持的编辑类型
            </template>

            <form-field-type v-else :form="form" :bind="item.field" :item="item" :item-label="itemLabel"/>

        </el-form-item>
    </template>
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { FormGroup, FormItem } from '@/components/formGenerator/formGenerator'
import { Plus, Minus, QuestionFilled } from '@element-plus/icons-vue'
import { StringDict } from '@/lib/common'

import FormFieldType from '@/components/formGenerator/formFieldType.vue'

@Options({
    name: 'formFieldGenerator',
    components: { QuestionFilled, FormFieldType },
    props: {
        form: {
            type: Object,
            default: () => {
                return {}
            }
        },
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
            marginBottom: '18px'
        }
    }

    public addValue (item: FormItem) {
        if (!Array.isArray(this.form[item.field])) {
            this.form[item.field] = []
        }
        let initValue = item.factory('')

        if (isNaN(initValue)) {
            initValue = 0
        }

        this.form[item.field].push(initValue)
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
.item-label {
    display: flex;
    align-items: center;
}

.table-header {
    display: flex;
    align-items: center;

    .el-icon {
        color: var(--el-text-color-regular) !important;
    }
}

.array-input {
    width: 100%;
    display: flex;

    & > div {
        width: calc(100% - 51px);
    }

    &:not(:first-child) {
        margin-top: 3px;
    }
}
</style>
