import { IPreferences } from "@silveredgold/beta-shared/preferences";
import { Emitter } from "mitt";
import { InjectionKey } from "vue";

export const eventEmitter: InjectionKey<Emitter<ActionEvents>> = Symbol();

export type ActionEvents = {
    reload: string;
}

export const userPrefs: InjectionKey<IPreferences> = Symbol();
export const updateUserPrefs: InjectionKey<(prefs?: IPreferences) => Promise<boolean>> = Symbol();