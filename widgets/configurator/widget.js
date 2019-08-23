//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';

import Container from 'gadgets/container/widget';
import Button from 'gadgets/button/widget';
import Label from 'gadgets/label/widget';
import TextFieldCombo from 'goblin-gadgets/widgets/text-field-combo/widget';
import LabelTextField from 'gadgets/label-text-field/widget';
import Separator from 'gadgets/separator/widget';
import C from 'goblin-laboratory/widgets/connect-helpers/c';
import GradientBg from '../gradient-bg/widget';
import IconNavigator from '../icon-navigator/widget';

class Configurator extends Form {
  constructor() {
    super(...arguments);
    this.onContinue = this.onContinue.bind(this);
    this.openSession = this.openSession.bind(this);
  }

  static get wiring() {
    return {
      id: 'id',
    };
  }

  onContinue() {
    this.submit();
  }

  openSession(selection) {
    this.do('open-session', {selection});
  }

  render() {
    const {id} = this.props;

    if (!id) {
      return null;
    }

    const buildProfile = this.WithModel(Label, current => {
      const text =
        '```' +
        'Settings\n' +
        `* Elasticsearch URL = **\`${current.get('elasticsearchUrl')}\`**\n` +
        `* Reset data = **\`${current.get('rethinkdbHost')}\`**\n` +
        `* Reset data = **\`${current.get('reset')}\`**\n` +
        `* Mandate = **\`${current.get('mandate')}\`**` +
        '```';
      return {text};
    });

    const sessionList = this.getModelValue('.feeds')
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
      if (t) {
        m = `${m}@${t}`;
      }
      if (!list[m]) {
        list[m] = {};
      }
      list[m][p.get('name')] = id;
      return list;
    }, {});

    sessionList.forEach(s => {
      if (byMandate[s.mandate]) {
        const session = s.id.split('@')[2];
        byMandate[s.mandate][session] = s.id;
      }
    });

    return (
      <GradientBg>
        <IconNavigator
          widgetId={`${id}$icon-navigator`}
          text={'POLYPHEME-DEV'}
          data={byMandate}
          onLeafSelect={this.openSession}
        ></IconNavigator>
      </GradientBg>
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
