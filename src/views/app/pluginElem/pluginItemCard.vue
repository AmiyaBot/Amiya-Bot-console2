<template>
    <div class="plugin-item">
        <div>
            <div class="plugin-title">
                <div class="plugin-icon">
                    <img :src="item.logo" alt="logo" v-if="item.logo">
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
            </div>
        </div>
        <div class="plugin-opt">
            <slot name="button"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { StringDict } from '@/lib/common'

export interface PluginItem extends StringDict {
    'name': string
    'version': string
    'plugin_id': string
    'plugin_type': string
    'description': string
    'document': string
}

@Options({
    props: {
        item: Object
    }
})
export default class PluginItemCard extends Vue {
    item!: PluginItem
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
            width: 45px;
            color: var(--el-color-info-dark-2);
        }

        & > div:last-child {
            width: calc(100% - 45px);
        }
    }

    .plugin-opt {
        margin-top: 20px;
        text-align: right;
    }
}
</style>