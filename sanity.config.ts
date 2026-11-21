"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes as productTypes } from "./sanity/schemaTypes/product";
import { order } from "./sanity/schemaTypes/order";

const schemaTypes = [...productTypes, order];

export default defineConfig({
  name: "dots",
  title: "DOTS Admin",
  basePath: "/studio",
  projectId: projectId || "not-configured",
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
