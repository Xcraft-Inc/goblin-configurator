import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import AppIcon from '../app-icon/widget';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Launcher from 'goblin-gadgets/widgets/launcher/widget';
import {debounce} from 'lodash';

/******************************************************************************/

function sessionToRocket(sessionKey, session) {
  let closeProps = null;
  if (session.closable) {
    const onClose = (e) => {
      e.stopPropagation();
      session.onClose(sessionKey);
    };
    closeProps = {onAdditional: onClose, additionalAnimation: 'dancing'};
  }

  const matches = session.name.match(
    /(.*)-([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  );

  return {
    id: sessionKey,
    title: matches ? matches[1] : session.name,
    subtitle: matches && matches[2],
    glyph: session.glyph,
    background: 'linear-gradient(125deg, #ff1461, #fe8506)',
    backgroundHover: 'linear-gradient(100deg, #ff1461, #fe8506)',
    onClick: session.onOpen,
    ...closeProps,
  };
}

/******************************************************************************/

export default class ConfiguratorNavigator extends Widget {
  constructor() {
    super(...arguments);
    this.launcherContainer = React.createRef();
    this.handleResize = debounce(this._handleResize, 250);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      showDetail: false,
      width: window.innerWidth,
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
  //#endregion

  /******************************************************************************/

  renderHeader() {
    return (
      <div className={this.styles.classNames.header}>
        {this.props.application}
      </div>
    );
  }

  _handleResize(e) {
    this.setState({width: e.currentTarget.innerWidth});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
    const passengerRocket = {
      id: 'passengersCount',
      title: this.props.passengers || '0',
      glyph: 'solid/plane',
      background: 'linear-gradient(125deg, #ff1461, #fe8506)',
      backgroundHover: 'linear-gradient(100deg, #ff1461, #fe8506)',
      onClick: null,
    };
    const rockets = sessions
      ? Object.entries(sessions).map(([sessionKey, session]) =>
          sessionToRocket(sessionKey, session)
        )
      : [];

    if (this.props.passengers > 0) {
      rockets.push(passengerRocket);
    }

    let size = (this.state.width - 200) / rockets.length;
    if (size > 250) {
      size = 250;
    }
    return (
      <Launcher
        title={this.props.application}
        blobKind="wave"
        blobColor="rgba(0,0,0,0.1)"
        background="linear-gradient(150deg, #011526 30%, #c853ff)"
        rocketSize={`${size}px`}
        rocketTextColor="#eee"
        rocketShadow="deep"
        rocketIconShadow="none"
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
        {this.renderLauncher()}
      </div>
    );
  }

  render() {
    if (this.props.useLauncher) {
      return this.render2();
    } else {
      return this.render1();
    }
  }
}

/******************************************************************************/
