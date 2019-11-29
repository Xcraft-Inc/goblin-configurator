import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithModel from 'goblin-laboratory/widgets/with-model/widget';

import Label from 'gadgets/label/widget';
import TextFieldCombo from 'goblin-gadgets/widgets/text-field-combo/widget';
import Field from 'goblin-gadgets/widgets/field/widget';
import Button from 'goblin-gadgets/widgets/button/widget';
import ConfiguratorPopup from '../configurator-popup/widget';

/******************************************************************************/

class ConfiguratorBuildPopup extends Widget {
  constructor() {
    super(...arguments);

    this.createNewEntity = this.createNewEntity.bind(this);
    this.openNewEntityPopup = this.openNewEntityPopup.bind(this);
    this.closeNewEntityPopup = this.closeNewEntityPopup.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.state = {
      showNewEntityPopup: false,
    };
  }

  openNewEntityPopup() {
    this.setState({showNewEntityPopup: true});
  }

  createNewEntity() {
    // Quest to create new entity
    //this.doFor();
    this.closeNewEntityPopup();
  }

  closeNewEntityPopup() {
    this.setState({showNewEntityPopup: false});
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

  renderNewEntityPopup() {
    const buttons = [
      {
        text: 'Générer',
        action: this.createNewEntity,
      },
      {
        text: 'Annuler',
        action: this.closeNewEntityPopup,
      },
    ];
    // Add list of Field to edit properties
    return (
      <ConfiguratorPopup
        animationIn="zoomIn"
        animationOut="zoomOut"
        showed={this.state.showNewEntityPopup}
        topGlyph="solid/industry"
        topTitle="Nouvelle entité"
        width="600px"
        height="400px"
        outsideClose={true}
        buttons={buttons}
        onClose={this.closeNewEntityPopup}
      >
        <Field
          labelText="Nom de l'entité"
          kind={'field'}
          model={'.form.entityName'}
        />
        <Label text="Liste des propriétés" />
      </ConfiguratorPopup>
    );
  }

  renderBuild() {
    return (
      <div className={this.styles.classNames.build}>
        <Button text={'Nouvelle entité'} onClick={this.openNewEntityPopup} />
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
    if (this.state.showNewEntityPopup) {
      return this.renderNewEntityPopup();
    }

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
