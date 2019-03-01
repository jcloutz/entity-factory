import { Adapter } from './adapters/Adapter';
import { Blueprint } from './blueprint/Blueprint';
export interface EntityFactoryOptions {
    adapter?: Adapter;
    blueprints?: Array<Function | string | Blueprint<any, any, any>>;
}
