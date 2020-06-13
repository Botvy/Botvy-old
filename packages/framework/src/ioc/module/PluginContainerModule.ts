import { ContainerModule } from 'inversify';
import { cwd } from 'process';

import { ServiceConstants } from '../../ioc/ServiceConstants';
import { DirectoryPluginLoader } from '../../plugin/loader/DirectoryPluginLoader';
import { PluginDependencyResolver } from '../../plugin/PluginDependencyResolver';
import { PluginManager } from '../../plugin/PluginManager';

export class PluginContainerModule extends ContainerModule {
    constructor() {
        super((bind) => {
            bind(PluginManager).toSelf().inSingletonScope();
            bind(PluginDependencyResolver).toSelf().inSingletonScope();
            bind(ServiceConstants.System.Plugin.Loader.PluginLoader).to(
                DirectoryPluginLoader,
            );
            bind(
                ServiceConstants.System.Plugin.Loader.DirectoryLoader
                    .directoryPath,
            ).toConstantValue(`${cwd()}/plugins`);
        });
    }
}
