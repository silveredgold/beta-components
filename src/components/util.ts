import { IPreferences } from "@silveredgold/beta-shared/preferences";
import { isEqual } from "lodash";
import { toRaw, unref, WatchCallback } from "vue";

export interface INavigationService {
    openSettings: () => void;
    openStatistics: () => void;
    openOverrides: () => void;
    openUrl: (url: string) => void;
    getAssetUrl: (assetUrl: string) => string;
}

export type HostConfigurator = {
    getBackendHost:() => Promise<string>
};

export const watchForChanges = (cb?: (prefs?: IPreferences) => any, guard?: () => boolean): WatchCallback<IPreferences, IPreferences> => {
    return async (newValue, oldValue) => {
        let oldVal = toRaw(oldValue);
        let newVal = toRaw(newValue);
        console.debug('checking preferences object for changes', {new: newVal, old: oldVal});
        if (!!oldVal && !!newVal && !isEqual(oldVal, newVal)) {
            console.debug('changes detected, checking against guard', newVal);
            guard ??= () => true;
            if (guard()) {
                console.debug('passing new object to callback');
                cb?.(newValue);
            }
        }
    }
}