[**blogr**](../README.md)

***

[blogr](../globals.md) / EventEmitter

# Class: EventEmitter

Defined in: src/core/events.ts:18

A minimal, dependency-free, typed event emitter.

## Constructors

### Constructor

> **new EventEmitter**(): `EventEmitter`

#### Returns

`EventEmitter`

## Methods

### emit()

> **emit**\<`K`\>(`event`, `payload`): `void`

Defined in: src/core/events.ts:47

#### Type Parameters

##### K

`K` *extends* keyof [`BloggerEventMap`](../interfaces/BloggerEventMap.md)

#### Parameters

##### event

`K`

##### payload

[`BloggerEventMap`](../interfaces/BloggerEventMap.md)\[`K`\]

#### Returns

`void`

***

### off()

> **off**\<`K`\>(`event`, `listener`): `this`

Defined in: src/core/events.ts:34

#### Type Parameters

##### K

`K` *extends* keyof [`BloggerEventMap`](../interfaces/BloggerEventMap.md)

#### Parameters

##### event

`K`

##### listener

[`Listener`](../type-aliases/Listener.md)\<`K`\>

#### Returns

`this`

***

### on()

> **on**\<`K`\>(`event`, `listener`): `this`

Defined in: src/core/events.ts:24

#### Type Parameters

##### K

`K` *extends* keyof [`BloggerEventMap`](../interfaces/BloggerEventMap.md)

#### Parameters

##### event

`K`

##### listener

[`Listener`](../type-aliases/Listener.md)\<`K`\>

#### Returns

`this`

***

### once()

> **once**\<`K`\>(`event`, `listener`): `this`

Defined in: src/core/events.ts:39

#### Type Parameters

##### K

`K` *extends* keyof [`BloggerEventMap`](../interfaces/BloggerEventMap.md)

#### Parameters

##### event

`K`

##### listener

[`Listener`](../type-aliases/Listener.md)\<`K`\>

#### Returns

`this`
