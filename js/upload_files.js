function cargarArchivos(carpeta, contenedorId) {
  const hosts = [
    "http://10.33.250.47:84/DSGC_test/",
    "http://10.33.250.47:84/security/"
  ];

  const fileList = document.getElementById(contenedorId);
  if (!fileList) return;

  fileList.innerHTML = "";

  const archivos = [];

  function procesarHTML(html, host) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const links = tempDiv.querySelectorAll("a");

    links.forEach(link => {
      const href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("?") &&
        !href.endsWith("/") &&
        !href.includes("?LinkID=")
      ) {
        const fullPath = `http://10.33.250.47:84${href}`;
        const urlParts = decodeURIComponent(href).split("/");
        const fileName = urlParts[urlParts.length - 1];
        archivos.push({ fileName, fullPath });
      }
    });
  }

  const carpetasConClasificacion = ["P01", "P02", "C02", "C03", "C04", "S01", "S05", "S06", "S09", "S10"];

  function obtenerPrioridad(ext) {
    const prioridad = {
      ".doc": 1, ".docx": 1,
      ".ppt": 2, ".pptx": 2,
      ".xls": 3, ".xlsx": 3,
      ".pdf": 4
    };
    return prioridad[ext.toLowerCase()] || 5;
  }

  function mostrarArchivos() {
    if (carpetasConClasificacion.includes(carpeta)) {
      const grupos = { D: [], P: [], I: [], F: [], otros: [] };

      archivos.forEach(({ fileName, fullPath }) => {
        const tipoLetra = fileName.charAt(7).toUpperCase();
        if (grupos[tipoLetra]) {
          grupos[tipoLetra].push({ fileName, fullPath });
        } else {
          grupos.otros.push({ fileName, fullPath });
        }
      });

      const nombresGrupo = {
        D: "DOCUMENTOS",
        P: "PROCEDIMIENTOS",
        I: "INSTRUCCIONES",
        F: "FORMATOS",
        otros: "OTROS"
      };

      Object.keys(grupos).forEach(grupo => {
        if (grupos[grupo].length > 0) {
          const contenedorWrapper = document.createElement("div");
          contenedorWrapper.className = "mb-3";

          const contenedor = document.createElement("div");
          contenedor.className = "p-2 border rounded bg-light";

          const collapseId = `collapse-${contenedorId}-${grupo}`;

          const titulo = document.createElement("button");
          titulo.className = "btn btn-primary w-100 text-start mb-2";
          titulo.setAttribute("data-bs-toggle", "collapse");
          titulo.setAttribute("aria-expanded", "false");
          titulo.setAttribute("aria-controls", collapseId);
          titulo.setAttribute("data-bs-target", `#${collapseId}`);
          titulo.textContent = nombresGrupo[grupo];

          const collapse = document.createElement("div");
          collapse.className = "collapse";
          collapse.id = collapseId;

          const ul = document.createElement("ul");
          ul.classList.add("group-file-list");

          grupos[grupo].sort((a, b) => {
            const extA = a.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
            const extB = b.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
            const prioA = obtenerPrioridad(extA);
            const prioB = obtenerPrioridad(extB);
            if (prioA !== prioB) return prioA - prioB;
            return a.fileName.localeCompare(b.fileName, undefined, { numeric: true });
          });

          grupos[grupo].forEach(({ fileName, fullPath }) => {
            const ext = fileName.toLowerCase();
            let iconClass = "", color = "black";
            if (ext.endsWith(".doc") || ext.endsWith(".docx")) {
              iconClass = "bi bi-file-earmark-word-fill";
              color = "blue";
            } else if (ext.endsWith(".ppt") || ext.endsWith(".pptx")) {
              iconClass = "bi bi-file-earmark-ppt-fill";
              color = "orange";
            } else if (ext.endsWith(".xls") || ext.endsWith(".xlsx")) {
              iconClass = "bi bi-file-earmark-excel-fill";
              color = "green";
            } else if (ext.endsWith(".pdf")) {
              iconClass = "bi bi-file-earmark-pdf-fill";
              color = "red";
            }

            const li = document.createElement("li");
            li.innerHTML = `<a href="${fullPath}" target="_blank" style="text-decoration:none; color:#333; font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
              <i class="${iconClass}" style="color:${color}; font-size:1.2rem;"></i> ${fileName}
            </a>`;
            ul.appendChild(li);
          });

          collapse.appendChild(ul);
          contenedor.appendChild(titulo);
          contenedor.appendChild(collapse);
          contenedorWrapper.appendChild(contenedor);
          fileList.appendChild(contenedorWrapper);
        }
      });
    } else {
      archivos.sort((a, b) => {
        const extA = a.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
        const extB = b.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
        const prioA = obtenerPrioridad(extA);
        const prioB = obtenerPrioridad(extB);
        if (prioA !== prioB) return prioA - prioB;
        return a.fileName.localeCompare(b.fileName, undefined, { numeric: true });
      });

      const contenedorWrapper = document.createElement("div");
      contenedorWrapper.className = "mb-3";

      const contenedor = document.createElement("div");
      contenedor.className = "p-2 border rounded bg-light";

      const ul = document.createElement("ul");
      ul.classList.add("group-file-list");

      archivos.forEach(({ fileName, fullPath }) => {
        const ext = fileName.toLowerCase();
        let iconClass = "", color = "black";
        if (ext.endsWith(".doc") || ext.endsWith(".docx")) {
          iconClass = "bi bi-file-earmark-word-fill";
          color = "blue";
        } else if (ext.endsWith(".ppt") || ext.endsWith(".pptx")) {
          iconClass = "bi bi-file-earmark-ppt-fill";
          color = "orange";
        } else if (ext.endsWith(".xls") || ext.endsWith(".xlsx")) {
          iconClass = "bi bi-file-earmark-excel-fill";
          color = "green";
        } else if (ext.endsWith(".pdf")) {
          iconClass = "bi bi-file-earmark-pdf-fill";
          color = "red";
        }

        const li = document.createElement("li");
        li.innerHTML = `<a href="${fullPath}" target="_blank" style="text-decoration:none; color:#333; font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="${iconClass}" style="color:${color}; font-size:1.2rem;"></i> ${fileName}
        </a>`;
        ul.appendChild(li);
      });

      contenedor.appendChild(ul);
      contenedorWrapper.appendChild(contenedor);
      fileList.appendChild(contenedorWrapper);
    }
  }

  let pendientes = hosts.length;
  hosts.forEach(host => {
    fetch(`${host}${carpeta}/`)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo acceder");
        return response.text();
      })
      .then(html => procesarHTML(html, host))
      .catch(() => {
        console.warn(`No se encontraron archivos en: ${host}${carpeta}`);
      })
      .finally(() => {
        pendientes--;
        if (pendientes === 0) mostrarArchivos();
      });
  });
}

// Llamadas a carpetas
cargarArchivos("MANUAL DEL SISTEMA DE GESTION DE LA CALIDAD", "manual-file-list");
cargarArchivos("P01", "p01-file-list");
cargarArchivos("P02", "p02-file-list");
cargarArchivos("C02", "c02-file-list");
cargarArchivos("C03", "c03-file-list");
cargarArchivos("C04", "c04-file-list");
cargarArchivos("S01", "s01-file-list");
cargarArchivos("S05", "s05-file-list");
cargarArchivos("S06", "s06-file-list");
cargarArchivos("S09", "s09-file-list");
cargarArchivos("S10", "s10-file-list");
cargarArchivos("CSR", "csr-file-list");
cargarArchivos("0     CON NUM. DE PARTE", "0     CON NUM. DE PARTE-file-list");
cargarArchivos("0     SIN NUM. DE PARTE", "0     SIN NUM. DE PARTE-file-list");
