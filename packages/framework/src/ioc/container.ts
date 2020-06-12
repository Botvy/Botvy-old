import { Container } from 'inversify';
import { PluginContainerModule } from '../ioc/module/PluginContainerModule';
import { LoggerContainerModule } from '../ioc/module/LoggerContainerModule';
import { InitializationSide } from '../plugin/InitializationSide';
import { SchemaContainerModule } from './module/SchemaContainerModule';
import { ServiceConstants } from './ServiceConstants';
import { TestContainerModule } from './module/TestContainerModule';

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

    container.load(
        new PluginContainerModule(),
        new SchemaContainerModule(),
        new LoggerContainerModule(),
    );

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
