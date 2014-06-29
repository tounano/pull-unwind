# pull-unwind

Unwind a json object into multiple json objects.

Similar behaviour to MongoDB's `$unwind` in the aggregation framework.

## Usage

### unwind(unwindBy)

`unwindBy` can be an integer or a property name.

If it's an integer `X`, the event would be cloned `X` times.

If it's a `property name`, it will check whether the value of a property is an integer or an array. If it's an integer
it will work the same way as specifying an integer.

In case it's an array, the array will be unwinded and it's contents would be extended to the `base` object, one-by-one.

## Examples

### unwindBy is an Integer

```js
var pull = require("pull-stream");
var unwind = require("pull-unwind");

var events = [
  {
    name: "SomeEvent",
    value: 1
  }
]

pull(
  pull.values(events),
  unwind(3),
  pull.drain(console.log)
)
```

**Result:**

```
{ name: 'SomeEvent', value: 1 }
{ name: 'SomeEvent', value: 1 }
{ name: 'SomeEvent', value: 1 }
```

### unwindBy is a property name with integer value

```js
var pull = require("pull-stream");
var unwind = require("pull-unwind");

var events = [
  {
    name: "SomeEvent",
    value: 1,
    clones: 2
  }
]

pull(
  pull.values(events),
  unwind('clones'),
  pull.drain(console.log)
)
```

**Result:**

```
{ name: 'SomeEvent', value: 1 }
{ name: 'SomeEvent', value: 1 }
```

### unwindBy is a property name with array as value

```js
var pull = require("pull-stream");
var unwind = require("pull-unwind");

var events = [
  {
    name: "SomeEvent",
    collection: [
      {value: 1},
      {value: 2}
    ]
  }
]

pull(
  pull.values(events),
  unwind('collection'),
  pull.drain(console.log)
)
```

**Result:**

```
{ name: 'SomeEvent', value: 1 }
{ name: 'SomeEvent', value: 2 }
```

## install

With [npm](https://npmjs.org) do:

```
npm install pull-unwind
```

## license

MIT