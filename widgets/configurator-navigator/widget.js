import React from 'react';
import Widget from 'laboratory/widget';
import AppIcon from '../app-icon/widget';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

/******************************************************************************/

export default class ConfiguratorNavigator extends Widget {
  constructor() {
    super(...arguments);

    this.state = {
      selectedMandat: null,
    };
  }

  //#region get/set
  get selectedMandat() {
    return this.state.selectedMandat;
  }

  set selectedMandat(value) {
    this.setState({
      selectedMandat: value,
    });
  }
  //#endregion

  /******************************************************************************/

  renderHeader() {
    return (
      <div className={this.styles.classNames.header}>
        {this.props.application}
      </div>
    );
  }

  renderArrowDown() {
    return (
      <div className={this.styles.classNames.arrowDown}>
        <div className={this.styles.classNames.triangle} />
      </div>
    );
  }

  renderBackButton(hasBackButton) {
    if (!hasBackButton) {
      return null;
    }

    return (
      <div
        className={this.styles.classNames.backButton}
        onClick={() => (this.selectedMandat = null)}
      >
        <FontAwesomeIcon icon={[`fas`, 'chevron-up']} />
      </div>
    );
  }

  renderBoxTitle(title, hasBackButton) {
    return (
      <div className={this.styles.classNames.boxTitle}>
        {this.renderBackButton(hasBackButton)}
        {title}
      </div>
    );
  }

  renderSession(sessionKey, session, index) {
    let closeProps = null;
    if (session.closable) {
      const onClose = e => {
        e.stopPropagation();
        session.onClose(sessionKey);
      };
      closeProps = {onClose: onClose, closable: true};
    }

    return (
      <AppIcon
        key={index}
        text={session.name}
        glyph={session.glyph}
        onClick={session.onOpen}
        {...closeProps}
      />
    );
  }

  renderSessions(sessions) {
    return (
      <div className={this.styles.classNames.boxContent}>
        {Object.entries(sessions).map(([sessionKey, session], index) =>
          this.renderSession(sessionKey, session, index)
        )}
      </div>
    );
  }

  renderSessionsBox() {
    const sessions = this.props.tree[this.selectedMandat];
    if (!sessions) {
      return null;
    }

    return (
      <React.Fragment>
        {this.renderArrowDown()}
        <div className={this.styles.classNames.box}>
          {this.renderBoxTitle('Sessions', true)}
          {this.renderSessions(sessions)}
        </div>
      </React.Fragment>
    );
  }

  renderMandat(mandateKey, mandat, index) {
    const active = mandateKey === this.selectedMandat;

    return (
      <AppIcon
        key={index}
        text={mandateKey}
        glyph="solid/database"
        active={active}
        onClick={() => {
          if (this.selectedMandat === mandateKey) {
            this.selectedMandat = null;
          } else {
            this.selectedMandat = mandateKey;
          }
        }}
      />
    );
  }

  renderMandats() {
    return (
      <div className={this.styles.classNames.boxContent}>
        {Object.entries(this.props.tree).map(([mandateKey, mandat], index) =>
          this.renderMandat(mandateKey, mandat, index)
        )}
      </div>
    );
  }

  renderMandatsBox() {
    return (
      <div className={this.styles.classNames.box}>
        {this.renderBoxTitle('Mandats', false)}
        {this.renderMandats()}
      </div>
    );
  }

  render() {
    return (
      <div className={this.styles.classNames.configuratorNavigator}>
        {this.renderHeader()}
        <div className={this.styles.classNames.content}>
          {this.renderMandatsBox()}
          {this.renderSessionsBox()}
        </div>
      </div>
    );
  }
}

/******************************************************************************/
