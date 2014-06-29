var pull = require("pull-stream");
var unwind = require("../");

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