/** Choose a new password from the link in the reset email. */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Field from "../components/Field";
import usePageTitle from "../hooks/usePageTitle";
import glowImage from "../assets/photos/plant-glow.png";
import { resetPassword } from "../services/api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Reset password · Soil Soul");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await resetPassword({ token, password });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell image={glowImage} imageAlt="A leafy green plant growing from soil.">
      <div className="auth-copy">
        <p className="eyebrow">Account help</p>
        <h1>Choose a new password</h1>
        {token ? (
          <form onSubmit={handleSubmit} noValidate>
            {error ? <p className="banner banner-error">{error}</p> : null}
            {message ? <p className="banner">{message}</p> : null}
            <Field label="New password" name="password">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" disabled={submitting || Boolean(message)}>
              {submitting ? "Saving…" : "Update password"}
            </Button>
          </form>
        ) : (
          <p className="banner banner-error">This reset link is missing. Request a new one.</p>
        )}
        <p className="auth-links">
          <Link to="/login">Log in</Link>
          <Link to="/forgot-password">Request a new link</Link>
        </p>
      </div>
    </AuthShell>
  );
}
