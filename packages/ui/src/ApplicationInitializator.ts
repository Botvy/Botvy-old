import { IPCConstants } from '@botvy/framework/dist/ipc/IPCConstants';
import { IPCResult } from '@botvy/framework/dist/ipc/IPCResult';
import { IClientSettings } from '@botvy/framework/dist/settings/IClientSettings';
import { ITheme } from '@botvy/framework/dist/theming/ITheme';
import { IpcRenderer } from 'electron';
import { setTheme } from 'packages/ui/src/store/theme/theme.actions';
import { Store } from 'redux';

import { finishInitialization, initializationFailed, setStepInfo } from './store/initialization/initialization.actions';

/**
 * A helper class for initializing the electron client
 *
 * @export
 * @class ApplicationInitializator
 */
export class ApplicationInitializator {
    /**
     * The IPC event emitter for the renderer process
     *
     * @private
     * @type {IpcRenderer}
     * @memberof ApplicationInitializator
     */
    private ipcRenderer: IpcRenderer;

    /**
     * Creates an instance of ApplicationInitializator.
     *
     * @param {Store} store The store of the application
     * @memberof ApplicationInitializator
     */
    constructor(private readonly store: Store) {
        this.ipcRenderer = window.require('electron').ipcRenderer;
    }

    /**
     * Starts the initialization process
     *
     * @memberof ApplicationInitializator
     */
    public async initialize() {
        this.store.dispatch(setStepInfo('Loading settings'));

        const clientSettings = await this.loadSettings();

        if (clientSettings.error) {
            this.store.dispatch(initializationFailed(clientSettings.error.message));
            return;
        }

        const { theme, activePlugins } = clientSettings.data!;

        this.store.dispatch(setStepInfo('Loading theme'));

        const loadedTheme = await this.loadTheme(theme);

        if (loadedTheme.error) {
            this.store.dispatch(initializationFailed(loadedTheme.error.message));
            return;
        }

        this.store.dispatch(setTheme(loadedTheme.data!));

        this.store.dispatch(setStepInfo('Loading plugins'));

        const loadPluginsResult = await this.loadPlugins(activePlugins);

        if (loadPluginsResult.success === false) {
            this.store.dispatch(initializationFailed(loadPluginsResult.error!.message));
            return;
        }

        this.store.dispatch(finishInitialization());
    }

    /**
     * Invokes the call for loading the client settings and returns the retrieved settings
     *
     * @private
     * @returns {Promise<IPCResult<IClientSettings>>} The IPC result with the loaded client settings
     * @memberof ApplicationInitializator
     */
    private async loadSettings(): Promise<IPCResult<IClientSettings>> {
        return await this.ipcRenderer.invoke(
            IPCConstants.Core.Settings.Load.toString(),
        );
    }

    /**
     * Invokes the call for loading the theme
     *
     * @private
     * @param {string} themeName The name of the theme which should be loaded
     * @returns {Promise<IPCResult<ITheme>>} The IPC result with the loaded theme
     * @memberof ApplicationInitializator
     */
    private async loadTheme(themeName: string): Promise<IPCResult<ITheme>> {
        return await this.ipcRenderer.invoke(
            IPCConstants.Core.Theming.LoadTheme.toString(),
            [themeName],
        );
    }

    private async loadPlugins(activePlugins: string[]): Promise<IPCResult<IPluginDescriptionFile>> {
        return await this.ipcRenderer.invoke(
            IPCConstants.Core.Plugins.LoadActive.toString(),
            activePlugins,
        );
    }
}
