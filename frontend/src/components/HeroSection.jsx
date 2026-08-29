import Parqueadero1 from "../assets/Parqueadero1.2.mp4";
import Parqueadero2 from "../assets/Parqueadero1.3.mp4";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => navigate('/login');

  return (
    <div className="relative flex flex-col items-center py-16 lg:py-20">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-600/20 blur-3xl" />

      <div className="relative">
        <h1 className="text-4xl text-center tracking-wide sm:text-6xl lg:text-7xl">
          Bienvenido a{" "}
          <span className="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
            YourParking
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-4xl text-center text-lg text-neutral-400">
          El parqueadero inteligente que te permite reservar, pagar y monitorear
          tu espacio de estacionamiento de forma rápida y segura. Olvídate de
          dar vueltas buscando dónde estacionar.
        </p>
      </div>

      <div className="relative mt-10 flex flex-wrap justify-center gap-4">
        <button className="btn-primary px-8 py-3 text-base" onClick={handleLoginClick}>
          Reservar
        </button>
        <a
          href="https://api.whatsapp.com/send/?phone=573138619952&text&type=phone_number&app_absent=0"
          className="btn-outline px-8 py-3 text-base"
        >
          Contactarse
        </a>
      </div>

      <div className="relative mt-12 flex flex-col justify-center gap-4 md:flex-row">
        <video
          autoPlay
          loop
          muted
          className="w-full rounded-xl border border-primary-600/40 shadow-lg shadow-primary-900/20 md:w-1/2"
        >
          <source src={Parqueadero1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="w-full rounded-xl border border-primary-600/40 shadow-lg shadow-primary-900/20 md:w-1/2"
        >
          <source src={Parqueadero2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default HeroSection;
