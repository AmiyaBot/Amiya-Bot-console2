import { StringDict } from '@/lib/common'

type SchemaType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'

interface Schema {
    type: SchemaType
    title: string
    default: any
    description: string
    enum: Array<string>
}

interface SchemaItem extends Schema {
    items: Schema
}

export interface JsonSchema extends StringDict {
    $schema?: string
    type?: string
    required?: Array<string>
    properties?: { [field: string]: SchemaItem }
}
