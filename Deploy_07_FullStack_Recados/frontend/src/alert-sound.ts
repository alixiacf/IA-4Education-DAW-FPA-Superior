/**
 * Utilidades para reproducir sonidos de alerta en la aplicación
 */

// Función principal para reproducir sonido de alerta usando Web Audio API
export const reproducirSonidoAlerta = (): void => {
  try {
    // Crear un contexto de audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Crear un oscilador (generador de tono)
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Onda sinusoidal (sonido suave)
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Nota A5
    
    // Crear un nodo de ganancia (para controlar el volumen)
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // 30% del volumen
    
    // Conectar el oscilador a la salida
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configurar la duración del sonido
    oscillator.start();
    
    // Primera serie de pitidos
    setTimeout(() => { gainNode.gain.setValueAtTime(0, audioContext.currentTime); }, 300);
    setTimeout(() => { gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); }, 500);
    setTimeout(() => { gainNode.gain.setValueAtTime(0, audioContext.currentTime); }, 800);
    setTimeout(() => { gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); }, 1000);
    
    // Detener después de la alerta
    setTimeout(() => { 
      oscillator.stop(); 
      console.log('🔔 ALERTA: Recordatorio de cita próxima (Web Audio API)');
    }, 1300);
  } catch (error) {
    console.error('No se pudo reproducir el sonido de alerta:', error);
    // Intentar con método alternativo si el primero falla
    reproducirSonidoSimple();
  }
};

// Función alternativa más simple usando Audio HTML5 (más compatible)
export const reproducirSonidoSimple = (): void => {
  try {
    // Reproducir un pitido simple predefinido
    const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+Array(1E3).join("AAAAA"));
    
    // Configurar sonido
    audio.volume = 0.5;
    
    // Reproducir el sonido
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // La reproducción se inició correctamente
          console.log('🔔 ALERTA SIMPLE: Sonido reproducido correctamente');
          
          // Detener después de 1 segundo
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 1000);
        })
        .catch(error => {
          // La reproducción automática fue impedida
          console.error('Error al reproducir sonido automáticamente:', error);
          console.log('ℹ️ Es posible que el navegador requiera interacción del usuario para reproducir sonidos');
          
          // Registrar un evento visual para notificar al usuario
          console.log('%c 🔔 ¡ALERTA DE CITA PRÓXIMA! 🔔 ', 'background: #ff0000; color: white; font-size: 24px;');
        });
    }
  } catch (error) {
    console.error('No se pudo reproducir el sonido simple:', error);
    // Último recurso: solo mostrar un mensaje visual en la consola
    console.log('%c 🔔 ¡ALERTA DE CITA PRÓXIMA! 🔔 ', 'background: #ff0000; color: white; font-size: 24px;');
  }
};

// Función para reproducir un pitido más simple (si todo lo demás falla)
export const reproducirPitido = (): void => {
  try {
    // Crear oscilador básico
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), 200);
    console.log('🔔 Pitido básico reproducido');
  } catch (error) {
    console.error('No se pudo reproducir ningún tipo de sonido:', error);
  }
};