//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';
import MouseTrap from 'mousetrap';
import MainLayout from '../main-layout/widget';
import IconNavigator from '../icon-navigator/widget';

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

  openSession(selection) {
    console.log('OPEN SESSION', selection);
    this.do('open-session', {selection});
  }

  closeSession(selection) {
    console.log('CLOSE SESSION', selection);
    this.do('close-session', {selection});
  }

  scopeInfo(selection) {
    console.log('SCOPE INFO', selection);
    this.do('change-form.profile', {newValue: Object.entries(selection)[0][1]});
  }

  /******************************************************************************/

  render() {
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
