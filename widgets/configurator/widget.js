//T:2019-02-27
import React from 'react';
import Form from 'goblin-laboratory/widgets/form';
import MouseTrap from 'mousetrap';
import MainLayout from '../main-layout/widget';
import ConfiguratorNavigator from '../configurator-navigator/widget';
import ConfiguratorConfirmPopup from '../configurator-confirm-popup/widget';
import ConfiguratorBuildPopup from '../configurator-build-popup/widget';
import ConfiguratorActionStorePopup from '../configurator-action-store-popup/widget';
import Widget from 'goblin-laboratory/widgets/widget';

/******************************************************************************/

// If session = "roux-2", return "2".
function getSessionNumber(session) {
  const parts = session.split('-');
  if (parts.length > 1) {
    return parts[parts.length - 1];
  } else {
    return null;
  }
}

function compareProfiles(p1, p2) {
  const a1 = p1.get('action') || 'aaa';
  const a2 = p2.get('action') || 'aaa';
  if (a1 < a2) {
    return -1;
  }
  if (a1 > a2) {
    return 1;
  }

  const n1 = p1.get('name');
  const n2 = p2.get('name');
  if (n1 < n2) {
    return -1;
  }
  if (n1 > n2) {
    return 1;
  }

  return 0;
}

function compareStrings(s1, s2) {
  if (s1 < s2) {
    return -1;
  }
  if (s1 > s2) {
    return 1;
  }
  return 0;
}

/******************************************************************************/

class Configurator extends Form {
  constructor() {
    super(...arguments);

    this.state = {
      showConformPopup: false,
      showBuildPopup: false,
      showActionStorePopup: false,
      useLauncher: true,
    };

    this.confirmPopupAction = null;
    this.confirmPopupProps = null;
    this.confirmPopupParam = null;

    this.onToggleAdvanced = this.onToggleAdvanced.bind(this);
    this.openSession = this.openSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.openActionStorePopup = this.openActionStorePopup.bind(this);
    this.closeActionStorePopup = this.closeActionStorePopup.bind(this);

    this.logout = this.logout.bind(this);
  }

  //#region get/set
  get showConformPopup() {
    return this.state.showConformPopup;
  }
  set showConformPopup(value) {
    this.setState({
      showConformPopup: value,
    });
  }

  get showBuildPopup() {
    return this.state.showBuildPopup;
  }
  set showBuildPopup(value) {
    this.setState({
      showBuildPopup: value,
    });
  }

  get useLauncher() {
    return this.state.useLauncher;
  }
  set useLauncher(value) {
    this.setState({
      useLauncher: value,
    });
  }
  //#endregion

  static get wiring() {
    return {
      id: 'id',
      feeds: 'feeds',
      advanced: 'advanced',
      workshopAvailable: 'workshopAvailable',
      availableEntities: 'availableEntities',
      useLogin: 'useLogin',
    };
  }

  componentDidMount() {
    MouseTrap.bind('ctrl+k', this.onToggleAdvanced);
  }

  onToggleAdvanced() {
    this.do('toggle-advanced');
  }

  openSession(profileKey, feed) {
    this.do('open-session', {profileKey, feed});
  }

  openActionStorePopup(profileKey) {
    this.do('change', {path: 'ripley.profileKey', newValue: profileKey});
    this.setState({showActionStorePopup: true});
    this.forceUpdate();
  }

  closeActionStorePopup() {
    this.do('change', {path: 'popup.ripley', newValue: false});
    this.setState({showActionStorePopup: false});
  }

  closeSession(name) {
    this.do('close-session', {name});
  }

  logout() {
    this.do('logout', {});
  }

  defineConfirmAction(glyph, name, action, profileKey) {
    this.showConformPopup = true;

    this.confirmPopupProps = {
      topGlyph: glyph,
      topTitle: name,
      question: 'Voulez-vous effacer complètement le mandat ?',
    };

    this.confirmPopupAction = this.openSession;
    this.confirmPopupParam = profileKey;
  }

