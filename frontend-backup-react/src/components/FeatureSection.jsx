import { features } from "../constants";

const FeatureSection = () => {
  return (
    <div className="mt-20 min-h-[800px] border-b border-neutral-800" id="Servicios">
      <div className="text-center">
        <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-sm font-medium uppercase tracking-wide text-primary-400">
          Servicios
        </span>
        <h2 className="mt-10 text-3xl tracking-wide sm:text-5xl lg:mt-16 lg:text-6xl">
          Controlamos cada ingreso y{" "}
          <span className="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
            salida para garantizar la seguridad de tu vehículo.
          </span>
        </h2>
      </div>
      <div className="mt-12 flex flex-wrap lg:mt-20">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="flex">
              <div className="mx-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 p-2 text-primary-500">
                {feature.icon}
              </div>
              <div>
                <h5 className="mt-1 mb-6 text-xl text-white">{feature.text}</h5>
                <p className="mb-20 p-2 text-neutral-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
