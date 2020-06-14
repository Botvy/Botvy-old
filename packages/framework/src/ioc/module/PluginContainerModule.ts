import { ContainerModule } from 'inversify';
import { resolve } from 'path';

import { ServiceConstants } from '../../ioc/ServiceConstants';
import { ModulePluginInstantiator } from '../../plugin/instantiator/ModulePluginInstantiator';
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
            bind(ServiceConstants.System.Plugin.Instantiator).to(ModulePluginInstantiator);
            bind(
                ServiceConstants.System.Plugin.Loader.DirectoryLoader
                    .directoryPath,
            ).toDynamicValue(({ container }) => {
                return resolve(
                    container.get(
                        ServiceConstants.System.CurrentWorkingDirectory,
                    ),
                    'plugins',
                );
            });
        });
    }
}
