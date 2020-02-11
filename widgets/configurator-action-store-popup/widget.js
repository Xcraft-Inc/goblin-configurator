import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import ConfiguratorPopup from '../configurator-popup/widget';
import Ripley from '../ripley/widget';

/******************************************************************************/

class ConfiguratorActionStorePopup extends Widget {
  constructor() {
    super(...arguments);

    this.replayActionStore = this.replayActionStore.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  replayActionStore() {
    if (this.props.selected) {
      this.doFor(this.props.id, 'replay-action-store');
      this.props.onClose();
    }
  }

  onCancel() {
    this.props.onClose();
  }

  /******************************************************************************/

  render() {
    const buttons = [
      {
        text: 'Voyager dans le temps',
        action: this.replayActionStore,
      },
      {
        text: 'Annuler',
        action: this.onCancel,
      },
    ];

    return (
      <ConfiguratorPopup
        animationIn="fadeIn"
        animationOut="fadeOut"
        showed={this.props.showed}
        topGlyph="solid/industry"
        topTitle="Action store replay"
        width="600px"
        height="600px"
        outsideClose={true}
        buttons={buttons}
        onClose={this.onCancel}
      >
        <Ripley id={this.props.id} />
      </ConfiguratorPopup>
    );
  }
}

/******************************************************************************/

export default Widget.connect((state, props) => {
  const from = state.get(`backend.${props.id}.ripley.selected.from`);
  const to = state.get(`backend.${props.id}.ripley.selected.to`);
  return {
    selected: from !== null && to !== null,
  };
})(ConfiguratorActionStorePopup);
