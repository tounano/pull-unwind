var pull = require("pull-stream");
var unwind = require("../");

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