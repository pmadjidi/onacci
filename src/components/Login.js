import React, { Component } from 'react';
import { Redirect } from 'react-router'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
       auth: "",
     passMessage: "Password"}
    this.handleUserNameChange = this.handleUserNameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
  //  this.componentWillMount = this.componentWillMount.bind(this)
    this.processLoginForm = this.processLoginForm.bind(this)

  }

  getInitialState() {
  return {username: "",password: "", auth: false, passMessage: "Password"};
}


    componentDidMount() {
      console.log(this.props.ws)
      console.log(this.state)
    }

    componentWillMount() {
      let that = this
      this.props.ws.addEventListener('message', function (event) {
    console.log('Message from server', event);
    let m = JSON.parse(event.data)
    console.log("Parsed message...",m)



    if (m.auth === false || m.auth === "false") {
      console.log("login failed....");
      that.setState({auth: false,passMessage: "Wrong password, retry?"})
    }

    if (m.auth === true  || m.auth === "true"){
      console.log("login sucess....");
        that.setState({auth: true})
        console.log("Setting auth user and session key to:", m.user,m.session)
        localStorage.setItem(m.session,m.user)
    }
    /*
    else {
      console.log("AUTH Error....")
      localStorage.setItem("currentUser","ERROR")
      localStorage.setItem("currentSession","ERROR")
    }
    */
    }
)}

componentWillUnmount() {
  console.log("Login: removeEventListener....");
  this.props.ws.removeEventListener('message')
}

    processLoginForm(){
      console.log("Socket state: ",this.props.ws.readyState)
      this.props.ws.send(JSON.stringify({type: "login",payload: this.state}))
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

  if (this.state.auth === true)
    return <Redirect to= "/home" />

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

    <label><b>{this.state.passMessage}</b></label>
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
