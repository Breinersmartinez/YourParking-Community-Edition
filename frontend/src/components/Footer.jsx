import { resourcesLinks, platformLinks, communityLinks } from "../constants";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-ink-900/60 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary-500" />
          <span className="text-lg font-bold text-white">
            Your<em className="not-italic text-primary-500">Parking</em>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300">Recursos</h3>
            <ul className="space-y-2">
              {resourcesLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-neutral-400 transition-colors hover:text-primary-400">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300">Plataforma</h3>
            <ul className="space-y-2">
              {platformLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-neutral-400 transition-colors hover:text-primary-400">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-300">Comunidad</h3>
            <ul className="space-y-2">
              {communityLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-neutral-400 transition-colors hover:text-primary-400">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} YourParking · Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
