import {fetch} from 'whatwg-fetch';

console.log('main.js loaded');

const foo = { bar: 'baz' };
const {bar} = foo;

console.log(bar);
