import { Container } from 'inversify';

import { LoggerContainerModule } from '../ioc/module/LoggerContainerModule';
import { PluginContainerModule } from '../ioc/module/PluginContainerModule';
import { InitializationSide } from '../plugin/InitializationSide';
import { TestContainerModule } from './module/TestContainerModule';
import { ServiceConstants } from './ServiceConstants';

/**
 * Returns a configured dependency injection container
 * based of the initialization side
 *
 * @export
 * @param {InitializationSide} initializationSide The initialization side (client or server)
 * @returns {Promise<Container>} The configured container
 */
export async function getConfiguredContainer(
    initializationSide: InitializationSide,
): Promise<Container> {
    const container = new Container();

    container.bind(Container).toConstantValue(container);
    container
        .bind(ServiceConstants.System.Plugin.InitializationSide)
        .toConstantValue(initializationSide);

    container.load(new PluginContainerModule(), new LoggerContainerModule());

    switch (initializationSide) {
        case InitializationSide.CLIENT:
            break;
        case InitializationSide.SERVER:
            break;
        case InitializationSide.TEST:
            container.load(new TestContainerModule());
            break;
    }

    return container;
}