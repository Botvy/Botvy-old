import { PluginDependencyResolver } from '../PluginDependencyResolver';
import { IPlugin } from '../IPlugin';

describe('PluginDependencyResolver', () => {
    let pluginDependencyResolver: PluginDependencyResolver;
    let anotherChildPlugin: IPlugin;
    let childPlugin: IPlugin;
    let rootPlugin: IPlugin;

    beforeEach(() => {
        pluginDependencyResolver = new PluginDependencyResolver();
        anotherChildPlugin = {
            id: 'com.github.botvy.another-child-test',
            name: 'Another child plugin',
            version: '0.0.0',
        };
        childPlugin = {
            id: 'com.github.botvy.child-test',
            name: 'Child plugin',
            version: '0.0.0',
            dependsOn: [
                anotherChildPlugin.id,
            ],
        };
        rootPlugin = {
            id: 'com.github.botvy.root-test',
            name: 'Root plugin',
            version: '0.0.0',
            dependsOn: [
                childPlugin.id,
                anotherChildPlugin.id,
            ],
        };
    });

    it('should be instantiable', () => {
        expect(pluginDependencyResolver).toBeDefined();
    });

    describe('add a found plugin', () => {
        let containsPluginSpy: jest.SpyInstance;

        beforeEach(() => {
            containsPluginSpy = jest.spyOn(
                pluginDependencyResolver,
                // eslint-disable-next-line
                // @ts-ignore
                'containsPlugin',
            );
        });

        it('should check if the plugin was already found', () => {
            pluginDependencyResolver.addFoundPlugin(rootPlugin);

            expect(containsPluginSpy).toHaveBeenCalled();
        });

        it('should not add a plugin twice or more', () => {
            expect(
                // eslint-disable-next-line
                (pluginDependencyResolver as any).foundPlugins,
            ).toHaveLength(0);

            pluginDependencyResolver.addFoundPlugin(rootPlugin);
            pluginDependencyResolver.addFoundPlugin(rootPlugin);

            expect(
                // eslint-disable-next-line
                (pluginDependencyResolver as any).foundPlugins,
            ).toHaveLength(1);
        });

        it('should be able to add found plugins', () => {
            expect(
                // eslint-disable-next-line
                (pluginDependencyResolver as any).foundPlugins,
            ).toHaveLength(0);

            pluginDependencyResolver.addFoundPlugin(rootPlugin);

            expect(
                // eslint-disable-next-line
                (pluginDependencyResolver as any).foundPlugins,
            ).toHaveLength(1);
        });
    });

    describe('resolving plugins', () => {
        it('should throw an exception when a dependent plugin with an id was not found', () => {
            // eslint-disable-next-line
            rootPlugin.dependsOn![0] = childPlugin.id + 'test';

            pluginDependencyResolver.addFoundPlugin(rootPlugin);
            pluginDependencyResolver.addFoundPlugin(childPlugin);
            pluginDependencyResolver.addFoundPlugin(anotherChildPlugin);

            expect(() => {
                pluginDependencyResolver.resolvePlugins();
            }).toThrow('The plugin with the id "com.github.botvy.child-testtest" was not found');
        });

        it('should throw an exception for circular dependencies', () => {
            childPlugin.dependsOn = [
                // eslint-disable-next-line
                ...childPlugin.dependsOn!,
                rootPlugin.id,
            ];

            pluginDependencyResolver.addFoundPlugin(rootPlugin);
            pluginDependencyResolver.addFoundPlugin(anotherChildPlugin);
            pluginDependencyResolver.addFoundPlugin(childPlugin);

            expect(() => {
                pluginDependencyResolver.resolvePlugins();
            }).toThrow('Circular dependency found!');
        });

        it('should resolve the plugins in the correct order', () => {
            pluginDependencyResolver.addFoundPlugin(rootPlugin);
            pluginDependencyResolver.addFoundPlugin(anotherChildPlugin);
            pluginDependencyResolver.addFoundPlugin(childPlugin);

            expect(pluginDependencyResolver.resolvePlugins()).toStrictEqual([
                anotherChildPlugin,
                childPlugin,
                rootPlugin,
            ]);
        });
    });
});
