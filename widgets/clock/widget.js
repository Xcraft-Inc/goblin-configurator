import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
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

  render() {
    const {time} = this.props;
    setTimeout(this.onTick, 1000);
    if (!time) {
      return <Label kind="big-center" text="..." />;
    }
    const pretty = v => `0${v}`.slice(-2);
    const HH = pretty(time.getHours());
    const MM = pretty(time.getMinutes());
    const SS = pretty(time.getSeconds());
    return <Label kind="big-center" text={`${HH}:${MM}:${SS}`} />;
  }
}

export default Widget.connectWidget(state => {
  if (!state) {
    return {time: null};
  }
  const time = state.get('time');
  return {time};
})(Clock);
