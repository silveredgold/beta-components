import { inject, InjectionKey } from "vue";
import { ICensorBackend } from "@silveredgold/beta-shared/transport";
import { throwError } from "../util";


export const censorBackend: InjectionKey<Promise<ICensorBackend>> = Symbol();

export function useBackendTransport(): Promise<ICensorBackend> {
    const events = inject(censorBackend, null);
    if (events === null) {
        throwError('use-backend-transport', 'Failed to inject backend provider.')
      }
    return events;
}