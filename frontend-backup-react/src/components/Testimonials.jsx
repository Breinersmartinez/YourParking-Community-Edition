import { testimonials } from "../constants";

const Testimonials = () => {
  return (
    <div className="mt-20 tracking-wide" id="Opiniones">
      <h2 className="my-10 text-center text-3xl sm:text-5xl lg:my-20 lg:text-6xl">
        Opiniones
      </h2>
      <div className="flex flex-wrap justify-center">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="w-full px-4 py-2 sm:w-1/2 lg:w-1/3">
            <div className="rounded-xl border border-neutral-800 bg-ink-900 p-6">
              <div className="mb-4 text-accent-400">
                {"★★★★★"}
              </div>
              <p className="text-neutral-300">{testimonial.text}</p>
              <div className="mt-8 flex items-start">
                <img
                  className="mr-4 h-12 w-12 rounded-full border-2 border-primary-500"
                  src={testimonial.image}
                  alt={testimonial.user}
                />
                <div>
                  <h6 className="text-white">{testimonial.user}</h6>
                  <span className="text-sm italic text-primary-400">{testimonial.company}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
