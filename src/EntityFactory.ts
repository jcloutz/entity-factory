/**
 * @module EntityFactory
 */
import { Adapter } from './adapters/Adapter';
import { ObjectAdapter } from './adapters/object/ObjectAdapter';
import { Blueprint } from './blueprint/Blueprint';
import { BlueprintBuilder } from './blueprint/BlueprintBuilder';
import { BlueprintLoader } from './blueprint/BlueprintLoader';
import { EntityObjectType } from './common/EntityObjectType';
import { EntityFactoryExecutor } from './EntityFactoryExecutor';
import { EntityFactoryOptions } from './EntityFactoryOptions';
import { EntityFactoryRegisterCallback } from './EntityFactoryRegisterCallback';
import { getName, isFunction } from './utils';

/**
 * EntityFactory is the primary interface for generating entities
 */
export class EntityFactory implements EntityFactoryExecutor {
    /**
     * Holds a list of registered blueprints
     */
    private readonly blueprints = new Map<string | EntityObjectType<any>, Blueprint<any, any, any>>();

    /**
     * Adapter supplied via the constructor. Defaults to [[ObjectAdapter]]
     */
    private readonly adapter: Adapter;

    /**
     * Create a new EntityFactory
     *
     * @param options:
     */
    constructor(private readonly options: EntityFactoryOptions = {}) {
        this.adapter = options.adapter || new ObjectAdapter();
        if (options.profiles) {
            const loader = new BlueprintLoader(options.profiles);
            const profiles = loader.getProfiles();

            profiles.forEach((profile) => {
                this.register(profile);
            });
        }
    }

    /**
     * Get a builder instance for an entity
     *
     * @param entity
     */
    public for(entity: string): BlueprintBuilder<Record<string, any>>;
    public for<EntityType = any>(entity: string | EntityObjectType<EntityType>): BlueprintBuilder<EntityType>;
    public for<EntityType = any>(entity: EntityObjectType<EntityType> | string): any {
        const blueprint = this.blueprints.get(entity);
        if (!blueprint) {
            throw new Error(`No blueprint exists for entity ${getName(entity)}`);
        }

        return new BlueprintBuilder<EntityType>(blueprint, this, this.adapter);
    }

    /**
     * Check if a blueprint has been registered
     *
     * @param entity
     */
    public hasBlueprint(entity: EntityObjectType<any> | string): boolean {
        return this.blueprints.has(entity);
    }

    /**
     * Get a registered blueprint
     *
     * @param entity
     */
    public getProfile(entity: string): Blueprint<Record<string, any>, any, any>;
    public getProfile<Entity>(entity: string | EntityObjectType<Entity>): Blueprint<Entity, any, any>;
    public getProfile<Entity = Record<string, any>>(entity: EntityObjectType<Entity> | string): any {
        return this.blueprints.get(entity);
    }

    public register(fixture: Blueprint<any, any, any> | EntityFactoryRegisterCallback): EntityFactory {
        let profile: Blueprint<any, any, any>; // = new FixtureBlueprint();

        if (fixture instanceof Blueprint) {
            profile = fixture;

            this.blueprints.set(profile.getType(), profile);
        } else if (isFunction(fixture)) {
            profile = new Blueprint<any, any, any>();

            fixture(profile);

            this.blueprints.set(profile.getType(), profile);
        }

        return this;
    }
}
