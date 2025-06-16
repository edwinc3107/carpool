

function Card({Title, feature, link}){
    return(
      <div className="bg-black rounded-2xl shadow-xl p-10 w-72 h-72 hover:scale-105 transition-transform border-1 border-transparent hover:border-lime-400">
      <div className="flex gap-2">
      <h2 className="text-xl text-white font-bold text-gray-800">{Title}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4 pt-4">{feature}</p>
            <p className="">
        {link}
      </p>
    </div>
    );
}

export default Card;