/*
  this file is just for testing of some features of JS, node and the libraries
 */

'use strict';

let _ = require('lodash');


let arr1 = [
  {id: '11', b: 22},
  {id: '11', b: 22},
  {id: '22', b: 11},
  {id: '11', b: 22},
  {id: '13', b: 2235}
];

let arr2 = [
  {id: '11', b: 22},
  {id: '17', b: 22},
  {id: '22', b: 11},
  {id: '11', b: 22},
  {id: '13', b: 2235}
];


var union = _(_.union(arr1, arr2)).uniq(item => item.id).value();
console.log(union);
