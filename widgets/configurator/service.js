'use strict';
//T:2019-02-27

const Goblin = require('xcraft-core-goblin');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;
const goblinName = 'configurator';

// Define initial logic values
const logicState = {
  form: {},
  current: {},
  available: {},
  profiles: {},
  advanced: false,
  selectedEntity: null,
};

/******************************************************************************/

// Define logic handlers according rc.json
const logicHandlers = {
  'create': (state, action) => {
    return state
      .set('id', action.get('id'))
      .set('sessionId', action.get('clientSessionId'))
      .set('form', action.get('form'))
      .set('current', action.get('current'))
      .set('feeds', action.get('feeds'))
      .set('available', action.get('available'))
      .set('profiles', action.get('profiles'))
      .set('mainGoblin', action.get('mainGoblin'))
      .set('buildInfo', action.get('buildInfo'))
      .set('workshopAvailable', action.get('workshopAvailable'))
      .set('availableEntities', action.get('availableEntities'));
  },

  'update-feeds': (state, action) => {
    return state.set('feeds', action.get('feeds'));
  },

  'change': (state, action) => {
    return state.set(action.get('path'), action.get('newValue'));
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

  'toggle-advanced': state => {
    return state.set('advanced', !state.get('advanced'));
  },
};

/******************************************************************************/

Goblin.registerQuest(goblinName, 'create', function*(
  quest,
  clientSessionId,
  username
) {
  const clientConfig = require('xcraft-core-etc')().load('goblin-client');
  const mainGoblin = clientConfig.mainGoblin;
  const confConfig = require('xcraft-core-etc')().load('goblin-configurator');
  const errorMsg = `Unable to configure app:`;
  const warehouse = quest.getAPI('warehouse');
  const feeds = yield warehouse.listFeeds();
  const buildInfo = confConfig.buildInfo;
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
    locale: 'fr-CH',
  };

  //WORKSHOP BUILDER TOOLS INFOS
  let workshopAvailable = false;
  let availableEntities = [];
  if (quest.hasAPI('workshop')) {
    workshopAvailable = true;
    const wAPI = quest.getAPI('workshop');
    availableEntities = yield wAPI.getAvailableEntities();
  }
  quest.do({
    id: quest.goblin.id,
    form,
    feeds,
    clientSessionId,
    current: currentProfile,
    available: availableProfiles,
    profiles: available,
    mainGoblin,
    buildInfo,
    workshopAvailable,
    availableEntities,
  });
  return quest.goblin.id;
});

Goblin.registerQuest(goblinName, 'update-feeds', function*(quest) {
  const warehouse = quest.getAPI('warehouse');
  const feeds = yield warehouse.listFeeds();
  quest.do({feeds});
});

Goblin.registerQuest(goblinName, 'change', function(quest, path, newValue) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.profile', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.username', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'toggle-advanced', function(quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'replay-action-store', function*(quest, name) {
  const state = quest.goblin.getState();
  let profile = state.get(`profiles.${name}`).toJS();
  const workshop = quest.getAPI('workshop');
  const xHost = require('xcraft-core-host');
  const mainGoblin = state.get('mainGoblin');
  const {appConfigPath, projectPath} = xHost;
  const srcPath = path.join(
    projectPath,
    'lib',
    `goblin-${mainGoblin}`,
    'action-stores',
    `${profile.mandate}.db`
  );
  const cryoPath = path.join(appConfigPath, 'var/cryo');
  mkdirp(cryoPath);
  const dstPath = path.join(cryoPath, `copy.db`);

  if (!fs.existsSync(srcPath)) {
    return;
  }

  fs.copyFileSync(srcPath, dstPath);

  yield workshop.ripleyFor({
    dbSrc: 'copy',
    dbDst: profile.mandate,
    timestamp: 9999,
    rethinkdbHost: profile.rethinkdbHost,
    elasticsearchUrl: profile.elasticsearchUrl,
    appId: mainGoblin,
  });
  yield quest.me.openSession({name});
});

Goblin.registerQuest(goblinName, 'open-session', function(quest, name, number) {
  const state = quest.goblin.getState();
  const username = state.get('form.username');
  if (name.startsWith('feed-desktop@')) {
    const parts = name.split('@');
    const mandate = parts[1];
    const session = parts[2];
    quest.evt(`configured`, {
      username,
      session,
      locale: null,
      configuration: {mandate},
    });
  } else {
    const profile = state.get(`profiles.${name}`);
    const locale = profile.get('defaultLocale', 'fr-CH');
    //sanitize username for making a valid user session id
    const userSession = state
      .get('form.username')
      .toLowerCase()
      .replace(/\.|\[|\//g, '-');

    const session =
      number === undefined ? userSession : `${userSession}-${number}`;
    quest.evt(`configured`, {
      username,
      session,
      locale,
      configuration: profile.toJS(),
    });
  }
});

Goblin.registerQuest(goblinName, 'close-session', function*(quest, name) {
  const desktop = name.replace('feed-', '');
  const deskAPI = quest.getAPI(desktop);
  yield deskAPI.close({closeIn: 10});
});

Goblin.registerQuest(goblinName, 'create-new-entity', function*(quest) {
  const state = quest.goblin.getState();
  const entity = state.get('newEntity').toJS();
  if (!entity || !entity.type) {
    return;
  }
  const workshopAPI = quest.getAPI('workshop');
  const mainGoblin = quest.goblin.getState().get('mainGoblin');
  const goblinLib = `goblin-${mainGoblin}`;
  yield workshopAPI.createNewEntity({goblinLib, entity});
  yield quest.me.change({path: 'newEntity', newValue: null});
});

Goblin.registerQuest(goblinName, 'generate-workitems-templates', function*(
  quest
) {
  const state = quest.goblin.getState();
  const entityType = state.get('selectedEntity');
  if (!entityType) {
    return;
  }
  const workshopAPI = quest.getAPI('workshop');
  const mainGoblin = quest.goblin.getState().get('mainGoblin');
  const goblinLib = `goblin-${mainGoblin}`;
  yield workshopAPI.generateWorkitemsTemplates({goblinLib, entityType});
  yield quest.me.change({path: 'selectedEntity', newValue: null});
});

Goblin.registerQuest(goblinName, 'clear-workitems-templates', function*(quest) {
  yield quest.me.change({path: 'selectedEntity', newValue: null});
});

Goblin.registerQuest(goblinName, 'delete', function(quest) {});

/******************************************************************************/

// Create a Goblin with initial state and handlers
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
