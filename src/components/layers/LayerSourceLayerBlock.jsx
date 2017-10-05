import React from 'react'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import AutocompleteInput from '../inputs/AutocompleteInput'

class LayerSourceLayer extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    sourceLayerIds: React.PropTypes.array,
  }

  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
  }

  render() {
    return <InputBlock label={"Source Layer"} doc={GlSpec.layer['source-layer'].doc}
      data-wd-key="layer-source-layer"
    >
      <AutocompleteInput
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceLayerIds.map(l => [l, l])}
      />
    </InputBlock>
  }
}

export default LayerSourceLayer
