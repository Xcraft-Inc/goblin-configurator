import React from 'react';
import Widget from 'laboratory/widget';
import Label from 'gadgets/label/widget';
/******************************************************************************/
class ProfileInfo extends Widget {
  render() {
    const {info} = this.props;
    return (
      <div className={this.styles.classNames.box}>
        <Label text={info} />
      </div>
    );
  }
}

export default Widget.connectBackend(state => {
  const current = state.get('current');
  const info =
    '```' +
    'Settings\n' +
    `* Elasticsearch URL = **\`${current.get('elasticsearchUrl')}\`**\n` +
    `* Reset data = **\`${current.get('rethinkdbHost')}\`**\n` +
    `* Reset data = **\`${current.get('reset')}\`**\n` +
    `* Mandate = **\`${current.get('mandate')}\`**` +
    '```';
  return {info};
})(ProfileInfo);
