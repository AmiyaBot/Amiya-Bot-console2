import { StringDict } from '@/lib/common'

type SchemaType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'

interface Schema {
    type: SchemaType
    title: string
    enum: Array<string>,
    default: any,
    description: string
}

export interface JsonSchema extends StringDict {
    $schema?: string
    type?: string
    required?: Array<string>
    properties?: { [field: string]: Schema }
}
