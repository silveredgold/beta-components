<template>
    <!-- <n-card size="small">
        <template v-if="!compact" v-slot:header>Backend Connection Status</template>
        <n-result
            :status="connected ? 'success' : 'warning'"
            :title="connected ? 'Connected' : 'Error'"
            :description="description"
            size="small"
        >
            <template v-slot:footer>
                <n-button >Recheck</n-button>
            </template>
        </n-result>
    </n-card> -->
    <n-card size="small">
        <template v-slot:header><template v-if="!compact">Backend Connection Status</template></template>
        <n-result
            :status="connected ? 'success' : 'warning'"
            :title="connected ? 'Connected' : 'Error'"
            :description="description"
            size="small"
        >
            <template v-slot:footer>
                <n-button v-on:click="checkConnection" >Recheck</n-button>
            </template>
        </n-result>
    </n-card>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeMount, PropType, ref, toRefs } from 'vue';
import { NCard, NButton, NResult } from "naive-ui";
import { HostConfigurator, useLazyBackendTransport } from '.';

const props = withDefaults(defineProps<{
    hostConfig: HostConfigurator,
    compact?: boolean
}>(), {compact: false});

const {compact, hostConfig} = toRefs(props);
const connected = ref(false);
const backend = useLazyBackendTransport();
const backendName = ref('censoring');
const description = computed(() => connected.value ? "Successfully connected to " + backendName.value + " backend!" : "Could not connect to backend!");

const checkConnection = async () => {
    connected.value = false;
    if (backend) {
        var client = await backend();
        const host = await hostConfig.value.getBackendHost();
        var status = await client.check(host);
        connected.value = status.available;
        backendName.value = status.name;
    }
}

onBeforeMount(checkConnection);
</script>