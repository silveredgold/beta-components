<template>
    <n-card title="Video Censoring Preferences" size="small">
        <n-thing title="Censor Mode" v-if="loaded">
            <n-radio-group v-model:value="prefs.videoCensorMode" name="left-size" size="small" style="margin-bottom: 12px;">
            <template v-for="opt in ['Block', 'Blur', 'Allow']" v-bind:key="opt">
                <n-radio-button :value="opt">{{opt}}</n-radio-button>
            </template>
            </n-radio-group>
        </n-thing>
        <template v-slot:footer>
            Block will hide all videos from view, Blur will display videos but blur the video, Allow leaves videos untouched.
        </template>
        <n-thing title="Censor Level" description="Higher levels cause more blur" v-if="loaded && !compact && prefs.videoCensorMode === 'Blur'">
            <n-slider
                :min="1"
                :max="10"
                v-model:value="prefs.videoCensorLevel"
                :step="1"
                :style="{ width: '50%' }"
                class="censor-input"
            />
        </n-thing>
        <template v-slot:action>
        <template v-if="loaded && !compact && (prefs.autoAnimate !== undefined)">
                    <n-thing>
                        <template v-slot:header>Animate GIFs</template>
                        <!-- <template v-slot:description>Attempt to automatically animate GIFs.</template> -->
                        Attempt to automatically animate GIFs. This is very intensive, can take a very long time, and will not always work at all.
                        <template v-slot:foooter>Enable with caution!</template>
                        <template v-slot:action>
                            <n-space item-style="display: flex;" align="center">
                                <n-checkbox v-model:checked="prefs.autoAnimate">Enable animation by default</n-checkbox>
                            </n-space>
                        </template>
                    </n-thing>
        </template>
        </template>
    </n-card>
</template>
<script setup lang="ts">
import { watch, computed, toRefs, inject } from 'vue';
import { NCard, NRadioGroup, NRadioButton, NThing, NSpace, NCheckbox, NSlider } from "naive-ui";
import { IPreferences } from '@silveredgold/beta-shared/preferences';
import { updateUserPrefs } from '../messaging';
import { PreferencesProps, watchForChanges } from '.';

const props = withDefaults(defineProps<PreferencesProps>(), {
    compact: false
});

const { preferences } = toRefs(props);
const prefs = preferences;
const updatePrefs = inject(updateUserPrefs, undefined);

const loaded = computed(() => prefs.value !== undefined);

watch(prefs, watchForChanges(false, updatePrefs), {deep: true});

</script>