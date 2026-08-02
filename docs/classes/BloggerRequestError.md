[**blogr**](../README.md)

***

[blogr](../globals.md) / BloggerRequestError

# Class: BloggerRequestError

Defined in: src/core/errors.ts:10

Thrown when a network/HTTP request fails or returns a non-2xx status.

## Extends

- [`BloggerError`](BloggerError.md)

## Constructors

### Constructor

> **new BloggerRequestError**(`message`, `url`, `status?`, `options?`): `BloggerRequestError`

Defined in: src/core/errors.ts:14

#### Parameters

##### message

`string`

##### url

`string` \| `URL`

##### status?

`number` \| `null`

##### options?

`ErrorOptions`

#### Returns

`BloggerRequestError`

#### Overrides

[`BloggerError`](BloggerError.md).[`constructor`](BloggerError.md#constructor)

## Properties

### cause?

> `optional` **cause?**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

[`BloggerError`](BloggerError.md).[`cause`](BloggerError.md#cause)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

[`BloggerError`](BloggerError.md).[`message`](BloggerError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

[`BloggerError`](BloggerError.md).[`name`](BloggerError.md#name)

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

[`BloggerError`](BloggerError.md).[`stack`](BloggerError.md#stack)

***

### status

> `readonly` **status**: `number` \| `null`

Defined in: src/core/errors.ts:12

***

### url

> `readonly` **url**: `string`

Defined in: src/core/errors.ts:11
