import { inject, InjectionKey } from "vue";
import { NotificationApiInjection, notificationApiInjectionKey } from 'naive-ui/lib/notification/src/NotificationProvider';
import { IPreferences } from '@silveredgold/beta-shared/preferences';
import { ICensorBackend } from "@silveredgold/beta-shared/transport";
import { throwError } from "../util";

/* eslint-disable import/prefer-default-export */
export { default as CensoringPreferences } from './CensoringPreferences.vue';
export { default as ConnectionStatus } from './ConnectionStatus.vue';
export { default as ErrorOptions } from './ErrorOptions.vue';
export { default as Import } from './Import.vue';
export { default as ImportExport } from './ImportExport.vue';
export { default as StatisticsDetail } from './StatisticsDetail.vue';
export { default as StatisticsHeader } from './StatisticsHeader.vue';
export { default as VideoOptions } from './VideoOptions.vue';
export { default as FileImportList } from './FileImportList.vue';

export * from './util';

export type PreferencesProps = {
    preferences: IPreferences,
    compact?: boolean
}

export function useOptionalNotification(): NotificationApiInjection|undefined {
    const notif = inject(notificationApiInjectionKey, undefined);
    return notif;
}




export const censorBackend: InjectionKey<()=>Promise<ICensorBackend>> = Symbol();

export function useBackendTransport(): Promise<ICensorBackend> {
    const events = inject(censorBackend, null);
    if (events === null) {
        throwError('use-backend-transport', 'Failed to inject backend provider.')
      }
    return events!();
}

export function useLazyBackendTransport(): ()=>Promise<ICensorBackend> {
    const events = inject(censorBackend, null);
    if (events === null) {
        throwError('use-backend-transport', 'Failed to inject backend provider.')
      }
    return events!;
}