/**
 * Defines event names for the inter-process communication
 */
export const IPCConstants = {
    Core: {
        Settings: {
            Load: Symbol.for('IPC.Core.Settings.Load'),
        },
    },
};
