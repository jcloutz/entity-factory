/**
 * @module Adapters/Object
 */

import { AdapterBlueprintOptions } from '../AdapterBlueprintOptions';

export interface ObjectBlueprintOptions extends AdapterBlueprintOptions {
    generateId?: boolean;
    idAttribute?: string;
}
