<template>
    <n-page-header
        subtitle="Check the statistics from the censoring backend."
        style="padding-bottom: 2rem;"
    >
        <template #header>Beta Protection</template>
        <template #title>Censoring Statistics</template>
        <template #avatar>
            <n-avatar :src="iconSrc" />
        </template>
        <template #extra>
            <n-space>
                <n-popover trigger="hover" placement="bottom">
                    <template #trigger>
                        <n-button @click="navService.openSettings">
                            <n-icon size="30" :component="Settings" />
                        </n-button>
                    </template>
                    Open Options
                </n-popover>
                <n-popover trigger="hover" placement="bottom">
                    <template #trigger>
                        <n-button @click="refresh">
                            <n-icon size="30" :component="Refresh" />
                        </n-button>
                    </template>
                    Refresh
                </n-popover>
            </n-space>
        </template>
        <template v-if="statistics">
            <n-grid :cols="3">
                <n-gi>
                    <n-statistic label="Censored Images" :value="censoredCount" />
                </n-gi>
                <n-gi>
                    <n-statistic label="Safe Images" :value="safeCount" />
                </n-gi>
                <n-gi>
                    <n-statistic label="Total Images" :value="totalCount" />
                </n-gi>
            </n-grid>
        </template>
    </n-page-header>
</template>
<script setup lang="ts">
import { NPageHeader, NGrid, NGi, NAvatar, NStatistic, NButton, NSpace, NIcon, useNotification, NPopover } from "naive-ui";
import { Settings, Refresh, AddCircle } from "@vicons/ionicons5";
import { computed, inject, Ref, toRefs } from "vue";
import { StatisticsData } from "@silveredgold/beta-shared/transport";
import { INavigationService } from ".";
import { useEventEmitter } from "../messaging";

const props = defineProps<{
    statistics: StatisticsData,
    navService: INavigationService,
    iconPath?: string
}>();

const emitter = useEventEmitter();
const { statistics, navService, iconPath } = toRefs(props);

const enabled = computed(() => statistics.value && Object.keys(statistics.value).length > 0);
const safeCount = computed(() => Object.values(statistics.value).reduce((a, b) => a = a + b.safe, 0));
const censoredCount = computed(() => Object.values(statistics.value).reduce((a, b) => a = a + b.censored, 0));
const totalCount = computed(() => Object.values(statistics.value).reduce((a, b) => a = a + b.safe + b.censored, 0));

const iconSrc = navService.value.getAssetUrl(iconPath?.value ?? '/images/icon.png');

const refresh = () => {
    emitter?.emit('reload', 'statistics');
}
</script>