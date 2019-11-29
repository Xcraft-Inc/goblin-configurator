import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithModel from 'goblin-laboratory/widgets/with-model/widget';

import Label from 'gadgets/label/widget';
import TextFieldCombo from 'goblin-gadgets/widgets/text-field-combo/widget';
import ConfiguratorPopup from '../configurator-popup/widget';

/******************************************************************************/

class ConfiguratorBuildPopup extends Widget {
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
        <Label text="Choix de l'entité" height="50px" />
        <WithModel model={`backend.${this.props.id}`}>
          <TextFieldCombo
            listModel={'.availableEntities'}
            model={'.selectedEntity'}
            hintText="Entités"
            width="400px"
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
        disabled: !this.props.selectedEntity,
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
        topTitle="Workitems templates generator"
        width="500px"
        height="200px"
        outsideClose={true}
        buttons={buttons}
        onClose={this.onCancel}
      >
        {this.renderBuild()}
      </ConfiguratorPopup>
    );
  }
}

/******************************************************************************/

export default Widget.connect((state, props) => {
  return {
    selectedEntity: state
      .get('backend')
      .get(props.id)
      .get('selectedEntity'),
  };
})(ConfiguratorBuildPopup);
