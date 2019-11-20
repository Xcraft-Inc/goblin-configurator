//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';
import MouseTrap from 'mousetrap';
import MainLayout from '../main-layout/widget';
import ConfiguratorNavigator from '../configurator-navigator/widget';

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

/******************************************************************************/

export default class Configurator extends Form {
  constructor() {
    super(...arguments);

    this.onToggleAdvanced = this.onToggleAdvanced.bind(this);
    this.openSession = this.openSession.bind(this);
    this.closeSession = this.closeSession.bind(this);
  }

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

  closeSession(name) {
    console.log('CLOSE SESSION', name);
    this.do('close-session', {name});
  }

  // Return a tree with 2 levels: mandats and sessions.
  getTree() {
    if (!this.props.id) {
      return null;
    }

    const dico = {};

    // Add all profiles.
    const tree = this.getModelValue('.profiles').reduce(
      (list, profile, profileKey) => {
        const name = profile.get('name');
        const topology = profile.get('topology', null);
        let mandate = profile.get('mandate');
        const isReset = profile.get('reset');

        if (!this.props.advanced && isReset) {
          return list;
        }
        if (topology) {
          mandate = `${mandate}@${topology}`;
        }
        if (!list[mandate]) {
          list[mandate] = {};
        }
        if (isReset) {
          list[mandate][profileKey] = {
            leaf: true,
            name: name,
            glyph: 'solid/trash',
            onOpen: () => this.openSession(profileKey),
          };
        } else {
          for (let sessionNumber = 1; sessionNumber <= 3; sessionNumber++) {
            const key = `${profileKey}-${sessionNumber}`;
            list[mandate][key] = {
              leaf: true,
              name: key,
              glyph: 'solid/plus',
              onOpen: () => this.openSession(profileKey, sessionNumber),
            };
          }
          dico[mandate] = profileKey;
        }
        return list;
      },
      {}
    );

    // Complete with opened sessions.
    const sessionList = this.props.feeds
      .filter(f => f.startsWith('feed-desktop@'))
      .map(feed => ({
        id: feed,
        text: feed,
        mandate: feed.split('@')[1],
      }))
      .toArray();

    sessionList.forEach(s => {
      if (tree[s.mandate]) {
        const session = s.id.split('@')[2];
        const sessionNumber = getSessionNumber(session);
        const profileKey = dico[s.mandate];
        const toReplace = tree[s.mandate][`${profileKey}-${sessionNumber}`];
        if (toReplace) {
          toReplace.name = session;
          toReplace.glyph = 'solid/tv';
          toReplace.closable = true;
          toReplace.onOpen = () => this.openSession(s.id);
          toReplace.onClose = () => this.closeSession(s.id);
        } else {
          tree[s.mandate][session] = {
            leaf: true,
            name: session,
            glyph: 'solid/tv',
            closable: true,
            onOpen: () => this.openSession(s.id),
            onClose: () => this.closeSession(s.id),
          };
        }
      }
    });

    return tree;
  }

  /******************************************************************************/

  render() {
    const tree = this.getTree();

    return (
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
    );
  }
}
