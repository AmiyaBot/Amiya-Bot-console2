<template>
    <div v-for="(item, index) in editorControls" :key="index" :item="item">
      <el-form label-position="top">
        <div v-if="item.type === 'textbox'">
          <el-tooltip effect="light" :content="item.desc" placement="top-start" :disabled="item.desc==null">
            <el-form-item :label="item.label">
              <el-input v-model="item.value" @input="handelGeneralValueChanged()" />
            </el-form-item>
          </el-tooltip>
        </div>
        <div v-if="item.type === 'option'">
          <el-tooltip effect="light" :content="item.desc" placement="top-start" :disabled="item.desc==null">
            <el-form-item :label="item.label">
              <el-select v-model="item.value" placeholder="请选择" @change="handelGeneralValueChanged()">
                <el-option v-for="(option) in item.options" :key="option" :label="option" :value="option" />
              </el-select>
            </el-form-item>
          </el-tooltip>
        </div>
        <div v-if="item.type === 'strArray'">
          <el-tooltip effect="light" :content="item.desc" placement="top-start" :disabled="item.desc==null">
            <div style="display: flex; align-items: center;">
              <el-form-item :label="item.label" style="display: flex; align-items: center;">
                <div style="flex: 1; margin-right: 10px;">
                  <el-input v-model="item.inputValue" placeholder="请输入要添加的值"></el-input>
                </div>
                <el-button type="primary" @click="addStringArrayValue(item)">添加</el-button>
              </el-form-item>
            </div>
          </el-tooltip>
          <el-card>
            <el-tooltip effect="dark" :content="tag" placement="bottom" v-for="(tag, index) in item.value" :key="index">
              <el-tag class="truncate" closable @close="removeStringArrayValue(item, index)">{{ truncateValue(tag) }}</el-tag>
            </el-tooltip>
          </el-card>
        </div>
      </el-form>
      <el-divider></el-divider>
    </div>
    <div v-if="editorControls.length==0">
        {{ rawJsonStr }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
    components: {
    },
    mounted () {
        this.loadJsonAndSchema(this.jsonSchema, this.json)
    }
})
export default class PluginConfigEditor extends Vue {
    public changed = false

    jsonObj = {}
    jsonSchemaObj = {}

    rawJsonStr = ''

    editorControls: any[] = []

    public async loadJson (jsonStr: string) {
        if (!jsonStr) {
            return
        }
        this.jsonObj = JSON.parse(jsonStr)
        await this.renderControls()
    }

    public async loadJsonAndSchema (jsonSchemaStr: string, jsonStr:string) {
        if (!jsonSchemaStr) {
            return
        }

        if (!jsonStr) {
            return
        }

        this.rawJsonStr = jsonStr

        try {
            this.jsonSchemaObj = JSON.parse(jsonSchemaStr)
            this.jsonObj = JSON.parse(jsonStr)
        } catch (e) {
            // jsonStr不是JSON格式
            return
        }

        console.log('PluginConfigEditor', 'loadJson', this.jsonObj, this.jsonSchemaObj)

        await this.renderControls()
    }

    public async renderControls () {
        this.editorControls = []
        this.changed = false

        if (!this.getValue(this.jsonSchemaObj, 'properties')) {
            console.log('PluginConfigEditor', 'loadSchema-propkey', this.jsonSchemaObj)
            return
        }

        const propObj = this.getValue(this.jsonSchemaObj, 'properties')

        for (let i = 0; i < Object.keys(propObj).length; i++) {
            const cfgName = Object.keys(propObj)[i]
            const cfgConfig = propObj[cfgName]

            console.log('PluginConfigEditor', 'renderControls-forEach', cfgConfig)
            const type = this.getValue(cfgConfig, 'type')

            switch (type) {
                case 'string':
                    if (this.getValue(cfgConfig, 'enum') != null) {
                        console.log('PluginConfigEditor', 'renderControls-enum', this.getValue(cfgConfig, 'enum'))
                        this.editorControls.push({
                            type: 'option',
                            options: this.getValue(cfgConfig, 'enum'),
                            label: this.getValue(cfgConfig, 'title') ?? cfgName,
                            desc: this.getValue(cfgConfig, 'description'),
                            key: cfgName,
                            value: this.getValue(this.jsonObj, cfgName)
                        })
                        continue
                    }
                    this.editorControls.push({
                        type: 'textbox',
                        label: this.getValue(cfgConfig, 'title') ?? cfgName,
                        desc: this.getValue(cfgConfig, 'description'),
                        key: cfgName,
                        value: this.getValue(this.jsonObj, cfgName)
                    })
                    break
                case 'array':
                    this.editorControls.push({
                        type: 'strArray',
                        label: this.getValue(cfgConfig, 'title') ?? cfgName,
                        desc: this.getValue(cfgConfig, 'description'),
                        key: cfgName,
                        value: this.getValue(this.jsonObj, cfgName),
                        inputValue: ''
                    })
                    break
            }
        }

        console.log('editorControls', this.editorControls)
    }

    public truncateValue (str:string) {
        const maxLength = 10
        if (str.length > maxLength) {
            return str.substring(0, maxLength - 3) + '...'
        } else {
            return str
        }
    }

    public getJsonObj () {
        const objCalcuated :any = {}
        this.editorControls.forEach(item => {
            switch (item.type) {
                case 'textbox':
                    objCalcuated[item.key] = item.value
                    break
                case 'option':
                    objCalcuated[item.key] = item.value
                    break
                case 'strArray':
                    objCalcuated[item.key] = item.value
                    break
            }
        })
        return objCalcuated
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

    removeStringArrayValue (item: any, index: number) {
        item.value.splice(index, 1)
        this.changed = true
    }

    addStringArrayValue (item: any) {
        if (item.inputValue) {
            console.log(item)
            if (!item.value) {
                item.value = []
            }
            item.value.push(item.inputValue)
            item.inputValue = ''
            this.changed = true
        }
    }

    handelGeneralValueChanged () {
        this.changed = true
    }
}

</script>
<style scoped>
.truncate {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 溢出隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 200px; /* 设置最大宽度 */
  margin-right: 5px;
}

</style>
