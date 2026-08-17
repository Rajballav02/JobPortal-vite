export default function Loader({ fullscreen = false, small = false }) {
  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        <div className="brand-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
  return (
    <div className={`d-flex justify-content-center align-items-center ${small ? "py-2" : "py-5"}`}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
