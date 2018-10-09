'use strict';

const Goblin = require('xcraft-core-goblin');
const confConfig = require('xcraft-core-etc')().load('goblin-configurator');

const goblinName = 'configurator';

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

// Define initial logic values
const logicState = {
  form,
  current: currentProfile,
  locales: ['disabled', 'fr_CH', 'de_CH', 'en_US'],
  available: availableProfiles,
  profiles: available,
};

// Define logic handlers according rc.json
const logicHandlers = {
  create: (state, action) => {
    return state.set('id', action.get('id'));
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
  quest.do();
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
