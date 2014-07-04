# pull-unwind

Unwind/flatten a complex stream to a simpler one.

Similar behaviour to MongoDB's `$unwind` in the aggregation framework.

## Usage

### unwind(?unwindBy)

`unwindBy` can be an integer or a property name. If you're unwinding a stream, you can leave this arg blank.

If it's an integer `X`, the event would be cloned `X` times.

If it's a `property name`, it will check whether the value of a property is an integer or an array. If it's an integer
it will work the same way as specifying an integer.

In case it's an array, the array will be unwinded and it's contents would be extended to the `base` object, one-by-one.

In case it's a stream, it'll unwind it.

## Examples

### unwindBy is blank (unwinding streams)

```js
var pull = require("pull-stream");
var unwind = require("pull-unwind");

var streamOfStreams = pull.values([
    pull.values([1,2,3,4,5]),
    pull.values([6,7,8])
]);

pull(
  streamOfStreams,
  unwind(),
  pull.log()
)
```

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