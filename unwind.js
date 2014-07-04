var _ = require("underscore");
var pull = require("pull-stream");

var unwindStream = pull.Through(function (read) {
  var ended, unwinding

  return function next (end, cb) {
    if (unwinding)
      return unwinding(end || ended, function (_end, data) {
        if (_end) {
          unwinding = null;
          return next(end, cb);
        }

        cb(_end, data);
      });

    read(end || ended, function (end, stream) {
      if (end) {
        ended = true;
        return cb(end, null);
      }

      unwinding = stream;
      return next(end, cb);
    })
  }
});

var unwind = pull.Through( function (read, unwindBy) {
  return unwindStream()(function (end, cb) {
    read(end, function (end, data) {
      if (end) return cb(end);

      var base = _.clone(data), stream

      if (typeof data === 'function') {
        return cb(end, data)
      } else if (_.isArray(data[unwindBy])) {
        delete base[unwindBy];
        stream = pull.values(data[unwindBy]);
      } else if (parseInt(data[unwindBy])) {
        delete base[unwindBy];
        stream = pull.count(data[unwindBy] - 1);
      } else if (parseInt(unwindBy)) {
        stream = pull.count(unwindBy - 1);
      } else
        return cb(end, pull.values([data]));

      cb(end, pull(
        stream,
        pull.map(function (d) { d = _.isObject(d) ? d : {}; return _.extend({}, base, d)})
      ))
    })
  })
})

module.exports = unwind;
module.exports.unwindStream = unwindStream;