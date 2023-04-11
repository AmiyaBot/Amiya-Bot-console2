<template>
    <div class="plugin-item"
         :class="{ 'upgrade': item.upgrade, 'installed': item.installed, 'detail-mode': detailMode, 'batch-mode': batchMode, selected }"
         @click="onclick">
        <div class="plugin-title">
            <div class="plugin-icon">
                <img :src="logo" alt="logo" v-if="logo">
                <span class="installed-icon" v-if="item.installed"></span>
            </div>
            <div class="plugin-info">
                <div class="plugin-name">
                    <div>
                        <slot :item="item" name="name">{{ item.name }}</slot>
                    </div>
                    <div class="official-icon" v-if="item.plugin_type === 'official'"></div>
                </div>
                <div style="color: var(--el-color-primary)">
                    <slot :item="item" name="version">{{ item.version }}</slot>
                </div>
            </div>
        </div>
        <div v-if="detailMode">
            <div class="desc">{{ item.description }}</div>
        </div>
    </div>

    <v-dialog class="plugin-detail" ref="dialog" :append-to-body="true" :show-close="false" width="60%">
        <plugin-detail :item="item" :author="author" :download-count="downloadCount">
            <template #author>
                <slot name="author"></slot>
            </template>
            <template #button>
                <slot name="button"></slot>
            </template>
            <template #version>
                <slot name="version"></slot>
            </template>
        </plugin-detail>
    </v-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PluginDetail, { PluginItem, pluginLogo } from '@/views/app/plugin/pluginDetail.vue'

import VDialog from '@/components/v-dialog.vue'

@Options({
    emits: [
        'selected',
        'unselected'
    ],
    components: {
        VDialog,
        PluginDetail
    },
    computed: {
        dialog () {
            return this.$refs.dialog
        },
        logo () {
            return pluginLogo(this.item)
        }
    },
    props: {
        item: Object,
        author: String,
        downloadCount: Number,
        detailMode: Boolean,
        batchMode: Boolean
    },
    watch: {
        batchMode () {
            this.selected = false
        }
    }
})
export default class PluginItemCard extends Vue {
    item!: PluginItem
    dialog!: VDialog
    batchMode!: boolean

    private selected = false

    private onclick () {
        if (this.batchMode) {
            if (this.item.installed && !this.item.upgrade) {
                return
            }
            if (!this.selected) {
                this.selected = true
                this.$emit('selected')
            } else {
                this.selected = false
                this.$emit('unselected')
            }
            return
        }
        this.dialog.show()
    }
}
</script>

<style scoped lang="scss">
.plugin-item {
    width: 240px;
    padding: 5px;
    margin: 2px 5px;
    border: 1px solid transparent;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 150ms ease-in-out;
    cursor: pointer;
    user-select: none;
    background: center right 5px / 25px no-repeat;

    &.detail-mode {
        width: fit-content;
        margin: 0;
        padding: 10px 30px 10px 10px;
        box-shadow: 0 0 5px 2px #d3d3d3;

        .desc {
            margin-top: 10px;
        }
    }

    &.batch-mode {
        border: 1px dashed #d1d1d1;
    }

    &.batch-mode.installed:not(.upgrade) {
        border: 1px solid #9E9E9E;
        background-color: #FAFAFA;
        background-image: url(../../../assets/icon/plugin/ok.svg);
        opacity: 0.5;
    }

    &.selected {
        border: 1px solid #03A9F4;
        background-color: #E1F5FE;
        background-image: url(../../../assets/icon/plugin/download.svg);
    }

    &.selected.upgrade {
        border: 1px solid #4caf50;
        background-color: #E8F5E9;
        background-image: url(../../../assets/icon/plugin/upgrade.svg);
    }

    &:hover {
        box-shadow: 0 0 5px 2px #d3d3d3;
    }

    .plugin-title {
        display: flex;
        align-items: center;

        .plugin-info {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
<style lang="scss">
.plugin-detail {
    & > header,
    & > footer {
        display: none;
    }

    .el-dialog__body {
        color: var(--el-color-black);
    }
}
</style>
