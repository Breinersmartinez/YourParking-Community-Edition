import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLANS = [
  { title: "Carro", price: "Desde $4.000", features: ["Reservas en línea", "Control de acceso básico", "Soporte por correo", "Seguridad 24/7"], popular: false },
  { title: "Motocicleta", price: "Desde $1.000", features: ["Reservas en línea", "Control de acceso básico", "Soporte por correo", "Seguridad 24/7"], popular: false },
  { title: "Abono Mensual", price: "Desde $62.000", features: ["Acceso ilimitado", "Soporte prioritario", "Estacionamiento permanente", "Beneficios exclusivos"], popular: true },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-20" id="Precios">
      <h2 className="my-8 text-center text-3xl tracking-wide sm:text-5xl lg:text-6xl">
        Tarifas Del Parqueadero
      </h2>
      <div className="flex flex-wrap">
        {PLANS.map((option, index) => (
          <div key={index} className="w-full p-2 sm:w-1/2 lg:w-1/3">
            <div
              className={`relative flex h-full flex-col rounded-xl border p-8 ${
                option.popular
                  ? "border-primary-500 bg-primary-500/5"
                  : "border-neutral-700 bg-ink-900"
              }`}
            >
              {option.popular && (
                <span className="absolute -top-3 right-6 rounded-full bg-accent-400 px-3 py-1 text-xs font-semibold text-ink-950">
                  Más popular
                </span>
              )}
              <p className="mb-6 text-2xl font-semibold text-white">{option.title}</p>
              <p className="mb-6">
                <span className="mr-2 text-4xl font-bold text-primary-500">{option.price}</span>
              </p>
              <ul className="mb-8 flex-1">
                {option.features.map((feature, fi) => (
                  <li key={fi} className="mt-4 flex items-center text-neutral-300">
                    <CheckCircle2 className="mr-2 text-primary-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login')}
                className={`w-full py-2.5 ${
                  option.popular ? 'btn-primary' : 'btn-outline'
                }`}
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
