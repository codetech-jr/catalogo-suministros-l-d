import React from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 py-16 px-6 lg:px-8 mt-auto print:hidden select-none">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">
          
          {/* Columna 1: Marca y Confianza (Toma 2 fracciones) — centrada en móvil, izquierda en md+ */}
          <div className="lg:col-span-2 flex flex-col gap-4 text-center md:text-left items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start gap-1.5 font-display font-bold text-lg text-white">
              <svg
                className="h-6 w-6 text-[#0ee0d5]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="tracking-wide">SUMINISTROS L&D 2023, C.A.</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest leading-none">
              RIF: J-50367899-0
            </span>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Expertos abasteciendo de soluciones eléctricas e iluminación a hogares, comercios y contratistas de Valles del Tuy.
            </p>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/suministros2023ld/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#0ee0d5] transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.792.052 1.03.048 1.83.21 2.455.452a4.722 4.722 0 011.666 1.086 4.72 4.72 0 011.086 1.666c.242.624.404 1.424.452 2.454.044 1.008.052 1.362.052 3.792s-.008 2.784-.052 3.792c-.048 1.03-.21 1.83-.452 2.455a4.72 4.72 0 01-1.086 1.666 4.722 4.722 0 01-1.666 1.086c-.624.242-1.424.404-2.454.452-1.008.044-1.362.052-3.792.052s-2.784-.008-3.792-.052c-1.03-.048-1.83-.21-2.455-.452a4.72 4.72 0 01-1.666-1.086 4.72 4.72 0 01-1.086-1.666c-.242-.624-.404-1.424-.452-2.454C2.008 15.284 2 14.93 2 12.5s.008-2.784.052-3.792c.048-1.03.21-1.83.452-2.455a4.72 4.72 0 011.086-1.666 4.72 4.72 0 011.666-1.086c.624-.242 1.424-.404 2.454-.452C9.53 2.008 9.884 2 12.315 2zm-1.108 8.122A3 3 0 1013.07 15.02a3 3 0 00-1.863-4.898zm0-1.674a4.674 4.674 0 110 9.348 4.674 4.674 0 010-9.348zm5.883-1.207a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Soluciones & Catálogo — centrada en móvil, izquierda en md+ */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider font-display">
              Nuestras Líneas
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="#catalogo"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Iluminación Eficiente
                </a>
              </li>
              <li>
                <a
                  href="#catalogo"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Control Eléctrico
                </a>
              </li>
              <li>
                <a
                  href="#catalogo"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Cables y Material Pesado
                </a>
              </li>
              <li>
                <a
                  href="#catalogo"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Cotización Express de Obras
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Políticas e Información — centrada en móvil, izquierda en md+ */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider font-display">
              Ventas Corporativas
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/tienda-fisica"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Retiros por Tienda
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda-fisica"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Opciones de Flete Logístico
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/584141025386?text=Hola,%20quisiera%20saber%20mas%20sobre%20comprar%20con%20Cashea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Guía para Comprar con Cashea
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/584141025386?text=Hola,%20quisiera%20saber%20sobre%20las%20garantias%20de%20los%20productos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0ee0d5] hover:pl-1 transition-all duration-200 block"
                >
                  Garantías de Productos
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ventas y Soporte — centrada en móvil, izquierda en md+ */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider font-display">
              Soporte y Ventas
            </h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400 w-full items-center md:items-start">
              <a
                href="https://wa.me/584141025386"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-[#0ee0d5] transition-colors w-full"
              >
                <svg className="h-4 w-4 text-emerald-400 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.312 1.98 13.846.953 11.23.953 5.794.953 1.37 5.323 1.366 10.751c-.001 1.76.471 3.479 1.366 5.011l-1.01 3.693 3.791-.986c1.478.808 3.084 1.235 4.534 1.235zm11.38-7.394c-.265-.133-1.57-.775-1.815-.865-.243-.09-.42-.133-.598.133-.176.265-.685.865-.84 1.042-.155.177-.31.198-.577.066-.265-.133-1.122-.413-2.138-1.32-.79-.705-1.325-1.575-1.48-1.84-.155-.267-.016-.41.117-.542.12-.12.265-.31.397-.465.133-.155.177-.266.265-.443.09-.176.044-.332-.022-.465-.067-.133-.598-1.44-.82-1.97-.216-.523-.453-.453-.62-.462-.16-.008-.344-.01-.528-.01-.184 0-.486.068-.74.344-.253.277-.97.95-.97 2.32s.995 2.69 1.13 2.87c.133.18 1.956 2.99 4.743 4.195.662.285 1.18.456 1.58.584.667.212 1.274.182 1.754.11.535-.08 1.57-.643 1.79-1.265.22-.623.22-1.157.155-1.265-.067-.108-.244-.153-.51-.287z"/>
                </svg>
                <span>+58 (414) 102-5386</span>
              </a>
              <a
                href="mailto:ventas@suministrosld.com.ve"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-[#0ee0d5] transition-colors break-all w-full"
              >
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <span>ventas@suministrosld.com.ve</span>
              </a>
              <div className="mt-2 w-full flex justify-center md:justify-start">
                <a
                  href="https://wa.me/584141025386?text=Hola,%20necesito%20soporte%20comercial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium text-slate-350 hover:text-white transition-all bg-transparent active:scale-[0.98]"
                >
                  Ir a Centro de Soporte
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Banda Transaccional Inferior — apilado en móvil y distribuido en escritorio */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left py-6 mt-12 border-t border-slate-800/60 gap-6 text-xs text-slate-500 w-full">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span>
              © 2026 Suministros L&D 2023, C.A. Todos los derechos reservados.
            </span>
            <span className="text-[10px] text-slate-600">
              Hecho por Codetech Jr / Desarrollador Web
            </span>
          </div>

          {/* Hack Psicológico B2B (Modalidades de Pago) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 select-none">
            {/* Banesco */}
            <img
              src="/banesco-logo.png"
              alt="Banesco"
              className="h-7 w-auto object-contain grayscale brightness-0 invert opacity-60 hover:opacity-100 transition-all duration-300 cursor-default"
            />
            {/* Banco de Venezuela */}
            <img
              src="/bdv-banco-de-venezuela.svg"
              alt="Banco de Venezuela"
              className="h-16 w-auto object-contain grayscale brightness-0 invert opacity-60 hover:opacity-100 transition-all duration-300 cursor-default"
            />
            {/* Zelle */}
            <img
              src="/zelle-1.svg"
              alt="Zelle"
              className="h-5 w-auto object-contain grayscale brightness-0 invert opacity-60 hover:opacity-100 transition-all duration-300 cursor-default"
            />
            {/* Pago Móvil */}
            <svg className="h-5 w-auto text-slate-300 fill-current opacity-60 hover:opacity-100 transition-all duration-300 cursor-default" viewBox="0 0 100 24" aria-label="Pago Móvil">
              <g fill="currentColor">
                <path d="M4 2h6c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm3 18a1 1 0 100-2 1 1 0 000 2zm-3-4h6V5H4v11z" />
                <path d="M9 9l-2 2 2 2V9zM5 9v4l2-2-2-2z" />
                <text x="18" y="16" className="font-sans font-extrabold text-[10px] tracking-wider uppercase">Pago Móvil</text>
              </g>
            </svg>
            {/* Cashea */}
            <svg className="h-5 w-auto text-slate-300 fill-current opacity-60 hover:opacity-100 transition-all duration-300 cursor-default" viewBox="0 0 85 24" aria-label="Cashea">
              <g fill="currentColor">
                <path d="M10 20c-3.3 0-6-2.7-6-6s2.7-6 6-6V2c-6.6 0-12 5.4-12 12s5.4 12 12 12c6.6 0 12-5.4 12-12h-6c0 3.3-2.7 6-6 6z" transform="scale(0.8) translate(2, 3)" />
                <text x="24" y="17" className="font-sans font-black text-[13px] tracking-tight">cashea</text>
              </g>
            </svg>
            {/* Binance */}
            <svg className="h-5 w-auto text-slate-300 fill-current opacity-60 hover:opacity-100 transition-all duration-300 cursor-default" viewBox="0 0 85 24" aria-label="Binance">
              <g fill="currentColor">
                <path d="M10 2L5 7l2 2 3-3 3 3 2-2-5-5zm0 14l-3-3-2 2 5 5 5-5-2-2-3 3zm-6-6l-2 2 2 2 2-2-2-2zm12 0l-2 2 2 2 2-2-2-2zm-6-2l-2 2 2 2 2-2-2-2z" transform="scale(0.9) translate(1, 1)" />
                <text x="24" y="17" className="font-sans font-bold text-[12px] tracking-wide uppercase">Binance</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

