<template>
    <el-dialog v-model="dialogVisible" :title="title" :append-to-body="appendToBody" :width="width">
        <el-form :model="form" :label-width="labelWidth">
            <template #default>
                <slot></slot>
            </template>
        </el-form>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { StringDict } from '@/lib/common'

@Options({
    props: {
        form: Object,
        title: String,
        width: Number,
        appendToBody: Boolean,
        labelWidth: {
            type: String,
            default: () => '100px'
        }
    }
})
export default class VFormDialog extends Vue {
    form!: StringDict
    title!: string

    private dialogVisible = false

    public show () {
        this.dialogVisible = true
    }

    public async asyncShow () {
        this.dialogVisible = true
        await this.$nextTick()
    }

    public hide () {
        this.dialogVisible = false
    }

    public async asyncHide () {
        this.dialogVisible = false
        await this.$nextTick()
    }
}
</script>

<style scoped lang="scss">

</style>
