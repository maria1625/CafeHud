import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "../src/index.css";

const SITE_URL = "https://cafehud-frontend.onrender.com";
const DEFAULT_TITLE = "CafeHub Premium | Cafe de especialidad y compras en linea";
const DEFAULT_DESCRIPTION =
  "Descubre CafeHub Premium: catalogo de cafe de especialidad, favoritos, reseñas y pedidos en linea.";

const getBackendOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return null;
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return null;
  }
};

const buildCsp = () => {
  const isDev = import.meta.env.DEV;
  const connectSrc = isDev
    ? "'self' http: https: ws: wss:"
    : "'self' https: wss:";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "img-src 'self' https: data: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self' 'unsafe-inline'",
    `connect-src ${connectSrc}`,
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
};

export function Layout({ children }) {
  const backendOrigin = getBackendOrigin();

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#3E2723" />
        <meta httpEquiv="Content-Security-Policy" content={buildCsp()} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CafeHub Premium" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/images/hero.png`} />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/images/hero.png`} />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="dns-prefetch" href={SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {backendOrigin && <link rel="preconnect" href={backendOrigin} crossOrigin="anonymous" />}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
