<template>
  <div class="selector-container">
    <div class="header">
      <el-select class="select" v-model="selectedChannelName" @change="handleSelectionChange" placeholder="请选择">
        <el-option v-for="option in options" :key="option" :value="option.name" :label="option.name">{{ option.name }}</el-option>
      </el-select>
      <div class="buttons">
        <el-button v-if="defaultValue!=''" @click="reset">设为默认值</el-button>
        <el-button v-if="templates.default_global_config && templates.default_global_config.length > 0" @click="createNew">新增</el-button>
        <el-button v-show="selectedChannelName!=''" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="editor"  v-show="selectedChannelName!=''">
      <plugin-config-editor ref="confEditor"/>
    </div>
    <el-dialog title="请输入字符串"  v-model="dialogVisible">
      <el-input v-model="dialogInputValue" placeholder="请输入字符串" />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInput">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { getPluginConfig, getPluginDefaultConfig, setPluginConfig } from '@/request/plugin'
import { Options, Vue } from 'vue-class-component'
import { StringDict } from '@/lib/common'
import PluginConfigEditor from './pluginConfigEditor.vue'
import Notice from '@/lib/message'

export interface ConfigSelectorItem extends StringDict {
    'name': string
    'json':string
}

@Options({
    props: {
        plugin: String
    },
    components: {
        PluginConfigEditor
    },
    watch: {
        plugin: function (newVal) {
            this.getPluginConfig(newVal)
        }
    },
    computed: {
        selectedValue () {
            return this.options.find((option:any) => option.name === this.selected)
        }
    },
    mounted () {
        this.confEditor = this.$refs.confEditor
        this.getPluginConfig(this.plugin)
    }
})
export default class PluginConfigSelector extends Vue {
      pluginId=''

      options :ConfigSelectorItem[] = []

      selectedChannelName=''

      oldSelection = ''

      defaultValue = ''
      templates = {}

      confEditor!:PluginConfigEditor

      dialogVisible = false;
      dialogInputValue = '';

      public async getPluginConfig (pluginId:string) {
          this.pluginId = pluginId

          this.confEditor.loadJsonAndSchema('{}', '{}')

          const res = await getPluginConfig({
              plugin_id: pluginId
          })
          if (res) {
              const templateRes = await getPluginDefaultConfig({
                  plugin_id: pluginId
              })
              if (templateRes) {
                  this.templates = templateRes.data
              }

              console.log('PluginConfigSelector', 'getPluginConfig', res)
              this.selectedChannelName = ''
              this.options = Object.keys(res.data).map((key:string) => {
                  const item = res.data[key]
                  if (key === '0') {
                      key = '全局配置'
                  }
                  return {
                      name: key,
                      json: item
                  }
              })

              if (!this.options.some((item) => item.name === '全局配置')) {
                  const globalConfKey = 'default_global_config'
                  if (globalConfKey in this.templates) {
                      this.options.push({
                          name: '全局配置',
                          json: this.getValue(this.templates, globalConfKey)
                      })
                  } else {
                      this.options.push({
                          name: '全局配置',
                          json: '{}'
                      })
                  }
              }
          }
      }

      async handleSelectionChange () {
          if (this.confEditor.changed) {
              console.log('PluginConfigSelector', 'getPluginConfig', this.confEditor.changed)
              if (await Notice.confirm('您的配置还未保存，是否丢弃修改？', '请注意', 'warning', ['取消', '丢弃'])) {
                  // event.preventDefault()
                  this.selectedChannelName = this.oldSelection
                  return
              }
              this.confEditor.changed = false
          }

          this.oldSelection = this.selectedChannelName
          const newVal = this.options.find((option:any) => option.name === this.selectedChannelName)

          if (!newVal) {
              return
          }

          if (newVal.json === '') {
              if (newVal.name === '全局配置') {
                  this.confEditor.loadJsonAndSchema(
                      this.getValue(this.templates, 'global_config_template'), this.getValue(this.templates, 'default_global_config'))
                  this.defaultValue = this.getValue(this.templates, 'default_global_config')
              } else {
                  this.confEditor.loadJsonAndSchema(
                      this.getValue(this.templates, 'channel_config_template'), this.getValue(this.templates, 'default_channel_config'))
                  this.defaultValue = this.getValue(this.templates, 'default_channel_config')
              }
          } else {
              if (newVal.name === '全局配置') {
                  this.confEditor.loadJsonAndSchema(
                      this.getValue(this.templates, 'global_config_template'), newVal.json)
                  this.defaultValue = this.getValue(this.templates, 'default_global_config')
              } else {
                  this.confEditor.loadJsonAndSchema(
                      this.getValue(this.templates, 'channel_config_template'),
                      newVal.json)
                  this.defaultValue = this.getValue(this.templates, 'default_channel_config')
              }
          }
      }

      reset () {
          this.confEditor.loadJson(this.defaultValue)
          this.confEditor.changed = true
      }

      createNew () {
          this.dialogVisible = true
          this.dialogInputValue = ''
      }

      async confirmInput () {
          this.dialogVisible = false
          // 检查一下有没有重复的PluginId已经存在
          if (this.options.some((item) => item.name === this.dialogInputValue) || this.dialogInputValue === '0') {
              await Notice.alert('您输入的ChannelId已重复', '警告')
              return
          }

          const localConfigKey = 'default_channel_config'
          let newVal
          if (localConfigKey in this.templates) {
              newVal = {
                  name: this.dialogInputValue,
                  json: this.getValue(this.templates, localConfigKey)
              }
          } else {
              newVal = {
                  name: this.dialogInputValue,
                  json: '{}'
              }
          }
          this.options.push(newVal)
          this.confEditor.changed = true
      }

      async save () {
          const jsonObj = this.confEditor.getJsonObj()
          console.log(JSON.stringify(jsonObj))

          if (this.selectedChannelName === '') {
              return
          }

          const selectVal = this.options.find((option:any) => option.name === this.selectedChannelName)
          if (!selectVal) {
              return
          }

          let channelId = this.getValue(selectVal, 'name')
          if (channelId === '全局配置') {
              channelId = '0'
          }

          await setPluginConfig({
              plugin_id: this.pluginId,
              channel_id: channelId,
              config_json: JSON.stringify(jsonObj)
          })
          this.confEditor.changed = false
          selectVal.json = JSON.stringify(jsonObj)
          this.$emit('save', {
              json: JSON.stringify(jsonObj),
              channelId: channelId
          })
      }

      private getValue (obj: object, key: string) {
          if (!obj) {
              return
          }
          if (obj == null) {
              return
          }
          if (Object.keys(obj).indexOf(key) >= 0) {
              return (obj as any)[key]
          }
          return null
      }
}

</script>

<style scoped>

.selector-container {
  margin: 0 auto;
  font-family: "Helvetica Neue", sans-serif;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.select {
  display: flex;
  width: 300px;
  align-items: center;
}
.select label {
  margin-right: 10px;
}
.buttons {
  display: flex;
  align-items: center;
}
.buttons button {
  margin-left: 10px;
}
.editor {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
}

</style>
