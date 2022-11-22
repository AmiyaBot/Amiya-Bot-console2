<template>
    <div class="plugin-item">
        <div>
            <div class="plugin-title">
                <div class="plugin-icon">
                    <img :src="logo" alt="logo" v-if="logo">
                </div>
                <div class="plugin-info">
                    <div style="display: flex;align-items: center;">
                        {{ item.name }}&nbsp;
                        <el-tag v-if="item.plugin_type === 'official'" size="small" type="success" effect="dark">
                            <span style="font-size: 12px">官方</span>
                        </el-tag>
                        <el-tag v-else size="small" effect="dark">
                            <span style="font-size: 12px">创意</span>
                        </el-tag>
                        <slot name="info"></slot>
                    </div>
                </div>
            </div>
            <div class="plugin-desc">
                <div v-if="item.author">
                    <div>作者：</div>
                    <div>
                        <slot>{{ item.author }}</slot>
                    </div>
                </div>
                <div>
                    <div>版本：</div>
                    <div>
                        <slot name="version">{{ item.version }}</slot>
                    </div>
                </div>
                <div v-if="item.description">
                    <div>描述：</div>
                    <div>
                        {{ item.description }}
                    </div>
                </div>
                <div v-if="downloadCount !== undefined">
                    <div>下载次数：</div>
                    <div>
                        {{ downloadCount }}
                    </div>
                </div>
            </div>
        </div>
        <div class="plugin-opt">
            <div>
                <el-button type="primary" link @click="dialog.show()">插件文档</el-button>
            </div>
            <div class="button">
                <slot name="button"></slot>
            </div>
        </div>
    </div>

    <v-form-dialog :title="'插件文档：' + item.name" ref="dialog" :append-to-body="true">
        <div class="markdown-body" v-html="pluginDoc()"></div>
    </v-form-dialog>
</template>

<script lang="ts">
import { marked } from 'marked'
import { Options, Vue } from 'vue-class-component'
import { sourceHost } from '@/request/plugin'
import { StringDict } from '@/lib/common'

import VFormDialog from '@/components/v-form-dialog.vue'

export interface PluginItem extends StringDict {
    'name': string
    'version': string
    'plugin_id': string
    'plugin_type': string
    'description': string
    'document': string
}

@Options({
    components: {
        VFormDialog
    },
    computed: {
        dialog () {
            return this.$refs.dialog
        },
        logo () {
            return this.item.logo.startsWith('data:image/png;') ? this.item.logo : (this.sourceHost + '/image?path=' + this.item.logo)
        }
    },
    props: {
        item: Object,
        downloadCount: Number
    }
})
export default class PluginItemCard extends Vue {
    item!: PluginItem
    dialog!: VFormDialog
    downloadCount!: number

    sourceHost = sourceHost

    public pluginDoc () {
        return marked.parse(this.item.document)
    }
}
</script>

<style scoped lang="scss">
.plugin-item {
    width: 300px;
    border: 1px solid var(--el-card-border-color);
    box-shadow: var(--el-box-shadow-light);
    border-radius: var(--el-card-border-radius);
    margin: 0 10px 10px 0;
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .plugin-title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .plugin-icon {
            width: 35px;
            height: 35px;
            margin-right: 10px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            overflow: hidden;

            img {
                width: 100%;
            }
        }

        .plugin-info {
            display: flex;
            flex-direction: column;
        }
    }

    .plugin-desc > div {
        display: flex;

        & > div:first-child {
            min-width: 45px;
            color: var(--el-color-info-dark-2);
        }
    }

    .plugin-opt {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
}
</style>
<style lang="scss">
.plugin-opt {
    .button .el-link:not(:last-child) {
        margin-right: 10px
    }
}
</style>
