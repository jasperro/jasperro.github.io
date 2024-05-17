import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "url";
import path from "path";
import { readFileSync } from "fs";
import { Plugin } from "rollup";

// Adapted from https://stackoverflow.com/questions/73847316
const bufferLoader: Plugin = {
    name: "buffer-loader",
    transform(_, id) {
        const [path, query] = id.split("?");
        if (query != "buffer") return null;

        const data = readFileSync(path);
        const hex = data.toString("hex");

        return `export default Buffer.from("${hex}", "hex");`;
    },
};

// https://astro.build/config
export default defineConfig({
    integrations: [
        icon({
            svgoOptions: {
                plugins: [
                    {
                        name: "preset-default",
                        params: {
                            overrides: {
                                inlineStyles: false,
                            },
                        },
                    },
                ],
            },
        }),
        mdx(),
        sitemap(),
    ],
    vite: {
        plugins: [bufferLoader],
        resolve: {
            alias: {
                node_modules: path.resolve(
                    path.dirname(fileURLToPath(import.meta.url)),
                    "node_modules"
                ),
            },
        },
    },
});
