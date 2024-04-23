import { isAuthenticated } from "firebase-auth.js"

function onLoadWindows() {
  if(isAuthenticated()){
    // Cargar la barra de navegación
    fetch('subpages/header.html')
    .then(response => response.text())
    .then(data => document.getElementById('header').innerHTML = data);

    // Cargar la barra lateral
    fetch('subpages/sidebar.html')
    .then(response => response.text())
    .then(data => document.getElementById('sidebar').innerHTML = data);

    // Cargar el pie de pagina
    fetch('subpages/footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer').innerHTML = data);
  }
  else{
    window.location.href = "../index.html"
  }
}

window.onload = onLoadWindows;