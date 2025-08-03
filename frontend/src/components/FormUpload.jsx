function FormUpload ({onSubmit, onFileChange}) {
    return (
        <form onSubmit={onSubmit}>
            <input type="file" accept="image/*" required onChange={onFileChange} />
            <br />
            <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i> Process
            </button>
        </form>
    )
}

export default FormUpload;