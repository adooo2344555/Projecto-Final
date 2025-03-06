// Almacenamiento de usuarios registrados
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

// Función para validar el formato del nombre completo (solo letras y espacios)
function validarNombreCompleto(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    return regex.test(nombre);
}

// Función para validar el formato del correo electrónico (debe contener al menos una letra antes del @)
function validarEmail(email) {
    const regex = /^[A-Za-z]+[A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
}

// Función para validar el formato del teléfono
function validarTelefono(phone) {
    const regex = /^\d{8}$/;
    return regex.test(phone);
}

// Función para validar el formato del DUI
function validarDUI(dui) {
    const regex = /^\d{8}-\d{1}$/;
    return regex.test(dui);
}

// Función para validar la fecha de nacimiento
function validarFechaNacimiento(dob) {
    const fechaNacimiento = new Date(dob);
    const fechaActual = new Date();
    return fechaNacimiento < fechaActual;
}

// Función para validar la contraseña
function validarPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

// Función para validar la fecha de la cita (no puede ser en el pasado)
function validarFechaCita(fecha) {
    const fechaCita = new Date(fecha);
    const fechaActual = new Date();
    return fechaCita >= fechaActual;
}

// Función para validar la hora de la cita (entre 8 AM y 6 PM)
function validarHoraCita(hora) {
    const horaCita = parseInt(hora.split(':')[0], 10);
    return horaCita >= 8 && horaCita <= 18; // 18 es las 6 PM
}

// Función para registrar un nuevo usuario
document.getElementById('registerForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const address = document.getElementById('address').value.trim();
    const dui = document.getElementById('dui').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validar que todos los campos estén llenos
    if (!fullName || !email || !phone || !dob || !gender || !address || !dui || !password || !confirmPassword) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar el formato del nombre completo
    if (!validarNombreCompleto(fullName)) {
        alert('Por favor, ingresa un nombre válido (solo letras y espacios).');
        return;
    }

    // Validar el formato del correo electrónico
    if (!validarEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido. Debe contener al menos una letra antes del @.');
        return;
    }

    // Validar el formato del teléfono
    if (!validarTelefono(phone)) {
        alert('Por favor, ingresa un número de teléfono válido (8 dígitos).');
        return;
    }

    // Validar el formato del DUI
    if (!validarDUI(dui)) {
        alert('Por favor, ingresa un DUI válido (formato: 12345678-9).');
        return;
    }

    // Validar la fecha de nacimiento
    if (!validarFechaNacimiento(dob)) {
        alert('Por favor, ingresa una fecha de nacimiento válida.');
        return;
    }

    // Validar la contraseña
    if (!validarPassword(password)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // Validar que el correo no esté registrado
    const usuarioExistente = usuariosRegistrados.find(u => u.email === email);
    if (usuarioExistente) {
        alert('Este correo electrónico ya está registrado.');
        return;
    }

    // Crear un objeto con los datos del usuario
    const usuario = {
        fullName,
        email,
        phone,
        dob,
        gender,
        address,
        dui,
        password
    };

    // Guardar el usuario en el almacenamiento local
    usuariosRegistrados.push(usuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

    // Mostrar mensaje de registro exitoso y redirigir a login.html
    alert('Registro exitoso.');
    window.location.href = 'login.html';
});

// Función para actualizar la visibilidad de los botones de autenticación
function actualizarBotonesAutenticacion() {
    const usuarioAutenticado = localStorage.getItem('usuarioAutenticado');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    const linkLogin = document.querySelector('a[href="login.html"]');

    if (usuarioAutenticado === 'true') {
        if (btnCerrarSesion) btnCerrarSesion.style.display = 'block'; // Mostrar botón de cerrar sesión
        if (linkLogin) linkLogin.style.display = 'none'; // Ocultar enlace de login
    } else {
        if (btnCerrarSesion) btnCerrarSesion.style.display = 'none'; // Ocultar botón de cerrar sesión
        if (linkLogin) linkLogin.style.display = 'block'; // Mostrar enlace de login
    }
}

// Función para cerrar sesión
document.getElementById('btnCerrarSesion')?.addEventListener('click', function () {
    localStorage.removeItem('usuarioAutenticado'); // Eliminar estado de autenticación
    localStorage.removeItem('usuarioActual'); // Eliminar datos del usuario
    alert('Sesión cerrada correctamente.');
    actualizarBotonesAutenticacion(); // Actualizar la visibilidad de los botones
    window.location.href = 'index.html'; // Redirigir al inicio
});

// Llamar a la función al cargar la página
window.addEventListener('load', actualizarBotonesAutenticacion);

// Función para autenticar al usuario
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validar que los campos no estén vacíos
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Obtener los usuarios registrados del almacenamiento local
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    // Buscar el usuario por correo electrónico y contraseña
    const usuario = usuariosRegistrados.find(u => u.email === email && u.password === password);

    if (usuario) {
        // Guardar el estado de autenticación en localStorage
        localStorage.setItem('usuarioAutenticado', 'true');
        localStorage.setItem('usuarioActual', JSON.stringify(usuario)); // Guardar datos del usuario

        // Mostrar mensaje de inicio de sesión exitoso y redirigir a index.html
        alert('Inicio de sesión exitoso.');
        actualizarBotonesAutenticacion();
        window.location.href = 'index.html';
    } else {
        alert('Correo electrónico o contraseña incorrectos.');
    }
});

