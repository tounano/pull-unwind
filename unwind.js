var _ = require("underscore");
var pull = require("pull-stream");

module.exports = pull.Through( function (read, unwindBy) {
  var base, cbs=[], reading = false, unwindArray=[];
  return function (end, cb) {
    if (end) return cb(end);

    cbs.push(cb);

    ;(function drain() {
      if (!base && !reading && cbs.length) {
        reading = true;
        var cb = cbs.shift();
        return read(null, function (end, data) {
          reading = false;
          if (end) {cb(end); return drain(); }
          cbs.unshift(cb);
          base = _.clone(data);
          if (_.isArray(base[unwindBy])) {
            unwindArray = base[unwindBy];
            delete base[unwindBy];
          } else {
            var offset;
            if (parseInt(unwindBy))
              offset = unwindBy;
            else {
              offset = parseInt(base[unwindBy]);
              delete base[unwindBy];
            }

            unwindArray = [];
            for (var i = 0; i < offset; ++i)
              unwindArray.push({});
          }
          drain();
        });
      }

      if (base && !unwindArray.length && cbs.length ) {
        base = null;
        return drain();
      }

      if (cbs.length && base) {
        var unwinded = _.extend({}, base, unwindArray.shift());
        cbs.shift()(null, unwinded);
        return drain();
      }
    })();
  }
})