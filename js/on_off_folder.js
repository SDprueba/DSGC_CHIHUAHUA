document.addEventListener("DOMContentLoaded", function () {
    const folders = document.querySelectorAll(".folder");
    const content = document.createElement("div");
    content.classList.add("content");
    document.body.appendChild(content);

    let currentOpenFolder = null;

    // Oculta contenido
    document.querySelectorAll(".file-list").forEach(list => list.style.display = "none");

    folders.forEach(folder => {
        folder.addEventListener("click", function () {
            const fileList = this.nextElementSibling;
            
            if (currentOpenFolder === this) {
                // Cerrar carpeta
                content.style.transform = "translateX(100%)";
                content.style.opacity = "0";
                setTimeout(() => {
                    content.innerHTML = "";
                }, 300);
                this.classList.remove("active"); 
                currentOpenFolder = null;
            } else {
                // Oculta todos los archivos en el menú lateral
                document.querySelectorAll(".file-list").forEach(list => list.style.display = "none");
                
                // Animación al cambiar carpeta
                content.style.transform = "translateX(100%)";
                content.style.opacity = "0";
                setTimeout(() => {
                    // Inserta archivos en menú derecho
                    content.innerHTML = "";
                    const clonedList = fileList.cloneNode(true);
                    clonedList.classList.add("file-list"); 
                    clonedList.style.display = "grid";  
                    content.appendChild(clonedList);

                    // Animación de desplazamiento
                    content.style.transform = "translateX(0)";
                    content.style.opacity = "1";
                }, 300); 
                
                // Resalta la carpeta activa
                folders.forEach(f => f.classList.remove("active"));
                this.classList.add("active");

                currentOpenFolder = this;
            }
        });
    });

    // Inicializa las propiedades CSS para la animación
    content.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
    content.style.transform = "translateX(100%)";
    content.style.opacity = "0";
});
