import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputString from './InputString'

type FieldIdProps = {
  value: string
  wdKey: string
  onChange(value: string | undefined): unknown
  error?: {message: string}
};

export default class FieldId extends React.Component<FieldIdProps> {
  render() {
    return <Block label="ID" fieldSpec={latest.layer.id}

      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      <InputString
        value={this.props.value}
        onInput={this.props.onChange}
        data-wd-key={this.props.wdKey + ".input"}
      />
    </Block>
  }
}
