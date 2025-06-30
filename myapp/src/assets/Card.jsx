function Card({ title, feature, link }) {
    const isTextFeature = typeof feature === "string";
  return (
    <div className="bg-black shadow-xl p-10 w-82 h-82 hover:scale-105 transition-transform border-1 border-transparent hover:border-lime-400">
      <div className="flex gap-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {isTextFeature ? (
          <p className="text-sm text-gray-300">{feature}</p>
        ) : (
          <div className="text-sm text-gray-300">{feature}</div>
        )}
      <div>{link}</div>
    </div>
  );
}

export default Card;