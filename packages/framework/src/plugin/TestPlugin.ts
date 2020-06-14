import { injectable } from 'inversify';
import { Logger } from 'winston';

import { IPluginDescriptionFile } from './IPlugin';
import { Plugin } from './Plugin';

@injectable()
export class TestPlugin extends Plugin {
    constructor(logger: Logger, pluginMetadata: IPluginDescriptionFile) {
        super(logger);

        this.mapPluginMetadata(pluginMetadata);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async initialize() {}
}
