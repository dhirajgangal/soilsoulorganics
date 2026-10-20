/** A labeled form control with an error message underneath. */
export default function Field({ label, name, error, children }) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      {children}
      {error ? (
        <span className="field-error" id={`${name}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
