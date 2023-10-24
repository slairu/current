import { React } from "react";
import "./styles/SignupPage.css";

function SignupPage(props) {
  return (
    <div className="centerForm">
      <div>
        <div>
          <h1 className="signupText">Account Signup</h1>
          <div className="promotionText">
            Become a member and enjoy exclusive promotions.
          </div>
        </div>
        <form className="signupForm">
          <label for="fullname">Full Name</label>
          <input></input>
          <label for="fullname">Email Address</label>
          <input></input>
          <label for="fullname">Password</label>
          <input></input>
          <label for="fullname">Confirmed Password</label>
          <input></input>
          <button className="continueButton">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
