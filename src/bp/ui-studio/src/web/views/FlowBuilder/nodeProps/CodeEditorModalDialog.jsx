import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import MonacoEditor from 'react-monaco-editor'

export default class CodeEditorModalDialog extends Component {
  constructor(props) {
    super(props)
    this.state = { value: this.props.value || '', editorRef: null, saved: true }
  }

  onSave() {
    this.props.onChange &&
      this.props.onChange({
        // IMPORTANT: Keep compatibility with native events in ParametersTable.renderRow.editValue
        target: {
          value: this.state.editorRef.editor.getValue()
        }
      })
    this.setState({ saved: true })
  }

  onClose() {
    this.props.onClose && this.props.onClose()
  }

  editorDidMount(editor, monaco) {
    editor.focus()
  }

  render() {
    return (
      <Modal animation={false} show={this.props.show} onHide={this.onClose} container={document.getElementById('app')}>
        <Modal.Header closeButton>
          <Modal.Title>Edit script</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MonacoEditor
            ref={ref => {
              this.state.editorRef = ref
            }}
            width="570"
            height="480"
            value={this.props.value}
            language={this.props.language}
            options={{
              selectOnLineNumbers: true,
              minimap: { enabled: false },
              theme: 'vs-dark'
            }}
            editorDidMount={this.editorDidMount.bind(this)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onClose.bind(this)}>Close</Button>
          <Button onClick={this.onSave.bind(this)} bsStyle="primary">
            Save (Alt+Enter)
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
