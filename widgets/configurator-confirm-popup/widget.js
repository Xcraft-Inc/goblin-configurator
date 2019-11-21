import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';

import Label from 'gadgets/label/widget';
import ConfiguratorPopup from '../configurator-popup/widget';

/******************************************************************************/

export default class ConfiguratorConfirmPopup extends Widget {
  constructor() {
    super(...arguments);

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onAccept() {
    if (this.props.onAccept) {
      this.props.onAccept();
    }
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  /******************************************************************************/

  renderConfirmation() {
    return (
      <div className={this.styles.classNames.confirmation}>
        <Label text={this.props.question} />
      </div>
    );
  }

  render() {
    const buttons = [
      {
        text: 'Oui',
        action: this.onAccept,
      },
      {
        text: 'Non',
        action: this.onCancel,
      },
    ];

    return (
      <ConfiguratorPopup
        animationIn="zoomIn"
        animationOut="zoomOut"
        showed={this.props.showed}
        topGlyph={this.props.topGlyph}
        topTitle={this.props.topTitle}
        width="600px"
        height="200px"
        outsideClose={true}
        buttons={buttons}
        onClose={this.onCancel}
      >
        {this.renderConfirmation()}
      </ConfiguratorPopup>
    );
  }
}
