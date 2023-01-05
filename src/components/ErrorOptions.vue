<template>
    <n-card title="Error Display Preferences" size="small">
        <div>
            <n-radio-group
                v-model:value="prefs.errorMode"
                name="left-size"
                size="small"
                style="margin-bottom: 12px;"
            >
                <template v-for="opt in availableModes" v-bind:key="opt">
                    <n-radio-button :value="opt.toLowerCase()">{{ opt }}</n-radio-button>
                </template>
            </n-radio-group>
        </div>
        <template #footer>
            Subtle will show a subtler SFW placeholder when censoring fails, while Normal will show an NSFW image instead. <template v-if="allowNone">None will not show an error image at all.</template>
        </template>
    </n-card>
</template>
<script setup lang="ts">
import { watch, toRefs, inject, computed } from 'vue';
import { NCard, NRadioGroup, NRadioButton } from "naive-ui";
import { updateUserPrefs } from '../messaging';
import { IPreferences } from '@silveredgold/beta-shared/preferences';
import { watchForChanges } from ".";

const props = withDefaults(defineProps<{
    preferences: IPreferences,
    allowNone?: boolean
}>(), {allowNone: false});

const { preferences, allowNone } = toRefs(props);
const availableModes = computed(() => allowNone.value ? ['Subtle', 'Normal', 'None'] : ['Subtle', 'Normal']);
const prefs = preferences;
const updatePrefs = inject(updateUserPrefs, undefined);

watch(prefs, watchForChanges(false, updatePrefs), {deep: true})

</script>