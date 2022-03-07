import { ActionEvents, eventEmitter } from './messaging';
import mitt from 'mitt';
import { Plugin, provide } from "vue";

export const eventEmitterPlugin: Plugin = {
    install: (app, options) => {
        const events = mitt<ActionEvents>();
        provide(eventEmitter, events);
    }
}