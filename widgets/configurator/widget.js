//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';
import MouseTrap from 'mousetrap';
import MainLayout from '../main-layout/widget';
import ConfiguratorNavigator from '../configurator-navigator/widget';
import ConfiguratorConfirmPopup from '../configurator-confirm-popup/widget';

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
  const m1 = p1.get('mandate');
  const m2 = p2.get('mandate');
  if (m1 < m2) {
    return -1;
  }
  if (m1 > m2) {
    return 1;
  }

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

export default class Configurator extends Form {
  constructor() {
    super(...arguments);

    this.state = {
      showConformPopup: false,
    };

    this.confirmPopupAction = null;
    this.confirmPopupProps = null;
    this.confirmPopupParam = null;

    this.onToggleAdvanced = this.onToggleAdvanced.bind(this);
    this.openSession = this.openSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
    this.replayActionStore = this.replayActionStore.bind(this);
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
  //#endregion

  static get wiring() {
    return {
      id: 'id',
      feeds: 'feeds',
      advanced: 'advanced',
    };
  }

  componentDidMount() {
    MouseTrap.bind('ctrl+k', this.onToggleAdvanced);
  }

  onToggleAdvanced() {
    this.do('toggle-advanced');
  }

  openSession(name, number) {
    console.log('OPEN SESSION', name, number);
    this.do('open-session', {name, number});
  }

  replayActionStore(name) {
    this.do('replay-action-store', {name});
  }

  closeSession(name) {
    console.log('CLOSE SESSION', name);
    this.do('close-session', {name});
  }

  defineConfirmAction(glyph, name, action, profileKey) {
    this.showConformPopup = true;

    this.confirmPopupProps = {
      topGlyph: glyph,
      topTitle: name,
      question:
        action === 'reset'
          ? 'Voulez-vous effacer complètement le mandat ?'
          : 'Voulez-vous restaurer le mandant selon le point de sauvegarde ?',
    };

    this.confirmPopupAction =
      action === 'reset' ? this.openSession : this.replayActionStore;
    this.confirmPopupParam = profileKey;
  }

  // Return a tree with 2 levels: mandats and sessions.
  getTree() {
    if (!this.props.id) {
      return null;
    }

    const tree = {};
    const maxSessionNumbers = {};

    // Add all opened sessions.
    const sessionList = this.props.feeds
      .filter(f => f.startsWith('feed-desktop@'))
      .sort((f1, f2) => compareStrings(f1, f2))
      .map(feed => ({
        id: feed,
        text: feed,
        mandate: feed.split('@')[1],
      }))
      .toArray();

    sessionList.forEach(s => {
      const mandate = s.mandate;

      if (!tree[mandate]) {
        tree[mandate] = {};
      }
      if (!maxSessionNumbers[mandate]) {
        maxSessionNumbers[mandate] = 0;
      }

      const session = s.id.split('@')[2];

      const n = getSessionNumber(session);
      maxSessionNumbers[mandate] = Math.max(maxSessionNumbers[mandate], n);

      tree[mandate][session] = {
        leaf: true,
        name: session,
        glyph: 'solid/tv',
        closable: true,
        onOpen: () => this.openSession(s.id),
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
      const topology = profile.get('topology', null);
      let mandate = profile.get('mandate');
      const action = profile.get('action');

      if (!this.props.advanced && action) {
        continue;
      }

      if (topology) {
        mandate = `${mandate}@${topology}`;
      }

      if (!tree[mandate]) {
        tree[mandate] = {};
      }

      const config = {
        mandate: profile.get('mandate'),
        action: action,
        elasticsearchUrl: profile.get('elasticsearchUrl'),
        rethinkdbHost: profile.get('rethinkdbHost'),
        topology: topology,
      };

      if (action) {
        const glyph = action === 'reset' ? 'solid/trash' : 'solid/undo';
        tree[mandate][profileKey] = {
          leaf: true,
          name: name,
          config: config,
          glyph: glyph,
          onOpen: () =>
            this.defineConfirmAction(glyph, name, action, profileKey),
        };
      } else {
        const sessionNumber = (maxSessionNumbers[mandate] || 0) + 1;
        const key = `${profileKey}-${sessionNumber}`;
        tree[mandate][key] = {
          leaf: true,
          name: key,
          config: config,
          glyph: 'solid/plus',
          onOpen: () => this.openSession(profileKey, sessionNumber),
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

  render() {
    const tree = this.getTree();

    return (
      <React.Fragment>
        <MainLayout
          id={this.props.id}
          info={this.getModelValue('.buildInfo')}
          advanced={this.props.advanced}
          onToggleAdvanced={this.onToggleAdvanced}
        >
          <div className={this.styles.classNames.configurator}>
            <ConfiguratorNavigator
              configuratorId={this.props.id}
              widgetId={`${this.props.id}$icon-navigator`}
              application={this.getModelValue('.mainGoblin')}
              tree={tree}
            ></ConfiguratorNavigator>
          </div>
        </MainLayout>
        {this.renderConfirmPopup()}
      </React.Fragment>
    );
  }
}
