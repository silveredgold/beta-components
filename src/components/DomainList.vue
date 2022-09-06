<template>
    <n-tabs type="line" animated size="small" justify-content="space-evenly">
        <n-tab-pane name="allow" tab="Allowed">
            <n-empty v-if="(allowList || []).length == 0" description="No sites in allowed list" size="large" />
            <template v-if="(allowList || []).length > 0">
                <n-list v-if="!compact" :bordered="true">
                    <n-list-item v-for="site in allowList">
                        <n-text>{{ site }}</n-text>
                    </n-list-item>
                </n-list>
                <n-text tag="p" v-if="compact" v-for="site in allowList"> {{ site }}</n-text>
            </template>
        </n-tab-pane>
        <n-tab-pane name="force" tab="Forced">
            <n-empty v-if="(forceList || []).length == 0" description="No sites in forced list" size="large" />
            <template v-if="!compact && forceList && forceList.length > 0">
                <n-list v-if="!compact" :bordered="true">
                    <n-list-item v-for="site in forceList">
                        <n-text>{{ site }}</n-text>
                    </n-list-item>
                </n-list>
                <n-text v-if="compact" tag="p" v-for="site in allowList"> {{ site }}</n-text>
            </template>
        </n-tab-pane>
    </n-tabs>

</template>
<script setup lang="ts">
import { toRefs } from "vue";
import { NTabs, NTabPane, NList, NListItem, NEmpty, NText } from "naive-ui";
const props = withDefaults(defineProps<{ allowList?: string[], forceList?: string[], compact?: boolean }>(), {
    compact: false
});

const { allowList, forceList, compact } = toRefs(props);
</script>