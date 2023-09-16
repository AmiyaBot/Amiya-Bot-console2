import { StringDict } from '@/lib/common'

export type SchemaType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'
export type DateTimeType = 'date' | 'time' | 'datetime' | 'date-range' | 'time-range' | 'datetime-range'

export const dateTimeTypeName: Array<DateTimeType> = ['date', 'time', 'datetime', 'date-range', 'time-range', 'datetime-range']

export interface Schema {
    type: SchemaType
    title: string
    minimum: number
    maximum: number
    default: any
    description: string
    enum: Array<string>
    format?: DateTimeType
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
