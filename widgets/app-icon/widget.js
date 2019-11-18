import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
import Button from 'gadgets/button/widget';

/******************************************************************************/

export default class AppIcon extends Widget {
  renderClose() {
    if (!this.props.closable) {
      return null;
    }

    return (
      <div className={this.styles.classNames.closeBox}>
        <Button
          glyph="solid/times"
          kind="notification-close"
          vpos="top"
          onClick={this.props.onClose}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        className={this.styles.classNames.appIcon}
        onClick={this.props.onClick}
      >
        {this.renderClose()}
        <div className={this.styles.classNames.text}>
          <Label
            justify="start"
            textTransform="uppercase"
            text={this.props.text}
            glyph={this.props.glyph}
            glyphPosition="center"
            glyphSize="150%"
          />
        </div>
      </div>
    );
  }
}
