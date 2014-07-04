var pull = require("pull-stream");
var unwind = require("../");

var streamOfStreams = pull.values([
    pull.values([1,2,3,4,5]),
    pull.values([6,7,8])
]);

pull(
  streamOfStreams,
  unwind(),
  pull.log()
)