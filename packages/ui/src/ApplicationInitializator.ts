import { IPCConstants } from '@botvy/framework/dist/ipc/IPCConstants';
import { IPCResult } from '@botvy/framework/dist/ipc/IPCResult';
import { IClientSettings } from '@botvy/framework/dist/settings/IClientSettings';
import { ITheme } from '@botvy/framework/dist/theming/ITheme';
import { IpcRenderer } from 'electron';
import { setTheme } from 'packages/ui/src/store/theme/theme.actions';
import { Store } from 'redux';

import {
    finishInitialization,
    setStepInfo,
} from './store/initialization/initialization.actions';

export class ApplicationInitializator {
    private ipcRenderer: IpcRenderer;

    constructor(private readonly store: Store) {
        this.ipcRenderer = window.require('electron').ipcRenderer;
    }

    public async initialize() {
        this.store.dispatch(setStepInfo('Loading settings'));

        const clientSettings = await this.loadSettings();

        if (clientSettings.error || !clientSettings.data) {
            return;
        }

        this.store.dispatch(setStepInfo('Loading theme'));

        const theme = await this.loadTheme(clientSettings.data.theme);

        if (theme.error || !theme.data) {
            return;
        }

        this.store.dispatch(setTheme(theme.data));
        this.store.dispatch(finishInitialization());
    }

    private async loadSettings(): Promise<IPCResult<IClientSettings>> {
        return await this.ipcRenderer.invoke(
            IPCConstants.Core.Settings.Load.toString(),
        );
    }

    private async loadTheme(themeName: string): Promise<IPCResult<ITheme>> {
        return await this.ipcRenderer.invoke(
            IPCConstants.Core.Theming.LoadTheme.toString(),
            [themeName],
        );
    }
}
