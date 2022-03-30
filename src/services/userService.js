import $ from "jquery";
import { isEmpty } from "lodash";

const serviceURL = "http://www.tochangehybrid.com/php/sqlservice.php";
export async function userLogin(user) {
  let retUser = { authorization: "", _id: "", username: "" };
  await $.post(serviceURL, { REQACTION: "LOGIN", USER: user }).then(function (
    response
  ) {
    retUser = JSON.parse(response);
  });

  localStorage.setItem("userauthorization", retUser.authorization);
  localStorage.setItem("user_id", retUser._id);
  localStorage.setItem("username", retUser.username);
  if (isEmpty(retUser.authorization)) {
    alert("Unregistered User");
  }
  //
}
export function logout() {
  localStorage.removeItem("userauthorization");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
}
export function getCurrentUser() {
  const user = {};
  user.authorization = localStorage.getItem("userauthorization");
  user.username = localStorage.getItem("username");
  user.id = localStorage.getItem("user_id");
  return user;
}
