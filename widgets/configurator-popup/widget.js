import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import KeyTrap from 'goblin-gadgets/widgets/key-trap.js';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Label from 'gadgets/label/widget';
import Button from 'gadgets/button/widget';

/******************************************************************************/

export default class ConfiguratorPopup extends Widget {
  constructor() {
    super(...arguments);

    this.handleClose = this.handleClose.bind(this);
    this.handleOutsideClose = this.handleOutsideClose.bind(this);
  }

  handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleOutsideClose() {
    if (this.props.outsideClose) {
      this.handleClose();
    }
  }

  handleIdle(e) {
    e.stopPropagation();
    // Don't close the popup!
  }

  /******************************************************************************/

  componentDidUpdate(prevProps) {
    if (prevProps.showed !== this.props.showed) {
      if (this.props.showed) {
        KeyTrap.bind('Escape', this.handleClose);
      } else {
        KeyTrap.unbind('Escape', this.handleClose);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.showed) {
      KeyTrap.unbind('Escape', this.handleClose);
    }
  }

  /******************************************************************************/

  renderHeader() {
    if (!this.props.topGlyph) {
      return null;
    }

    return (
      <div className={this.styles.classNames.header}>
        <div className={this.styles.classNames.headerGlyph}>
          <FontAwesomeIcon icon={[`fas`, this.props.topGlyph.split('/')[1]]} />
        </div>
        <div className={this.styles.classNames.headerText}>
          <Label text={this.props.topTitle} />
        </div>
      </div>
    );
  }

  renderCloseButton() {
    if (this.props.onClose) {
      return (
        <div
          className={this.styles.classNames.closeButton}
          onClick={this.handleClose}
        >
          <FontAwesomeIcon icon={[`fal`, 'times']} />
        </div>
      );
    } else {
      return null;
    }
  }

  renderButton(button, total, index) {
    return (
      <Button
        key={index}
        kind="action"
        place={`${index + 1}/${total}`}
        justify="center"
        width={button.width || '200px'}
        text={button.text}
        disabled={button.disabled}
        onClick={button.action}
      />
    );
  }

  renderButtons() {
    const result = [];
    let index = 0;
    for (const button of this.props.buttons) {
      result.push(
        this.renderButton(button, this.props.buttons.length, index++)
      );
    }
    return result;
  }

  renderFooter() {
    if (this.props.buttons) {
      return (
        <div className={this.styles.classNames.footer}>
          {this.renderButtons()}
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div
        className={this.styles.classNames.fullScreen}
        onClick={this.handleOutsideClose}
      >
        <div className={this.styles.classNames.animated}>
          <div
            className={this.styles.classNames.popup}
            onClick={this.handleIdle}
          >
            {this.renderHeader()}
            {this.renderCloseButton()}
            {this.props.children}
            {this.renderFooter()}
          </div>
        </div>
      </div>
    );
  }
}

/******************************************************************************/
