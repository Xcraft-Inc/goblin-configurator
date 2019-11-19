import React from 'react';
import Widget from 'laboratory/widget';
import AppIcon from '../app-icon/widget';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

/******************************************************************************/

class IconNavigator extends Widget {
  constructor() {
    super(...arguments);
    this.select = this.select.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  select(ico) {
    this.dispatchTo(this.widgetId, {
      type: 'SELECT',
      selected: ico,
    });
    if (this.props.onLeafSelect) {
      this.props.onLeafSelect(this.props.data.value);
    }
  }

  open(e) {
    e.stopPropagation();
    if (this.props.parent) {
      this.dispatchTo(this.props.parent, {
        type: 'SCOPE',
        target: this.props.dataId,
      });
      if (this.props.onScope) {
        this.props.onScope(this.props.data);
      }
    } else {
      this.dispatchTo(this.widgetId, {
        type: 'OPEN',
      });
    }
  }

  close(e) {
    e.stopPropagation();
    this.dispatchTo(this.widgetId, {
      type: 'CLOSE',
    });
    if (this.props.parent) {
      this.dispatchTo(this.props.parent, {
        type: 'OPEN',
      });
    }
  }

  /******************************************************************************/

  renderFirstHeader() {
    if (this.props.level !== 0) {
      return null;
    }

    const title = 'Applications';
    return <div className={this.styles.classNames.headerFirst}>{title}</div>;
  }

  renderHeader() {
    if (this.props.flow !== 'opened') {
      return null;
    }

    let title;
    switch (this.props.level) {
      case -1:
        title = 'Applications';
        break;
      case 0:
        title = 'Mandats';
        break;
      case 1:
        title = 'Sessions';
        break;
    }

    return <div className={this.styles.classNames.header}>{title}</div>;
  }

  renderClosedNode() {
    const glyph = this.props.level === 0 ? 'solid/cube' : 'solid/database';

    return (
      <div className={this.styles.classNames.iconNavigator}>
        {this.renderFirstHeader()}
        <AppIcon text={this.props.text} glyph={glyph} onClick={this.open} />
      </div>
    );
  }

  renderClosedLeaf() {
    let closeProps = null;
    if (this.props.data.closable) {
      const onClose = e => {
        e.stopPropagation();
        this.props.data.onClose(this.props.data.value);
      };
      closeProps = {onClose: onClose, closable: true};
    }

    return (
      <div className={this.styles.classNames.iconNavigator}>
        <AppIcon
          text={this.props.text}
          glyph={this.props.data.glyph}
          onClick={this.select}
          {...closeProps}
        />
      </div>
    );
  }

  renderClosed() {
    if (this.props.scoped) {
      this.dispatchTo(this.widgetId, {
        type: 'OPEN',
      });
    }

    if (this.props.data.leaf) {
      return this.renderClosedLeaf();
    } else {
      return this.renderClosedNode();
    }
  }

  renderOpenedLeaf() {
    return (
      <div className={this.styles.classNames.iconNavigator}>
        <AppIcon text={this.props.data} glyph={this.props.data.glyph} />
      </div>
    );
  }

  renderBack() {
    if (this.props.scoped === false) {
      return null;
    }

    let title;
    switch (this.props.level) {
      case 0:
        title = 'Application';
        break;
      case 1:
        title = 'Mandat';
        break;
      case 2:
        title = 'Session';
        break;
    }

    title += ' — ';
    title += this.props.text;
    title += ` flow=${this.props.flow} scoped=${this.props.scoped}`;

    return (
      <div className={this.styles.classNames.back}>
        <div className={this.styles.classNames.backButton} onClick={this.close}>
          <FontAwesomeIcon icon={[`fas`, 'chevron-up']} />
        </div>
        <div className={this.styles.classNames.backText}>{title}</div>
      </div>
    );
  }

  renderOpenedNode() {
    const style =
      this.props.flow === 'opened'
        ? this.styles.classNames.contentOpened
        : this.styles.classNames.content;

    return (
      <div className={this.styles.classNames.iconNavigator}>
        {this.renderBack()}
        {this.renderHeader()}
        <div className={style}>
          {Object.entries(this.props.data).map(([id, data], i) => {
            return (
              <CIconNavigator
                key={i}
                dataId={id}
                configuratorId={this.props.configuratorId}
                widgetId={`${this.props.configuratorId}$icon-navigator@${id}`}
                text={id}
                data={data}
                parent={this.widgetId}
                scoped={this.props.target === id}
                parentFlow={this.props.flow}
                level={this.props.level + 1}
                onLeafSelect={this.props.onLeafSelect}
                onScope={this.props.onScope}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderOpened() {
    if (this.props.data.leaf) {
      return this.renderOpenedLeaf();
    } else {
      return this.renderOpenedNode();
    }
  }

  render() {
    if (
      this.props.parentFlow &&
      this.props.parentFlow === 'scoped' &&
      this.props.level > 0 &&
      !this.props.scoped
    ) {
      return null;
    }

    switch (this.props.flow) {
      default:
      case 'closed':
        return this.renderClosed();
      case 'scoped':
      case 'opened':
        return this.renderOpened();
    }
  }
}

/******************************************************************************/

const CIconNavigator = Widget.connectWidget(state => {
  return {
    flow: state ? state.get('flow') : 'loading',
    target: state ? state.get('target') : null,
  };
})(IconNavigator);

export default CIconNavigator;
