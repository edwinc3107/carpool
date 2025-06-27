function Navbar() {
  return (
    <div className="fixed top-0 w-full py-6 z-50  backdrop-blur-md">
      <ul className="flex justify-center divide-x divide-gray-600">
        <li>
          <a
            href="/dashboard"
            className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/findride"
            className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
          >
            Find Ride
          </a>
        </li>
        <li>
          <a
            href="/hostride"
            className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
          >
            Host Ride
          </a>
        </li>
        <li>
          <a
            href="/findride"
            className="text-white font-semibold px-5 py-2 inline-block rounded transition duration-300 ease-in-out hover:border-b-4 hover:border-lime-400"
          >
            My Profile
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
