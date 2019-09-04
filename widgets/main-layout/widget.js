import React from 'react';
import Widget from 'laboratory/widget';
import Container from 'gadgets/container/widget';
import Button from 'gadgets/button/widget';
import Label from 'gadgets/label/widget';
import ProfileInfo from '../profile-info/widget';
import Clock from '../clock/widget';

/******************************************************************************/

class MainLayout extends Widget {
  constructor() {
    super(...arguments);
    this.onSessionOne = this.onSessionOne.bind(this);
    this.onSessionTwo = this.onSessionTwo.bind(this);
  }

  onSessionOne() {
    this.doAs('configurator', 'change-form.username', {
      newValue: this.props.session.replace('-2', ''),
    });
  }

  onSessionTwo() {
    this.doAs('configurator', 'change-form.username', {
      newValue: this.props.session + '-2',
    });
  }

  render() {
    const {session, showProfileInfo} = this.props;

    return (
      <div className={this.styles.classNames.background}>
        <div className={this.styles.classNames.titleBar}>
          <Container kind="row-pane">
            <Container kind="column-full">
              <Label
                kind="big-center"
                text={session}
                glyph="solid/tv"
                glyphPosition="center"
                glyphSize="100%"
              />
            </Container>
            <Container kind="column-full">
              <Button
                text="💻1"
                width="200px"
                kind="button-notification"
                onClick={this.onSessionOne}
                disabled={!session.endsWith('-2')}
              />
              <Button
                text="💻2"
                width="200px"
                kind="button-notification"
                onClick={this.onSessionTwo}
                disabled={session.endsWith('-2')}
              />
            </Container>
          </Container>
        </div>
        {this.props.children}
        <div className={this.styles.classNames.statusBar}>
          <Container kind="row-pane">
            <Container kind="column-full">
              <Label
                kind="big-center"
                text={new Date().toLocaleString('fr-CH').split(' ')[0]}
              />
            </Container>
            <Container kind="column-full"></Container>
            <Container kind="column-full">
              <Clock widgetId={this.props.id + '$clock'} />
            </Container>
          </Container>
          {showProfileInfo ? <ProfileInfo id={this.props.id} /> : null}
        </div>
      </div>
    );
  }
}

export default Widget.connectBackend(state => {
  const session = state.get('form.username');
  return {session};
})(MainLayout);
