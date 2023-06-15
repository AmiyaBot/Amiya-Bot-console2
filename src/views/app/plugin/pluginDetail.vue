<template>
    <div class="plugin-detail-content">
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
                            <slot :item="item" name="version">{{ item.version }}</slot>
                        </div>
                        <div v-if="author">
                            <el-icon>
                                <User/>
                            </el-icon>
                            <div>作者：</div>
                            <div>
                                <slot :item="item" name="author">{{ author }}</slot>
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
            <div style="display: flex">
                <slot :item="item" name="button"></slot>
            </div>
        </div>
        <div class="plugin-desc" ref="description">{{ item.description }}</div>
        <div class="plugin-doc-card" style="padding: 10px">
            <el-card :body-style="{ height: 'calc(100% - 57px)', overflow: 'auto' }"
                     style="height: 100%; transition: none">
                <template #header>
                    <div style="display: flex;align-items: center;">
                        <el-icon style="margin-right: 3px">
                            <Collection/>
                        </el-icon>
                        <el-button link :type="docPage === 0 ? 'primary' : ''" @click="docPage = 0">插件文档</el-button>
                        <template v-if="item.instruction">
                            <el-divider direction="vertical"/>
                            <el-icon style="margin-right: 3px">
                                <Collection/>
                            </el-icon>
                            <el-button link :type="docPage === 1 ? 'primary' : ''" @click="docPage = 1">使用说明
                            </el-button>
                        </template>
                    </div>
                </template>
                <div class="plugin-doc">
                    <div class="markdown-body" v-html="pluginDoc()"></div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { marked } from 'marked'
import Common, { StringDict } from '@/lib/common'
import { Discount, User, Download, Collection } from '@element-plus/icons-vue'
import { amiyaBotServerHost } from '@/request/remote/amiyabotServer'

export interface PluginItem extends StringDict {
    'logo': string
    'name': string
    'version': string
    'plugin_id': string
    'plugin_type': string
    'description': string
    'document': string
    'instruction': string
    'allow_config': boolean
    'installed'?: boolean
    'upgrade'?: boolean
    'higher'?: boolean
    'curr_version'?: string
}

export function pluginLogo (item: PluginItem) {
    const logo = item.logo
    if (!logo) {
        return logo
    }
    if (logo.startsWith('data:image/png;')) {
        return logo
    }
    if (logo.startsWith('/')) {
        return Common.getData('host') + logo
    }
    return amiyaBotServerHost + '/image?path=' + logo
}

@Options({
    components: {
        Discount,
        User,
        Download,
        Collection
    },
    props: {
        item: Object,
        author: String,
        downloadCount: Number
    },
    computed: {
        logo () {
            return pluginLogo(this.item)
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.$forceUpdate()
        })
    }
})
export default class PluginDetail extends Vue {
    item!: PluginItem

    public docPage = 0

    public pluginDoc () {
        return marked.parse(this.docPage === 0 ? this.item.document : this.item.instruction)
    }
}
</script>

<style lang="scss">
.plugin-detail-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .plugin-detail-header {
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .plugin-detail-title {
            display: flex;
            align-items: center;
        }

        .plugin-name {
            display: flex;
            align-items: center;

            &.detail > div {
                font-size: 20px;
            }

            .official-icon {
                margin-left: 3px;
                padding: 10px;
                background: url(../../../assets/icon/official.svg) center / 20px no-repeat;
            }
        }

        .plugin-detail-info {
            display: flex;
            flex-wrap: wrap;
            color: #646464;

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
    }

    .plugin-desc {
        height: 100px;
        padding: 30px 0;
        overflow: auto;
    }

    .plugin-doc-card {
        height: calc(100% - 55px - 100px);
    }
}

.plugin-head {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    cursor: pointer;

    .plugin-title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis !important;
        white-space: nowrap;

        &.selected {
            color: var(--el-color-primary);
        }
    }
}

.plugin-icon {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    border: 1px solid var(--el-card-border-color);
    display: flex;
    align-items: center;
    position: relative;

    &.detail {
        width: 50px;
        height: 50px;
    }

    img {
        width: 100%;
        border-radius: 4px;
    }

    & > .installed-icon {
        width: 16px;
        height: 16px;
        position: absolute;
        top: -5px;
        right: -5px;
        background: url(../../../assets/icon/plugin/ok2.svg) center / 100% no-repeat;
    }

    &.detail > .installed-icon {
        display: none;
    }
}
</style>
