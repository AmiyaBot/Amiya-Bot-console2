<template>
    <el-dialog v-model="dialogVisible" :title="title" :append-to-body="appendToBody" :width="width" destroy-on-close
               @closed="() => $emit('closed')">
        <template #default>
            <slot></slot>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
    emits: [
        'closed'
    ],
    props: {
        title: String,
        width: String,
        appendToBody: Boolean
    }
})
export default class VDialog extends Vue {
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
