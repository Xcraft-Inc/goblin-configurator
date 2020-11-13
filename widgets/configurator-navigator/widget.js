import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import AppIcon from '../app-icon/widget';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from 'goblin-gadgets/widgets/button/widget';
import Launcher from 'goblin-gadgets/widgets/launcher/widget';

/******************************************************************************/

export default class ConfiguratorNavigator extends Widget {
  constructor() {
    super(...arguments);

    this.state = {
      showDetail: false,
      useLauncher: true,
    };
  }

  //#region get/set
  get showDetail() {
    return this.state.showDetail;
  }
  set showDetail(value) {
    this.setState({
      showDetail: value,
    });
  }

  get useLauncher() {
    return this.state.useLauncher;
  }
  set useLauncher(value) {
    this.setState({
      useLauncher: value,
    });
  }
  //#endregion

  /******************************************************************************/

  renderHeader() {
    return (
      <div className={this.styles.classNames.header}>
        {this.props.application}
        <div className={this.styles.classNames.headerButton}>
          <Button
            border="none"
            shape="rounded"
            width="60px"
            height="60px"
            glyph="solid/rocket"
            onClick={() => (this.useLauncher = !this.useLauncher)}
          />
        </div>
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
    const sessions = this.props.tree;
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

  renderLauncher() {
    const sessions = this.props.tree;
    const rockets = sessions
      ? Object.entries(sessions).map(([sessionKey, session], index) => {
          return {
            id: sessionKey,
            title: session.name,
            glyph: session.glyph,
            textColor: '#eee',
            background: 'linear-gradient(125deg, #e6316e, #fe8506)',
            backgroundHover: 'linear-gradient(90deg, #e6316e, #fe8506)',
            shadow: 'light',
            iconShadow: 'none',
            onClick: session.onOpen,
          };
        })
      : null;

    return (
      <Launcher
        blobKind="wave"
        blobColor="rgba(0,0,0,0.1)"
        background="linear-gradient(150deg, #011526 30%, #c853ff)"
        rocketSize="200px"
        rockets={rockets}
      />
    );
  }

  render1() {
    return (
      <div className={this.styles.classNames.configuratorNavigator}>
        {this.renderHeader()}
        <div className={this.styles.classNames.content}>
          <div className={this.styles.classNames.contentScrollable}>
            {this.renderSessionsBox()}
          </div>
        </div>
      </div>
    );
  }

  render2() {
    return (
      <div className={this.styles.classNames.configuratorNavigator}>
        {this.renderHeader()}
        <div className={this.styles.classNames.launcher}>
          {this.renderLauncher()}
        </div>
      </div>
    );
  }

  render() {
    if (this.useLauncher) {
      return this.render2();
    } else {
      return this.render1();
    }
  }
}

/******************************************************************************/
