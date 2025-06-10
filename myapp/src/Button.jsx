function Button({ message, onClick}) {
  return (
    <div>
      <button 
        className="bg-lime-400 text-black px-4 py-2 rounded border-r-2 border-black hover:bg-lime-500 transition duration-300"
        style={{ fontFamily: 'Orbitron' }}
        onClick={onClick}
      >
        {message}
      </button>
    </div>
  );
}
export default Button;
