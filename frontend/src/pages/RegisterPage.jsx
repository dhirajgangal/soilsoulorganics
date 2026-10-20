/** Create a customer account and log in straight away. */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Field from "../components/Field";
import usePageTitle from "../hooks/usePageTitle";
import moundImage from "../assets/photos/plant-mound.jpg";
import { useAuth } from "../context/AuthContext";

const EMPTY = { name: "", email: "", phone: "", password: "" };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Create account · Soil Soul");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate("/account", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell image={moundImage} imageAlt="A young plant standing on a mound of dark soil.">
      <div className="auth-copy">
        <p className="eyebrow">Join Soil Soul</p>
        <h1>Create an account</h1>
        <p className="muted">Save addresses, a wishlist, and the orders you place.</p>
        <form onSubmit={handleSubmit} noValidate>
          {error ? <p className="banner banner-error">{error}</p> : null}
          <Field label="Full name" name="name">
            <input id="name" name="name" autoComplete="name" value={form.name} onChange={updateField} required />
          </Field>
          <Field label="Email" name="email">
            <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} required />
          </Field>
          <Field label="Phone" name="phone">
            <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} required />
          </Field>
          <Field label="Password" name="password">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={updateField}
              required
            />
          </Field>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="auth-links">
          <Link to="/login">Already have an account? Log in</Link>
        </p>
      </div>
    </AuthShell>
  );
}
