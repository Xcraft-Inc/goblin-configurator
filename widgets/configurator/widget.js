//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';
import MouseTrap from 'mousetrap';
import MainLayout from '../main-layout/widget';
import IconNavigator from '../icon-navigator/widget';

class Configurator extends Form {
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

  componentDidMount() {
    MouseTrap.bind('ctrl+k', this.onToggleAdvanced);
  }

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
      list[m][p.get('name')] = {leaf: true, value: id, glyph: 'solid/plus'};
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
      <MainLayout id={id}>
        <div className={this.styles.classNames.main}>
          <div className={this.styles.classNames.left}>
            <IconNavigator
              widgetId={`${id}$icon-navigator`}
              text={this.getModelValue('.mainGoblin')}
              data={byMandate}
              onLeafSelect={this.openSession}
              onScope={this.scopeInfo}
            ></IconNavigator>
          </div>
        </div>
      </MainLayout>
    );
    /*const Form = this.Form;
    return (
      <Container kind="root">
        <Container kind="right">
          <Container kind="content">
            <Form {...this.formConfig}>
              <Container
                width="400px"
                height="350px"
                kind="configurator-header"
              >
                <Label glyph="solid/sign-in-alt" kind="floating-header" />
              </Container>
              <BusyContent
                kind="configurator-content"
                width="400px"
                height="350px"
              >
                <Container kind="row-pane">
                  <Label text="dev-mode" grow="1" kind="big-center" />
                </Container>
                <Separator kind="space" height="30px" />
                <Container kind="row-pane">
                  <Label glyph="solid/user" horizontalSpacing="overlap" />
                  <TextFieldCombo
                    grow="1"
                    selectedId={C('.form.session')}
                    list={feedList}
                    menuType="wrap"
                    comboTextTransform="none"
                  />
                </Container>
                <Container kind="row-pane">
                  <Label glyph="solid/database" horizontalSpacing="overlap" />
                  <TextFieldCombo
                    selectedId={C('.form.profile')}
                    grow="1"
                    list={list}
                    menuType="wrap"
                    comboTextTransform="none"
                  />
                </Container>
                <Separator kind="space" height="1px" />
                <Container kind="row-pane">
                  <LabelTextField
                    labelGlyph="solid/user"
                    model=".form.username"
                    grow="1"
                  />
                </Container>
                <Separator kind="space" height="30px" />
                <ProfileInfo />
                <Separator kind="space" height="50px" />
                <Container kind="row-pane">
                  <Button
                    onClick={this.onContinue}
                    text={'Continuer'}
                    grow="1"
                    kind="action"
                    justify="center"
                    place="single"
                  />
                </Container>
              </BusyContent>
              <Container
                kind="configurator-footer"
                height="100px"
                width="400px"
              >
                <Separator width="300px" kind="floating-footer" />
                <Label text={'Crésus — EPSITEC SA'} kind="floating-footer" />
              </Container>
            </Form>
          </Container>
        </Container>
      </Container>
    );*/
  }
}

export default Configurator;
