[**blogr**](../README.md)

***

[blogr](../globals.md) / BloggerError

# Class: BloggerError

Defined in: [src/core/errors.ts:2](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/errors.ts#L2)

Base error type for all errors thrown by blogr.

## Extends

- `Error`

## Extended by

- [`BloggerRequestError`](BloggerRequestError.md)
- [`BloggerValidationError`](BloggerValidationError.md)

## Constructors

### Constructor

> **new BloggerError**(`message`, `options?`): `BloggerError`

Defined in: [src/core/errors.ts:3](https://github.com/oyzamil/blogr/blob/1c6cb2dad175a1dc9d674306d1fc362c093f80ba/src/core/errors.ts#L3)

#### Parameters

##### message

`string`

##### options?

`ErrorOptions`

#### Returns

`BloggerError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause?**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`
