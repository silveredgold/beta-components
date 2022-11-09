<template>
    <div v-if="!loadedFiles || loadedFiles.length == 0">
        <n-tooltip trigger="hover" v-if="!!(actionHelpText)">
            <template #trigger>
                <n-button @click="openDir">{{actionLabel}}</n-button>
            </template>
            {{actionHelpText}}
        </n-tooltip>
        <n-button @click="openDir" v-if="!(actionHelpText)">{{actionLabel}}</n-button>
    </div>
    <n-card
        v-if="loadedFiles && loadedFiles.length > 0"
        title="Importing Files:"
        size="small"
        :style="{ height: '500px' }"
    >
        <n-tree
            block-line
            :data="importData"
            default-expand-all
            virtual-scroll
            style="height: 250px"
        />
        <template #action>
            <n-thing :title="importMsg" :description="humanFileSize(allFileSize)">
                {{ submitHelpText ?? '' }}
                <template #footer>
                    <n-button primary @click="importCurrent">Import</n-button>
                    <n-button @click="cancelImport" ghost>Cancel</n-button>
                </template>
            </n-thing>
        </template>
    </n-card>
</template>
<script setup lang="ts">import { FileSystemClient, DirectoryFile, DirectoryFileList, toFileList } from '../services';
import { computed, ref, Ref, toRefs } from 'vue';
import { humanFileSize } from "@silveredgold/beta-shared";
import { TreeOption, NTooltip, NButton, NCard, NTree, NThing } from 'naive-ui';

const emit = defineEmits<{
    (e: 'filesLoaded', dir: FileSystemDirectoryHandle, files: DirectoryFileList[]): void
}>();

const props = withDefaults(defineProps<{
    actionLabel?: string
    actionHelpText?: string,
    submitHelpText?: string
}>(), {
    actionLabel: 'Import Files...'
});

const {actionLabel, actionHelpText, submitHelpText } = toRefs(props);
const loadedFiles: Ref<DirectoryFileList[]> = ref([]);
const loadedDir: Ref<FileSystemDirectoryHandle|undefined> = ref(undefined);
const importMsg = computed(() => `Importing ${loadedFiles.value.flatMap(h => h.files).length} files from ${loadedFiles.value.length} directories...`)
const allFileSize = computed(() => loadedFiles.value.reduce((a, b) => a = a + b.files.reduce((c, d) => c + d.file.size, 0), 0));
const importData = computed((): TreeOption[] => {
    return loadedFiles.value !== undefined ? loadedFiles.value.map(nfv => {
        return {
            label: nfv.name,
            key: nfv.name,
            children: nfv.files.map(f => {
                return {
                    label: f.handle.name,
                    key: `${nfv.name}/${f.handle.name}`
                }
            })
        }
    })
    : [];
});

const openDir = async () => {
    const fs = new FileSystemClient();
    const result = await fs.getDirectoriesandFiles((file) => file.type.startsWith("image/"));
    loadedDir.value = result.dir;
    const results = await toFileList(result);
    loadedFiles.value = results;
}

const importCurrent = async () => {
    emit('filesLoaded', loadedDir.value!, loadedFiles.value);
}

const cancelImport = () => {
    loadedFiles.value = [];
}

</script>