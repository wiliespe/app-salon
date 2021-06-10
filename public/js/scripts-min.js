"use strict";
let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarServicios();

    /* Resalta el div actual según el tab que se presiona */
    mostrarSeccion();
    
    /* Oculta o muestra una sección  según el tab que se presiona */
    cambiarSeccion();

    /* Paginación siguiente y anterior */
    paginaSiguiente();
    paginaAnterior();

    /* Comprueba la página actual para ocultar o mostrar la paginación */
    botonesPaginador();

    /* Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validación) */
    mostrarResumen();

    /* Alamcena el nombre de la cita en el objeto */
    nombreCita();

    /* Alamecena la fecha de la cita en el objeto */
    fechaCita();

    /* Desabilita días pasados del calendario de cita */
    desabilitarFechaAnterior();

    /* Almacena la hora de la cita en el objeto */
    horaCita();
});


async function mostrarServicios() {
    

    try {
        const resultado = await fetch('data/servicios.json');
        const db = await resultado.json()

        const { servicios } = db;
        
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            /* DOM SCRIPTING */

            /* Generar nombre del servicio */
            const nombreServicio = document.createElement('p');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            /* Generar el precio del servicio */
            const precioServicio = document.createElement('p');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            /* Genear el div para nombrar los id del servicio */
            const servicioDiv = document.createElement('div');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            /* Inyectar precio y nombre al div de servicio */
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            /* Selecciona un servicio para la cita */
            servicioDiv.onclick = seleccionarServicio

            /* Inyectar en el HTML */
            document.querySelector('#list-services').appendChild(servicioDiv);
        });

   

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    /* Forzar que el elmento al cual le damos click sea el DIV */
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio)

        eliminarServicio(id);



    } else {
        elemento.classList.add('seleccionado');


        const servicioObj = {
            id: parseInt (elemento.dataset.idServicio),
            nombre : elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
            
        }

        /* console.log(servicioObj); */

        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id );
    /* console.log(cita); */
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];
 /*    console.log(cita); */
}

function mostrarSeccion() {
     /* Eliminar mostrarSeccion de la seccion anterior*/
     const seccionAnterior = document.querySelector('.mostrar-setion');

     if (seccionAnterior) {
         seccionAnterior.classList.remove('mostrar-setion') ;
     }
     

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-setion');
}


function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click',  e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            /* Llamar la función de mostrar sección */
            mostrarSeccion();
            botonesPaginador();
        })

    });
}

function paginaSiguiente() {
    const btnSiguiente = document.querySelector('#siguiente');

    btnSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior() {
    const btnanterior = document.querySelector('#anterior');

    btnanterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador() {
    const btnSiguiente = document.querySelector('#siguiente');
    const btnanterior = document.querySelector('#anterior');
    const btnServicios = document.querySelector('#btn-servicios');
    const btnCliente = document.querySelector('#btn-cliente');
    const btnResumen = document.querySelector('#btn-resumen');
   
    if (pagina === 1) {
        btnanterior.classList.add('ocultar-btn'); 
        btnServicios.classList.add('active');
        btnCliente.classList.remove('active');
        btnResumen.classList.remove('active');
        btnSiguiente.style.display = 'inline-block';
       
        
    } else {
        btnanterior.classList.remove('ocultar-btn')
        btnSiguiente.classList.remove('ocultar-btn')
        
        btnServicios.classList.remove('active'); 
        
        btnCliente.classList.add('active');

        btnResumen.classList.remove('active');

        btnSiguiente.style.display = 'inline-block';

        
        
    }
    
    if (pagina === 3) {
        btnSiguiente.classList.add('ocultar-btn');
        btnanterior.classList.remove('ocultar-btn');
        btnSiguiente.style.display = 'none';
        btnCliente.classList.remove('active');

        btnResumen.classList.add('active');

        mostrarResumen() /* Estamos en la página que carga el resumen de la cita */

       
    } else {
        btnSiguiente.classList.remove('ocultar-btn');
    }
    

    mostrarSeccion(); /* Cambia la sección que se muestra por la de la página  */

}

function mostrarResumen() {
    /* Destructuring */

    const { nombre, fecha, hora, servicios } = cita;

    /* Seleccionar el resumen */
    /* console.log(cita); */
    const resumenDiv = document.querySelector('.resumen-contenido');

    /*Limpia el HTML previo */
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }


    /* Validación del objeto */
    if(Object.values(cita).includes('')) {
        /* console.log('El objeto esta vacio'); */
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Falta ingresar los datos de tu cita';
        noServicios.classList.add('invalidar-cita');
    
        resumenDiv.appendChild(noServicios);

    } else {
        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen Cita';

        const nombreCita = document.createElement('P');
        const fechaCita = document.createElement('P');
        const horasCita = document.createElement('P');

        /* Mostrar el resumen */
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
        horasCita.innerHTML = `<span>Hora:</span> ${hora}`;

        resumenDiv.classList.add('div-left');
        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');


        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen Servicios';

        serviciosCita.appendChild(headingServicios);
        resumenDiv.appendChild(headingCita);

        let cantidad = 0;

        /* Iterar sobre el arreglo de servicios */
        servicios.forEach(servicio => {
            const contenedorServicio = document.createElement('DIV');
            const {nombre, precio} = servicio;

            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');textoServicio.textContent= nombre

            const precioServicio = document.createElement('P');
            precioServicio.classList.add('precio');
            precioServicio.textContent = precio;

            /* console.log(textoServicio); */
            const totalServicio = precio.split('$');

            cantidad += parseInt(totalServicio[1].trim());

            
            
            
            /* Colocar texto y el precio en el div */
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            
            serviciosCita.appendChild(contenedorServicio);
            
        });
        /* console.log(cantidad) */
        const totalpagar = document.createElement('P');
        totalpagar.classList.add('div-right');
        
        totalpagar.innerHTML = `<span>Total a pagar:</span> $ ${cantidad}`;
        /* Insertar en el HTML */
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horasCita);

        resumenDiv.appendChild(serviciosCita);

        resumenDiv.appendChild(totalpagar);

    }

}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', (e) => {
        const nombreTexto = e.target.value.trim();

        /* Validación de que nombre de texto debe tener algo */

        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('El nombre no es valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }

            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo) {
    /* Si hay una alerta previa, entonces no crear otra */
    const alertaPrevia = document.querySelector('.alerta');
    const mostrarError = document.querySelector('.formulario');

    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');

    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    mostrarError.appendChild(alerta);

    /* Eliminar la alerta */
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', (e) => {
        
        const dia = new Date(e.target.value).getUTCDay() ;
        /* console.log(dia); */

        if ([0, 6].includes(dia)) {
            e.preventDefault();
            mostrarAlerta('Fines de semana no son permitidos', 'error');
            fechaInput.value = '';
        } else {
            cita.fecha = fechaInput.value;
            /* console.log(cita); */
        }
    })
}

function desabilitarFechaAnterior() {
   const inputFecha = document.querySelector('#fecha');
    
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = ('0'+(fechaAhora.getMonth()+1)).slice(-2);
    const dia = ('0'+(fechaAhora.getDate()+1)).slice(-2);

    const fechaDesabilitar =`${year}-${mes}-${dia}`;

    inputFecha.min = fechaDesabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', (e) => {
        const horaSelecionada = e.target.value;
        const hora = horaSelecionada.split(':');

       if (hora[0] < 10 || hora[0] > 18) {
           mostrarAlerta('Hora ingresada no valida', 'error');
           setTimeout(() => {
               inputHora.value = '';
           }, 5000);
       } else {
           cita.hora = inputHora.value;
       }
       
    })
}

