import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';

import Button from 'goblin-gadgets/widgets/button/widget';
import Label from 'goblin-gadgets/widgets/label/widget';
import ConfiguratorPopup from '../configurator-popup/widget';
import ConfiguratorBuildEntityPopup from '../configurator-build-entity-popup/widget';
import ConfiguratorBuildWorkitemPopup from '../configurator-build-workitem-popup/widget';

/******************************************************************************/

export default class ConfiguratorBuildPopup extends Widget {
  constructor() {
    super(...arguments);

    this.state = {
      showEntityPopup: false,
      showWorkitemPopup: false,
    };

    this.onClose = this.onClose.bind(this);
  }

  //#region get/set
  get showEntityPopup() {
    return this.state.showEntityPopup;
  }

  set showEntityPopup(value) {
    this.setState({
      showEntityPopup: value,
    });
  }

  get showWorkitemPopup() {
    return this.state.showWorkitemPopup;
  }

  set showWorkitemPopup(value) {
    this.setState({
      showWorkitemPopup: value,
    });
  }
  //#endregion

  onClose() {
    this.props.onClose();
  }

  /******************************************************************************/

  renderEntityPopup() {
    return (
      <ConfiguratorBuildEntityPopup
        id={this.props.id}
        showed={this.showEntityPopup}
        onClose={() => (this.showEntityPopup = false)}
      />
    );
  }

  renderWorkitemPopup() {
    return (
      <ConfiguratorBuildWorkitemPopup
        id={this.props.id}
        showed={this.showWorkitemPopup}
        entities={this.props.availableEntities}
        onClose={() => (this.showWorkitemPopup = false)}
      />
    );
  }

  renderMain() {
    return (
      <div className={this.styles.classNames.main}>
        <div className={this.styles.classNames.button}>
          <Button
            width="200px"
            height="200px"
            glyph="solid/database"
            glyphSize="600%"
            tooltip="Entity generator"
            horizontalSpacing="large"
            onClick={() => (this.showEntityPopup = true)}
          />
          <Label height="40px" text="Entity" justify="center" />
        </div>
        <div className={this.styles.classNames.button}>
          <Button
            width="200px"
            height="200px"
            glyph="solid/square"
            glyphSize="600%"
            tooltip="Workitems templates generator"
            onClick={() => (this.showWorkitemPopup = true)}
          />
          <Label height="40px" text="Workitem" justify="center" />
        </div>
      </div>
    );
  }

  render() {
    if (this.state.showEntityPopup) {
      return this.renderEntityPopup();
    } else if (this.state.showWorkitemPopup) {
      return this.renderWorkitemPopup();
    }

    const buttons = [
      {
        text: 'Fermer',
        action: this.onClose,
      },
    ];

    return (
      <ConfiguratorPopup
        animationIn="fadeIn"
        animationOut="fadeOut"
        showed={this.props.showed}
        topGlyph="solid/industry"
        topTitle="Builder"
        width="600px"
        height="350px"
        outsideClose={true}
        buttons={buttons}
        onClose={this.onClose}
      >
        {this.renderMain()}
      </ConfiguratorPopup>
    );
  }
}
