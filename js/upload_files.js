function cargarArchivos(carpeta, contenedorId) {
  const hosts = [
     "http://10.33.250.47:84/DSGC_test/",
    "http://10.33.250.47:84/security/"
  ];

  const fileList = document.getElementById(contenedorId);
  if (!fileList) return; // Si no se encuentra el contenedor, detiene la ejecucion

  fileList.innerHTML = ""; // Limpia la lista antes de agregar nuevos archivos

  const archivos = []; // Guarda todos los archivos para poder ordenarlos y agruparlos 4-07-25 BV

  // Función para procesar archivos de cada host
  function procesarHTML(html, host) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const links = tempDiv.querySelectorAll("a");  // Obtiene todos los enlaces de archivos 
    
    // Recorre los enlaces, filtra solo archivos válidos y los guarda
    links.forEach(link => {
      const href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("?") &&
        !href.endsWith("/") &&
        !href.includes("?LinkID=")
      ) {
        const fullPath = `http://10.33.250.47:84${href}`; // Ruta completa del archivo
        const urlParts = decodeURIComponent(href).split("/");
        const fileName = urlParts[urlParts.length - 1]; // Obtiene el nombre del archivo

        archivos.push({ fileName, fullPath }); // Agrega al arreglo para ordenamiento
      }
    });
  }
  // Carpetas que se agrupan por letra (P01 a S10) 9-07-25 BV
  const carpetasConClasificacion = ["P01", "P02", "C02", "C03", "C04", "S01", "S05", "S06", "S09", "S10"]; 

  // Después de procesar todos los hosts, agrupa por tipo y muestra archivos
  function mostrarArchivos() {
    if (carpetasConClasificacion.includes(carpeta)) {
      // Crea grupos: P, I, D, F (letra 8) 9-07-25 BV
      const grupos = {
        D: [],
        P: [],
        I: [],
        F: [],
        otros: []
      };
      
      // Clasifica cada archivo según la letra del carácter 8 en su nombre 9-07-25 BV
      archivos.forEach(({ fileName, fullPath }) => {
        const tipoLetra = fileName.charAt(7).toUpperCase();
        if (grupos[tipoLetra]) {
          grupos[tipoLetra].push({ fileName, fullPath });
        } else {
          grupos.otros.push({ fileName, fullPath });
        }
      });
      // Nombre amigable para cada grupo mostrado en pantalla 9-07-25 BV
      const nombresGrupo = {
        D: "DOCUMENTOS",
        P: "PROCEDIMIENTOS",
        I: "INSTRUCCIONES",
        F: "FORMATOS",
        otros: "OTROS"
      };
      
       // Creación de contenedores visuales para cada grupo 9-07-25 BV
      Object.keys(grupos).forEach(grupo => {
        if (grupos[grupo].length > 0) {

          // Contenedor externo con espaciado entre grupos
          const contenedorWrapper = document.createElement("div");
          contenedorWrapper.className = "mb-3";

          // Contenedor visual interno con fondo y borde
          const contenedor = document.createElement("div");
          contenedor.className = "p-2 border rounded bg-light";

          // ID único para cada colapsable 11-07-25 BV
          const collapseId = `collapse-${contenedorId}-${grupo}`;
          
           // Botón colapsable de Bootstrap (título azul)  11-07-25 BV
          const titulo = document.createElement("button");
          titulo.className = "btn btn-primary w-100 text-start mb-2";
          titulo.setAttribute("data-bs-toggle", "collapse");
          titulo.setAttribute("aria-expanded", "false");
          titulo.setAttribute("aria-controls", collapseId);
          titulo.setAttribute("data-bs-target", `#${collapseId}`);
          titulo.textContent = nombresGrupo[grupo];

           // Contenedor colapsable que envuelve la lista UL 11-07-25 BV
          const collapse = document.createElement("div");
          collapse.className = "collapse";
          collapse.id = collapseId;

          // Lista UL que contendrá los archivos 11-07-25 BV
          const ul = document.createElement("ul");
          ul.classList.add("group-file-list");

          // Orden por tipo: Word -> Excel -> PDF -> Otros 11-07-25 BV
          const prioridadExtension = {
            ".doc": 1, ".docx": 1,
            ".ppt": 2, ".pptx": 2,
            ".xls": 3, ".xlsx": 3,
            ".pdf": 3
          };

          grupos[grupo].sort((a, b) => {
            const extA = a.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
            const extB = b.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
            const prioridadA = prioridadExtension[extA] || 4;
            const prioridadB = prioridadExtension[extB] || 4;
            
             // Primero por tipo de archivo, luego por nombre
            if (prioridadA !== prioridadB) {
              return prioridadA - prioridadB;
            }
            return a.fileName.localeCompare(b.fileName, undefined, { numeric: true });
          });


          // Genera los elementos <li> con íconos y estilos
          grupos[grupo].forEach(({ fileName, fullPath }) => {
            const ext = fileName.toLowerCase();
            let iconClass = "", color = "black";
            
             // Asigna ícono y color según extensión del archivo
            if (ext.endsWith(".doc") || ext.endsWith(".docx")) {
              iconClass = "bi bi-file-earmark-word-fill";
                color = "blue";
            } else if (ext.endsWith(".ppt") || ext.endsWith(".pptx")) {
              iconClass = "bi bi-file-earmark-ppt-fill";  // Usa un ícono similar o uno alternativo
              color = "orange";
            } else if (ext.endsWith(".xls") || ext.endsWith(".xlsx")) {
              iconClass = "bi bi-file-earmark-excel-fill";
              color = "green";
            } else if (ext.endsWith(".pdf")) {
              iconClass = "bi bi-file-earmark-pdf-fill";
              color = "red";
            }
             // Construcción visual del archivo como elemento de lista
            const li = document.createElement("li");
            li.style.border = "1px solid #ddd";
            li.style.padding = "0.6rem";
            li.style.borderRadius = "0.4rem";
            li.style.background = "#fff";
            li.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.gap = "0.5rem";

            li.innerHTML = `<a href="${fullPath}" target="_blank" style="text-decoration:none; color:#333; font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
              <i class="${iconClass}" style="color:${color}; font-size:1.2rem;"></i> ${fileName}
            </a>`;

            ul.appendChild(li);
          });

          // Añade elementos al DOM
          collapse.appendChild(ul);
          contenedor.appendChild(titulo);
          contenedor.appendChild(collapse);
          contenedorWrapper.appendChild(contenedor);
          fileList.appendChild(contenedorWrapper);
        }
      });
    } else {
         // Carpetas sin clasificación: diseño visual con íconos, pero sin agrupación 11-07-25 BV
      archivos.sort((a, b) =>
        a.fileName.localeCompare(b.fileName, undefined, { numeric: true })
      );
      
      const prioridadExtension = {
       ".doc": 1, ".docx": 1,
       ".xls": 2, ".xlsx": 2,
         ".pdf": 3
      };

      archivos.sort((a, b) => {
        const extA = a.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
        const extB = b.fileName.toLowerCase().match(/\.\w+$/)?.[0] || "";
        const prioridadA = prioridadExtension[extA] || 4;
        const prioridadB = prioridadExtension[extB] || 4;

        if (prioridadA !== prioridadB) {
          return prioridadA - prioridadB;
        }
        return a.fileName.localeCompare(b.fileName, undefined, { numeric: true });
      });

      // Contenedor visual como en las carpetas agrupadas
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
        } else if (ext.endsWith(".xls") || ext.endsWith(".xlsx")) {
          iconClass = "bi bi-file-earmark-excel-fill";
          color = "green";
        } else if (ext.endsWith(".pdf")) {
          iconClass = "bi bi-file-earmark-pdf-fill";
          color = "red";
        }

        const li = document.createElement("li");
        li.style.border = "1px solid #ddd";
        li.style.padding = "0.6rem";
        li.style.borderRadius = "0.4rem";
        li.style.background = "#fff";
        li.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "0.5rem";

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
  
  // Espera a que todos los hosts respondan antes de mostrar los archivos
  let pendientes = hosts.length;

  hosts.forEach(host => {
    fetch(`${host}${carpeta}/`)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo acceder");
        return response.text();
      })
      .then(html => procesarHTML(html, host))
      .catch(error => {
        console.warn(`No se encontraron archivos en: ${host}${carpeta}`);
      })
      .finally(() => {
        pendientes--;
        if (pendientes === 0) {
          mostrarArchivos();
        }
      });
  });
}

 //Creación de carpeta para documentos de manual de calidad 3-07-25 BV
  cargarArchivos("MANUAL DEL SISTEMA DE GESTION DE LA CALIDAD","manual-file-list");
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

  // Llama la función para cada carpeta de seguridad
  cargarArchivos("0     CON NUM. DE PARTE", "0     CON NUM. DE PARTE-file-list");
  cargarArchivos("0     SIN NUM. DE PARTE", "0     SIN NUM. DE PARTE-file-list");
