<template>
    <n-popover trigger="hover" :placement="placement">
        <template v-slot:trigger>
            <n-icon :component="icon" :size="20" />
        </template>
        <n-thing
            title="Experimental Feature!"
            style="max-width: 20rem;"
        >
            <n-text tag="p" v-for="(msg, idx) of message" :key="idx">{{msg}} </n-text>
        </n-thing>
    </n-popover>
</template>
<script setup lang="ts">
import { AlertCircleOutline } from '@vicons/ionicons5';
import { PopoverPlacement, NPopover, NIcon, NThing, NText } from 'naive-ui';
import { Component, computed, toRefs } from 'vue';


const props = withDefaults(defineProps<{
    placement?: PopoverPlacement,
    performance?: boolean,
    support?: boolean,
    experimental?: boolean,
    icon?: Component,
    featureName?: string
}>(), {
    placement: 'bottom',
    performance: false,
    support: false,
    experimental: false,
    icon: AlertCircleOutline,
    featureName: undefined
});

const { experimental, performance, support, placement, icon, featureName } = toRefs(props);

const title = computed(() => [experimental.value, performance.value, support.value].filter(fl => !!fl).length > 1 ? 'Experimental Feature!' : 'Experimental Feature!')

const message = computed(() => {
    let firstRun = true;
    const getName = () => {
        const res = firstRun ? (featureName.value ?? 'This feature') : 'This feature';
        firstRun = false;
        return res;
    }
    const builder: string[] = [];
    if (support.value) {
        builder.push(getName() + ' is an experimental feature that may not be supported by all backends. If you are having problems with this feature, check that your current backend supports it.');
    }
    if (experimental.value) {
        builder.push(getName() + ' is not a part of the NudeNet model so not all backends may support it! Additionally, the accuracy or performance may be worse than other supported parts.');
    }
    if (performance.value) {
        builder.push(getName() + ' may affect censoring performance more noticeably than other features. Enable with caution!');
    }
    return builder;
});

</script>