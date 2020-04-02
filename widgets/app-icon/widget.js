import React from 'react';
import Widget from 'laboratory/widget';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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

  renderDetailRow(index, label, value) {
    return (
      <div key={index} className={this.styles.classNames.detailRow}>
        <div className={this.styles.classNames.detailRowLabel}>{label}</div>
        <div className={this.styles.classNames.detailRowValue}>{value}</div>
      </div>
    );
  }

  renderDetail() {
    if (this.props.type !== 'session') {
      return null;
    }

    const showed = this.props.showDetail && this.props.config;
    const style = showed
      ? this.styles.classNames.detail
      : this.styles.classNames.detailHidden;

    return (
      <div className={style}>
        {this.props.config
          ? Object.entries(this.props.config).map(([label, value], index) =>
              this.renderDetailRow(index, label, value)
            )
          : null}
      </div>
    );
  }

  renderMain() {
    return (
      <div className={this.styles.classNames.main}>
        <div className={this.styles.classNames.glyph}>
          <FontAwesomeIcon icon={[`fas`, this.props.glyph.split('/')[1]]} />
        </div>
        <div className={this.styles.classNames.text}>{this.props.text}</div>
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
        {this.renderMain()}
        {this.renderDetail()}
      </div>
    );
  }
}
