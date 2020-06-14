import { ContainerModule } from 'inversify';
import { Plugin } from '../../plugin/Plugin';
import { Logger } from 'winston';
import { ServiceConstants } from '../ServiceConstants';
import { IPluginDescriptionFile } from '../../plugin/IPlugin';
import { TestPlugin } from '../../plugin/TestPlugin';

export const TestPluginMetadata: IPluginDescriptionFile = {
    id: 'com.github.botvy.test-plugin',
    name: 'Test plugin',
    version: '0.0.0',
    authors: [
        {
            name: 'Yannick Fricke',
            website: 'https://github.com/YannickFricke',
        },
    ],
    dependsOn: [],
    entrypoint: '',
    additionalContainerBindings: ['./dist/ioc/bindings/TestPluginModule.js'],
    sectionComponents: {
        'test.section': ['./dist/section/TestSection.js'],
    },
};

export class TestContainerModule extends ContainerModule {
    constructor() {
        super((bind) => {
            bind(TestPluginMetadata.id).toDynamicValue((context) => {
                const logger = context.container.get<Logger>(
                    ServiceConstants.System.Logger,
                );

                return new TestPlugin(logger, TestPluginMetadata);
            });
            bind(Plugin).to(TestPlugin);
        });
    }
}
