<template>
    <div class="v-table">
        <div class="header-area">
            <div>
                <slot name="header"></slot>
            </div>
            <el-input style="width: 520px" v-model="searchInput" placeholder="输入任意值搜索..." @change="executeLoad(true)">
                <template #append>
                    <el-button :icon="searchIcon"/>
                </template>
            </el-input>
        </div>
        <el-table :data="tableData" stripe header-cell-class-name="v-table-header" ref="table" empty-text="暂无数据"
                  :max-height="600">
            <el-table-column v-for="(item, index) in columns" show-overflow-tooltip
                             :width="item.width || colWidth[item.field]"
                             :class-name="'mark_' + item.field"
                             :key="index"
                             :prop="item.field"
                             :label="item.title">
                <template #default="scope">
                    <slot name="cell"
                          :row="scope.row"
                          :field="item.field"
                          :value="scope.row[item.field]"
                          :index="scope.$index">
                        <div v-if="item.format"
                             v-html="item.format(scope.row, scope.row[item.field], scope.$index)"></div>
                        <div v-else v-html="scope.row[item.field]"></div>
                    </slot>
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" class-name="mark_operation" :width="colWidth.operation"
                             v-if="this.$slots.operations">
                <template #default="scope">
                    <slot name="operations" :row="scope.row" :index="scope.$index"></slot>
                </template>
            </el-table-column>
        </el-table>
        <div class="v-bottom">
            <el-pagination :layout="pagination ? 'total, prev, pager, next, sizes, jumper' : 'total'" :small="true"
                           :background="true"
                           v-model:currentPage="currentPage"
                           v-model:page-size="pageSize"
                           v-model:total="total"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"/>
            <el-icon class="v-bottom-icon" :size="20" @click="executeLoad()">
                <Refresh/>
            </el-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { calcMinWidth, WidthList } from '@/components/table/calcMinWidth'
import { Refresh, Search } from '@element-plus/icons-vue'
import { DictArray, StringDict } from '@/lib/common'

interface ColumnField {
    title: string
    field?: string
    width?: number
    format?: (row: StringDict, value: any, index: number) => string
}

interface ColumnConfig {
    [field: string]: ColumnField
}

interface QueryData extends StringDict {
    currentPage: number
    pageSize: number
    search?: string
}

interface PaginationData {
    total: number
    list: DictArray
}

type QueryMethod = (data: QueryData) => void

export {
    QueryData
}

@Options({
    components: {
        Refresh
    },
    props: {
        load: {
            type: Function,
            default: () => null
        }
    },
    computed: {
        table () {
            return this.$refs.table
        }
    },
    methods: {
        resetWidth (): void {
            setTimeout(() => {
                this.colWidth = calcMinWidth(this.table.$el)
            }, 200)
        }
    },
    watch: {
        tableData: {
            handler () {
                this.resetWidth()
            },
            deep: true
        }
    }
})
export default class VTable extends Vue {
    load!: QueryMethod

    private searchIcon = shallowRef(Search)
    private searchInput = ''

    private tableData: DictArray = []
    private columns: Array<ColumnField> = []
    private colWidth: WidthList = {}

    private pagination = false
    private currentPage = 1
    private pageSize = 10
    private total = 0

    public getColumns () {
        return {
            columns: this.columns,
            colWidth: this.colWidth
        }
    }

    public setData (data: DictArray): void {
        this.tableData = data
        this.total = data.length
        this.pagination = false
    }

    public setPaginationData (data: PaginationData): void {
        this.tableData = data.list
        this.total = data.total
        this.pagination = true
    }

    public setColumns (config: ColumnConfig): void {
        const columns: Array<ColumnField> = []

        for (const field in config) {
            const item = config[field]

            if (item.constructor === String) {
                columns.push({
                    field: field,
                    title: item
                })
            } else {
                if (!item.field) {
                    item.field = field
                }
                columns.push(item)
            }
        }

        this.columns = columns
        this.executeLoad()
    }

    public executeLoad (reset = false) {
        if (reset) {
            this.currentPage = 1
        }
        this.load({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            search: this.searchInput
        })
    }

    public handleSizeChange () {
        this.executeLoad()
    }

    public handleCurrentChange () {
        this.executeLoad()
    }
}
</script>

<style lang="scss">
.v-table {
    .header-area {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .v-table-header {
        font-weight: 100;
        color: var(--c-main);
    }

    .v-bottom {
        margin-top: 10px;
        display: flex;
        align-items: center;

        .v-bottom-icon {
            color: var(--el-text-color-regular);
            cursor: pointer;
        }

        .v-bottom-icon:hover {
            color: var(--c-main);
        }
    }

    .cell {
        width: auto;
        white-space: nowrap;
        display: flex;
    }

    .cell > .el-link:not(:last-child) {
        margin-right: 10px;
    }

    .el-pagination__sizes {
        margin-left: 15px;
    }

    .el-pagination__jump {
        margin-left: 0;
    }
}
</style>
