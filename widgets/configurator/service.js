'use strict';
//T:2019-02-27

const Goblin = require('xcraft-core-goblin');
const fs = require('fs');
const path = require('path');
const {mkdir} = require('xcraft-core-fs');
const goblinName = 'configurator';

// Define initial logic values
const logicState = {
  form: {},
  available: {},
  profiles: {},
  advanced: false,
  selectedEntity: null,
  ripley: {
    profileKey: null,
    db: {},
    selected: {
      from: null,
      to: null,
    },
  },
};

/******************************************************************************/

// Define logic handlers according rc.json
const logicHandlers = {
  'create': (state, action) => {
    return state
      .set('id', action.get('id'))
      .set('sessionId', action.get('clientSessionId'))
      .set('form', action.get('form'))
      .set('feeds', action.get('feeds'))
      .set('available', action.get('available'))
      .set('profiles', action.get('profiles'))
      .set('mainGoblin', action.get('mainGoblin'))
      .set('buildInfo', action.get('buildInfo'))
      .set('useLogin', action.get('useLogin'))
      .set('workshopAvailable', action.get('workshopAvailable'))
      .set('isCresusLauncher', action.get('isCresusLauncher'))
      .set('availableEntities', action.get('availableEntities'))
      .set('ripley.db', action.get('db'))
      .set('relaunch.reason', action.get('relaunchReason'))
      .set('relaunch.desktops', action.get('relaunchDesktops'));
  },

  'update-feeds': (state, action) => {
    return state.set('feeds', action.get('feeds'));
  },

  'change': (state, action) => {
    return state.set(action.get('path'), action.get('newValue'));
  },

  'change-form.locale': (state, action) => {
    const locale = action.get('newValue');
    return state.set('form.locale', locale);
  },

  'change-form.username': (state, action) => {
    const usr = action.get('newValue');
    return state.set('form.username', usr);
  },

  'toggle-advanced': (state) => {
    return state.set('advanced', !state.get('advanced'));
  },
  'select': (state, action) => {
    const type = action.get('type');
    const selected = state.get(`selected.${type}`);
    return state.set(
      `selected.${type}`,
      selected === action.get('selectedId') ? null : action.get('selectedId')
    );
  },
};

/******************************************************************************/

Goblin.registerQuest(goblinName, 'create', function* (
  quest,
  labId,
  clientSessionId,
  username,
  appArgs,
  useLogin = false,
  next
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
    quest.sub(`*::warehouse.feed-(sub|unsub)scribed`, function* (
      err,
      {msg, resp}
    ) {
      yield resp.cmd(`${goblinName}.update-feeds`, {
        id: quest.goblin.id,
      });
    })
  );

  // initialize branches by mandate
  let groupedBranches = {};
  if (quest.resp.hasCommand('cryo.branches')) {
    const branches = yield quest.cmd('cryo.branches');
    if (branches) {
      for (const key of Object.keys(branches)) {
        const db = key.split('_');
        if (db.length === 1) {
          groupedBranches[db[0]] = {branches: []};
        } else if (db.length === 2) {
          if (groupedBranches[db[0]]) {
            groupedBranches[db[0]].branches.push(key);
          } else {
            groupedBranches[db[0]] = {branches: [key]};
          }
        }
      }
    }
  }

  const selectedProfile = availableProfiles[0];

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

  const isCresusLauncher = quest.hasAPI('cresus-launcher');
  if (isCresusLauncher) {
    const cresusLauncherAPI = quest.getAPI('cresus-launcher');
    yield cresusLauncherAPI.init({labId, desktopId: quest.getDesktop()});
  }

  const relaunchReason = appArgs && appArgs['relaunch-reason'];
  const relaunchDesktops = appArgs && appArgs['relaunch-desktops'];

  quest.do({
    id: quest.goblin.id,
    form,
    feeds,
    clientSessionId,
    available: availableProfiles,
    profiles: available,
    mainGoblin,
    buildInfo,
    workshopAvailable,
    availableEntities,
    isCresusLauncher,
    db: groupedBranches,
    useLogin,
    relaunchReason,
    relaunchDesktops,
  });

  if (relaunchDesktops && relaunchDesktops.length > 0) {
    for (const desktopId of relaunchDesktops) {
      quest.me.openSession({feed: `feed-${desktopId}`}, next.parallel());
    }
    yield next.sync();
  }

  return quest.goblin.id;
});

