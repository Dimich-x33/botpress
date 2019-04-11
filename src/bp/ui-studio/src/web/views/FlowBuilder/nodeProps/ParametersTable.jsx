import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { Table } from 'react-bootstrap'
import classnames from 'classnames'
import _ from 'lodash'
import MonacoEditor from 'react-monaco-editor'
import { IEditorConstructionOptions } from 'monaco-editor/esm/vs/editor/editor.api'

const style = require('./parameters.scss')

export default class ParametersTable extends Component {
  constructor(props) {
    super(props)
    this.state = { arguments: this.transformArguments(props.value) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ arguments: this.transformArguments(nextProps.value) })
  }

  transformArguments(args) {
    const valuesArray = [..._.map(args, (value, key) => ({ key, value })), { key: '', value: '' }]
    return _.fromPairs(valuesArray.map((el, i) => [i, el]))
  }

  getValues() {
    return this.state.arguments
  }

  onChanged() {
    setImmediate(() => {
      this.props.onChange && this.props.onChange(this.state.arguments)
    })
  }

  renderInputByType(type, placeholder, value, onChange) {
    switch (type) {
      case 'string':
        return <input type="text" placeholder={placeholder} value={value} onChange={onChange} />

      case 'JavaScript':
        return (
          <MonacoEditor
            height="200"
            value={value}
            onChange={onChange}
            language="javascript"
            style={{ width: '100%', height: '200px' }}
            options={{
              selectOnLineNumbers: true,
              minimap: { enabled: false },
              theme: 'vs-dark'
            }}
          />
        )

      default:
        return <input type="text" placeholder={placeholder} value={value} onChange={onChange} />
    }
  }

  renderRow(id) {
    const args = this.state.arguments

    const regenerateEmptyRowIfNeeded = () => {
      if (args[id].key === '' && args[id].value === '') {
        args[new Date().getTime()] = { key: '', value: '' }
      }
    }

    const deleteDuplicatedEmptyRows = () => {
      let count = 0
      for (const id in this.state.arguments) {
        const v = this.state.arguments[id]
        if (v.key === '' && v.value === '') {
          count++
        }
        if (count > 1) {
          const clone = { ...this.state.arguments }
          delete clone[id]
          return this.setState({
            arguments: clone
          })
        }
      }
    }

    const editKey = evt => {
      if (evt.target.value !== '') {
        regenerateEmptyRowIfNeeded()
      } else {
        if (this.state.arguments[id].value === '') {
          setTimeout(deleteDuplicatedEmptyRows, 100)
        }
      }

      this.setState({
        arguments: { ...args, [id]: { key: evt.target.value, value: args[id].value } }
      })

      this.onChanged()
    }

    const editValue = evt => {
      if (evt.target.value !== '') {
        regenerateEmptyRowIfNeeded()
      } else {
        if (this.state.arguments[id].key === '') {
          setTimeout(deleteDuplicatedEmptyRows, 100)
        }
      }

      this.setState({
        arguments: { ...args, [id]: { value: evt.target.value, key: args[id].key } }
      })

      this.onChanged()
    }

    const isKeyValid = args[id].key.length > 0 || !args[id].value.length

    const paramName = args[id].key
    const paramValue = args[id].value

    const definition = _.find(this.props.definitions || [], { name: paramName }) || {
      required: false,
      description: 'No description',
      default: '',
      type: 'Unknown',
      fake: true
    }

    const tooltip = (
      <Tooltip id={`param-${paramName}`}>
        <strong>({definition.type}) </strong> {definition.description}
      </Tooltip>
    )

    const help = definition.fake ? null : (
      <OverlayTrigger placement="bottom" overlay={tooltip}>
        <i className={'material-icons ' + style.keyTip}>help_outline</i>
      </OverlayTrigger>
    )

    const keyClass = classnames({ [style.invalid]: !isKeyValid, [style.mandatory]: definition.required })

    return (
      <tr key={id}>
        <td className={keyClass}>
          {help}
          <input type="text" disabled={!!definition.required} value={paramName} onChange={editKey} />
        </td>
        <td>{this.renderInputByType(definition.type, definition.default, paramValue, editValue)}</td>
      </tr>
    )
  }

  render() {
    const rows = _.orderBy(_.keys(this.state.arguments), x => x).map(this.renderRow.bind(this))

    return (
      <Table className={classnames(style.table, this.props.className)}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    )
  }
}
