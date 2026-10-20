/** Update name, email, phone, and password. */
import { useState } from "react";
import Button from "../../components/Button";
import Field from "../../components/Field";
import Icon from "../../components/Icon";
import usePageTitle from "../../hooks/usePageTitle";
import { useAuth } from "../../context/AuthContext";
import { changePassword, updateProfile } from "../../services/api";

export default function AccountProfilePage() {
  const { user, replaceUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  usePageTitle("My profile · Soil Soul");

  function updateProfileField(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  }

  function updatePasswordField(event) {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSavingProfile(true);
    try {
      const next = await updateProfile(profile);
      replaceUser(next);
      setMessage("Profile saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwords.new_password.length < 8) {
      setError("Use a new password of at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      const result = await changePassword(passwords);
      setPasswords({ current_password: "", new_password: "" });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      <div className="page-kicker">
        <span className="kicker-icon">
          <Icon name="user" />
        </span>
        <div>
          <h1>My profile</h1>
          <p className="muted">The name, email, and phone used on your orders.</p>
        </div>
      </div>
      {error ? <p className="banner banner-error">{error}</p> : null}
      {message ? <p className="banner">{message}</p> : null}
      <form className="panel" onSubmit={saveProfile} noValidate>
        <h2>Details</h2>
        <Field label="Full name" name="name">
          <input id="name" name="name" value={profile.name} onChange={updateProfileField} required />
        </Field>
        <Field label="Email" name="email">
          <input id="email" name="email" type="email" value={profile.email} onChange={updateProfileField} required />
        </Field>
        <Field label="Phone" name="phone">
          <input id="phone" name="phone" value={profile.phone} onChange={updateProfileField} required />
        </Field>
        <Button type="submit" disabled={savingProfile}>
          {savingProfile ? "Saving…" : "Save profile"}
        </Button>
      </form>
      <form className="panel" onSubmit={savePassword} noValidate>
        <h2>Password</h2>
        <Field label="Current password" name="current_password">
          <input
            id="current_password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            value={passwords.current_password}
            onChange={updatePasswordField}
            required
          />
        </Field>
        <Field label="New password" name="new_password">
          <input
            id="new_password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            value={passwords.new_password}
            onChange={updatePasswordField}
            required
          />
        </Field>
        <Button type="submit" disabled={savingPassword}>
          {savingPassword ? "Updating…" : "Update password"}
        </Button>
      </form>
    </>
  );
}
