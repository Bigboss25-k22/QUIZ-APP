import type { Preview } from "@storybook/nextjs-vite";
import "@fontsource-variable/archivo";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/500.css";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    layout: "centered",
  },
};

export default preview;
