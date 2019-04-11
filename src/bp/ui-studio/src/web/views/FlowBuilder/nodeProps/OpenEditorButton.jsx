import React, { Component, Fragment } from 'react'
import CodeEditorModalDialog from './CodeEditorModalDialog'

export default class OpenEditorButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  openEditor() {
    this.setState({
      show: true
    })
  }

  onCloseEditor() {
    this.setState({
      show: false
    })
  }

  render() {
    return (
      <Fragment>
        <button style={{ width: '100%' }} onClick={this.openEditor.bind(this)}>
          Open editor
        </button>
        <CodeEditorModalDialog
          show={this.state.show}
          language="javascript"
          onClose={this.onCloseEditor.bind(this)}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          value={this.props.value}
        />
      </Fragment>
    )
  }
}
