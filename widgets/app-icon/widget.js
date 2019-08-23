import React from 'react';
import Widget from 'laboratory/widget';

/******************************************************************************/
export default class AppIcon extends Widget {
  render() {
    return (
      <div className={this.styles.classNames.icon} onClick={this.props.onClick}>
        <div className={this.styles.classNames.text}>{this.props.text}</div>
      </div>
    );
  }
}
