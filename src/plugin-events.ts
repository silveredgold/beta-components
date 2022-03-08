import { ActionEvents, eventEmitter } from './messaging';
import mitt from 'mitt';
import { Plugin } from "vue";

export const eventEmitterPlugin: Plugin = {
    install: (app, options) => {
        const events = mitt<ActionEvents>();
        app.provide(eventEmitter, events);
    }
}