<template>
    <n-thing :title="title" style="margin: 1rem;">
        <n-data-table
            :columns="columns"
            :data="requests"
            :pagination="pagination"
            :row-key="idAsKey"
            :bordered="false"
            style="margin-bottom: 1.5em;"
        />
        <template #header-extra>
            <slot name="action"></slot>
        </template>
    </n-thing>
</template>
<script setup lang="ts">
import { DataTableColumns, NIcon, NIconWrapper, NDataTable, useThemeVars, DataTableCreateSummary, NThing, NSpin } from 'naive-ui';
import { computed, h, reactive, toRefs, useSlots } from 'vue';
import { Checkmark, Close, Help, Stop } from "@vicons/ionicons5";
import { imagePreviewPopover, stateIcon, wrappedIcon } from './fragments';

export interface IRequestState {
    id: string,
    name?: string,
    loading: boolean
    completed?: boolean
}


const props = withDefaults(defineProps<{
    requests: IRequestState[],
    title?: string
}>(), {
    title: "Pending Requests"
});

const { title, requests } = toRefs(props);
// const slots = useSlots();

const themeVars = useThemeVars();

const hasCompletionStatus = computed(() => requests.value.every(v => v.completed !== undefined));
const hasNames = computed(() => requests.value.some(v => v.name !== undefined));

const columns = computed(() => {
    const icon = stateIcon(themeVars.value);
    const baseColumns: DataTableColumns<IRequestState> = [];
    if (hasNames.value) {
        baseColumns.push({
            type: 'expand',
            expandable: (rowData) => rowData.name !== undefined && rowData.id !== undefined,
            renderExpand: (rowData) => {
                return `Request ID: ${rowData.id}`
            }
        }, {
            title: "Name",
            key: 'name'
        });
    } else {
        baseColumns.push({
            title: "Request ID",
            key: 'id'
        })
    }
    baseColumns.push({
        title: "Status",
        key: 'loading',
        render: row => {
            return row.loading ? h(NSpin, {size: 'small'}) : row.completed === undefined ? wrappedIcon(Stop) : icon(row.completed)
        }
    });
    return baseColumns;
})


const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [5, 10, 20, 50],
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    }
});

const idAsKey = (row: IRequestState) => {
    return row.id;
}

</script>