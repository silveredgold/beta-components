import { IPreferences } from "@silveredgold/beta-shared/preferences";
import { isEqual } from "lodash";
import { WatchCallback } from "vue";

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
        if (!!oldValue && !!newValue && !isEqual(oldValue, newValue)) {
            guard ??= () => true;
            if (guard()) {
                cb?.(newValue);
            }
        }
    }
}