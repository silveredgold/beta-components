import { ActionEvents, eventEmitter } from "../messaging";
import { Emitter } from "mitt";
import { inject } from "vue";
import { NotificationApiInjection, notificationApiInjectionKey } from 'naive-ui/lib/notification/src/NotificationProvider';


export function useEventEmitter(): Emitter<ActionEvents>|undefined {
    const events = inject(eventEmitter, undefined);
    return events;
}

export function useOptionalNotification(): NotificationApiInjection|undefined {
    const notif = inject(notificationApiInjectionKey, undefined);
    return notif;
}

export * from './fs-client';