<template>
    <n-thing :title="name" style="margin-bottom: 1rem;">
        <template #header-extra>
            <n-space>
                <slot name="prefix" />
                <n-badge v-if="level != undefined" :dot="level == 0" :value="level" :max="20" :type="type">
                    <n-tag :size="tagSize" :bordered="false">{{ getType(method) }}</n-tag>
                </n-badge>
                <n-tag :size="tagSize" v-if="level == undefined" :bordered="false" :type="type">{{getType(method)}}</n-tag>
                <slot name="suffix" />
            </n-space>
        </template>
    </n-thing>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import { NThing, NSpace, NBadge, NTag } from "naive-ui";
import { CensorType } from '@silveredgold/beta-shared/preferences';

const props = withDefaults(defineProps<{ name: string, method: string, level?: number, type?: "default" | "error" | "info" | "success" | "warning" , tagSize?: "small" | "medium" | "large" | "tiny"}>(), {
    type: 'info',
    tagSize: 'large'
});

const { level, method, name, type, tagSize } = toRefs(props);

const getType = (mode: string) => {
    return Object.keys(CensorType)[(Object.values(CensorType) as string[]).indexOf(mode)] || mode;
}
</script>