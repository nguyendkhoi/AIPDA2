import flecheG from "../../assets/icons/fleche-g.svg";
import fleche from "../../assets/icons/fleche-d.svg";

export default function Editions() {
  return (
    <section id="previous-editions" className="py-12">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Revivez nos éditions précédentes
      </h2>
      <div className="relative">
        <button
          className="absolute left-0 top-8 hover:bg-gray-300 rounded-full p-3 -ml-4 opacity-75"
          aria-label="Édition précédente"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <div className="flex space-x-3 justify-center">
          <div className="image-editions h-30 w-40 rounded">image edition</div>
          <div className="image-editions h-30 w-40 rounded">image edition</div>
          <div className="image-editions h-30 w-40 rounded">image edition</div>
          <div className="image-editions h-30 w-40 rounded">image edition</div>
        </div>
        <button
          className="absolute right-0 top-8 hover:bg-gray-300 rounded-full p-3 -mr-4 opacity-75"
          aria-label="Édition suivante"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
}
