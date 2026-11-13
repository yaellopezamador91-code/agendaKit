// Reemplaza con tu URL de Apps Script que termina en /exec
const API_URL = "TU_URL_DE_APPS_SCRIPT_AQUI";

// Obtener todas las citas/notas de Google Sheets
async function obtenerRegistros() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error("Error al consultar datos");
    return await respuesta.json();
  } catch (error) {
    console.error("Error obteniendo datos:", error);
    return [];
  }
}

// Guardar una nueva cita o nota en Google Sheets
async function guardarRegistro(datos) {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(datos)
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error guardando registro:", error);
    return { status: "error" };
  }
}