Goblin.registerQuest(goblinName, 'update-feeds', function* (quest) {
  const warehouse = quest.getAPI('warehouse');
  const feeds = yield warehouse.listFeeds();
  quest.do({feeds});
});

Goblin.registerQuest(goblinName, 'change', function (quest, path, newValue) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.profile', function (quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'change-form.username', function (quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'toggle-advanced', function (quest) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'select', function (quest, type, selectedId) {
  quest.do();
});

Goblin.registerQuest(goblinName, 'replay-action-store', function* (quest) {
  const state = quest.goblin.getState();
  const profileName = state.get('ripley.profileKey');
  let profile = state.get(`profiles.${profileName}`).toJS();
  const username = state.get('form.username');
  const src = state.get('ripley.selected.from');
  const dst = state.get('ripley.selected.to');
  if (src && dst) {
    const workshop = quest.getAPI('workshop');
    const xHost = require('xcraft-core-host');
    const mainGoblin = state.get('mainGoblin');
    const {appConfigPath} = xHost;

    const cryoPath = path.join(appConfigPath, 'var', 'cryo');
    const srcPath = path.join(cryoPath, `${src}.db`);
    mkdir(cryoPath);
    const dstPath = path.join(cryoPath, `copy.db`);

    if (!fs.existsSync(srcPath)) {
      return;
    }

    fs.copyFileSync(srcPath, dstPath);

    yield workshop.ripleyFor({
      dbSrc: 'copy',
      dbDst: dst,
      timestamp: 9999,
      rethinkdbHost: profile.rethinkdbHost,
      elasticsearchUrl: profile.elasticsearchUrl,
      appId: mainGoblin,
    });
    yield quest.me.openSession({name: username});
  }
});

Goblin.registerQuest(goblinName, 'open-session', function* (
  quest,
  profileKey,
  feed
) {
  let session;
  let locale;
  const state = quest.goblin.getState();
  const username = state.get('form.username');

  if (feed) {
    const desktopId = feed.replace(/^feed-/, '');
    profileKey = yield quest.warehouse.get({
      path: `${desktopId}.profileKey`,
    });
    if (!profileKey) {
      quest.log.warn(`profileKey missing for desktopid:${desktopId}`);
      return;
    }
    const parts = feed.split('@');
    session = parts[2];
  }

  const profile = state.get(`profiles.${profileKey}`);

  if (!feed) {
    //sanitize username for making a valid user session id
    session = state
      .get('form.username')
      .toLowerCase()
      .replace(/\.|\[|\//g, '-');
    // Generate uuid for multi-instance
    if (!profile.get('singleInstance')) {
      session += '-' + quest.uuidV4();
    } else {
      // Use unique id for each app !
      session += '-' + profileKey;
    }

    //FIXME: number provided is bad, need to be fixed in widget
    /*const session =
      number === undefined ? userSession : `${userSession}-${number}`;*/
  }

  locale = profile.get('defaultLocale', 'fr-CH');

  quest.evt(`configured`, {
    username,
    session, //limit the number of session to one by userName
    locale,
    configuration: profile.toJS(),
  });
});

Goblin.registerQuest(goblinName, 'close-session', function* (quest, name) {
  const desktopId = name.replace('feed-', '');
  const deskManager = quest.getAPI('desktop-manager');
  yield deskManager.close({sessionDesktopId: desktopId});
});

Goblin.registerQuest(goblinName, 'create-new-entity', function* (quest) {
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

Goblin.registerQuest(goblinName, 'generate-workitems-templates', function* (
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

Goblin.registerQuest(goblinName, 'clear-workitems-templates', function* (
  quest
) {
  yield quest.me.change({path: 'selectedEntity', newValue: null});
});

Goblin.registerQuest(goblinName, 'logout', function* (quest) {
  const clientAPI = quest.getAPI('client');
  yield clientAPI.logout();
  yield clientAPI.startUX();
});

Goblin.registerQuest(goblinName, 'delete', function (quest) {});

/******************************************************************************/

// Create a Goblin with initial state and handlers
module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
