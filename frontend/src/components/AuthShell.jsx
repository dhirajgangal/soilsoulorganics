/** Shared frame for login, register, and password pages. */
export default function AuthShell({ image, imageAlt, children }) {
  return (
    <section className="auth-screen">
      <div className="auth-stage">
        <div className="auth-visual">
          <img src={image} alt={imageAlt} />
          <p>Let Soil Soul Nourish Nature</p>
        </div>
        <div className="auth-panel">{children}</div>
      </div>
    </section>
  );
}
