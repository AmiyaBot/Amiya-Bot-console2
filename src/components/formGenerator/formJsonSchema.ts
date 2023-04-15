import { StringDict } from '@/lib/common'

type SchemaType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'

export interface Schema {
    type: SchemaType
    title: string
    minimum: number
    maximum: number
    default: any
    description: string
    enum: Array<string>
}

export interface SchemaItem extends Schema {
    items: Schema
}

export interface JsonSchema extends StringDict {
    $schema?: string
    type?: string
    required?: Array<string>
    properties?: { [field: string]: SchemaItem }
}
