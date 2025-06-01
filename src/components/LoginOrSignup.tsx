// src/components/LoginOrSignup.tsx
import React from "react";
import { StytchB2B } from "@stytch/react/b2b";
import { StytchEventType } from "@stytch/vanilla-js";
import { discoveryConfig, discoveryStyles } from "../utils/stytchConfig";
import { useNavigate } from "react-router-dom";

// 1) Import the CSS from the same folder:
import "./LoginOrSignup.css";

const LoginOrSignup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Column: Logo + DATADOG Text */}
        <div className="login-left">
          <div>
            <img src="/dog.svg" alt="Datadog Logo" className="logo-img" />
          
          </div>
        </div>

        {/* Right Column: White Card with Stytch Form */}
        <div className="login-right">
          <div className="login-card">
            <h2>Log in to Datadog</h2>
            <p className="new-user-line">
              New user?{" "}
              <a
                href="https://www.datadoghq.com/pricing/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try for free
              </a>
            </p>

            <StytchB2B
              config={discoveryConfig}
              styles={discoveryStyles}
              callbacks={{
                onEvent: (event) => {
                  if (
                    event.type === StytchEventType.AuthenticateFlowComplete
                  ) {
                    navigate("/dashboard", { replace: true });
                  }
                },
              }}
            />

            <div className="login-footer">
              &copy; Datadog, Inc. 2025 ・{" "}
              <a
                href="https://www.datadoghq.com/legal/master-subscription-agreement/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Master Subscription Agreement
              </a>{" "}
              ・{" "}
              <a
                href="https://www.datadoghq.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              ・{" "}
              <a
                href="https://www.datadoghq.com/legal/cookie/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOrSignup;