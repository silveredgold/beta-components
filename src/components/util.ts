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