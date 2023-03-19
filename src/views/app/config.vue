<template>
    <div class="config-container ">
      <div class="left-box">
        <div class="plugin-list" v-if="pluginList.length">
          <div
            class="plugin-item"
            v-for="(item, index) in pluginList"
            :key="index"
            :class="{ 'selected-item': item === selectedItem }"
            @click="selectItem(index)"
          >
            <div class="plugin-icon">
              <img class="plugin-image" :src="item.logo" alt="logo" v-if="item.logo" />
            </div>
            <div class="plugin-info">
              <div class="plugin-name">
                {{ item.name }}
                <div
                  class="official-icon"
                  v-if="item.plugin_type === 'official'"
                ></div>
              </div>
              <div class="plugin-version">
                <slot name="version">{{ item.version }}</slot>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-divider class="divider" direction="vertical"></el-divider>
      <div class="right-box">
        <div v-if="selectedItem">
          <plugin-config-selector
            ref="configSelector"
            :plugin="selectedItem.plugin_id"
          />
        </div>
        <div v-else>
          <p>Please select an item from the list.</p>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { getInstalledPlugin } from '@/request/plugin'
import PluginConfigSelector from './pluginElem/pluginConfigSelector.vue'
import Notice from '@/lib/message'

@Options({
    components: {
        PluginConfigSelector
    },
    mounted () {
        this.getPlugin()
    }
})
export default class Config extends Vue {
    public pluginList= []

    public selectedItem = null

    public async getPlugin () {
        const res = await getInstalledPlugin()
        if (res) {
            console.log(res.data)
            this.pluginList = res.data
        }
    }

    async selectItem (index: number) {
        const configSelector : PluginConfigSelector = this.$refs.configSelector as PluginConfigSelector
        if (this.selectedItem !== this.pluginList[index] && this.selectedItem != null) {
            // 切换插件
            if (configSelector.confEditor.changed) {
                console.log('PluginConfigSelector', 'getPluginConfig', configSelector.confEditor.changed)
                if (await Notice.confirm('您的配置还未保存，是否丢弃修改？', '请注意', 'warning', ['取消', '丢弃'])) {
                    return
                }
                configSelector.confEditor.changed = false
            }
        }
        this.selectedItem = this.pluginList[index]
        console.log('?', this.selectedItem)
    }
}
</script>

<style scoped lang="scss">
.config-container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  }

  .left-box {
    flex: 0 0 300px;
    background-color: #f5f7fa;
    border-right: 1px solid #e4e7ed;
    overflow-y: auto;
  }

  .plugin-list {
    padding: 5px;
  }

  .divider{
    height: 100%;
    margin: 0 10px;
  }

  .right-box {
  flex: 1;
  align-items: stretch;
}

.plugin-item {
display: flex;
flex-direction: row;
align-items: center;
margin-bottom: 5px;
padding: 2px;
border-radius: 4px;
cursor: pointer;
transition: background-color 0.2s ease;
}

.plugin-item:hover {
background-color: #eef1f6;
}

.selected-item {
border: 2px solid gray;
}

.plugin-title {
display: flex;
align-items: center;

    .plugin-info {
        display: flex;
        flex-direction: column;
    }
}
.plugin-icon {
width: 35px;
height: 35px;
margin-right: 10px;
margin-top: 5px;
margin-bottom: 5px;
border-radius: 4px;
border: 1px solid var(--el-card-border-color);
box-shadow: var(--el-box-shadow-light);
display: flex;
align-items: center;
overflow: hidden;

    .plugin-image {
        width: 100%;
    }
}

</style>
