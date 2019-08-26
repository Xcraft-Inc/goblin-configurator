import React from 'react';
import Widget from 'laboratory/widget';

/******************************************************************************/
export default class GradientBg extends Widget {
  render() {
    return (
      <div className={this.styles.classNames.background}>
        {this.props.children}
      </div>
    );
  }
}
