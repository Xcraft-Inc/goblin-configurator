import React from 'react';
import Widget from 'laboratory/widget';
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
    this.doAs('configurator', 'change-form.session', {
      newValue: this.props.session.replace('-2', ''),
    });
  }

  onSessionTwo() {
    this.doAs('configurator', 'change-form.session', {
      newValue: this.props.session + '-2',
    });
  }

  /******************************************************************************/

  renderHeader(session) {
    return (
      <div className={this.styles.classNames.header}>
        <Label
          width="200px"
          text={session}
          glyph="solid/tv"
          glyphPosition="center"
          glyphSize="100%"
        />
        <Button
          width="120px"
          kind="action"
          place="1/2"
          justify="center"
          text="1"
          glyph={!session.endsWith('-2') ? 'solid/check' : null}
          onClick={this.onSessionOne}
          horizontalSpacing="tiny"
        />
        <Button
          width="120px"
          kind="action"
          place="2/2"
          justify="center"
          text="2"
          glyph={session.endsWith('-2') ? 'solid/check' : null}
          onClick={this.onSessionTwo}
        />
      </div>
    );
  }

  renderContent() {
    return (
      <div className={this.styles.classNames.content}>
        {this.props.children}
      </div>
    );
  }

  renderFooter_WITHOUTCLOCK(info, showProfileInfo) {
    return (
      <div className={this.styles.classNames.footer}>
        <Label text={new Date().toLocaleString('fr-CH').split(' ')[0]} />
        <Label text={info} />
        {showProfileInfo ? <ProfileInfo id={this.props.id} /> : null}
      </div>
    );
  }

  renderFooter(info, showProfileInfo) {
    return (
      <div className={this.styles.classNames.footer}>
        <Label text={new Date().toLocaleString('fr-CH').split(' ')[0]} />
        <Clock widgetId={this.props.id + '$clock'} />
        <Label text={info} />
        {showProfileInfo ? <ProfileInfo id={this.props.id} /> : null}
      </div>
    );
  }

  render() {
    const {session, info, showProfileInfo} = this.props;

    return (
      <div className={this.styles.classNames.mainLayout}>
        {this.renderHeader(session)}
        {this.renderContent()}
        {this.renderFooter(info, showProfileInfo)}
      </div>
    );
  }
}

/******************************************************************************/

export default Widget.connectBackend(state => {
  const session = state.get('form.session');
  const username = state.get('form.username');
  return {session, username};
})(MainLayout);
