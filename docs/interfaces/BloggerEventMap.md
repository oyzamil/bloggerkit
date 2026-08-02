[**blogr**](../README.md)

***

[blogr](../globals.md) / BloggerEventMap

# Interface: BloggerEventMap

Defined in: src/core/events.ts:2

Payloads for each event emitted by a [Blogr](../classes/Blogr.md) instance.

## Properties

### error

> **error**: `object`

Defined in: src/core/events.ts:8

Fired when a request or parsing step fails.

#### error

> **error**: `unknown`

#### url

> **url**: `string` \| `null`

***

### request

> **request**: `object`

Defined in: src/core/events.ts:4

Fired right before a network request is made.

#### method

> **method**: `string`

#### url

> **url**: `string`

***

### response

> **response**: `object`

Defined in: src/core/events.ts:6

Fired after a network request completes successfully.

#### durationMs

> **durationMs**: `number`

#### status

> **status**: `number`

#### url

> **url**: `string`
