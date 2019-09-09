import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
import Button from 'gadgets/button/widget';
/******************************************************************************/
export default class AppIcon extends Widget {
  render() {
    const {text, glyph, closable, onClick, onClose} = this.props;
    return (
      <div className={this.styles.classNames.icon} onClick={onClick}>
        {closable ? (
          <div className={this.styles.classNames.closeBox}>
            <Button
              glyph="solid/times"
              kind="notification-close"
              vpos="top"
              onClick={onClose}
            />
          </div>
        ) : null}

        <div className={this.styles.classNames.text}>
          <Label
            kind="big-center"
            text={text}
            glyph={glyph}
            glyphPosition="center"
            glyphSize="200%"
          />
        </div>
      </div>
    );
  }
}
