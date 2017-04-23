import React, { Component } from 'react';

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
       auth: ""}
    this.handleUserNameChange = this.handleUserNameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.processLoginForm = this.processLoginForm.bind(this)

  }

  getInitialState() {
  return {username: "",password: "", auth: false};
}


    componentWillMount() {
      console.log(this.props.ws)
      console.log(this.state)
    }

    processLoginForm(){
      console.log(new Date() + JSON.stringify(this.state))
      console.log("Socket state: ",this.props.ws.readyState)
      this.props.ws.send(JSON.stringify(this.state))
    }

    handleUserNameChange(e) {
      console.log(e.target.value)
   this.setState({username: e.target.value});
}
handlePasswordChange(e) {
    console.log(e.target.value)
   this.setState({password: e.target.value});
}


render() {

  return (
    <div>


  <div className="modal" id="id01" >
<form >
  <div className="imgcontainer">
    <img src="/images/onacci.png" alt="Avatar" className="avatar" />
  </div>

  <div className="container">
    <label><b>Username</b></label>
    <input type="text" placeholder="Enter Username"   value={this.state.name} required onChange={this.handleUserNameChange} />

    <label><b>Password</b></label>
    <input type="password" placeholder="Enter Password"  value={this.state.name} required onChange={this.handlePasswordChange} />

    <button  type='button' onClick={this.processLoginForm}>Login</button>
    <input type="checkbox" checked={this.props.checked} /> Remember me
  </div>

  <div className="container" style={{"backgroundColor": "#f1f1f1"}}>
    <button type="button" className="cancelbtn">Cancel</button>
    <span className="psw">Forgot <a href="#">password?</a></span>
  </div>
</form>
  </div>
</div>
)
}

}

export default Login
