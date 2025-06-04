// src/components/LoginOrSignup.tsx

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { StytchB2B, useStytchB2BClient } from "@stytch/react/b2b";
import { StytchEventType } from "@stytch/vanilla-js/b2b";
import { discoveryConfig, discoveryStyles } from "../utils/stytchConfig";
import "./LoginOrSignup.css";

//
// ─── REPLACE THESE WITH YOUR REAL B2B TEST/LIVE IDs ─────────────────────────
const MEMBER_ID       = "member-test-0f110fdb-6e23-47ee-9e24-8ca6d0a3acff";
const ORGANIZATION_ID = "organization-test-d0206e4a-5353-4cf2-ac00-e07f888d2fd1";

export const LoginOrSignup: React.FC = () => {
  const navigate = useNavigate();
  const stytch   = useStytchB2BClient(); // requires <StytchB2BProvider> in main.tsx

  //
  // ─── MODE STATE: "discovery" or "sms" ────────────────────────────────────────
  //
  const [mode, setMode] = useState<"discovery" | "sms">("discovery");

  //
  // ─── SMS OTP STATE ──────────────────────────────────────────────────────────
  //
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // "+1XXXXXXXXXX"
  const [smsCode,     setSmsCode]     = useState<string>(""); // six-digit code
  const [error,       setError]       = useState<string | null>(null);

  //
  // ─── (1) DISCOVERY CALLBACK ─────────────────────────────────────────────────
  // When Stytch Discovery (Google / SSO / Magic Link) finishes, it fires
  // an event of type AuthenticateFlowComplete. We then flip into SMS mode.
  //
  const onDiscoveryEvent = useCallback((event: { type: string }) => {
    if (event.type === StytchEventType.AuthenticateFlowComplete) {
      setMode("sms");
    }
  }, []);


  //
  // ─── (2) SEND SMS OTP ────────────────────────────────────────────────────────
  // Before sending an SMS OTP, we check for any existing session and revoke it.
  //
  const handleSendSmsOtp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        // 2a) Check for any active session
        let activeSessionId: string | null = null;
        try {
          const sessionInfo = await stytch.session.getInfo();
          activeSessionId = sessionInfo.session?.member_session_id ?? null;
        } catch {
          // No active session found → ignore
          activeSessionId = null;
        }

        // 2b) If a session existed, revoke it
  //       if (activeSessionId) {
  //         await stytch.session.revoke()
  // .then(() => window.location.href = '/');
  //         console.log("ℹ️ Revoked previous session:", activeSessionId);
  //       }

        console.log(activeSessionId);
        // 2c) Now send the SMS OTP (B2B signature)
        await stytch.otps.sms.send({
          mfa_phone_number:  phoneNumber.trim(),
          member_id:         MEMBER_ID,
          organization_id:   ORGANIZATION_ID,
          // expiration_minutes: 5, // optional (default is 5)
        });

        alert("✅ SMS OTP sent! Check your phone for the 6-digit code.");
      } catch (err: any) {
        console.error("❌ Failed to send SMS OTP:", err);
        setError(
          err?.message ||
          "Error sending SMS OTP. Please confirm your phone number and try again."
        );
      }
    },
    [phoneNumber, stytch]
  );


  //
  // ─── (3) VERIFY SMS OTP ─────────────────────────────────────────────────────
  //
  const handleVerifySmsOtp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!smsCode.trim()) {
        setError("Please enter the 6-digit code you received.");
        return;
      }

      try {
        await stytch.otps.sms.authenticate({
          organization_id:         ORGANIZATION_ID,
          member_id:               MEMBER_ID,
          code:                    smsCode.trim(),
          session_duration_minutes: 60, // optional
        });

        // On success, navigate to /dashboard
        navigate("/dashboard", { replace: true });
      } catch (err: any) {
        console.error("❌ Invalid code or verify failed:", err);
        setError(
          err?.message ||
          "Invalid code. Please try again or resend a new OTP."
        );
      }
    },
    [smsCode, stytch, navigate]
  );


  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* ─────────────────────────────────────────────────────────────────────────
            LEFT COLUMN: Datadog “dog” icon + text
        ───────────────────────────────────────────────────────────────────────── */}
        <div className="login-left">
          <img src="/dog.svg" alt="Datadog Logo" className="logo-img" />
          <h1 className="datadog-text">DATADOG</h1>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────
            RIGHT COLUMN: “Discovery” (Google/SSO/MagicLink) OR SMS OTP
        ───────────────────────────────────────────────────────────────────────── */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-heading">Log in to Datadog</h2>
            <p className="new-user-line">
              <span style={{ color: "#FFFFFF" }}>New user?</span>{" "}
              <a
                href="https://www.datadoghq.com/pricing/"
                target="_blank"
                rel="noopener noreferrer"
                className="try-link"
              >
                Try for free →
              </a>
            </p>

            {/* ─────────────────────────────────────────────────────────────────────
                A) DISCOVERY MODE
            ───────────────────────────────────────────────────────────────────── */}
            {mode === "discovery" && (
              <StytchB2B
                config={discoveryConfig}
                styles={discoveryStyles}
                callbacks={{ onEvent: onDiscoveryEvent }}
              />
            )}

            {/* ─────────────────────────────────────────────────────────────────────
                B) SMS OTP MODE (after Discovery completes)
            ───────────────────────────────────────────────────────────────────── */}
            {mode === "sms" && (
              <>
                <div className="divider">— or via phone (SMS OTP) —</div>

                <form className="sms-form" onSubmit={handleSendSmsOtp}>
                  <label htmlFor="phone-input" className="sms-label">
                    Phone Number (E.164)
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1XXXXXXXXXX"
                    className="sms-input"
                    required
                  />
                  <button type="submit" className="sms-button">
                    Send SMS OTP
                  </button>
                </form>

                <form className="sms-form" onSubmit={handleVerifySmsOtp}>
                  <label htmlFor="code-input" className="sms-label">
                    Enter 6-digit Code
                  </label>
                  <input
                    id="code-input"
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="123456"
                    className="sms-input"
                    required
                  />
                  <button type="submit" className="sms-button">
                    Verify Code
                  </button>
                </form>

                {error && <p className="sms-error">{error}</p>}
              </>
            )}

            {/* ─────────────────────────────────────────────────────────────────────
                FOOTER LINKS
            ───────────────────────────────────────────────────────────────────── */}
            <div className="login-footer" style={{ marginTop: "1.5rem" }}>
              &copy; Datadog, Inc. 2025&nbsp;•&nbsp;
              <a
                href="https://www.datadoghq.com/legal/master-subscription-agreement/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Master Subscription Agreement
              </a>
              &nbsp;•&nbsp;
              <a
                href="https://www.datadoghq.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Privacy Policy
              </a>
              &nbsp;•&nbsp;
              <a
                href="https://www.datadoghq.com/legal/cookie/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
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