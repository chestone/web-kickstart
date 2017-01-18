// First we setup some polyfills to get things at a sane baseline
import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;
}

import 'whatwg-fetch';
