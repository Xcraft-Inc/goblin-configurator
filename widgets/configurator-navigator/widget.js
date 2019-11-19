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

    this.selectMandat = this.selectMandat.bind(this);
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

  selectMandat(mandateKey) {
    this.selectMandat = mandateKey;
  }

  /******************************************************************************/

  renderBoxTitle(title) {
    return <div className={this.styles.classNames.boxTitle}>{title}</div>;
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
      <div className={this.styles.classNames.box}>
        {this.renderBoxTitle('Sessions')}
        {this.renderSessions(sessions)}
      </div>
    );
  }

  renderMandat(mandateKey, mandat, index) {
    return (
      <AppIcon
        key={index}
        text={mandateKey}
        glyph="solid/database"
        onClick={() => (this.selectedMandat = mandateKey)}
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
    if (this.selectedMandat) {
      const title = `Mandat — ${this.selectedMandat}`;

      return (
        <div className={this.styles.classNames.back}>
          <div
            className={this.styles.classNames.backButton}
            onClick={() => (this.selectedMandat = null)}
          >
            <FontAwesomeIcon icon={[`fas`, 'chevron-up']} />
          </div>
          <div className={this.styles.classNames.backText}>{title}</div>
        </div>
      );
    } else {
      return (
        <div className={this.styles.classNames.box}>
          {this.renderBoxTitle('Mandats')}
          {this.renderMandats()}
        </div>
      );
    }
  }

  render() {
    return (
      <div className={this.styles.classNames.configuratorNavigator}>
        {this.renderMandatsBox()}
        {this.renderSessionsBox()}
      </div>
    );
  }
}

/******************************************************************************/
