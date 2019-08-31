import React from 'react';
import Widget from 'laboratory/widget';
import AppIcon from '../app-icon/widget';
import C from 'goblin-laboratory/widgets/connect-helpers/c';
import {unfold} from 'linq';
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

  render() {
    const {
      text,
      flow,
      data,
      target,
      scoped,
      level,
      parentFlow,
      onLeafSelect,
      onScope,
    } = this.props;
    let lvl = level;
    if (!lvl) {
      lvl = 0;
    }
    if (parentFlow && parentFlow === 'scoped' && lvl > 0 && !scoped) {
      return null;
    }
    const glyph = lvl === 0 ? 'solid/cube' : 'solid/database';
    switch (flow) {
      default:
      case 'closed': {
        if (scoped) {
          this.dispatchTo(this.widgetId, {
            type: 'OPEN',
          });
        }
        if (!data.leaf) {
          return <AppIcon text={text} glyph={glyph} onClick={this.open} />;
        } else {
          return (
            <AppIcon text={text} glyph={data.glyph} onClick={this.select} />
          );
        }
      }
      case 'scoped':
      case 'opened': {
        if (!data.leaf) {
          return (
            <React.Fragment>
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
                      level={lvl + 1}
                      onLeafSelect={onLeafSelect}
                      onScope={onScope}
                    />
                  );
                })}
              </div>
            </React.Fragment>
          );
        } else {
          return <AppIcon text={data} glyph={data.glyph} />;
        }
      }
    }
  }
}
const CIconNavigator = Widget.connectWidget(state => {
  return {
    flow: state ? state.get('flow') : 'loading',
    target: state ? state.get('target') : null,
  };
})(IconNavigator);

export default CIconNavigator;
