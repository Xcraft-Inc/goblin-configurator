//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';
import MouseTrap from 'mousetrap';
import MainLayout from '../main-layout/widget';
import IconNavigator from '../icon-navigator/widget';
import ConfiguratorNavigator from '../configurator-navigator/widget';

/******************************************************************************/

export default class Configurator extends Form {
  constructor() {
    super(...arguments);

    this.onContinue = this.onContinue.bind(this);
    this.onToggleAdvanced = this.onToggleAdvanced.bind(this);
    this.openSession = this.openSession.bind(this);
    this.scopeInfo = this.scopeInfo.bind(this);
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

  onContinue() {
    this.submit();
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

  scopeInfo(selection) {
    console.log('SCOPE INFO', selection);
    this.do('change-form.profile', {newValue: Object.entries(selection)[0][1]});
  }

  // Return a tree with 2 levels: mandats and sessions.
  getTree() {
    const {id, feeds, advanced} = this.props;

    if (!id) {
      return null;
    }

    // Add all profiles.
    const tree = this.getModelValue('.profiles').reduce(
      (list, profile, profileKey) => {
        const name = profile.get('name');
        const topology = profile.get('topology', null);
        let mandate = profile.get('mandate');
        const isReset = profile.get('reset');

        if (!advanced && isReset) {
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
            value: profileKey,
            glyph: 'solid/trash',
            onOpen: () => this.openSession(profileKey),
          };
        } else {
          for (let sessionNumber = 1; sessionNumber <= 3; sessionNumber++) {
            const key = `${profileKey}-${sessionNumber}`;
            list[mandate][key] = {
              leaf: true,
              value: profileKey,
              name: key,
              glyph: 'solid/plus',
              onOpen: () => this.openSession(profileKey, sessionNumber),
            };
          }
        }
        return list;
      },
      {}
    );

    // Complete with opened sessions.
    const sessionList = feeds
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
        tree[s.mandate][session] = {
          leaf: true,
          name: session,
          value: s.id,
          glyph: 'solid/tv',
          closable: true,
          onOpen: () => this.openSession(s.id),
          onClose: () => this.closeSession(s.id),
        };
      }
    });

    return tree;
  }

  /******************************************************************************/

  render() {
    const tree = this.getTree();

    return (
      <MainLayout id={this.props.id} info={this.getModelValue('.buildInfo')}>
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

  render_OLD() {
    const {id, feeds, advanced} = this.props;

    if (!id) {
      return null;
    }

    const sessionList = feeds
      .filter(f => f.startsWith('feed-desktop@'))
      .map(feed => ({
        id: feed,
        text: feed,
        mandate: feed.split('@')[1],
      }))
      .toArray();

    const byMandate = this.getModelValue('.profiles').reduce((list, p, id) => {
      const t = p.get('topology', null);
      let m = p.get('mandate');
      const isReset = p.get('reset');
      if (!advanced && isReset) {
        return list;
      }
      if (t) {
        m = `${m}@${t}`;
      }
      if (!list[m]) {
        list[m] = {};
      }
      list[m][p.get('name')] = {
        leaf: true,
        value: id,
        glyph: isReset ? 'solid/trash' : 'solid/eye',
      };
      return list;
    }, {});

    sessionList.forEach(s => {
      if (byMandate[s.mandate]) {
        const session = s.id.split('@')[2];
        byMandate[s.mandate][session] = {
          leaf: true,
          value: s.id,
          glyph: 'solid/tv',
          closable: true,
          onClose: this.closeSession,
        };
      }
    });

    return (
      <MainLayout id={id} info={this.getModelValue('.buildInfo')}>
        <div className={this.styles.classNames.configurator}>
          <IconNavigator
            configuratorId={id}
            widgetId={`${id}$icon-navigator`}
            text={this.getModelValue('.mainGoblin')}
            data={byMandate}
            level={0}
            onLeafSelect={this.openSession}
            onScope={this.scopeInfo}
          ></IconNavigator>
        </div>
      </MainLayout>
    );
  }
}
