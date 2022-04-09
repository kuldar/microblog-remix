import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

// Hydrate remix app
hydrate(<RemixBrowser />, document);
