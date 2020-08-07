import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import Label from 'goblin-gadgets/widgets/label/widget';

/******************************************************************************/

class Clock extends Widget {
  constructor() {
    super(...arguments);
    this.onTick = this.onTick.bind(this);
  }

  onTick() {
    this.dispatchTo(this.widgetId, {
      type: 'TICK',
    });
  }

  /******************************************************************************/

  render() {
    const {time} = this.props;
    setTimeout(this.onTick, 1000);
    if (!time) {
      return <Label text="..." />;
    }

    const pretty = (v) => `0${v}`.slice(-2);
    const hh = pretty(time.getHours());
    const mm = pretty(time.getMinutes());
    const ss = pretty(time.getSeconds());

    return <Label text={`${hh}:${mm}:${ss}`} />;
  }
}

/******************************************************************************/

export default Widget.connectWidget((state) => {
  if (!state) {
    return {time: null};
  }
  const time = state.get('time');
  return {time};
})(Clock);
