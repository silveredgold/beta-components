<template>
    <n-card title="Import and Export Preferences" size="small">
        <n-thing title="Import Settings" v-if="loaded">
            Import your Beta Protection preferences from a previously exported file.
            <template #footer>
                <n-text type="warning">This will overwrite your current preferences!</n-text>&nbsp;
            </template>
            <template #action>
                <n-space item-style="display: flex;" justify="end">
                    <n-popover trigger="hover" placement="bottom">
                        <template #trigger>
                            <n-icon
                                style="margin-top: auto; margin-bottom: auto;"
                                :component="HelpCircleOutline"
                                :size="30"
                            />
                        </template>
                        <n-thing title="Looking for Beta Safety import?">
                            Your Beta Safety preferences (if you had any) were already imported when you installed Beta Protection!
                        </n-thing>
                    </n-popover>
                    <n-button @click="importPrefs">Import</n-button>
                </n-space>
            </template>
        </n-thing>
    </n-card>
</template>
<script setup lang="ts">
import { watch, computed, toRefs, inject } from 'vue';
import { NCard, useNotification, NThing, NGrid, NGridItem, NSpace, NButton, NText, NIcon, NPopover } from "naive-ui";
import { HelpCircleOutline } from "@vicons/ionicons5";
import { IPreferences } from '@silveredgold/beta-shared/preferences';
import { FileSystemClient } from '../services';
import { PreferencesProps, useOptionalNotification } from '.';
import { useEventEmitter } from "../messaging";

const emit = defineEmits<{
    (e: 'imported', preferences: IPreferences): void
}>();

const props = withDefaults(defineProps<PreferencesProps>(), {
    compact: false
});

const notif = useOptionalNotification();

const { preferences } = toRefs(props);

const emitter = useEventEmitter();

const loaded = computed(() => preferences.value !== undefined);

const importPrefs = async () => {
    const fs = new FileSystemClient();
    const result = await fs.getFile(fs.jsonFiles);
    const content = await result.file.text();
    const newPrefs = JSON.parse(content) as IPreferences;
    if (newPrefs && newPrefs.exposed) {
        emit('imported', newPrefs);
    } else {
        emitter?.emit('reload', 'preferences');
        notif?.create({
            type: 'warning',
            content: 'Failed to import preferences!'
        });
    }
}

</script>
<style>
</style>