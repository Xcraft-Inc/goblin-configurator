import React from 'react';
import Widget from 'laboratory/widget';
import AppIcon from '../app-icon/widget';
import Label from 'gadgets/label/widget';

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
    const {parent} = this.props;
    if (parent) {
      this.dispatchTo(parent, {
        type: 'SCOPE',
        target: this.widgetId.replace('$icon-navigator', ''),
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
    const {parent} = this.props;
    this.dispatchTo(this.widgetId, {
      type: 'CLOSE',
    });
    if (parent) {
      this.dispatchTo(parent, {
        type: 'OPEN',
      });
    }
  }

  /******************************************************************************/

  renderHeader(title) {
    const {level = 0} = this.props;

    return (
      <div className={this.styles.classNames.header}>
        <Label text={`${title} level=${level}`} />
      </div>
    );
  }

  renderClosedNode() {
    const {text, level = 0} = this.props;

    const glyph = level === 0 ? 'solid/cube' : 'solid/database';

    return (
      <div className={this.styles.classNames.iconNavigator}>
        {this.renderHeader('Closed-node')}
        <AppIcon text={text} glyph={glyph} onClick={this.open} />
      </div>
    );
  }

  renderClosedLeaf() {
    const {text, data} = this.props;

    let closeProps = null;
    if (data.closable) {
      const onClose = e => {
        e.stopPropagation();
        data.onClose(data.value);
      };
      closeProps = {onClose: onClose, closable: true};
    }

    return (
      <div className={this.styles.classNames.iconNavigator}>
        {this.renderHeader('Closed-leaf')}
        <AppIcon
          text={text}
          glyph={data.glyph}
          onClick={this.select}
          {...closeProps}
        />
      </div>
    );
  }

  renderClosed() {
    const {data, scoped} = this.props;

    if (scoped) {
      this.dispatchTo(this.widgetId, {
        type: 'OPEN',
      });
    }

    if (data.leaf) {
      return this.renderClosedLeaf();
    } else {
      return this.renderClosedNode();
    }
  }

  renderOpenedLeaf() {
    const {data} = this.props;

    return (
      <div className={this.styles.classNames.iconNavigator}>
        {this.renderHeader('Opened-leaf')}
        <AppIcon text={data} glyph={data.glyph} />
      </div>
    );
  }

  renderOpenedNode() {
    const {text, flow, target, level = 0, onLeafSelect, onScope} = this.props;

    //? const glyph = level === 0 ? 'solid/cube' : 'solid/database';
    const glyph = 'solid/chevron-up';

    return (
      <div className={this.styles.classNames.iconNavigator}>
        {this.renderHeader('Opened-node')}
        <AppIcon text={text} glyph={glyph} onClick={this.close} />
        <div className={this.styles.classNames.content}>
          {Object.entries(this.props.data).map(([id, data], i) => {
            return (
              <CIconNavigator
                key={i}
                widgetId={`${id}$icon-navigator`}
                text={id}
                data={data}
                parent={this.widgetId}
                scoped={target === id}
                parentFlow={flow}
                level={level + 1}
                onLeafSelect={onLeafSelect}
                onScope={onScope}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderOpened() {
    const {data} = this.props;

    if (data.leaf) {
      return this.renderOpenedLeaf();
    } else {
      return this.renderOpenedNode();
    }
  }

  render() {
    const {flow, scoped, level = 0, parentFlow} = this.props;

    if (parentFlow && parentFlow === 'scoped' && level > 0 && !scoped) {
      return null;
    }

    switch (flow) {
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
