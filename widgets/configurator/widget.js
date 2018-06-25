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
  }

  static get wiring() {
    return {
      id: 'id',
    };
  }

  onContinue() {
    this.submit();
  }

  render() {
    const {id} = this.props;

    if (!id) {
      return null;
    }
    const mapBusyContainer = this.getWidgetToFormMapper(Container, 'busy');
    const BusyContent = mapBusyContainer('.form.busy');
    const buildProfile = this.WithModel(Label, current => {
      return {
        text: `Configuration choisie: 
        Application URL: ${current.get('applicationBusUrl')}
        Elasticsearch URL: ${current.get('elasticsearchUrl')}
        RethinkDB URL: ${current.get('rethinkdbHost')}
        Reset data: ${current.get('reset')}`,
      };
    });

    const ProfileInfo = buildProfile('.current');

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
                  <Label glyph="solid/flask" spacing="overlap" />
                  <TextFieldCombo
                    model=".form.profile"
                    readonly="false"
                    grow="1"
                    list={this.getModelValue('.available').toArray()}
                    menuType="wrap"
                    defaultValue={this.getModelValue('.form.profile')}
                    comboTextTransform="none"
                    onSetText={text => {
                      this.setModelValue('.form.profile', text);
                    }}
                  />
                </Container>
                <Separator kind="space" height="1px" />
                <Container kind="row-pane">
                  <Label glyph="solid/language" spacing="overlap" />
                  <TextFieldCombo
                    model=".form.locale"
                    readonly="false"
                    grow="1"
                    list={this.getModelValue('.locales').toArray()}
                    menuType="wrap"
                    defaultValue={this.getModelValue('.form.locale')}
                    comboTextTransform="none"
                    onSetText={text => {
                      this.setModelValue('.form.locale', text);
                    }}
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
                    text="Continuer"
                    grow="1"
                    kind="action"
                    justify="center"
                    place="single"
                  />
                </Container>
              </BusyContent>
              <Container kind="floating-footer" height="100px">
                <Separator width="300px" kind="floating-footer" />
                <Label text="Crésus — EPSITEC SA" kind="floating-footer" />
              </Container>
            </Form>
          </Container>
        </Container>
      </Container>
    );
  }
}

export default Configurator;
