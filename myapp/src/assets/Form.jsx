function Form({ title, onSubmit, children }) {
  return (
    <div
      className="bg-gradient-to-br from-gray-800 to-black text-white rounded-2xl p-8 shadow-lg max-w-md w-full border border-lime-400"
      style={{ fontFamily: "Orbitron" }}
    >
      <h2 className="text-3xl font-extrabold text-center text-lime-400 mb-6">
        {title}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <button
          type="submit"
          className="w-full bg-lime-400 hover:bg-lime-500 text-black py-2 px-4 rounded shadow-lg transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form
