import { IpcMainInvokeEvent } from 'electron';
import { injectable, unmanaged } from 'inversify';

import { IPCResult } from './IPCResult';

/**
 * Defines a basic IPC (inter process communication) event handler
 */
@injectable()
export abstract class IPCEventHandler<T> {
    /**
     * The name of the event which will be handled by the event handler
     */
    eventName: string;

    protected constructor(@unmanaged() eventName: string | symbol) {
        let resolvedEventName = eventName;

        if (typeof resolvedEventName === 'symbol') {
            resolvedEventName = resolvedEventName.toString();
        }

        this.eventName = resolvedEventName;
        this.handleEvent = this.handleEvent.bind(this);
    }

    /**
     * Handles the incoming IPC event
     *
     * @abstract
     * @param {IpcMainInvokeEvent} event The incoming IPC event
     * @param {string[]} args The event arguments
     * @returns {Promise<IPCResult<T>>} The resolved IPC result
     * @memberof IPCEventHandler
     */
    public abstract async handleEvent(
        event: IpcMainInvokeEvent,
        args: string[],
    ): Promise<IPCResult<T>>;
}
