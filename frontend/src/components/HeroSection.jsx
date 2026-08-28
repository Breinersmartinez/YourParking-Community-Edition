import Parqueadero1 from "../assets/Parqueadero1.2.mp4";
import Parqueadero2 from "../assets/Parqueadero1.3.mp4";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/Login');
  };

  return (

    
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Bienvenido a
        <span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
          {" "}
          YourParking
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        YourParking es una plataforma innovadora que te permite encontrar y
        reservar espacios de estacionamiento de manera rápida y segura. Con
        nosotros, olvídate de dar vueltas buscando donde estacionar.
      </p>
      
      <div className="flex justify-center my-10">
     <button className="py-2 px-1 rounded-md bg-gradient-to-r from-blue-500 to-blue-800" onClick={handleLoginClick}>
              Reservar
            </button>
        <a href="https://api.whatsapp.com/send/?phone=573138619952&text&type=phone_number&app_absent=0" className="py-3 px-4 mx-3 rounded-md border">
          Contactarse
        </a>
      </div>
      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-sm shadow-blue-400 mx-2 my-4"
        >
          <source src={Parqueadero1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-sm shadow-blue-400 mx-2 my-4"
        >
          <source src={Parqueadero2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default HeroSection;