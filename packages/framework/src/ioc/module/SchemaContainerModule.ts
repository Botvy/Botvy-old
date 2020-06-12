import { ContainerModule } from 'inversify';
import { SchemaValidator } from '../../schema/SchemaValidator';

export class SchemaContainerModule extends ContainerModule {
    constructor() {
        super((bind) => {
            bind(SchemaValidator).toSelf();
        });
    }
}
