import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { createContext, useContext, useEffect, useState } from "react";
import { SSE_Service } from "./service/sse_service";
import { SSE_DOMAIN } from "./utility/api_static";
import { useStreamingInputStore } from "./zustand/streaming_store";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

export default function App() {
	const set_sse = useStreamingInputStore(x=>x.set_streaming);

	useEffect(() => {
		const sse_service = new SSE_Service()   
		sse_service.connect(SSE_DOMAIN);
		set_sse(sse_service);

		return () => {
		};
	  }, []);
	
	return (<>
	<Outlet />
	</>);
}
