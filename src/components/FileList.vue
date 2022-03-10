<template>
    <n-thing :title="title" style="margin: 1rem;">
        <n-data-table
            :columns="columns"
            :data="files"
            :pagination="pagination"
            :bordered="false"
            style="margin-bottom: 1.5em;"
        />
        <template #header-extra>
            <slot name="action"></slot>
        </template>
    </n-thing>
</template>
<script setup lang="ts">
import { DataTableColumns, NIcon, NIconWrapper, NDataTable, useThemeVars, DataTableCreateSummary, NThing } from 'naive-ui';
import { computed, h, reactive, toRefs, useSlots } from 'vue';
import { Checkmark, Close, Help } from "@vicons/ionicons5";
import { imagePreviewPopover } from './fragments';
import { SummaryRowData } from 'naive-ui/lib/data-table/src/interface';

export interface IFileEntry {
    keyName?: string,
    key: string,
    imageSrc?: string,
    removeAction?: () => void,
    completed?: boolean
}


const props = withDefaults(defineProps<{
    files: IFileEntry[],
    title: string
    keyName?: string
}>(), {
    keyName: "Name"
});

const { files, keyName, title } = toRefs(props);
// const slots = useSlots();

const themeVars = useThemeVars();

const hasImagePreviews = computed(() => files.value.some(v => !!v.imageSrc));
const hasRemoveAction = computed(() => files.value.some(v => !!v.removeAction));
const columns = computed(() => {
    var baseColumns: DataTableColumns<IFileEntry> = [
        {
            title: keyName.value,
            key: 'key'
        }];
    if (hasImagePreviews.value) {
        baseColumns.push({
            title: 'Preview',
            key: 'url',
            render: row => {
                return imagePreviewPopover()(row.imageSrc);
            }
        });
    }
    baseColumns.push({
        title: 'Complete',
        key: 'completed',
        render: row => {
            return h(
                NIconWrapper,
                {
                    size: 24,
                    borderRadius: 10,
                    color: row.completed === undefined ? themeVars.value.warningColor : row.completed ? themeVars.value.successColor : themeVars.value.errorColor
                }, () => h(
                    NIcon, {
                    component: row.completed === undefined ? Help : row.completed ? Checkmark : Close
                })
            )
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
</script>