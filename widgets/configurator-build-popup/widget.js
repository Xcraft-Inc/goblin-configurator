import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';

import Label from 'gadgets/label/widget';
import ConfiguratorPopup from '../configurator-popup/widget';

/******************************************************************************/

export default class ConfiguratorBuildPopup extends Widget {
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

  renderBuild() {
    return (
      <div className={this.styles.classNames.build}>
        <Label text="Construction automatique du workitem.ui d'une entité." />
        <Label text="TODO, by Sam..." />
        <Label height="20px" />
        <Label
          height="100px"
          justify="center"
          glyphPosition="center"
          glyph="light/smile"
          glyphSize="600%"
        />
      </div>
    );
  }

  render() {
    const buttons = [
      {
        text: 'Générer',
        action: this.onAccept,
      },
      {
        text: 'Annuler',
        action: this.onCancel,
      },
    ];

    return (
      <ConfiguratorPopup
        animationIn="zoomIn"
        animationOut="zoomOut"
        showed={this.props.showed}
        topGlyph="solid/industry"
        topTitle="Build"
        width="600px"
        height="400px"
        outsideClose={true}
        buttons={buttons}
        onClose={this.onCancel}
      >
        {this.renderBuild()}
      </ConfiguratorPopup>
    );
  }
}
