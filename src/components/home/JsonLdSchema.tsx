export default function JsonLdSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HardwareStore",
        "@id": "https://suministrosld.com/#localbusiness",
        name: "Suministros L&D 2023, C.A.",
        description:
          "Ferretería y distribuidora de materiales eléctricos, iluminación LED, tuberías PVC y herramientas en Charallave, Valles del Tuy.",
        url: "https://suministrosld.com",
        telephone: "+584141025386",
        email: "suministrosld2023@gmail.com",
        image: "https://suministrosld.com/og-suministros-ld.jpg",
        priceRange: "$$",
        currenciesAccepted: "VES, USD",
        paymentAccepted: "Pago Móvil, Transferencia, Zelle, Efectivo",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Calle 15 Miranda, frente al Concejo Municipal",
          addressLocality: "Charallave",
          addressRegion: "Miranda",
          postalCode: "1210",
          addressCountry: "VE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 10.246132,
          longitude: -66.861945,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:00",
            closes: "17:00",
          },
        ],
        areaServed: [
          { "@type": "City", name: "Charallave" },
          { "@type": "City", name: "Cúa" },
          { "@type": "City", name: "Ocumare del Tuy" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Catálogo de Productos",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Interruptores Termomagnéticos y Control Industrial",
            },
            {
              "@type": "OfferCatalog",
              name: "Canalización y Tubería PVC",
            },
            {
              "@type": "OfferCatalog",
              name: "Ferretería y Herramientas",
            },
            {
              "@type": "OfferCatalog",
              name: "Iluminación LED",
            },
          ],
        },
        sameAs: [
          "https://www.instagram.com/suministrosld2023",
          "https://wa.me/584141025386",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://suministrosld.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Qué marcas de interruptores termomagnéticos (breakers) tienen disponibles?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Trabajamos con interruptores termomagnéticos de marcas reconocidas como Schneider Electric (línea QO y Easy9), Protonic Electric y Belt-G. Disponibles en amperajes desde 15A hasta 100A para tableros residenciales e industriales. Todos los precios se muestran a tasa BCV del día.",
            },
          },
          {
            "@type": "Question",
            name: "¿Hacen envíos fuera de Charallave?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí, realizamos delivery local cubriendo Charallave, Cúa y Ocumare del Tuy en los Valles del Tuy, Estado Miranda. También puedes retirar directamente en nuestra tienda física ubicada en la Calle 15 Miranda, Charallave. Para zonas fuera de cobertura, contáctanos por WhatsApp para coordinar el envío.",
            },
          },
          {
            "@type": "Question",
            name: "¿Tienen precios especiales para compras al por mayor?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí, ofrecemos descuentos automáticos por volumen a partir de 5 unidades en productos seleccionados como cintas aislantes, tubos PVC, cajetines y conectores. Los electricistas y contratistas pueden solicitar cotizaciones personalizadas para obras completas a través de nuestro WhatsApp.",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://suministrosld.com/#website",
        name: "Suministros L&D",
        url: "https://suministrosld.com",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://suministrosld.com/catalogo?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
