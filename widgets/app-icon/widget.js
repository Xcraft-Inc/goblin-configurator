import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
import Button from 'gadgets/button/widget';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

/******************************************************************************/

export default class AppIcon extends Widget {
  renderClose() {
    if (!this.props.closable) {
      return null;
    }

    return (
      <div
        className={this.styles.classNames.closeBox}
        onClick={this.props.onClose}
      >
        <FontAwesomeIcon icon={[`fal`, 'times']} />
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
        <div className={this.styles.classNames.glyph}>
          <FontAwesomeIcon icon={[`fas`, this.props.glyph.split('/')[1]]} />
        </div>
        <div className={this.styles.classNames.text}>{this.props.text}</div>
      </div>
    );
  }
}
