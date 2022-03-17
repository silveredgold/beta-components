<template>
    <n-card title="Censoring Options" size="small">
        <!-- <template v-slot:header-extra>Backend Host</template> -->
        <n-tabs type="segment">
            <n-tab-pane name="special" tab="Special">
                <div v-if="prefs && prefs.otherCensoring">
                    <n-form :model="prefs.otherCensoring" label-placement="left" :label-width="120">
                        <n-form-item label="Male Face" path="maleFace">
                            <n-input-group class="censor-input-group">
                                    <n-select
                                        v-model:value="prefs.otherCensoring.maleFace.method"
                                        :options="rawCensorTypes"
                                        class="censor-input"
                                        :style="{ width: '25%' }"
                                    />
                                    <n-slider
                                        :min="1"
                                        :max="20"
                                        v-model:value="prefs.otherCensoring.maleFace.level"
                                        :marks="sliderMarks"
                                        :step="1"
                                        :style="{ width: '50%' }"
                                        class="censor-input"
                                    />
                                </n-input-group>
                        </n-form-item>
                        <n-form-item label="Female Face" path="femaleFace">
                            <n-input-group class="censor-input-group">
                                    <n-select
                                        v-model:value="prefs.otherCensoring.femaleFace.method"
                                        :options="rawCensorTypes"
                                        :style="{ width: '25%' }"
                                        class="censor-input"
                                    />
                                    <n-slider
                                        :min="1"
                                        :max="20"
                                        v-model:value="prefs.otherCensoring.femaleFace.level"
                                        :marks="sliderMarks"
                                        :step="1"
                                        :style="{ width: '50%' }"
                                        class="censor-input"
                                    />
                                </n-input-group>
                        </n-form-item>
                        <n-form-item label="Female Eyes" path="femaleEyes">
                            <n-input-group class="censor-input-group">
                                <n-popover trigger="hover" placement="bottom">
                                    <template v-slot:trigger>
                                        <n-icon style="margin-top: auto; margin-bottom: auto;" :component="HelpCircleOutline" :size="20" />
                                    </template>
                                    <n-thing title="Experimental Feature!" style="max-width: 20rem;">
                                        Eye detection is not a part of the NudeNet model so not all backends may support it! Additionally, the accuracy or performance may be worse than other supported parts.
                                    </n-thing>
                                </n-popover>
                                <n-select
                                        v-model:value="prefs.otherCensoring.femaleEyes"
                                        :options="eyeCensorTypes"
                                        :style="{ width: '75%' }"
                                        class="censor-input"
                                    />
                            </n-input-group>
                        </n-form-item>
                        <n-form-item label="Female Mouth" path="femaleMouth">
                            <n-input-group class="censor-input-group">
                                <n-popover trigger="hover" placement="bottom">
                                    <template v-slot:trigger>
                                        <n-icon style="margin-top: auto; margin-bottom: auto;" :component="HelpCircleOutline" :size="20" />
                                    </template>
                                    <n-thing title="Experimental Feature!" style="max-width: 20rem;">
                                        Mouth detection is not a part of the NudeNet model so not all backends may support it! Additionally, the accuracy or performance may be worse than other supported parts.
                                    </n-thing>
                                </n-popover>
                                <n-select
                                        v-model:value="prefs.otherCensoring.femaleMouth"
                                        :options="eyeCensorTypes"
                                        :style="{ width: '75%' }"
                                        class="censor-input"
                                    />
                            </n-input-group>
                        </n-form-item>
                    </n-form>
                    <n-card size="small">
                    <n-thing>
                        <template v-slot:header>Obfuscation</template>
                        <template v-slot:description>Enable obfuscating images during censoring.</template>
                        This will include a very aggressive watermark on images when they are censored. This is very noticeable and a little obnoxious, but will further hide the image while preventing reverse searches from finding the image.
                        <template v-slot:foooter>Only enable if you're ready for it!</template>
                        <template v-slot:action>
                            <n-space item-style="display: flex;" align="center">
                                <n-checkbox v-model:checked="prefs.obfuscateImages">Enable Obfuscation</n-checkbox>
                            </n-space>
                        </template>
                    </n-thing>
                    </n-card>
                </div>
            </n-tab-pane>
            <template v-for="mode in ['exposed', 'covered']" v-bind:key="mode">
            <n-tab-pane :name="mode" :tab="toTitleCase(mode)">
                <div v-if="prefs && (prefs as any)[mode]">
                    <n-form :model="(prefs as any)[mode]" label-placement="left" :label-width="120">
                        <template v-for="(value, name) in ((prefs as any)[mode] as BodyCensorModes)" v-bind:key="name">
                            <n-form-item
                                :label="name"
                                :path="name"
                                v-if="((prefs as any)[mode][name] as any).method"
                            >
                                <n-input-group class="censor-input-group">
                                    <n-select
                                        v-model:value="((prefs as any)[mode][name] as CensorMode).method"
                                        :options="rawCensorTypes"
                                        :style="{ width: '25%' }"
                                        class="censor-input"
                                    />
                                    <n-slider
                                        :min="1"
                                        :max="20"
                                        v-model:value="((prefs as any)[mode][name] as CensorMode).level"
                                        :marks="sliderMarks"
                                        :step="1"
                                        :style="{ width: '50%' }"
                                        class="censor-input"
                                    />
                                </n-input-group>
                            </n-form-item>
                        </template>
                    </n-form>
                </div>
            </n-tab-pane>
            </template>
        </n-tabs>
        <template v-slot:footer>
            You can individually adjust each body part using the sliders and dropdowns above.
        </template>
    </n-card>
</template>
<script setup lang="ts">
import { inject, toRefs, watch } from 'vue';
import { NCard, useNotification, NTabs, NTabPane, NSpace, NForm, NFormItem, NSelect, NInputGroup, NSlider, NThing, NCheckbox, NPopover, NIcon } from "naive-ui";
import { HelpCircleOutline } from "@vicons/ionicons5";
import { IPreferences, CensorType, getCensorTypes } from '@silveredgold/beta-shared/preferences';
import type { BodyCensorModes, CensorMode } from '@silveredgold/beta-shared/preferences';
import { updateUserPrefs } from "../messaging";
import { toTitleCase } from "@silveredgold/beta-shared";

const props = defineProps<{
    preferences: IPreferences
}>()

const notif = useNotification();

const sliderMarks = {
    1: "Very Light",
    20: "Very Heavy"
}
const { preferences } = toRefs(props);
const prefs = preferences;
const updatePrefs = inject(updateUserPrefs, undefined);

const rawCensorTypes = getCensorTypes();

// yes I made the beta-shared API use 'Box' like an idiot
const eyeCensorTypes = [{label: 'Nothing', value: 'None'}, {label: 'Black Bars', value: 'Box'}, {label: 'Sticker', value: 'Sticker'}];

watch(prefs, async (newMode, prevMode) => {
    // console.log(`prefs watch: ${prevMode}->${newMode}`);
    updatePrefs?.();
}, {deep: true});

</script>
<style>
.censor-input-group {
    /* justify-content: flex-end; */
    justify-content: space-evenly;
}

.censor-input {
    margin: 0em 1em;
}
</style>