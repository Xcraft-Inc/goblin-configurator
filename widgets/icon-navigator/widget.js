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
  }

  open(e) {
    e.stopPropagation();
    const {parent} = this.props;
    if (parent) {
      this.dispatchTo(parent, {
        type: 'SCOPE',
        target: this.widgetId.replace('$icon-navigator', ''),
      });
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
    } = this.props;
    let lvl = level;
    if (!lvl) {
      lvl = 0;
    }
    if (parentFlow && parentFlow === 'scoped' && lvl > 0 && !scoped) {
      return null;
    }
    switch (flow) {
      default:
      case 'closed':
        if (scoped) {
          this.dispatchTo(this.widgetId, {
            type: 'OPEN',
          });
        }
        if (typeof data === 'object') {
          return <AppIcon text={text} onClick={this.open} />;
        } else {
          const select = () => onLeafSelect(data);
          return <AppIcon text={text} onClick={select} />;
        }
      case 'scoped':
      case 'opened': {
        if (typeof data === 'object') {
          return (
            <React.Fragment>
              <AppIcon text={text} onClick={this.close} />
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
                    />
                  );
                })}
              </div>
            </React.Fragment>
          );
        } else {
          return <AppIcon text={data} />;
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
