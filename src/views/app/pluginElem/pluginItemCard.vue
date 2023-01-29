<template>
    <div class="plugin-item">
        <div class="plugin-title" @click="dialog.show()">
            <div class="plugin-icon">
                <img :src="logo" alt="logo" v-if="logo">
            </div>
            <div class="plugin-info">
                <div class="plugin-name">
                    <div>{{ item.name }}</div>
                    <div class="official-icon" v-if="item.plugin_type === 'official'"></div>
                </div>
                <div style="color: var(--el-color-primary)">
                    <slot name="version">{{ item.version }}</slot>
                </div>
            </div>
        </div>
    </div>

    <v-dialog custom-class="plugin-detail" ref="dialog" :append-to-body="true" :show-close="false" width="60%">
        <div class="plugin-detail-header">
            <div class="plugin-detail-title">
                <div class="plugin-icon detail">
                    <img :src="logo" alt="logo" v-if="logo">
                </div>
                <div>
                    <div class="plugin-name detail">
                        <div style="color: var(--el-color-primary)">{{ item.name }}</div>
                        <div class="official-icon" v-if="item.plugin_type === 'official'"></div>
                    </div>
                    <div class="plugin-detail-info">
                        <div>
                            <el-icon>
                                <Discount/>
                            </el-icon>
                            <div>版本：</div>
                            <slot name="version">{{ item.version }}</slot>
                        </div>
                        <div v-if="author">
                            <el-icon>
                                <User/>
                            </el-icon>
                            <div>作者：</div>
                            <div>
                                <slot>{{ author }}</slot>
                            </div>
                        </div>
                        <div v-if="downloadCount !== undefined">
                            <el-icon>
                                <Download/>
                            </el-icon>
                            <div>累计下载次数：</div>
                            <div>
                                {{ downloadCount }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <slot name="button"></slot>
            </div>
        </div>
        <div class="plugin-desc">{{ item.description }}</div>
        <el-divider content-position="left">插件文档</el-divider>
        <div class="plugin-doc">
            <div class="markdown-body" v-html="pluginDoc()"></div>
        </div>
    </v-dialog>
</template>

<script lang="ts">
import { marked } from 'marked'
import { Options, Vue } from 'vue-class-component'
import { amiyaBotServerHost } from '@/request/remote/amiyabotServer'
import { StringDict } from '@/lib/common'
import { Discount, User, Download } from '@element-plus/icons-vue'

import VDialog from '@/components/v-dialog.vue'

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
        VDialog,
        Discount,
        User,
        Download
    },
    computed: {
        dialog () {
            return this.$refs.dialog
        },
        logo () {
            return this.item.logo.startsWith('data:image/png;') ? this.item.logo : (amiyaBotServerHost + '/image?path=' + this.item.logo)
        }
    },
    props: {
        item: Object,
        author: String,
        downloadCount: Number
    }
})
export default class PluginItemCard extends Vue {
    item!: PluginItem
    dialog!: VDialog

    public pluginDoc () {
        return marked.parse(this.item.document)
    }
}
</script>

<style scoped lang="scss">
.plugin-item {
    width: 240px;
    margin: 0 10px 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 150ms ease-in-out;

    .plugin-title {
        display: flex;
        align-items: center;
        cursor: pointer;

        .plugin-info {
            display: flex;
            flex-direction: column;
        }
    }
}

.plugin-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .plugin-detail-title {
        display: flex;
        align-items: center;
    }
}

.plugin-icon {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid var(--el-card-border-color);
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    align-items: center;
    overflow: hidden;

    &.detail {
        width: 50px;
        height: 50px;
    }

    img {
        width: 100%;
    }
}

.plugin-name {
    display: flex;
    align-items: center;

    &.detail > div {
        font-size: 20px;
    }
}

.official-icon {
    margin-left: 3px;
    padding: 10px;
    background: url(../../../assets/icon/official.svg) center / 20px no-repeat;
}

.plugin-desc {
    margin: 30px 0;
}

.plugin-detail-info {
    display: flex;

    & > div {
        margin-top: 5px;
        margin-right: 10px;
        padding-right: 10px;
        border-right: 1px solid var(--el-border-color);
        display: flex;
        align-items: center;

        .el-icon {
            font-size: 14px;
            margin-right: 3px;
        }
    }

    & > div:last-child {
        border-right: none;
    }
}

.plugin-doc {
    max-height: 400px;
    overflow: auto;
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
