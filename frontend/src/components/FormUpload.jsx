function FormUpload({ onSubmit, onFileChange, loading }) {
  return (
    <form onSubmit={onSubmit}>
      <input type="file" accept="image/*" required onChange={onFileChange} />
      <br />

      {loading ? (
        <button type="button" disabled>
          <i className="fa-solid fa-spinner fa-spin"></i> Processing
        </button>
      ) : (
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i> Process
        </button>
      )}
    </form>
  );
}

export default FormUpload;
