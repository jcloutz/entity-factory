# Using the Builder

The builder is accessed via an entity factory instance by calling the `for()`
method.

```javascript
factory
    .for('user')
    .state('active')
    .with({
        email: 'test@test.com',
    })
    .create();
```

## Builder Methods

### state(...string)

Used to apply defined state transforms to a factory. The states are applied the
order they are provided to the function.

```javascript
factory.for(User).state('active', 'with-posts');
```

### with(partial)

Used for overriding properties on a created entity. This is particularly useful
when testing for a specific value.

```javascript
factory.for(User).with({
    name: 'john',
});
```

### make([int, [partial]])

Resolves the partials generated by the factory methods and converts them into
plain objects or class instances. Unlike `create()` the entity will not be
persisted

```javascript
// return a single User
factory.for(User).make();
factory.for(User).make({ active: true });
factory.for(User).make(1);
factory.for(User).make(1, { active: true });

// return an array of User
factory.for(User).make(2);
factory.for(User).make(2, { active: true });
```

### create([int, [partial]])

Resolves and persists the partials generated by the factory methods and converts
them into plain objects and class instances. Depending on the adapter this can
mean that they simple have an id generated for them or they are saved to teh
database.

```javascript
// return a single User
factory.for(User).create();
factory.for(User).create({ active: true });
factory.for(User).create(1);
factory.for(User).create(1, { active: true });

// return an array of User
factory.for(User).create(2);
factory.for(User).create(2, { active: true });
```