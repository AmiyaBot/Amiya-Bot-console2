import Common, { StringDict } from '@/lib/common'
import { JsonSchema } from '@/components/formGenerator/formJsonSchema'

type FormType = 'input' | 'number' | 'select' | 'boolean' | 'values' | 'table' | 'unsupported'

export class FormItem {
    type: FormType = 'input'
    field: string
    value: any
    title = ''
    description = ''
    required = false

    tableForm: any = null
    options: StringDict = {}

    factory: any = String

    constructor (field: string) {
        this.field = field
    }
}

export class FormGroup {
    type = 'form'
    name: string
    field: string
    formItems: Array<FormItem | FormGroup> = []

    constructor (name: string, field = '') {
        this.name = name
        this.field = field
    }

    public append (item: FormItem | FormGroup) {
        this.formItems.push(item)
    }
}

class BuildFromJson {
    static build (dict: StringDict, group: FormGroup): FormGroup {
        for (const field in dict) {
            const item = this.buildField(field, dict[field])
            if (item) {
                group.append(item)
            }
        }
        return group
    }

    static buildField (field: string, value: any): FormGroup | FormItem {
        const item = new FormItem(field)

        item.value = value
        item.factory = value !== null ? value.constructor : String

        switch (item.factory) {
            case Object:
                return this.build(value, new FormGroup(field, field))
            case Array:
                item.type = 'values'
                item.factory = value.length ? value[0].constructor : String

                if (item.factory === Object) {
                    item.type = 'table'
                    item.tableForm = this.build(value[0], new FormGroup(field, field))
                }
                if (item.factory === Array) {
                    item.type = 'unsupported'
                }
                break
            case Number:
                item.type = 'number'
                break
            case Boolean:
                item.type = 'boolean'
                break
        }

        return item
    }
}

class BuildFromSchema {
    static build (schema: JsonSchema, name: string, groupField = '') {
        const group = new FormGroup(name, groupField)

        for (const field in schema.properties) {
            const schemaItem = schema.properties[field]
            const item = new FormItem(field)

            item.title = schemaItem.title
            item.value = schemaItem.default
            item.description = schemaItem.description
            item.required = !!(schema.required && schema.required.indexOf(field) >= 0)

            if (schemaItem.enum && schemaItem.enum.length) {
                item.type = 'select'
                item.factory = schemaItem.enum[0].constructor

                for (const option of schemaItem.enum) {
                    item.options[option] = option
                }
            } else {
                switch (schemaItem.type) {
                    case 'array':
                        item.type = 'values'
                        if (!item.value) {
                            item.value = []
                        }
                        if (item.value.length) {
                            item.factory = item.value[0].constructor
                        }
                        break
                    case 'boolean':
                        item.type = 'boolean'
                        item.factory = Boolean
                        if (!item.value) {
                            item.value = false
                        }
                        break
                    case 'number':
                    case 'integer':
                        item.type = 'number'
                        item.factory = Number
                        if (!item.value) {
                            item.value = 0
                        }
                        break
                    case 'object':
                        group.append(this.build(schemaItem, schemaItem.title, field))
                        continue
                    case 'null':
                        continue
                }
            }

            group.append(item)
        }

        return group
    }
}

export default class FormGenerator {
    form: FormGroup

    constructor (dict: JsonSchema, isSchema = false) {
        if (isSchema) {
            this.form = BuildFromSchema.build(dict, '')
        } else {
            this.form = BuildFromJson.build(Common.deepCopy(dict), new FormGroup(''))
        }
    }
}
