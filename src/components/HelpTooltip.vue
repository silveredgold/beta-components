<template>
  <n-popover trigger="hover" :placement="placement">
    <template #trigger>
      <n-icon style="margin-top: auto; margin-bottom: auto;" :component="HelpCircleOutline" :size="size" />
    </template>
    <slot></slot>
  </n-popover>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import { NIcon, NPopover } from "naive-ui";
import { HelpCircleOutline } from "@vicons/ionicons5";
import { FollowerPlacement } from 'vueuc';

const props = withDefaults(defineProps<{
  placement?: FollowerPlacement,
  size?: number
}>(), {
  placement: 'bottom',
  size: 30
});

const { placement, size } = toRefs(props);
</script>
