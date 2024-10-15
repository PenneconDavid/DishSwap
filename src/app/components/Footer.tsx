const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-500 to-pink-500 p-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} DishSwap. All rights reserved.
        </p>
        <div className="mt-2">
          <a
            href="https://x.com/Davey_Rockets"
            target="_blank"
            className="text-white hover:text-gray-300 mx-2"
          >
            Twitter/X
          </a>
          <a
            href="https://github.com/PenneconDavid"
            target="_blank"
            className="text-white hover:text-gray-300 mx-2"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
