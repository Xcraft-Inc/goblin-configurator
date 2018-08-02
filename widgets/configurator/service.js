'use strict';

const Goblin = require('xcraft-core-goblin');
const fse = require('fs-extra');
const path = require('path');
const goblinName = 'configurator';
const WESTEROS_APP = process.env.WESTEROS_APP;

const errorMsg = `Unable to configure app:`;
const openAppFileAndCheck4Profiles = app => {
  const appFileDir = path.normalize(`../../../../app/${app}/`);
  const appFilePath = path.join(__dirname, appFileDir, 'app.json');
  let profiles = {};
  try {
    const appFile = JSON.parse(fse.readFileSync(appFilePath));
    profiles = appFile.profiles;
  } catch (e) {
    throw new Error(`${errorMsg}
    Unable to find app.json file in ${appFilePath}`);
  }

  if (!profiles) {
    throw new Error(`${errorMsg}
    "profiles" key not defined in ${appFilePath}`);
  }

  if (typeof profiles === 'string') {
    return openAppFileAndCheck4Profiles(profiles);
  }
  return profiles;
};

const available = openAppFileAndCheck4Profiles(WESTEROS_APP);

const availableProfiles = Object.keys(available);
if (availableProfiles.length === 0) {
  throw new Error(`${errorMsg}
  No profiles available.`);
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
