let todosLosRegistros = [];

document.addEventListener("DOMContentLoaded", () => {
  const inputFechaFiltro = document.getElementById("fechaSeleccionada");
  const modal = document.getElementById("modalForm");
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const form = document.getElementById("registroForm");
  const radioTipos = document.getElementsByName("tipo");
  const grupoHora = document.getElementById("grupoHora");

  // Establecer fecha de hoy por defecto en el filtro y formulario
  const hoy = new Date().toISOString().split("T")[0];
  inputFechaFiltro.value = hoy;
  document.getElementById("fecha").value = hoy;

  // Cargar datos al iniciar
  cargarDatos();

  // Cambio de fecha en el filtro
  inputFechaFiltro.addEventListener("change", renderizarVistaDiaria);

  // Abrir / Cerrar Modal
  btnAbrirModal.onclick = () => modal.classList.remove("hidden");
  btnCerrarModal.onclick = () => modal.classList.add("hidden");

  // Mostrar/Ocultar campo de hora según el tipo
  radioTipos.forEach(radio => {
    radio.addEventListener("change", (e) => {
      grupoHora.style.display = e.target.value === "Nota" ? "none" : "block";
    });
  });

  // Guardar Registro
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.disabled = true;
    btnGuardar.innerText = "Guardando...";

    const tipoSeleccionado = Array.from(radioTipos).find(r => r.checked).value;

    const nuevoRegistro = {
      tipo: tipoSeleccionado,
      titulo: document.getElementById("titulo").value,
      fecha: document.getElementById("fecha").value,
      hora: tipoSeleccionado === "Actividad" ? document.getElementById("hora").value : "",
      detalle: document.getElementById("detalle").value,
      estado: "Pendiente"
    };

    await guardarRegistro(nuevoRegistro);
    form.reset();
    document.getElementById("fecha").value = hoy;
    modal.classList.add("hidden");
    btnGuardar.disabled = false;
    btnGuardar.innerText = "Guardar en Google Sheets";

    // Recargar la lista
    cargarDatos();
  });
});

async function cargarDatos() {
  todosLosRegistros = await obtenerRegistros();
  renderizarVistaDiaria();
}

function renderizarVistaDiaria() {
  const fechaSeleccionada = document.getElementById("fechaSeleccionada").value;
  const listaActividades = document.getElementById("listaActividades");
  const listaNotas = document.getElementById("listaNotas");

  listaActividades.innerHTML = "";
  listaNotas.innerHTML = "";

  // Filtrar registros por la fecha seleccionada
  const registrosDelDia = todosLosRegistros.filter(item => {
    if (!item.Fecha) return false;
    // Formatear la fecha ingresada para compararla directamente YYYY-MM-DD
    const fechaItem = new Date(item.Fecha).toISOString().split("T")[0];
    return fechaItem === fechaSeleccionada;
  });

  const actividades = registrosDelDia.filter(item => item.Tipo === "Actividad");
  const notas = registrosDelDia.filter(item => item.Tipo === "Nota");

  // Render Actividades
  if (actividades.length === 0) {
    listaActividades.innerHTML = '<p class="placeholder-text">Sin actividades para hoy.</p>';
  } else {
    actividades.forEach(act => {
      listaActividades.innerHTML += `
        <div class="item-card">
          <div class="time">⏰ ${act.Hora || 'Todo el día'}</div>
          <strong>${act.Título}</strong>
          ${act.Categoría ? `<p style="font-size: 0.85rem; color: #6B7280; margin-top: 0.3rem;">${act.Categoría}</p>` : ''}
        </div>
      `;
    });
  }

  // Render Notas
  if (notas.length === 0) {
    listaNotas.innerHTML = '<p class="placeholder-text">Sin notas registradas.</p>';
  } else {
    notas.forEach(nota => {
      listaNotas.innerHTML += `
        <div class="item-card nota">
          <strong>📝 ${nota.Título}</strong>
          ${nota.Categoría ? `<p style="font-size: 0.85rem; color: #6B7280; margin-top: 0.3rem;">${nota.Categoría}</p>` : ''}
        </div>
      `;
    });
  }
}
