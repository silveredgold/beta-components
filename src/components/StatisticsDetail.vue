<template>
<n-grid :x-gap="12" :cols="3">
    <n-grid-item :span="3" v-if="!!navService">
      <n-alert title="Unknown Domains" type="default" closable style="margin-bottom: 1.5em;" v-if="stats && stats.length > 0">
            <template #icon>
              <n-icon :component="InformationCircle" />
            </template>
            See an entry for <code>unknown.tld</code> in the list? That just means domain hiding is enabled. You can turn it off in the <n-button @click="navService!.openSettings" size="small" type="info" quaternary icon-placement="right"><template #icon><n-icon :component="Open" /></template> settings</n-button> to share domains with the backend.
          </n-alert>
    </n-grid-item>
    <n-grid-item :span="3">
      <n-data-table
    :columns="columns"
    :data="stats"
    :pagination="pagination"
    :bordered="false"
    style="margin-bottom: 1.5em;"
  />
    </n-grid-item>
    <n-grid-item :offset="2" >
    <n-card title="Reset Statistics" size="small">
        <template #header-extra>Reset Backend Logs</template>
        <div>
            This will request the backend to reset <em>all</em> your statistics! Use with caution!
        </div>
        <template #action>
            <n-space item-style="display: flex;" justify="end">
                <n-button strong secondary type="error" @click="resetStatistics">Reset all statistics</n-button>
            </n-space>
        </template>
    </n-card></n-grid-item>
  </n-grid>

  
</template>
<script setup lang="ts">
import { NDataTable, NAlert, NIcon, useNotification, DataTableColumns, NButton, NCard, NSpace, NGrid, NGridItem } from "naive-ui";
import { InformationCircle, Open } from "@vicons/ionicons5";
import { computed, inject, reactive, ref, Ref, toRefs, watch } from "vue";
import {StatisticsData} from "@silveredgold/beta-shared/transport";
import { useEventEmitter } from "../messaging";
import { toTitleCase } from "@silveredgold/beta-shared";
import { INavigationService, useBackendTransport } from ".";

const props = defineProps<{
    statistics: StatisticsData,
    navService?: INavigationService
}>();

type SiteStatistic = {
    domain: string,
    safe: number,
    censored: number,
    categories: {
        [name: string]: number
    }
};

const emitter = useEventEmitter();
const notif = useNotification();
const asyncBackend = useBackendTransport();
const { statistics, navService } = toRefs(props);

const stats = computed<SiteStatistic[]>(() => statistics?.value ? Object.keys(statistics.value).map(st => {
    const detail = statistics.value[st];
    return {
        domain: st,
        ...detail
    }
}) : []);

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
    })


const defaultColumns: DataTableColumns<SiteStatistic> = [
    {
        title: 'Domain',
        key: 'domain'
    },
    {
        title: 'Safe Images',
        key: 'safe',
    },
    {
        title: 'Censored',
        key: 'censored',
    }
];

const columns: Ref<DataTableColumns<SiteStatistic>> = ref(defaultColumns);

watch(statistics, (newStats) => {
    columns.value = defaultColumns;
    const firstSite = Object.values(statistics.value).find(s => !!s.categories);
    if (firstSite) {
        for (const category of Object.keys(firstSite.categories)) {
            columns.value.push({title: toTitleCase(category), key: 'categories.' + category});
        }
    }
});


const enabled = computed(() => statistics.value && Object.keys(statistics.value).length > 0);

const refresh = () => {
    emitter?.emit('reload', 'statistics');
}

const resetStatistics = async () => {
    var backend = await asyncBackend;
    const result = await backend.resetStatistics();
    if (result) {
        notif?.create({
            type: 'success',
            title: 'Statistics have been reset!',
            content: 'The backend has successfully reset your statistics',
            duration: 5000
        });
    } else {
        notif?.create({
            type: 'warning',
            title: 'Statistics reset failed!',
            content: 'The reset request returned an error, and your statistics are likely still stored.'
        });
    }
    emitter?.emit('reload', 'statistics');
}
</script>