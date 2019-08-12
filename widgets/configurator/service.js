'use strict';
//T:2019-02-27

const Goblin = require('xcraft-core-goblin');

const goblinName = 'configurator';

// Define initial logic values
const logicState = {
  form: {},
  current: {},
  available: {},
  profiles: {},
};

// Define logic handlers according rc.json
const logicHandlers = {
  'create': (state, action) => {
    return state
      .set('id', action.get('id'))
      .set('form', action.get('form'))
      .set('current', action.get('current'))
      .set('available', action.get('available'))
      .set('profiles', action.get('profiles'));
  },
  'change-form.profile': (state, action) => {
    const profileName = action.get('newValue');
    const profile = state.get(`profiles.${profileName}`, null);
    state = state.set('form.profile', profileName);
    if (profile) {
      return state.set('current', profile.toJS());
    }
    return state;
  },
  'change-form.locale': (state, action) => {
    const locale = action.get('newValue');
    return state.set('form.locale', locale);
  },
  'change-form.username': (state, action) => {
    const usr = action.get('newValue');
    return state.set('form.username', usr);
  },
  'submit': (state, action) => {
    return state.applyForm(action.get('value')).set('form.busy', true);
  },
};

Goblin.registerQuest(goblinName, 'create', function(quest, id, labId) {
  const confConfig = require('xcraft-core-etc')().load('goblin-configurator');
  const errorMsg = `Unable to configure app:`;

  const available = confConfig.profiles;
  if (!available) {
    throw new Error(
      `${errorMsg} "profiles" key not defined in goblin-configurator settings`
    );
  }

  const availableProfiles = Object.keys(available);
  if (availableProfiles.length === 0) {
    throw new Error(`${errorMsg} No profiles available.`);
  }

  const selectedProfile = availableProfiles[0];
  const currentProfile = available[selectedProfile];
  const form = {
    busy: false,
    profile: selectedProfile,
    username: require('os').userInfo().username,
    locale: 'disabled',
  };

  quest.do({
    id: quest.goblin.id,
    form,
    current: currentProfile,
    available: availableProfiles,
    profiles: available,
  });
  return quest.goblin.id;
});

Goblin.registerQuest(goblinName, 'change-form.profile', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.username', function(quest) {
  quest.do();
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
