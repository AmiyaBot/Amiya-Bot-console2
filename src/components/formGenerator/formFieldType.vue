<template>
    <div class="form-field-type">
        <!-- 输入框 -->
        <template v-if="type === 'input'">
            <el-input v-model="form[bind]" :size="size"
                      :placeholder="(item.value || `请输入${itemLabel(item)}`).toString()">
                <template v-if="$slots.append" #append>
                    <slot name="append"></slot>
                </template>
            </el-input>
        </template>

        <!-- 数字输入框 -->
        <template v-if="type === 'number'">
            <div class="number-input">
                <el-input-number v-model="form[bind]" :controls="false" :size="size"
                                 :class="{ 'has-button': $slots.append }"
                                 :min="item.minimum"
                                 :max="item.maximum"/>
                <template v-if="$slots.append">
                    <slot name="append"></slot>
                </template>
            </div>
        </template>

        <!-- 选择框 -->
        <template v-if="type === 'select'">
            <el-select v-model="form[bind]" :placeholder="`请选择${itemLabel(item)}`" :size="size">
                <el-option v-for="(n, i) in item.options" :key="i" :value="item.factory(n)">{{ n }}</el-option>
            </el-select>
        </template>

        <!-- 日期选择器（包含"日期"、"日期时间"和两者的范围选择） -->
        <el-date-picker v-if="type.startsWith('date')" placement="bottom-start"
                        v-model="form[bind]"
                        :type="type.replace('-', '')"
                        :placeholder="`请选择${itemLabel(item)}`"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"/>

        <!-- 时间选择器 -->
        <el-time-picker v-if="type.startsWith('time')" placement="bottom-start"
                        v-model="form[bind]"
                        :is-range="type.endsWith('range')"
                        :placeholder="`请选择${itemLabel(item)}`"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"/>

        <!-- 切换按钮 -->
        <template v-if="type === 'boolean'">
            <el-switch v-model="form[bind]" :size="size"/>
        </template>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
    props: [
        'item',
        'form',
        'bind',
        'size',
        'itemLabel'
    ],
    computed: {
        type () {
            return this.item.subType || this.item.type
        }
    }
})
export default class FormFieldType extends Vue {
}
</script>

<style lang="scss">
.form-field-type {
    width: 100%;

    & > div.el-date-editor {
        width: 100% !important;

        .el-input__wrapper {
            width: 100%;
        }
    }
}

.el-input-number {
    width: 100%;

    &.is-controls-right .el-input__wrapper {
        padding-left: 11px;
    }

    input {
        text-align: left !important;
    }
}

.number-input {
    display: flex;

    button {
        color: var(--el-color-info);
        background-color: var(--el-fill-color-light);
        border-radius: 0 4px 4px 0;
    }

    & > .has-button .el-input__wrapper {
        border-radius: 4px 0 0 4px;
    }
}
</style>
