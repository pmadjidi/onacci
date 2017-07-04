import React, { Component } from 'react';
import Highlight from 'react-highlight'

class  CodeSnippet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      snippetWindow: "",
      output: null
    }
}



sendMessage(e) {
  this.setState({snippetWindow: e.target.value });
}

processSnippet(e) {
  let payload = {type: "message", payload: {}}
  let codeSnippet
  if (this.props.selected.type === "channel") {
    payload.payload.type = "channel"
    payload.payload.targetChannel = this.props.selected.name
  }
  else {
    payload.payload.type = "P2P"
    payload.payload.targetUser = this.props.selected.name
  }

  if (this.state.snippetWindow !== "")
  {
    payload.payload.content = this.state.snippetWindow
    payload.payload.subtype = "snippet"
    payload.payload.lang = e.target.value

    /*
    codeSnippet = <Highlight className={e.target.value}>{this.state.snippetWindow}</Highlight>
    this.setState({output: codeSnippet});
    console.log(payload)
    console.log("lang = ",e.target.value)
    */
    this.props.send(payload)
      this.setState({output: "",snippetWindow: ""});
  }
  this.props.toogle()
}

  render() {
    return (
      <div>
         <textarea className = "SnippetInputField"  rows="30" cols="75" placeholder={"Enter text to format "}
          ref="SnippetInputField" value = {this.state.snippetWindow} onChange= {this.sendMessage.bind(this)} placeholder="Enter code...."></textarea>
        <select value={this.state.lang} onChange={this.processSnippet.bind(this)} style={{width: "100%",height: "4%"}}>
      <option value=""></option>
      <option value="python">Python</option>
      <option value="js">Javascript</option>
      <option value="c">C</option>
      <option value="c++">C++</option>
      <option value="c#">C#</option>
      <option value="go">Go</option>
      <option value="html">HTML</option>
      <option value="jsx">JSX</option>
      <option value="lisp">Lisp</option>
      <option value="haskel">Haskel</option>
      <option value="skala">Skala</option>
      <option value="swift">Swift</option>
    </select>
      </div>
    );
  }
};



export default CodeSnippet
