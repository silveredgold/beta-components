<script setup lang="ts">
import { toRefs } from "vue";
import { NCollapse, NCollapseItem } from "naive-ui";
import { toTitleCase } from "@silveredgold/beta-shared";
import ExperimentalOption from "./ExperimentalOption.vue";
import CensoringMethod from "./CensoringMethod.vue";
import { startCase } from "lodash";
import type { BodyCensorModes, CensorMode, IPreferences } from "@silveredgold/beta-shared/preferences"

const props = withDefaults(defineProps<{ preferences: Partial<IPreferences>, extraCategory?: string }>(), {
    extraCategory: undefined
});

const { preferences, extraCategory } = toRefs(props);


</script>
<template>
    <n-collapse accordion>
        <n-collapse-item title="Censoring" name="censoring" v-if="preferences.exposed && preferences.covered">
            <n-collapse accordion>
                <template v-for="mode in ['exposed', 'covered']" v-bind:key="mode">
                    <n-collapse-item :name="mode" :title="toTitleCase(mode)">
                        <div v-if="preferences && (preferences as any)[mode]">
                        <CensoringMethod v-for="(value, name) in ((preferences as any)[mode] as BodyCensorModes)" :name="name" :key="name"
                            :level="((preferences as any)[mode][name] as CensorMode).level"
                            :method="((preferences as any)[mode][name] as CensorMode).method"
                            />
                        </div>
                    </n-collapse-item>
                </template>

                <n-collapse-item title="Other" name="censoring-other" v-if="preferences.otherCensoring">
                    <CensoringMethod name="Female Face" :method="preferences.otherCensoring.femaleFace.method" :level="preferences.otherCensoring.femaleFace.level">
                        <template #suffix>
                            <ExperimentalOption :support="true" featureName="Face Detection" />
                        </template>
                    </CensoringMethod>
                    <CensoringMethod name="Female Eyes" :method="preferences.otherCensoring.femaleEyes.method" :level="preferences.otherCensoring.femaleEyes.level">
                        <template #suffix>
                            <ExperimentalOption :support="true" featureName="Eye Detection" />
                        </template>
                    </CensoringMethod>
                    <CensoringMethod name="Female Mouth" :method="preferences.otherCensoring.femaleMouth.method" :level="preferences.otherCensoring.femaleMouth.level">
                        <template #suffix>
                            <ExperimentalOption :support="true" featureName="Mouth Detection" />
                        </template>
                    </CensoringMethod>
                    <CensoringMethod name="Image Obfuscation" :method="preferences.obfuscateImages ? 'Enabled' : 'Disabled'" :type="preferences.obfuscateImages ? 'error' : 'success'" v-if="preferences.obfuscateImages != undefined">
                        <template #suffix>
                            <ExperimentalOption :support="true" feature-name="Obfuscation" />
                        </template>
                    </CensoringMethod>
                </n-collapse-item>
            </n-collapse>
        </n-collapse-item>
        <n-collapse-item title="Video Options" name="video" v-if="preferences.videoCensorMode != undefined">
            <CensoringMethod name="Video Censoring" :method="toTitleCase(preferences.videoCensorMode)" :level="preferences.videoCensorMode == 'Blur' ? preferences.videoCensorLevel : undefined" :type="preferences.videoCensorMode == 'Allow' ? 'success' : preferences.videoCensorMode == 'Block' ? 'error' : 'warning'" />
        </n-collapse-item>
        <n-collapse-item v-if="!!extraCategory" :title="extraCategory">
            <slot name="extra" />
        </n-collapse-item>
        <!-- <n-collapse-item title="Site Lists">
            <DomainList :allow-list="preferences.allowList" :force-list="preferences.forceList" />
        </n-collapse-item> -->
    </n-collapse>

</template>