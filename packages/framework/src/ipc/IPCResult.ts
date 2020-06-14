/**
 * Defines the result for an IPC handled event
 *
 * @export
 * @class IIPCResult
 * @template T The result type
 */
export class IPCResult<T> {
    /**
     * Indicates if the IPC action was performed successfully or not
     *
     * @type {boolean}
     * @memberof IIPCResult
     */
    success: boolean;

    /**
     * The resolved data when there was no error
     *
     * @type {T}
     * @memberof IIPCResult
     */
    data?: T;

    /**
     * The error message when the event was not handled successfully
     *
     * @type {string}
     * @memberof IIPCResult
     */
    error?: string;

    constructor(success: boolean, data?: T, error?: string) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public static CreateSuccessfulResult<T>(data: T) {
        return new IPCResult(true, data, undefined);
    }

    public static CreateFailedResult<T>(error: string) {
        return new IPCResult(false, {} as T, error);
    }
}
