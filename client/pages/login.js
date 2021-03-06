import React from 'react'
import Layout from "../components/layout";
import Form from "react-bootstrap/Form";
import { Button, Alert, Container } from 'react-bootstrap';
import { withRouter } from 'next/router';
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props)
    let imgNum = parseInt(Math.random() * 50)
    this.state = {
      showAlert: false,
      imgNum: imgNum,
      email: undefined
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }
  
  async handleLogin(event) {
    let validation = document.getElementById('login-form').checkValidity()
    const email = this.state.email;
    if (validation == false) {
      return this.showAlert(true)
    } 
    this.showAlert(false)
    let result = await this.sendCode(email)
    this.props.router.replace('/code')
  }

  showAlert(show=true) {
    this.setState({
      ...this.state,
      showAlert: show
    })
  }

  async sendCode(email) {
    let params = { email:email };
    const { data } = await axios.post(`/users/code`, params);
    localStorage.setItem('user', JSON.stringify(data.user));
    return true
  }

  async handleEmailChange(event) {
    let value = event.target.value;
    //console.log("handleEmail : " + value);
    this.setState({email:value});
  }
  
  render() {
    return (
      <Layout>
        <Container>
        <div className="d-flex justify-content-center flex-wrap mt-5">
          <div id="form-container" className="w-100">
            <div className="w-100 d-flex justify-content-center">
              <img className="w-50 h-50 img-fluid" src={`/icons/icon-${this.state.imgNum}.svg`} alt="logo-image"/>
            </div>
            <div className="w-100 mt-5">
              <Form id="login-form" onSubmit={event => event.preventDefault()}>
                <Form.Control required size="lg" type="email" placeholder="Enter email" onChange={this.handleEmailChange} />
                <Button size="lg" className="btn-block mt-3" variant="dark" onClick={this.handleLogin.bind(this)}>Login</Button>
              </Form>
            </div>
            <Alert show={this.state.showAlert} className="mt-3 w-100" variant="dark" dismissible onClose={() => this.showAlert(false)}>
              Please enter a valid email.
            </Alert>
            <style jsx>{`
              // Medium devices (tablets, 768px and up)
              @media (min-width: 768px) {
                #form-container {
                  max-width: 400px;
                }
              }
              img {
                filter: drop-shadow(5px 5px 5px #222);
              }
            `}</style>
          </div>
        </div>
        </Container>
      </Layout>
    )
  }
}

export default withRouter(Login)
