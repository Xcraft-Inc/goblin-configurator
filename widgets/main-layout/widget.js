import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
import ProfileInfo from '../profile-info/widget';
import Clock from '../clock/widget';

/******************************************************************************/

class MainLayout extends Widget {
  constructor() {
    super(...arguments);
  }

  /******************************************************************************/

  renderHeader(username) {
    return (
      <div className={this.styles.classNames.header}>
        <Label
          width="200px"
          text={username}
          glyph="solid/tv"
          glyphPosition="center"
          glyphSize="100%"
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
    const {username, info, showProfileInfo} = this.props;

    return (
      <div className={this.styles.classNames.mainLayout}>
        {this.renderHeader(username)}
        {this.renderContent()}
        {this.renderFooter(info, showProfileInfo)}
      </div>
    );
  }
}

/******************************************************************************/

export default Widget.connectBackend(state => {
  const username = state.get('form.username');
  return {username};
})(MainLayout);
