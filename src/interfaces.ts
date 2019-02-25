import FakerStatic = Faker.FakerStatic;
import { BaseProfile, Blueprint, ObjectAdapter, TypeormAdapter } from '.';
import { EntityFactory } from './EntityFactory';
import { ProfileBuilder } from './profile/ProfileBuilder';

/**
 * Table of Contents
 *
 * 1. Adapter Interfaces
 * 2. Profile Interfaces
 * 3. Common Interfaces
 */

/**********************
 * 1. Adapter Interfaces
 **********************/

/**
 * base Adapter Interface
 */
export interface BaseAdapter<
    Context extends BaseAdapterContext = BaseAdapterContext
> {
    /**
     * Called during the make operation. Perform any task necessary to convert
     * from a plain object into a valid entity object.
     *
     * @param objects
     * @param context
     */
    make<Entity>(
        objects: Array<DeepEntityPartial<Entity>>,
        context: Context,
    ): Promise<Entity[]>;

    /**
     * Called during the create operation. Perform any necessary tasks to persist
     * the provided entities.
     *
     * @param objects
     * @param context
     */
    create<Entity>(objects: Entity[], context: Context): Promise<Entity[]>;
}

/**
 * Base adapter context
 */
export interface BaseAdapterContext {
    /**
     * The type of entity being defined
     */
    type: string | FixtureObjectType<any>;
}

/**********************
 * 2. Profile Interfaces
 **********************/

export interface Blueprint<
    Entity = Record<string, any>,
    Adapter extends BaseAdapter = BaseAdapter,
    Context extends BaseAdapterContext = BaseAdapterContext
> {
    /**
     * Set the type entity being defined
     *
     * @param entity
     */
    setType(
        entity: FixtureObjectType<Entity> | string,
    ): Blueprint<Entity, Adapter, Context>;

    /**
     * Set the blueprint context
     *
     * @param context
     */
    context(context: Context): Blueprint<Entity, Adapter, Context>;

    /**
     * Define a new entity factory
     *
     * @param factory
     */
    define(
        factory: FactoryProfileMethod<Entity>,
    ): Blueprint<Entity, Adapter, Context>;

    /**
     * Define a factory state transformation
     *
     * @param state
     * @param factory
     */
    state(
        state: string,
        factory: FactoryProfileMethod<Entity> | DeepFactoryPartial<Entity>,
    ): Blueprint<Entity, Adapter, Context>;

    /**
     * Define an after making callback
     *
     * @param callback
     */
    afterMaking(
        callback: FactoryProfileCallbackMethod<Entity, Adapter>,
    ): Blueprint<Entity, Adapter, Context>;

    /**
     * Define an after making callback for a state transformation
     *
     * @param state
     * @param callback
     */
    afterMakingState(
        state: string,
        callback: FactoryProfileCallbackMethod<Entity, Adapter>,
    ): Blueprint<Entity, Adapter, Context>;

    /**
     * Define an after creating method
     *
     * @param callback
     */
    afterCreating(
        callback: FactoryProfileCallbackMethod<Entity, Adapter>,
    ): Blueprint<Entity, Adapter, Context>;

    /**
     * Define an after creating method for a state transformation
     *
     * @param state
     * @param callback
     */
    afterCreatingState(
        state: string,
        callback: FactoryProfileCallbackMethod<Entity, Adapter>,
    ): Blueprint<Entity, Adapter, Context>;
}

/**********************
 * 3. Common Interfaces
 **********************/

/**
 * Defines a partial object
 *
 * Taken from Typeorm's DeepPartial type
 */
export type DeepEntityPartial<T> = { [P in keyof T]?: DeepEntityPartial<T[P]> };

/**
 * Deep partial passed to factory and state definition methods allowing property
 * values to be resolved via T or () => T
 */
export declare type DeepFactoryPartial<T> = {
    [P in keyof T]?:
        | DeepFactoryPartial<T[P]>
        | DeepFactoryPartialMethod<DeepFactoryPartial<T[P]>>
};

/**
 * Method to resolve property within DeepFactoryPartial by calling a factory method
 */
export type DeepFactoryPartialMethod<Type> = (
    factory: FactoryExecutor,
) => Type | Promise<Type>;

/**
 * Context passed to FactoryProfileCallbackMethod
 */
export interface FactoryCallBackContext<Adapter> {
    factory: EntityFactory;
    faker: FakerStatic;
    adapter: Adapter;
}

/**
 * Used by DeepFactoryPartialMethod when passing factory to callback
 */
export interface FactoryExecutor {
    for<EntityType>(
        entity: FixtureObjectType<EntityType> | string,
    ): ProfileBuilder<EntityType>;
}

/**
 * Method used when defining a base factory and state factory
 */
export type FactoryProfileMethod<EntityType> = (
    fakerInstance: FakerStatic,
) => Promise<DeepFactoryPartial<EntityType>>;

/**
 * Method passed as callback to to afterCreating and afterMaking used
 * for manipulating an entity
 */
export type FactoryProfileCallbackMethod<EntityType, Adapter> = (
    entity: EntityType,
    context: FactoryCallBackContext<Adapter>,
) => Promise<void>;

/**
 * Options used by FixtureFactory
 */
export interface FixtureFactoryOptions {
    adapter?: BaseAdapter;
    fixtures?: Array<Function | string | BaseProfile<any>>;
}

/**
 * Callback passed to FixtureFactory.register() to register a blueprint without
 * creating a profile.
 */
export type FixtureFactoryRegisterCallback = (
    blueprint: Blueprint<any, any, any>,
) => void;

/**
 * Defines a creatable object
 *
 * Taken from TypeOrm ObjectType<T> type of the same name
 */
export type FixtureObjectType<T> =
    | {
          new (): T;
      }
    | Function;
