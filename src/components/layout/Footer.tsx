import { Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-canvas-elevated border-t border-hairline py-8 px-4 text-xs mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Legal & Brand info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-1.5 font-display font-bold text-sm text-text-primary">
            <svg
              className="h-5 w-5 text-accent-electric"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>SUMINISTROS L&D 2023, C.A.</span>
          </div>
          <span className="text-text-muted font-mono leading-none">RIF: J-50367899-0</span>
          <p className="text-text-secondary mt-2 max-w-xs leading-relaxed">
            Tu aliado en iluminación y materiales eléctricos de todo los Valles del Tuy.
          </p>
        </div>

        {/* Address and contacts */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1.5">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <MapPin className="h-3.5 w-3.5 text-accent-amber" />
            <span>Charallave Centro, Edo. Miranda, Venezuela</span>
          </div>
          <a
            href="https://wa.me/584120000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-secondary hover:text-accent-electric transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-success" />
            <span>+58 (412) 000-0000 (Ventas)</span>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-hairline/35 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-text-muted">
        <span>
          &copy; {currentYear} Suministros L&D. Todos los derechos reservados.
        </span>
        <div className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          <span>Desarrollado con Next.js + TailwindCSS</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
