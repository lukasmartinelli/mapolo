import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldSourceInternalProps = {
  value?: string
  wdKey?: string
  onChange?(value: string| undefined): unknown
  sourceIds?: unknown[]
  error?: {message: string}
} & WithTranslation;

class FieldSourceInternal extends React.Component<FieldSourceInternalProps> {
  static defaultProps = {
    onChange: () => {},
    sourceIds: [],
  }

  render() {
    const t = this.props.t;
    return <Block
      label={t("Source")}
      fieldSpec={latest.layer.source}
      error={this.props.error}
      data-wd-key={this.props.wdKey}
    >
      <InputAutocomplete
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceIds?.map(src => [src, src])}
      />
    </Block>
  }
}

const FieldSource = withTranslation()(FieldSourceInternal);
export default FieldSource;
