export default function FormField({
  id,
  label,
  icon,
  error,
  endAdornment,
  className = "mb-3",
  ...inputProps
}) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="input-group has-validation">
        {icon && <span className="input-group-text bg-light"><i className={`bi ${icon}`}></i></span>}
        <input id={id} className={`form-control ${error ? "is-invalid" : ""}`} {...inputProps} />
        {endAdornment}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}
