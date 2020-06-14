import { getConfiguredContainer } from '@botvy/framework/dist/ioc/container';
import { IPCEventHandler } from '@botvy/framework/dist/ipc/IPCEventHandler';
import { InitializationSide } from '@botvy/framework/dist/plugin/InitializationSide';

import { LoadClientSettingsIPCHandler } from '../ipc/settings/LoadClientSettingsIPCHandler';

export const getClientContainer = async () => {
    const container = await getConfiguredContainer(InitializationSide.CLIENT);

    container
        .bind(IPCEventHandler)
        .to(LoadClientSettingsIPCHandler)
        .inSingletonScope();

    return container;
};
