//variables para sesion

const loginForm = document.getElementById('login-form');
const logoutForm = document.getElementById('logout-form');

//variables front

const menu = document.getElementById('menu');
const btnAdd = document.getElementById('add-product');
const formAdd = document.getElementById('form-add');
const btnClose = document.getElementById('close-add');
const select = document.getElementById('select-category');
const selectT = document.getElementById('select-type');

//MANEJO DE SESION

window.authAPI.onSessionRestored((userData) => {
    console.log(`Bienvenido de nuevo, ${userData.username}`);
    mostrarPanelPrincipal(); // Función que oculta el login y muestra el CRUD
});

function mostrarPanelPrincipal() {
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('main-content').classList.remove('d-none');
}

function ocultarPanelPrincipal() {
  document.getElementById('login-section').classList.remove('d-none');
  document.getElementById('main-content').classList.add('d-none');
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();

  const response = await window.authAPI.login({ user, pass });

  if (response.success) {
    mostrarPanelPrincipal();
    alert("Sesion iniciada");
  } else {
    console.log(response.message);
  }
});

logoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  window.authAPI.logout();
  ocultarPanelPrincipal();
});

//Funciones frontend
menu.addEventListener('click', () => {
  menu.classList.toggle("rota");
});

btnAdd.addEventListener('click', () => {
  btnAdd.classList.add("d-none");
  formAdd.classList.remove("d-none");
});

btnClose.addEventListener('click', () => {
  formAdd.classList.add("d-none");
  btnAdd.classList.remove("d-none");
})

select.addEventListener("change", () => {
  if (select.value != "Electricidad") {
    selectT.classList.add("d-none");
  } else {
    selectT.classList.remove("d-none");
  }
});

//carga producto

formAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const desc = document.getElementById('desc').value;
  const file = document.getElementById('formFile');
  const category = select.value;
  let img=null, type="n";
  if (file.files.length > 0) {
    img = window.authAPI.getFilePath(file.files[0]);
  };

  if (selectT.className === "col") {
    type=document.getElementById('s-type').value;
  };

  const response = await window.authAPI.enviarProducto({ title,price,desc,img,category,type });

  if (response.success) {
    alert("Producto creado");
    window.location.href = `categoria.html?cat=${category}`;
  } else {
    console.log(response.message);
  }
});