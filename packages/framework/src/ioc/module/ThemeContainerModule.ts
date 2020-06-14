import { ContainerModule } from 'inversify';

import { ThemeManager } from '../../theming/ThemeManager';

/**
 * The theme container modules binds all theming related things to the container
 *
 * @export
 * @class ThemeContainerModule
 * @extends {ContainerModule}
 */
export class ThemeContainerModule extends ContainerModule {
    constructor() {
        super((bind) => {
            bind(ThemeManager).toSelf();
        });
    }
}
