import { ServiceConstants } from '@botvy/framework/dist/ioc/ServiceConstants';
import { IPCConstants } from '@botvy/framework/dist/ipc/IPCConstants';
import { IPCEventHandler } from '@botvy/framework/dist/ipc/IPCEventHandler';
import { IPCResult } from '@botvy/framework/dist/ipc/IPCResult';
import { configureLogger } from '@botvy/framework/dist/logging/logger';
import { ClientSettingsHandler } from '@botvy/framework/dist/settings/ClientSettingsLoader';
import { IClientSettings } from '@botvy/framework/dist/settings/IClientSettings';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

@injectable()
export class LoadClientSettingsIPCHandler extends IPCEventHandler<
    IClientSettings
> {
    constructor(
        @inject(ClientSettingsHandler)
        private readonly clientSettingsLoader: ClientSettingsHandler,
        @inject(ServiceConstants.System.Logger)
        private readonly logger: Logger,
    ) {
        super(IPCConstants.Core.Settings.Load);
        configureLogger(logger, LoadClientSettingsIPCHandler.name);
    }

    async handleEvent(): Promise<IPCResult<IClientSettings>> {
        this.logger.info('Loading client settings');

        try {
            return IPCResult.CreateSuccessfulResult(
                this.clientSettingsLoader.loadSettings(),
            );
        } catch (error) {
            return IPCResult.CreateFailedResult<IClientSettings>(error);
        }
    }
}
