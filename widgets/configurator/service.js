'use strict';

const Goblin = require('xcraft-core-goblin');
const goblinName = 'configurator';
// Define initial logic values
const logicState = {
  form: {
    busy: false,
    profile: 'lab-test',
    username: require('os').userInfo().username,
    locale: 'disabled',
  },
  current: {
    applicationBusUrl: 'http://lab0.epsitec.ch',
    elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
    rethinkdbHost: 'lab0.epsitec.ch',
    reset: false,
    mandate: 'test',
  },
  locales: ['disabled', 'fr_CH', 'de_CH', 'en_US'],
  available: [
    'lab-velocite',
    'mfb',
    'VCBASE',
    'VCY',
    'VCN',
    'VCL',
    'VCV',
    'lab-test',
    'lab-blupi',
    'lab-hello',
    'lab-epsitec',
    'lab-epsitec-local',
    'lab-zeus',
    'lab-ellen',
    'server',
    'localhost',
    'reset-lab-test',
    'reset-lab-blupi',
    'reset-lab-hello',
    'reset-lab-epsitec',
    'reset-lab-zeus',
    'reset-lab-ellen',
    'reset-localhost',
    'RESETVCBASE',
    'RESETVCY',
    'RESETVCN',
    'RESETVCL',
    'RESETVCV',
    'reset-server',
  ],
  profiles: {
    server: {
      applicationBusUrl: 'vc.cresus.ch',
      elasticsearchUrl: 'localhost:9200',
      rethinkdbHost: 'localhost',
      reset: false,
      mandate: 'server',
    },
    'reset-server': {
      applicationBusUrl: 'vc.cresus.ch',
      elasticsearchUrl: 'localhost:9200',
      rethinkdbHost: 'localhost',
      reset: true,
      mandate: 'server',
    },
    'lab-test': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'test',
    },
    'reset-lab-test': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'test',
    },
    'lab-blupi': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'blupi',
    },
    'reset-lab-blupi': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'blupi',
    },
    'lab-hello': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'hello',
    },
    'reset-lab-hello': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'hello',
    },
    'lab-zeus': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'zeus',
    },
    'reset-lab-zeus': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'zeus',
    },
    'lab-epsitec': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'epsitec',
    },
    'lab-epsitec-local': {
      applicationBusUrl: 'http://localhost',
      elasticsearchUrl: 'http://localhost:9200',
      rethinkdbHost: 'localhost',
      reset: false,
      mandate: 'epsitec',
    },
    'reset-lab-epsitec': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'epsitec',
    },
    'lab-ellen': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'ellen',
    },
    'reset-lab-ellen': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'ellen',
    },
    'lab-velocite': {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'velocite',
    },
    mfb: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'mfb',
    },
    VCN: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'vcn',
    },
    RESETVCN: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'vcn',
    },
    VCL: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'vcl',
    },
    RESETVCL: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'vcl',
    },
    VCBASE: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'vcbase',
    },
    RESETVCBASE: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'vc',
    },
    VCY: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'vcy',
    },
    RESETVCY: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'vcy',
    },
    VCV: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: false,
      mandate: 'vcv',
    },
    RESETVCV: {
      applicationBusUrl: 'http://lab0.epsitec.ch',
      elasticsearchUrl: 'http://lab0.epsitec.ch:9200',
      rethinkdbHost: 'lab0.epsitec.ch',
      reset: true,
      mandate: 'vcv',
    },
    localhost: {
      applicationBusUrl: 'http://localhost:7777',
      elasticsearchUrl: 'http://localhost:9200',
      rethinkdbHost: 'localhost',
      reset: false,
      mandate: 'alleycat',
    },
    'reset-localhost': {
      applicationBusUrl: 'http://localhost:7777',
      elasticsearchUrl: 'http://localhost:9200',
      rethinkdbHost: 'localhost',
      reset: true,
      mandate: 'alleycat',
    },
  },
};

// Define logic handlers according rc.json
const logicHandlers = {
  create: (state, action) => {
    return state.set('id', action.get('id'));
  },
  'change-form.profile': (state, action) => {
    const profileName = action.get('newValue');
    const profile = state.get(`profiles.${profileName}`, null);
    if (profile) {
      return state.set('current', profile.toJS());
    }
    return state;
  },
  submit: (state, action) => {
    return state.applyForm(action.get('value')).set('form.busy', true);
  },
};

Goblin.registerQuest(goblinName, 'create', function(quest, id, labId) {
  quest.do({id: quest.goblin.id});
  return quest.goblin.id;
});

Goblin.registerQuest(goblinName, 'change-form.profile', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.locale', function*(
  quest,
  newValue
) {
  const nabu = quest.getAPI('nabu');
  if (newValue === 'disabled') {
    nabu.disable();
    return;
  }
  yield nabu.enable();
  yield nabu.changeLocale({locale: newValue});
});

Goblin.registerQuest(goblinName, 'submit', function(quest) {
  quest.do();
  const state = quest.goblin.getState();
  const configuration = state.get('current').toJS();
  const username = state.get('form.username');
  quest.evt(`configured`, {username, configuration});
});

Goblin.registerQuest(goblinName, 'delete', function(quest) {});

// Create a Goblin with initial state and handlers
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
