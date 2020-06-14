/**
 * Contains the constants for the dependency injection container
 */
export const ServiceConstants = {
    System: {
        CurrentWorkingDirectory: Symbol.for('System.CurrentWorkingDirectory'),
        Logger: Symbol.for('System.Logger'),
        LoggerOptions: {
            Transports: Symbol.for('System.LoggerOptions.Transports'),
        },
        Plugin: {
            InitializationSide: Symbol.for('System.Plugin.InitializationSide'),
            Loader: {
                PluginLoader: Symbol.for('System.Plugin.Loader.PluginLoader'),
                DirectoryLoader: {
                    directoryPath: Symbol.for(
                        'System.Plugin.Loader.DirectoryLoader.DirectoryPath',
                    ),
                },
            },
            Instantiator: Symbol.for('System.Plugin.Instantiator'),
        },
    },
};
