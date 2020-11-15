import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import Label from 'goblin-gadgets/widgets/label/widget';
import Button from 'goblin-gadgets/widgets/button/widget';
import Clock from '../clock/widget';

/******************************************************************************/

class MainLayout extends Widget {
  constructor() {
    super(...arguments);
  }

  // Use this line in app.json:
  // "buildInfo": "Warning: developer release, press ctrl+k for advanced mode",
  get isDeveloper() {
    return this.props.info ? this.props.info.includes('ctrl+k') : false;
  }

  /******************************************************************************/

  renderHeader() {
    return (
      <div className={this.styles.classNames.header}>
        <Label
          width="200px"
          text={this.props.username}
          glyph="solid/user"
          glyphPosition="center"
          glyphSize="150%"
        />
        <Label grow="1" />
        <Label text={this.props.info} />
        {this.isDeveloper ? (
          <Button
            width="50px"
            height="50px"
            horizontalSpacing="tiny"
            border="none"
            active={this.props.advanced}
            glyph="solid/bug"
            glyphSize="150%"
            onClick={this.props.onToggleAdvanced}
          />
        ) : null}
        {this.isDeveloper ? (
          <Button
            width="50px"
            height="50px"
            border="none"
            glyph="solid/industry"
            glyphSize="150%"
            onClick={this.props.onBuild}
          />
        ) : null}
        {this.isDeveloper ? (
          <Button
            width="50px"
            height="50px"
            border="none"
            glyph="solid/rocket"
            glyphSize="150%"
            onClick={this.props.onToggleLauncher}
          />
        ) : null}
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

  renderFooter_WITHOUTCLOCK() {
    return (
      <div className={this.styles.classNames.footer}>
        <Label text={new Date().toLocaleString('fr-CH').split(' ')[0]} />
      </div>
    );
  }

  renderFooter() {
    return (
      <div className={this.styles.classNames.footer}>
        <Label text={new Date().toLocaleString('fr-CH').split(' ')[0]} />
        <Clock widgetId={this.props.id + '$clock'} />
      </div>
    );
  }

  render() {
    return (
      <div className={this.styles.classNames.mainLayout}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}

/******************************************************************************/

export default Widget.connectBackend((state) => {
  const username = state.get('form.username');
  return {username};
})(MainLayout);
