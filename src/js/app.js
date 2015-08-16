// Browserify
var _ = require('lodash');
// browserify-handlebars
var handlebars = require('../handlebars/test.hbs')
// ES2015
import { sum, another as newName } from './sum';
console.log("Running");

var [a, , b] = [1,2,3];
console.log(a);

var result = sum(a, b);
typeof newName == 'object';

console.log('Result: '+result);
console.log(handlebars( {name:'Andy Dong'} ));

var ele = [1,2,3,4];
_.each(ele, function(e){
  console.log(e);
})
