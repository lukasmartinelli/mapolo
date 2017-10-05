import React from 'react'
import classnames from 'classnames'
import DocLabel from '../fields/DocLabel'

/** Wrap a component with a label */
class InputBlock extends React.Component {
  static propTypes = {
    "data-wd-key": React.PropTypes.string,
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]).isRequired,
    doc: React.PropTypes.string,
    action: React.PropTypes.element,
    children: React.PropTypes.element.isRequired,
    style: React.PropTypes.object,
  }

  onChange(e) {
    const value = e.target.value
    return this.props.onChange(value === "" ? null: value)
  }

  render() {
    return <div style={this.props.style}
      data-wd-key={this.props["data-wd-key"]}
      className={classnames({
        "maputnik-input-block": true,
        "maputnik-action-block": this.props.action
      })}
      >
      {this.props.doc &&
      <div className="maputnik-input-block-label">
        <DocLabel
          label={this.props.label}
          doc={this.props.doc}
        />
      </div>
      }
      {!this.props.doc &&
      <label className="maputnik-input-block-label">
        {this.props.label}
      </label>
      }
      {this.props.action &&
      <div className="maputnik-input-block-action">
        {this.props.action}
      </div>
      }
      <div className="maputnik-input-block-content">
        {this.props.children}
      </div>
    </div>
  }
}

export default InputBlock
