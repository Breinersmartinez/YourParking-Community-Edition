import { CheckCircle2 } from "lucide-react";
import codeImg from "../assets/parqueaderoSeñalizacionRoja.jpg";
import { checklistItems } from "../constants";

const Workflow = () => {
  return (
    <div className="mt-20" id="Caracteristicas">
      <h2 className="mt-6 text-center text-3xl tracking-wide sm:text-5xl lg:text-6xl">
        Caracteristicas{" "}
        <span className="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
          de los servicios del parqueadero.
        </span>
      </h2>
      <div className="flex flex-wrap justify-center">
        <div className="w-full p-2 lg:w-1/2">
          <img
            src={codeImg}
            alt="Señalización del parqueadero"
            className="w-full rounded-xl border border-neutral-800"
          />
        </div>
        <div className="w-full pt-12 lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="mb-12 flex">
              <div className="mx-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 p-2 text-primary-500">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mb-2 mt-1 text-xl text-white">{item.title}</h5>
                <p className="text-neutral-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;
