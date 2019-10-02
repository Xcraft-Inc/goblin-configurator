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
  advanced: false,
};

// Define logic handlers according rc.json
const logicHandlers = {
  'create': (state, action) => {
    return state
      .set('id', action.get('id'))
      .set('form', action.get('form'))
      .set('current', action.get('current'))
      .set('feeds', action.get('feeds'))
      .set('available', action.get('available'))
      .set('profiles', action.get('profiles'))
      .set('mainGoblin', action.get('mainGoblin'));
  },
  'update-feeds': (state, action) => {
    return state.set('feeds', action.get('feeds'));
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
  'change-form.session': (state, action) => {
    const s = action.get('newValue');
    return state.set('form.session', s);
  },
  'submit': (state, action) => {
    return state.applyForm(action.get('value')).set('form.busy', true);
  },
  'toggle-advanced': state => {
    return state.set('advanced', !state.get('advanced'));
  },
};

Goblin.registerQuest(goblinName, 'create', function*(quest, userId, username) {
  const clientConfig = require('xcraft-core-etc')().load('goblin-client');
  const mainGoblin = clientConfig.mainGoblin;
  const confConfig = require('xcraft-core-etc')().load('goblin-configurator');
  const errorMsg = `Unable to configure app:`;
  const warehouse = quest.getAPI('warehouse');
  const feeds = yield warehouse.listFeeds();
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

  quest.goblin.defer(
    quest.sub(`*::warehouse.feed-(sub|unsub)scribed`, function*(
      err,
      {msg, resp}
    ) {
      yield resp.cmd(`${goblinName}.update-feeds`, {
        id: quest.goblin.id,
      });
    })
  );

  const selectedProfile = availableProfiles[0];
  const currentProfile = available[selectedProfile];

  const form = {
    busy: false,
    profile: selectedProfile,
    username: username,
    session: userId,
    locale: 'fr-CH',
  };

  quest.do({
    id: quest.goblin.id,
    form,
    feeds,
    current: currentProfile,
    available: availableProfiles,
    profiles: available,
    mainGoblin,
  });
  return quest.goblin.id;
});

Goblin.registerQuest(goblinName, 'update-feeds', function*(quest) {
  const warehouse = quest.getAPI('warehouse');
  const feeds = yield warehouse.listFeeds();
  quest.do({feeds});
});

Goblin.registerQuest(goblinName, 'change-form.profile', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.username', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.session', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'toggle-advanced', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'open-session', function(quest, selection) {
  const state = quest.goblin.getState();
  const profile = state.get(`profiles.${selection}`, null);
  const username = state.get('form.username');
  if (selection.startsWith('feed-desktop@')) {
    const parts = selection.split('@');
    const mandate = parts[1];
    const session = parts[2];
    quest.evt(`configured`, {
      username,
      session,
      locale: null,
      configuration: {mandate},
    });
  } else {
    const locale = profile.get('defaultLocale', 'fr-CH');
    const session = state.get('form.session');
    quest.evt(`configured`, {
      username,
      session,
      locale,
      configuration: profile.toJS(),
    });
  }
});

Goblin.registerQuest(goblinName, 'close-session', function*(quest, selection) {
  const session = selection.replace('feed-', '');
  const sessionAPI = quest.getAPI(session);
  yield sessionAPI.close();
  yield quest.sub.wait(`*::*.${session}.closed`);
  yield quest.warehouse.feedSubscriptionDel({
    feed: session,
    branch: session,
    parents: session,
  });
  yield quest.warehouse.unsubscribe({feed: session});
});

Goblin.registerQuest(goblinName, 'delete', function(quest) {});

// Create a Goblin with initial state and handlers
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
