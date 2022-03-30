import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { userLogin } from "../services/userService";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    required: { username: "", password: "" },
    errors: {},
  };
  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    await userLogin(this.state.data);
    // let user = getCurrentUser();
    // if (user.username) window.location = "/tcbt/";
    // else
    window.location = "/";
  };
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <main className="container">
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}
            {this.renderButton("Login")}
          </main>
        </form>
      </div>
    );
  }
}

export default LoginForm;
