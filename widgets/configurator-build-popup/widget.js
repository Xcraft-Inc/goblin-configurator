import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithModel from 'goblin-laboratory/widgets/with-model/widget';
import C from 'goblin-laboratory/widgets/connect-helpers/c';

import Label from 'gadgets/label/widget';
import TextFieldCombo from 'goblin-gadgets/widgets/text-field-combo/widget';
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
        <WithModel model={`backend.${this.props.id}`}>
          <TextFieldCombo
            listModel={'.availableEntities'}
            model={'.selectedEntity'}
            hintText="Entités"
            width="300px"
            menuType="wrap"
            restrictsToList={true}
          />
        </WithModel>
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
        topTitle="Workitems templates generator "
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
