#!/usr/btn/env node

'use strict';
console.log("hello node");


// var Immutable = require('immutable');
// var map1 = Immutable.Map({a:1, b:2, c:3});
// var map2 = map1.set('b', 50);
// map1.get('b'); // 2
// map2.get('b'); // 50

const csv = require('csv');
const fs = require('fs');
const path = require('path');
const Iconv = require('iconv').Iconv;
const jschardet = require('jschardet');

function data2utf8String(data) {
    const detectResult = jschardet.detect(data);
    const iconv = new Iconv(detectResult.encoding, 'UTF-8//TRANSLIT//IGNORE');
    return iconv.convert(data).toString();
}

function readFile(filePath) {
    return data2utf8String(fs.readFileSync(filePath));

}

const FILE = path.join('20170125', '20170126130818.csv');
readFile(FILE);
//console.log(readFile(FILE));


const KEY_COMPANY = 'company';
const KEY_ID = 'id';
const KEY_PROGRAM = 'program';
const KEY_IMPRESSION = 'impression';
const KEY_CLICK = 'click';
const KEY_BUY = 'buy';
const KEY_REWARD = 'reword';

const str = readFile(FILE);
var tempArray = str.split("\n");
var csvArray = new Array();
for (var i = 1; i < tempArray.length; i++) {
    const vals = tempArray[i].split(",");
    csvArray[i] = {};
    csvArray[i][KEY_COMPANY] = vals[0];
    csvArray[i][KEY_PROGRAM] = vals[2];
    csvArray[i][KEY_IMPRESSION] = vals[3];
    csvArray[i][KEY_CLICK] = vals[4];
    csvArray[i][KEY_BUY] = vals[5];
}
console.log(csvArray);
