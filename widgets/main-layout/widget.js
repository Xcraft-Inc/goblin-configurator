import React from 'react';
import Widget from 'laboratory/widget';
import Container from 'gadgets/container/widget';
import Label from 'gadgets/label/widget';
import ProfileInfo from '../profile-info/widget';
import Clock from '../clock/widget';
/******************************************************************************/

class MainLayout extends Widget {
  render() {
    const {session, showProfileInfo} = this.props;

    return (
      <div className={this.styles.classNames.background}>
        <div className={this.styles.classNames.titleBar}>
          <Label kind="big-center" text={`💻${session}`} />
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
