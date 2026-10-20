/** Ask for a password reset link by email. */
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Field from "../components/Field";
import usePageTitle from "../hooks/usePageTitle";
import trowelImage from "../assets/photos/trowel.jpg";
import { forgotPassword } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Forgot password · Soil Soul");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const result = await forgotPassword(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell image={trowelImage} imageAlt="A garden trowel beside a small plant in soil.">
      <div className="auth-copy">
        <p className="eyebrow">Account help</p>
        <h1>Forgot password</h1>
        <p className="muted">Enter your account email. If it matches an account, we send a reset link.</p>
        <form onSubmit={handleSubmit} noValidate>
          {error ? <p className="banner banner-error">{error}</p> : null}
          {message ? <p className="banner">{message}</p> : null}
          <Field label="Email" name="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="auth-links">
          <Link to="/login">Back to log in</Link>
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}
