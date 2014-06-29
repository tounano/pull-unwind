var pull = require("pull-stream");
var unwind = require("../");

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