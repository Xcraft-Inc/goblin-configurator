import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
/******************************************************************************/
export default class AppIcon extends Widget {
  render() {
    return (
      <div className={this.styles.classNames.icon} onClick={this.props.onClick}>
        <div className={this.styles.classNames.text}>
          <Label
            kind="big-center"
            text={this.props.text}
            glyph={this.props.glyph}
            glyphPosition="center"
            glyphSize="200%"
          />
        </div>
      </div>
    );
  }
}
