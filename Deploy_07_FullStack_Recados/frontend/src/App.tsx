import { reproducirSonidoAlerta, reproducirSonidoSimple } from "./alert-sound";
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, Calendar, Bell, UserCircle, Edit, CheckSquare, Clock, BellRing } from 'lucide-react';

// Interfaces
interface Usuario {
  _id: string;
  nombre: string;
  email: string;
}

interface Recado {
  _id: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  completado: boolean;
}

interface Cita {
  _id: string;
  usuarioId: string;
  servicio: string;
  fecha: string;
  hora: string;
  descripcion: string;
  alarma: boolean;
  minutos_antes: number;
}

function App() {
  // Estados para usuario
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [passwordUsuario, setPasswordUsuario] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // Estados para recados
  const [recados, setRecados] = useState<Recado[]>([]);
  const [tituloRecado, setTituloRecado] = useState('');
  const [descripcionRecado, setDescripcionRecado] = useState('');
  const [fechaRecado, setFechaRecado] = useState('');
  const [horaRecado, setHoraRecado] = useState('');
  const [recadoEditando, setRecadoEditando] = useState<Recado | null>(null);

  // Estados para citas
  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicioCita, setServicioCita] = useState('');
  const [descripcionCita, setDescripcionCita] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('');
  const [alarmaCita, setAlarmaCita] = useState(true);
  const [minutosAntesCita, setMinutosAntesCita] = useState(30);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  // Estado para sección actual
  const [seccionActual, setSeccionActual] = useState<'recados' | 'citas'>('recados');
  
  // Estados para el reloj y alarmas
  const [horaActual, setHoraActual] = useState<string>('');
  const [fechaActual, setFechaActual] = useState<string>('');
  const [alarmasActivas, setAlarmasActivas] = useState<Cita[]>([]);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [citaNotificacion, setCitaNotificacion] = useState<Cita | null>(null);
  
  // Referencia para el intervalo del reloj
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmaIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Funciones para el reloj y alarmas
  const actualizarReloj = () => {
    const ahora = new Date();
    setHoraActual(ahora.toLocaleTimeString());
    setFechaActual(ahora.toLocaleDateString());
  };

  const verificarAlarmas = async () => {
    if (!usuarioActual) return;
    
    try {
      const response = await fetch(`http://localhost:3000/alarmas/${usuarioActual._id}`);
      const citasAlarma = await response.json();
      
      if (citasAlarma.length > 0) {
        setAlarmasActivas(citasAlarma);
        setCitaNotificacion(citasAlarma[0]);
        setMostrarNotificacion(true);
        
        // Solicitar permiso para notificaciones si es necesario
        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
        
        // Mostrar notificación del navegador
        if (Notification.permission === 'granted') {
          new Notification('Recordatorio de cita', {
            body: `Tienes una cita con ${citasAlarma[0].servicio} en ${citasAlarma[0].minutos_antes} minutos.`,
            icon: '/favicon.ico'
          });
        }
      }
    } catch (error) {
      console.error('Error al verificar alarmas:', error);
    }
  };

  // Iniciar el reloj y la verificación de alarmas cuando se inicia sesión
  useEffect(() => {
    if (usuarioActual) {
      // Iniciar el reloj
      actualizarReloj();
      intervalRef.current = setInterval(actualizarReloj, 1000);
      
      // Iniciar la verificación de alarmas
      verificarAlarmas();
      alarmaIntervalRef.current = setInterval(verificarAlarmas, 30000); // Cada 30 segundos
    } else {
      // Limpiar los intervalos al cerrar sesión
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (alarmaIntervalRef.current) {
        clearInterval(alarmaIntervalRef.current);
        alarmaIntervalRef.current = null;
      }
    }
    
    // Limpiar los intervalos al desmontar el componente
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (alarmaIntervalRef.current) clearInterval(alarmaIntervalRef.current);
    };
  }, [usuarioActual]);

  // Obtener datos
  const fetchRecados = async () => {
    if (!usuarioActual) return;
    
    try {
      const response = await fetch(`http://localhost:3000/recados/${usuarioActual._id}`);
      const data = await response.json();
      setRecados(data);
    } catch (error) {
      console.error('Error al obtener recados:', error);
    }
  };

  const fetchCitas = async () => {
    if (!usuarioActual) return;
    
    try {
      const response = await fetch(`http://localhost:3000/citas/${usuarioActual._id}`);
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  // Efecto para cargar datos cuando cambia el usuario
  useEffect(() => {
    if (usuarioActual) {
      fetchRecados();
      fetchCitas();
    }
  }, [usuarioActual]);

  // Funciones para usuario
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nombre: nombreUsuario, 
          email: emailUsuario, 
          password: passwordUsuario 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsuarioActual(data);
        setMostrarRegistro(false);
        resetFormUsuario();
      } else {
        alert(data.error || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: loginEmail, 
          password: loginPassword 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsuarioActual(data);
        resetFormLogin();
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    setRecados([]);
    setCitas([]);
    setMostrarNotificacion(false);
    setCitaNotificacion(null);
  };

  const resetFormUsuario = () => {
    setNombreUsuario('');
    setEmailUsuario('');
    setPasswordUsuario('');
  };

  const resetFormLogin = () => {
    setLoginEmail('');
    setLoginPassword('');
  };

  // Funciones para recados
  const handleSubmitRecado = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioActual) return;
    
    try {
      if (recadoEditando) {
        // Actualizar recado existente
        await fetch(`http://localhost:3000/recados/${recadoEditando._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            titulo: tituloRecado, 
            descripcion: descripcionRecado, 
            fecha: fechaRecado,
            hora: horaRecado,
            completado: recadoEditando.completado
          }),
        });
      } else {
        // Crear nuevo recado
        await fetch('http://localhost:3000/recados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            usuarioId: usuarioActual._id,
            titulo: tituloRecado, 
            descripcion: descripcionRecado, 
            fecha: fechaRecado,
            hora: horaRecado
          }),
        });
      }
      
      resetFormRecado();
      fetchRecados();
    } catch (error) {
      console.error('Error al gestionar recado:', error);
    }
  };

  const handleDeleteRecado = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/recados/${id}`, {
        method: 'DELETE',
      });
      fetchRecados();
    } catch (error) {
      console.error('Error al eliminar recado:', error);
    }
  };

  const handleEditRecado = (recado: Recado) => {
    setRecadoEditando(recado);
    setTituloRecado(recado.titulo);
    setDescripcionRecado(recado.descripcion);
    setFechaRecado(new Date(recado.fecha).toISOString().split('T')[0]);
    setHoraRecado(recado.hora);
  };

  const handleCompletarRecado = async (recado: Recado) => {
    try {
      await fetch(`http://localhost:3000/recados/${recado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...recado,
          completado: !recado.completado
        }),
      });
      fetchRecados();
    } catch (error) {
      console.error('Error al actualizar recado:', error);
    }
  };

  const resetFormRecado = () => {
    setTituloRecado('');
    setDescripcionRecado('');
    setFechaRecado('');
    setHoraRecado('');
    setRecadoEditando(null);
  };

  // Funciones para citas
  const handleSubmitCita = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioActual) return;
    
    try {
      if (citaEditando) {
        // Actualizar cita existente
        const response = await fetch(`http://localhost:3000/citas/${citaEditando._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            servicio: servicioCita, 
            descripcion: descripcionCita, 
            fecha: fechaCita,
            hora: horaCita,
            alarma: alarmaCita,
            minutos_antes: minutosAntesCita
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error || 'Error al actualizar cita');
          return;
        }
      } else {
        // Crear nueva cita
        const response = await fetch('http://localhost:3000/citas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            usuarioId: usuarioActual._id,
            servicio: servicioCita, 
            descripcion: descripcionCita, 
            fecha: fechaCita,
            hora: horaCita,
            alarma: alarmaCita,
            minutos_antes: minutosAntesCita
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error || 'Error al crear cita');
          return;
        }
      }
      
      resetFormCita();
      fetchCitas();
    } catch (error) {
      console.error('Error al gestionar cita:', error);
    }
  };

  const handleDeleteCita = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/citas/${id}`, {
        method: 'DELETE',
      });
      fetchCitas();
    } catch (error) {
      console.error('Error al eliminar cita:', error);
    }
  };

  const handleEditCita = (cita: Cita) => {
    setCitaEditando(cita);
    setServicioCita(cita.servicio);
    setDescripcionCita(cita.descripcion);
    setFechaCita(new Date(cita.fecha).toISOString().split('T')[0]);
    setHoraCita(cita.hora);
    setAlarmaCita(cita.alarma);
    setMinutosAntesCita(cita.minutos_antes);
  };

  const resetFormCita = () => {
    setServicioCita('');
    setDescripcionCita('');
    setFechaCita('');
    setHoraCita('');
    setAlarmaCita(true);
    setMinutosAntesCita(30);
    setCitaEditando(null);
  };

  const cerrarNotificacion = () => {
    setMostrarNotificacion(false);
    setCitaNotificacion(null);
  };

  // Renderizar formulario de login o registro
  const renderLoginRegistro = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <UserCircle className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mostrarRegistro ? 'Crea tu cuenta' : 'Inicia sesión'}
          </h2>
        </div>
        
        {mostrarRegistro ? (
          <form className="mt-8 space-y-6" onSubmit={handleRegistro}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="nombre" className="sr-only">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nombre"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email-registro" className="sr-only">Email</label>
                <input
                  id="email-registro"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={emailUsuario}
                  onChange={(e) => setEmailUsuario(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password-registro" className="sr-only">Contraseña</label>
                <input
                  id="password-registro"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={passwordUsuario}
                  onChange={(e) => setPasswordUsuario(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrarse
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setMostrarRegistro(false)}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="email-login" className="sr-only">Email</label>
                <input
                  id="email-login"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password-login" className="sr-only">Contraseña</label>
                <input
                  id="password-login"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar sesión
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setMostrarRegistro(true)}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  // Renderizar la sección principal (recados o citas)
  const renderSeccionPrincipal = () => {
    if (!usuarioActual) return null;
    
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        {mostrarNotificacion && citaNotificacion && (
          <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm border-l-4 border-blue-500 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <BellRing className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-md font-semibold">Recordatorio de cita</h3>
              </div>
              <button 
                onClick={cerrarNotificacion}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Tienes una cita con <strong>{citaNotificacion.servicio}</strong>
            </p>
            <p className="text-sm text-gray-600">
              En {citaNotificacion.minutos_antes} minutos ({citaNotificacion.hora})
            </p>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Mi Agenda Electrónica</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Reloj */}
              <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-md shadow-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-mono">{horaActual}</span>
              </div>
              
              <div className="text-sm font-medium text-gray-700">
                Hola, {usuarioActual.nombre}
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSeccionActual('recados')}
              className={`px-4 py-2 rounded-md ${
                seccionActual === 'recados'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Recados
            </button>
            <button
              onClick={() => setSeccionActual('citas')}
              className={`px-4 py-2 rounded-md ${
                seccionActual === 'citas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Citas
            </button>
          </div>

          {seccionActual === 'recados' ? renderRecados() : renderCitas()}
        </div>
      </div>
    );
  };

  // Renderizar sección de recados
  const renderRecados = () => (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {recadoEditando ? 'Editar Recado' : 'Agregar Nuevo Recado'}
        </h2>
        <form onSubmit={handleSubmitRecado} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={tituloRecado}
                onChange={(e) => setTituloRecado(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={descripcionRecado}
                onChange={(e) => setDescripcionRecado(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={fechaRecado}
                onChange={(e) => setFechaRecado(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                value={horaRecado}
                onChange={(e) => setHoraRecado(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {recadoEditando && (
              <button
                type="button"
                onClick={resetFormRecado}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              {recadoEditando ? (
                <>
                  <Edit className="w-5 h-5" />
                  Actualizar
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Agregar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Mis Recados</h2>
        </div>
        {recados.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No tienes recados. ¡Agrega uno!
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recados.map((recado) => (
                <tr key={recado._id} className={recado.completado ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCompletarRecado(recado)}
                      className={`p-1 rounded ${
                        recado.completado
                          ? 'text-green-600 hover:text-green-800'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <CheckSquare className="w-5 h-5" />
                    </button>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${recado.completado ? 'line-through text-gray-500' : ''}`}>
                    {recado.titulo}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${recado.completado ? 'line-through text-gray-500' : ''}`}>
                    {recado.descripcion}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${recado.completado ? 'line-through text-gray-500' : ''}`}>
                    {new Date(recado.fecha).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${recado.completado ? 'line-through text-gray-500' : ''}`}>
                    {recado.hora}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRecado(recado)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecado(recado._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  // Renderizar sección de citas
  const renderCitas = () => (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {citaEditando ? 'Editar Cita' : 'Agregar Nueva Cita'}
        </h2>
        <form onSubmit={handleSubmitCita} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
              <input
                type="text"
                value={servicioCita}
                onChange={(e) => setServicioCita(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={descripcionCita}
                onChange={(e) => setDescripcionCita(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={fechaCita}
                onChange={(e) => setFechaCita(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                value={horaCita}
                onChange={(e) => setHoraCita(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                id="alarma"
                type="checkbox"
                checked={alarmaCita}
                onChange={(e) => setAlarmaCita(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="alarma" className="ml-2 block text-sm text-gray-700">
                Activar alarma
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minutos antes (alarma)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={minutosAntesCita}
                onChange={(e) => setMinutosAntesCita(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border"
                disabled={!alarmaCita}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {citaEditando && (
              <button
                type="button"
                onClick={resetFormCita}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              {citaEditando ? (
                <>
                  <Edit className="w-5 h-5" />
                  Actualizar
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Agregar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Mis Citas</h2>
        </div>
        {citas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No tienes citas. ¡Agrega una!
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alarma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {citas.map((cita) => (
                <tr key={cita._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.servicio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(cita.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.hora}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cita.alarma ? (
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-blue-500 mr-1" />
                        <span>{cita.minutos_antes} min antes</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Desactivada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCita(cita)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCita(cita._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  return (
    <div>
      {usuarioActual ? renderSeccionPrincipal() : renderLoginRegistro()}
    </div>
  );
}

export default App;