// Función para verificar autenticación
function verificarAutenticacion(mensaje) {
    const usuarioAutenticado = localStorage.getItem('usuarioAutenticado');
    if (!usuarioAutenticado || usuarioAutenticado !== 'true') {
        alert(mensaje);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Verificar autenticación al cargar la página de "Agendar Cita" y "Contacto"
window.addEventListener('load', function () {
    if (window.location.pathname.includes('agendar-cita.html')) {
        if (!verificarAutenticacion('Debes iniciar sesión para agendar una cita.')) {
            return;
        }
    } else if (window.location.pathname.includes('contacto.html')) {
        if (!verificarAutenticacion('Debes iniciar sesión para acceder al formulario de contacto.')) {
            return;
        }
    }
});

// Función para manejar el formulario de agendar cita
document.getElementById('appointmentForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    // Verificar autenticación antes de agendar la cita
    if (!verificarAutenticacion('Debes iniciar sesión para agendar una cita.')) {
        return;
    }

    // Obtener el nombre del usuario autenticado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const patientName = usuarioActual?.fullName || 'No especificado'; // Usar el nombre del usuario autenticado

    // Obtener los valores del formulario
    const doctor = document.getElementById('doctor')?.value;
    const consultationType = document.getElementById('consultationType')?.value;
    const appointmentDate = document.getElementById('appointmentDate')?.value.trim();
    const appointmentTime = document.getElementById('appointmentTime')?.value.trim();
    const comments = document.getElementById('comments')?.value.trim();

    // Validar que los campos no estén vacíos
    if (!patientName || !doctor || !consultationType || !appointmentDate || !appointmentTime) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Validar la fecha de la cita
    if (!validarFechaCita(appointmentDate)) {
        alert('La fecha de la cita no puede ser en el pasado.');
        return;
    }

    // Validar la hora de la cita
    if (!validarHoraCita(appointmentTime)) {
        alert('La hora de la cita debe estar entre las 8 AM y las 6 PM.');
        return;
    }

    // Guardar los datos en localStorage
    const appointmentData = {
        patientName, // Usar el nombre del usuario autenticado
        doctor,
        consultationType,
        appointmentDate,
        appointmentTime,
        comments
    };
    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));

    // Mostrar un mensaje de confirmación
    alert('Cita agendada exitosamente. Los datos se han guardado.');
    window.location.href = 'ver-cita.html'; // Redirigir a "Ver Cita"
});

// Función para manejar el formulario de reprogramación de cita
document.getElementById('reprogramarCitaForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    // Verificar autenticación antes de reprogramar la cita
    if (!verificarAutenticacion('Debes iniciar sesión para reprogramar una cita.')) {
        return;
    }

    // Obtener los valores del formulario
    const newAppointmentDate = document.getElementById('newAppointmentDate').value.trim();
    const newAppointmentTime = document.getElementById('newAppointmentTime').value.trim();
    const reprogramComments = document.getElementById('reprogramComments').value.trim();

    // Validar que los campos no estén vacíos
    if (!newAppointmentDate || !newAppointmentTime) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Validar la fecha de la cita
    if (!validarFechaCita(newAppointmentDate)) {
        alert('La fecha de la cita no puede ser en el pasado.');
        return;
    }

    // Validar la hora de la cita
    if (!validarHoraCita(newAppointmentTime)) {
        alert('La hora de la cita debe estar entre las 8 AM y las 6 PM.');
        return;
    }

    // Obtener los datos actuales de la cita
    const citaActual = JSON.parse(localStorage.getItem('appointmentData'));

    // Actualizar los datos de la cita
    const nuevaCita = {
        ...citaActual, // Mantener los datos anteriores
        appointmentDate: newAppointmentDate, // Actualizar la fecha
        appointmentTime: newAppointmentTime, // Actualizar la hora
        comments: reprogramComments // Actualizar los comentarios
    };

    // Guardar los datos actualizados en localStorage
    localStorage.setItem('appointmentData', JSON.stringify(nuevaCita));

    // Mostrar un mensaje de confirmación
    alert('Cita reprogramada exitosamente. Los datos se han actualizado.');

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('reprogramarCitaModal'));
    modal.hide();

    // Redirigir a "Ver Cita" para mostrar los cambios
    window.location.href = 'ver-cita.html';
});

// Función para cargar los datos de la cita en "Ver Cita"
function cargarCita() {
    const cita = JSON.parse(localStorage.getItem('appointmentData'));

    if (cita) {
        document.getElementById('patientName').textContent = cita.patientName || 'No especificado';
        document.getElementById('doctor').textContent = cita.doctor || 'No especificado';
        document.getElementById('consultationType').textContent = cita.consultationType || 'No especificado';
        document.getElementById('appointmentDate').textContent = cita.appointmentDate || 'No especificado';
        document.getElementById('appointmentTime').textContent = cita.appointmentTime || 'No especificado';
        document.getElementById('comments').textContent = cita.comments || 'No hay comentarios';
    } else {
        document.querySelector('.card-body').innerHTML = '<p class="text-center">No hay una cita agendada.</p>';
    }
}

// Llamar a la función al cargar la página "Ver Cita"
if (window.location.pathname.includes('ver-cita.html')) {
    window.addEventListener('load', cargarCita);
}