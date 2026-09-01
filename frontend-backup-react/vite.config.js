
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
});

/*
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Aplicacion_de_gestion_para_parqueadero/",
});
*/


