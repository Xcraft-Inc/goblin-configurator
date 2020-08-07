import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import AppIcon from '../app-icon/widget';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

/******************************************************************************/

export default class ConfiguratorNavigator extends Widget {
  constructor() {
    super(...arguments);

    this.state = {
      selectedMandat: null,
      showDetail: false,
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

  get showDetail() {
    return this.state.showDetail;
  }

  set showDetail(value) {
    this.setState({
      showDetail: value,
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
    const style = this.selectedMandat
      ? this.styles.classNames.arrowDown
      : this.styles.classNames.arrowDownHidden;

    return (
      <div className={style}>
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

  renderDetailButton(hasDetailButton) {
    if (!hasDetailButton) {
      return null;
    }

    const style = this.showDetail
      ? this.styles.classNames.detailButtonActive
      : this.styles.classNames.detailButton;

    return (
      <div
        className={style}
        onClick={() => (this.showDetail = !this.showDetail)}
      >
        <FontAwesomeIcon icon={[`fas`, 'eye']} />
      </div>
    );
  }

  renderBoxTitle(title, isSessions) {
    return (
      <div className={this.styles.classNames.boxTitle}>
        {this.renderBackButton(isSessions)}
        {this.renderDetailButton(isSessions)}
        {title}
      </div>
    );
  }

  renderSession(sessionKey, session, index) {
    let closeProps = null;
    if (session.closable) {
      const onClose = (e) => {
        e.stopPropagation();
        session.onClose(sessionKey);
      };
      closeProps = {onClose: onClose, closable: true};
    }

    return (
      <AppIcon
        key={index}
        type="session"
        text={session.name}
        glyph={session.glyph}
        showDetail={this.showDetail}
        config={session.config}
        onClick={session.onOpen}
        {...closeProps}
      />
    );
  }

  renderSessions(sessions) {
    return (
      <div className={this.styles.classNames.boxContent}>
        {sessions
          ? Object.entries(sessions).map(([sessionKey, session], index) =>
              this.renderSession(sessionKey, session, index)
            )
          : null}
      </div>
    );
  }

  renderSessionsBox() {
    const sessions = this.props.tree[this.selectedMandat];
    const style = sessions
      ? this.styles.classNames.box
      : this.styles.classNames.boxHidden;

    return (
      <div className={style}>
        {this.renderBoxTitle('Sessions', true)}
        {this.renderSessions(sessions)}
      </div>
    );
  }

  renderMandate(mandateKey, mandate, index) {
    const active = mandateKey === this.selectedMandat;

    return (
      <AppIcon
        key={index}
        type="mandate"
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

  renderMandates() {
    return (
      <div className={this.styles.classNames.boxContent}>
        {Object.entries(this.props.tree).map(([mandateKey, mandate], index) =>
          this.renderMandate(mandateKey, mandate, index)
        )}
      </div>
    );
  }

  renderMandatsBox() {
    return (
      <React.Fragment>
        <div className={this.styles.classNames.box}>
          {this.renderBoxTitle('Mandats', false)}
          {this.renderMandates()}
        </div>
        {this.renderArrowDown()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={this.styles.classNames.configuratorNavigator}>
        {this.renderHeader()}
        <div className={this.styles.classNames.content}>
          <div className={this.styles.classNames.contentScrollable}>
            {this.renderMandatsBox()}
            {this.renderSessionsBox()}
          </div>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
