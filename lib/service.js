'use strict';

const path = require('path');
const goblinName = path.basename(module.parent.filename, '.js');

const Goblin = require('xcraft-core-goblin');

const logicState = {};
const logicHandlers = {};

Goblin.registerQuest(goblinName, 'boot', function* (quest) {
  yield quest.cmd('client.boot');
  const confConfig = require('xcraft-core-etc')().load('goblin-configurator');
  const isCresusLauncher = quest.hasAPI('cresus-launcher');
  if (isCresusLauncher) {
    const cresusLauncher = quest.getAPI('cresus-launcher');
    yield cresusLauncher.boot();
  }

  for (const key in confConfig.profiles) {
    const profile = confConfig.profiles[key];
    const api = quest.getAPI(profile.mainGoblin);
    if (api.boot) {
      yield api.boot();
    }
  }
});

Goblin.registerQuest(goblinName, 'configure-desktop', function* (
  quest,
  clientSessionId,
  labId,
  desktopId,
  session,
  username,
  locale,
  configuration
) {
  quest.goblin.setX('configuration', configuration);
  const mainGoblinAPI = quest.getAPI(configuration.mainGoblin);
  if (mainGoblinAPI.configureDesktop) {
    return yield mainGoblinAPI.configureDesktop({
      clientSessionId,
      labId,
      desktopId,
      session,
      username,
      locale,
      configuration,
    });
  }
});

Goblin.registerQuest(goblinName, 'after-configure-desktop', function* (
  quest,
  labId,
  desktopId
) {
  const configuration = quest.goblin.getX('configuration');
  const mainGoblinAPI = quest.getAPI(configuration.mainGoblin);
  if (mainGoblinAPI.afterConfigureDesktop) {
    return yield mainGoblinAPI.afterConfigureDesktop({
      labId,
      desktopId,
    });
  }
});

module.exports = Goblin.configure(goblinName, logicState, logicHandlers);
Goblin.createSingle(goblinName);
