<template>
    <el-dialog v-model="dialogVisible" :title="title" :append-to-body="appendToBody" :width="width">
        <template #default>
            <slot></slot>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
    props: {
        title: String,
        width: String,
        appendToBody: Boolean,
        labelWidth: {
            type: String,
            default: () => '100px'
        }
    }
})
export default class VDialog extends Vue {
    title!: string
    labelWidth!: string

    private dialogVisible = false

    public show () {
        this.dialogVisible = true
    }

    public hide () {
        this.dialogVisible = false
    }
}
</script>

<style scoped lang="scss">

</style>
