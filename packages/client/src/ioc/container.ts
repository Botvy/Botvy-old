import { getConfiguredContainer } from '@botvy/framework/dist/ioc/container';
import { IPCEventHandler } from '@botvy/framework/dist/ipc/IPCEventHandler';
import { InitializationSide } from '@botvy/framework/dist/plugin/InitializationSide';
import { Container } from 'inversify';
import { LoadActivePluginsIPCHandler } from '../ipc/plugins/LoadActivePluginsIPCHandler';

import { LoadClientSettingsIPCHandler } from '../ipc/settings/LoadClientSettingsIPCHandler';
import { LoadThemeIPCHandler } from '../ipc/theming/LoadThemeIPCHandler';

export const getClientContainer = async (): Promise<Container> => {
    const container = await getConfiguredContainer(InitializationSide.CLIENT);

    const ipcEventHandlers = [
        LoadClientSettingsIPCHandler,
        LoadThemeIPCHandler,
        LoadActivePluginsIPCHandler,
    ];

    ipcEventHandlers.forEach(EventHandler => {
        container.bind(IPCEventHandler).to(EventHandler).inSingletonScope();
    });

    return container;
};
