import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithModel from 'goblin-laboratory/widgets/with-model/widget';

import Label from 'gadgets/label/widget';
import Field from 'goblin-gadgets/widgets/field/widget';
import ConfiguratorPopup from '../configurator-popup/widget';

/******************************************************************************/

export default class ConfiguratorBuildEntityPopup extends Widget {
  constructor() {
    super(...arguments);

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onAccept() {
    this.do('create-new-entity');
    this.props.onClose();
  }

  onCancel() {
    this.props.onClose();
  }

  /******************************************************************************/

  renderMain() {
    // Add list of Field to edit properties
    return (
      <div className={this.styles.classNames.main}>
        <Field labelText="Nom de l'entité" kind={'field'} model={'.type'} />
        <Label text="Liste des propriétés" />
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
      <WithModel model={`backend.${this.props.id}.newEntity`}>
        <ConfiguratorPopup
          animationIn="fadeIn"
          animationOut="fadeOut"
          showed={this.props.showed}
          topGlyph="solid/industry"
          topTitle="Entity generator"
          width="600px"
          height="400px"
          outsideClose={true}
          buttons={buttons}
          onClose={this.onCancel}
        >
          {this.renderMain()}
        </ConfiguratorPopup>
      </WithModel>
    );
  }
}

/******************************************************************************/
