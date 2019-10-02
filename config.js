'use strict';

/**
 * Retrieve the inquirer definition for xcraft-core-etc
 */
module.exports = [
  {
    type: 'checkbox',
    name: 'profiles',
    message: 'list of available profiles',
    default: [],
  },
  {
    type: 'input',
    name: 'buildInfo',
    message: 'build info displayed in configurator',
    default: '',
  },
];
