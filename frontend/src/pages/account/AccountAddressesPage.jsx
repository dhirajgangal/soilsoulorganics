/** Saved delivery addresses. The first one becomes the default. */
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Field from "../../components/Field";
import Icon from "../../components/Icon";
import usePageTitle from "../../hooks/usePageTitle";
import { createAddress, deleteAddress, getAddresses, makeDefaultAddress } from "../../services/api";

const EMPTY = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Addresses · Soil Soul");

  useEffect(() => {
    let ignore = false;
    getAddresses()
      .then((data) => {
        if (!ignore) {
          setAddresses(data);
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const created = await createAddress({ ...form, is_default: addresses.length === 0 });
      setAddresses((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      setForm(EMPTY);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(addressId) {
    setError("");
    try {
      await deleteAddress(addressId);
      const next = await getAddresses();
      setAddresses(next);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function chooseDefault(addressId) {
    setError("");
    try {
      await makeDefaultAddress(addressId);
      const next = await getAddresses();
      setAddresses(next);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-kicker">
        <span className="kicker-icon">
          <Icon name="pin" />
        </span>
        <div>
          <h1>Addresses</h1>
          <p className="muted">Saved delivery addresses. The default one fills checkout.</p>
        </div>
      </div>
      {loading ? <p className="status-text">Loading addresses…</p> : null}
      {error ? <p className="banner banner-error">{error}</p> : null}
      {!loading && addresses.length === 0 ? (
        <div className="empty-panel">
          <span className="empty-icon">
            <Icon name="pin" />
          </span>
          <h2>No addresses yet</h2>
          <p>Add one below. Checkout can use it the next time you order.</p>
        </div>
      ) : null}
      <div className="order-list">
        {addresses.map((address) => (
          <article className="order-card" key={address.id}>
            <h2>
              <span className="kicker-icon kicker-icon-sm">
                <Icon name="pin" />
              </span>
              {address.full_name}
            </h2>
            {address.is_default ? <span className="status-pill">Default</span> : null}
            <p>
              {address.address_line}, {address.city}, {address.state} {address.postal_code}
            </p>
            <p>{address.phone}</p>
            <div className="card-actions">
              {address.is_default ? null : (
                <Button type="button" variant="secondary" onClick={() => chooseDefault(address.id)}>
                  Make default
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={() => remove(address.id)}>
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
      <form className="panel" onSubmit={handleSubmit} noValidate>
        <h2>Add an address</h2>
        <Field label="Full name" name="full_name">
          <input id="full_name" name="full_name" value={form.full_name} onChange={updateField} required />
        </Field>
        <Field label="Phone" name="phone">
          <input id="phone" name="phone" value={form.phone} onChange={updateField} required />
        </Field>
        <Field label="Address" name="address_line">
          <input id="address_line" name="address_line" value={form.address_line} onChange={updateField} required />
        </Field>
        <div className="field-row">
          <Field label="City" name="city">
            <input id="city" name="city" value={form.city} onChange={updateField} required />
          </Field>
          <Field label="State" name="state">
            <input id="state" name="state" value={form.state} onChange={updateField} required />
          </Field>
        </div>
        <Field label="Postal code" name="postal_code">
          <input id="postal_code" name="postal_code" value={form.postal_code} onChange={updateField} required />
        </Field>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save address"}
        </Button>
      </form>
    </>
  );
}
