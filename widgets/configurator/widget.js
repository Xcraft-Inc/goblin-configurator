//T:2019-02-27
import React from 'react';
import Form from 'laboratory/form';

import Container from 'gadgets/container/widget';
import Button from 'gadgets/button/widget';
import Label from 'gadgets/label/widget';
import TextFieldCombo from 'gadgets/text-field-combo/widget';
import LabelTextField from 'gadgets/label-text-field/widget';
import Separator from 'gadgets/separator/widget';

class Configurator extends Form {
  constructor() {
    super(...arguments);
    this.onContinue = this.onContinue.bind(this);
    this.getDisplayValue = this.getDisplayValue.bind(this);
  }

  static get wiring() {
    return {
      id: 'id',
    };
  }

  onContinue() {
    this.submit();
  }

  getDisplayValue(value) {
    return this.getModelValue(`.profiles.${value}.name`);
  }

  render() {
    const {id} = this.props;

    if (!id) {
      return null;
    }
    const mapBusyContainer = this.getWidgetToFormMapper(Container, 'busy');
    const BusyContent = mapBusyContainer('.form.busy');
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

    const ProfileInfo = buildProfile('.current');

    const list = this.getModelValue('.profiles')
      .map((profile, key) => ({
        text: profile.get('name'),
        value: key,
      }))
      .toArray();

    const Form = this.Form;
    return (
      <Container kind="root">
        <Container kind="right">
          <Container kind="content">
            <Form {...this.formConfig}>
              <Container kind="floating-header" floatingHeight="350px">
                <Label glyph="solid/sign-in-alt" kind="floating-header" />
              </Container>
              <BusyContent kind="floating" width="400px" height="350px">
                <Container kind="row-pane">
                  <Label text="dev-mode" grow="1" kind="big-center" />
                </Container>
                <Separator kind="space" height="30px" />
                <Container kind="row-pane">
                  <Label glyph="solid/database" spacing="overlap" />
                  <TextFieldCombo
                    model=".form.profile"
                    readonly="false"
                    grow="1"
                    list={list}
                    menuType="wrap"
                    defaultValue={this.getModelValue('.form.profile')}
                    comboTextTransform="none"
                    onSetText={text => {
                      this.setModelValue('.form.profile', text);
                    }}
                    getDisplayValue={this.getDisplayValue}
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
              <Container kind="floating-footer" height="100px">
                <Separator width="300px" kind="floating-footer" />
                <Label text={'Crésus — EPSITEC SA'} kind="floating-footer" />
              </Container>
            </Form>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default Configurator;
