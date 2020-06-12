import { ContainerModule } from 'inversify';
import { PluginManager } from '../../plugin/PluginManager';
import { PluginDependencyResolver } from '../../plugin/PluginDependencyResolver';
import { DirectoryPluginLoader } from '../../plugin/loader/DirectoryPluginLoader';
import { ServiceConstants } from '../../ioc/ServiceConstants';

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
            ).toConstantValue('./plugins');
        });
    }
}
