(function() {
  "use strict";

  require('events').EventEmitter.prototype._maxListeners = 100;

  var fs = require('fs');
  var _ = require('lodash');
  var parse = require('csv-parse');
  var json2csv = require('json2csv');

  var conbined = [];

  var dist = process.argv[2] || "conbined.csv";
  var files = [
    {'file': '20170125/20170126130818.csv', 'date': '20140414'}
    ];


      var tasks = _.map(files, function(file) {
        // make tasks from list of files to parse csv
        return new Promise(function(resolve, reject) {

          var output = [];

          var parser = parse({}, function(err, data) {
            var fr = data.shift();
            data = _.map(data, function(arr) {
              return _.object(fr, arr);
            });
            output.push(data);
          });

          var s = fs.createReadStream(file.file);
          var p =  s.pipe(parser);
          p.on('end', function() {

            output = _.map(output[0], function(obj) {
              obj.date = file.date;
              return obj;
            });
            conbined.push(output);
            resolve();
          });
        });
      });

      Promise.all(tasks).then(function(x) {
        var klist = [];
        conbined = _.flatten(conbined);

        // use conbined and output to klist
        conbined = _.map(conbined, function(obj) {
          var date = obj.date;
          var ret = {};
          ret["検索キーワード"] = obj["検索キーワード"];
          ret["表示回数-"+date] = obj["表示回数"];
          ret["クリック数-"+date] = obj["クリック数"];
          ret["CTR-"+date] = obj["CTR"];
          ret["平均掲載順位-"+date] = obj["平均掲載順位"];
          return ret;
        });

        conbined = _.groupBy(conbined, function(obj){
          return obj["検索キーワード"];
        });

        _.each(conbined, function(word) {
          var ret = {};
          _.each(word, function(col) {
            ret = _.extend(ret,col);
          });
          klist.push(ret);
        });

        // output to csv
        var keys = _.keys(klist[0]);
        console.log(keys);
        json2csv({data: klist, fields: keys}, function(err, csv) {
          if(err) {
            console.error(err);
          }
          fs.writeFile(dist, csv);
        });
      });

    })();
