import React from 'react';

class EditableText extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false,
      value: ""
    };
  }

  textChanged(event) {
    console.log("new container name is: " + this.refs.inputContainerName.value);

    this.props.onChange(this.refs.inputContainerName.value);

    this.setState({
      editing: false
    });
  }

  handleKeyPress(event) {
    console.log(event.key);
    if (event.key === "Enter" || event.keyCode == 27) {
      event.target.blur();
    }
  }

  setEditable(event) {
    this.setState({
      editing: true
    });
  }

  render() {
    if (this.state.editing) {
      return (
        <div className="form-group">
          <input type="text" className="form-control" ref="inputContainerName" onBlur={this.textChanged.bind(this)} onKeyUp={this.handleKeyPress.bind(this)} defaultValue={this.props.value} />
        </div>
      );
    }
    else {
      return(
        <span onClick={this.setEditable.bind(this)}>{this.props.value}</span>
      );
    }
  }
}

export default EditableText;