  // Return a tree with 2 levels: mandats and sessions.
  getTree() {
    if (!this.props.id) {
      return null;
    }

    const tree = {};
    let maxSessionNumbers = 0;

    // Add all opened sessions.
    const sessionList = this.props.feeds
      .filter((f) => f.startsWith('feed-desktop@') && !f.endsWith('$passenger'))
      .sort((f1, f2) => compareStrings(f1, f2))
      .map((feed) => ({
        id: feed,
        text: feed,
        mandate: feed.split('@')[1],
      }))
      .valueSeq()
      .toArray();

    sessionList.forEach((s) => {
      if (!maxSessionNumbers) {
        maxSessionNumbers = 0;
      }

      const session = s.id.split('@')[2];

      const n = getSessionNumber(session);
      maxSessionNumbers = Math.max(maxSessionNumbers, n);

      tree[session] = {
        leaf: true,
        name: session,
        glyph: 'solid/tv',
        closable: true,
        onOpen: () => this.openSession(null, s.id),
        onClose: () => this.closeSession(s.id),
      };
    });

    // Add all profiles.
    const profiles = this.getModelValue('.profiles').sort((p1, p2) =>
      compareProfiles(p1, p2)
    );
    for (const p of profiles) {
      const profileKey = p[0];
      const profile = p[1];

      const name = profile.get('name');
      const mainGoblin = profile.get('mainGoblin');

      const action = profile.get('action');

      if (!this.props.advanced && action) {
        continue;
      }

      const config = {
        action: action,
      };

      if (action) {
        const isReset = action === 'reset';
        if (isReset) {
          const glyph = 'solid/trash';
          tree[profileKey] = {
            leaf: true,
            name: name,
            config: config,
            glyph: glyph,
            onOpen: () =>
              this.defineConfirmAction(glyph, name, action, profileKey),
          };
        } else {
          const glyph = 'solid/undo';
          tree[profileKey] = {
            leaf: true,
            name: name,
            config: config,
            glyph: glyph,
            onOpen: () => this.openActionStorePopup(profileKey),
          };
        }
      } else {
        const sessionNumber = (maxSessionNumbers || 0) + 1;
        const key = `${profileKey}-${sessionNumber}`;
        tree[key] = {
          leaf: true,
          name: mainGoblin,
          config: config,
          glyph: 'solid/plus',
          onOpen: () => this.openSession(profileKey, null),
        };
      }
    }

    return tree;
  }

  /******************************************************************************/

  renderConfirmPopup() {
    return (
      <ConfiguratorConfirmPopup
        showed={this.showConformPopup}
        {...this.confirmPopupProps}
        onAccept={() => {
          this.showConformPopup = false;
          this.confirmPopupAction(this.confirmPopupParam);
        }}
        onCancel={() => (this.showConformPopup = false)}
      />
    );
  }

  renderBuildPopup() {
    if (!this.props.workshopAvailable) {
      return null;
    }
    return (
      <ConfiguratorBuildPopup
        id={this.props.id}
        showed={this.showBuildPopup}
        entities={this.props.availableEntities}
        onClose={() => (this.showBuildPopup = false)}
      />
    );
  }

  renderActionStorePopup() {
    if (!this.props.workshopAvailable) {
      return null;
    }
    return (
      <ConfiguratorActionStorePopup
        id={this.props.id}
        onClose={this.closeActionStorePopup}
        showed={this.state.showActionStorePopup}
      />
    );
  }

  render() {
    if (!this.props.id) {
      return null;
    }
    const tree = this.getTree();

    const style = this.useLauncher
      ? this.styles.classNames.configuratorLauncher
      : this.styles.classNames.configurator;

    return (
      <>
        <MainLayout
          id={this.props.id}
          info={this.getModelValue('.buildInfo')}
          advanced={this.props.advanced}
          useLauncher={this.useLauncher}
          useLogin={this.props.useLogin}
          onToggleAdvanced={this.onToggleAdvanced}
          onToggleLauncher={() => (this.useLauncher = !this.useLauncher)}
          onBuild={() => (this.showBuildPopup = true)}
          onLogout={this.logout}
        >
          <div className={style}>
            <ConfiguratorNavigator
              configuratorId={this.props.id}
              widgetId={`${this.props.id}$icon-navigator`}
              application={this.getModelValue('.mainGoblin')}
              tree={tree}
              passengers={
                this.props.feeds.filter((feed) => feed.endsWith('$passenger'))
                  .length
              }
              useLauncher={this.useLauncher}
            ></ConfiguratorNavigator>
          </div>
        </MainLayout>
        {this.renderConfirmPopup()}
        {this.renderBuildPopup()}
        {this.renderActionStorePopup()}
      </>
    );
  }
}

export default Widget.Wired(Configurator)();
