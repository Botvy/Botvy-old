/**
 * Defines event names for the inter-process communication
 */
export const IPCConstants = {
    Core: {
        Plugins: {
            LoadActive: Symbol.for('Core.Plugins.LoadActive'),
        },
        Settings: {
            Load: Symbol.for('Core.IPC.Settings.Load'),
        },
        Theming: {
            LoadTheme: Symbol.for('Core.Theming.LoadTheme'),
            ThemeUpdated: Symbol.for('Core.Theming.ThemeUpdated'),
        },
    },
};
