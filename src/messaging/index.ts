import { IPreferences } from "@silveredgold/beta-shared/preferences";
import { Emitter } from "mitt";
import { inject, InjectionKey } from "vue";

export const eventEmitter: InjectionKey<Emitter<ActionEvents>> = Symbol();

export type ActionEvents = {
    reload: string;
}

export const userPrefs: InjectionKey<()=>Promise<IPreferences>> = Symbol();
export const updateUserPrefs: InjectionKey<(prefs?: IPreferences) => Promise<boolean>> = Symbol();

export function useEventEmitter(): Emitter<ActionEvents>|undefined {
    const events = inject(eventEmitter, undefined);
    return events;
}