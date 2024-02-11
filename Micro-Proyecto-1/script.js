        const numMaximo = 50;
        const maxRondas = 25;
        let ronda = 0;
        let tamaño = 0;
        let jugadores = [];
        let numerosSalidos = new Set();

        class Tablero {
            constructor(tamaño) {
            this.matriz = this.generarMatriz(tamaño);
            }
        
            generarMatriz(tamaño) {
            let matriz = [];
            let numerosUsados = new Set();
        
            for (let i = 0; i < tamaño; i++) {
                matriz[i] = [];
                for (let j = 0; j < tamaño; j++) {
                let numeroAleatorio;
                do {
                    numeroAleatorio = Math.floor(Math.random() * 50) + 1;
                } while (numerosUsados.has(numeroAleatorio));
                numerosUsados.add(numeroAleatorio);
                matriz[i][j] = numeroAleatorio;
                }
            }
            return matriz;
            }
        }
        
        class Jugador {
            constructor(nombre, tamañoTablero) {
            this.nombre = nombre;
            this.puntaje = 0;
            this.tablero = new Tablero(tamañoTablero);
            }
        }

        /*HOME - FRAME 1*/
        function iniciarJuego(tamaño) {
            const nombres = [
            document.getElementById("name-player1").value.trim(),
            document.getElementById("name-player2").value.trim(),
            document.getElementById("name-player3").value.trim(),
            document.getElementById("name-player4").value.trim()
            ];
        
            
            if (nombres.every(nombre => nombre.length > 0)) {
            const jugadores = nombres.map(nombre => new Jugador(nombre, tamaño));
            localStorage.setItem('jugadores', JSON.stringify(jugadores));
            window.location.href = 'juego.html'
            
            } else {
            alert("Por favor, ingresa el nombre de los 4 jugadores.");
            }
        }

        /*PLAYROOM -FRAME 2*/
        //Al cargar la pagina de juego
        document.addEventListener('DOMContentLoaded', (event) => {
            jugadores = JSON.parse(localStorage.getItem('jugadores'));
            const numbers = document.getElementById('numbers');
            
            mostrarTableroJugador(0);
        
            document.getElementById('player-selector').addEventListener('change', (e) => {
            mostrarTableroJugador(e.target.selectedIndex);
            });
        });
        
        // Función para generar un nuevo numero
        function generarNumero() {
            if (ronda > maxRondas) {
            alert("Máximo de rondas alcanzado");
            return;
            }
        
            const numeroGenerado = Math.floor(Math.random() * numMaximo) + 1;
            if (numerosSalidos.has(numeroGenerado)) {
            return generarNumero();
            }
        
            numerosSalidos.add(numeroGenerado);
            ronda++;
            actualizarRondaUI();
            actualizarJuego(numeroGenerado);
        }
        
        // Función para marcar numeros en cartones
        function marcarNumeros(numero) {
            jugadores.forEach((jugador, indiceJugador) => {
              let cambio = false;
              jugador.tablero.matriz.forEach((fila, i) => {
                fila.forEach((valor, j) => {
                  if (valor.toString() === numero.toString()) {
                    jugador.tablero.matriz[i][j] = 'X'; 
                    cambio = true;
                  }
                });
              });
              
              if (cambio) {
                if (indiceJugador === document.getElementById('player-selector').selectedIndex) {
                  mostrarTableroJugador(indiceJugador);
                }
              }
            });
          }
        
          // Función para actualizar las rondas en pantalla
          function actualizarRondaUI() {
            document.querySelector('.Round-counter h3').textContent = `⏱️ Ronda: ${ronda} / ${maxRondas}`;
            document.getElementById('num-container-t').textContent = numerosSalidos.size > 0 ? Array.from(numerosSalidos).pop() : '';
        }

        
        // Función para crear el tablero en el DOM
        function crearTableroDOM(tablero) {
          const numbers = document.getElementById('numbers');
          numbers.innerHTML = ''; // Limpiar el contenedor del tablero
          tablero.matriz.forEach((fila) => {
            fila.forEach((numero) => {
              let cellDiv = document.createElement('div');
              cellDiv.classList.add('num');
              if (numero === 'X') {
                cellDiv.classList.add('num-checked');
              }
              cellDiv.textContent = numero;
              numbers.appendChild(cellDiv);
            });
          });
        }
  
      // Función para actualizar el nombre del jugador y mostrar su tablero
      function mostrarTableroJugador(indice) {
          let jugador = jugadores[indice];
          document.getElementById('playerName').textContent = jugador.nombre;
          // Limpia clases previas
          numbers.className = 'numbers'; // Restablece a la clase base para limpiar clases anteriores
          // Añade la clase según el tamaño del tablero
          if (jugador.tablero.matriz.length === 3) {
          numbers.classList.add('three');
          } else if (jugador.tablero.matriz.length === 4) {
          numbers.classList.add('four');
          } else if (jugador.tablero.matriz.length === 5) {
          numbers.classList.add('five');
          }
          crearTableroDOM(jugador.tablero);
      }

      //Calcular puntaje
      function calcularPuntos(jugador) {
        let puntos = 0;
        let cartonLleno = true;
      
        // Calcular líneas horizontales y verticales
        for (let i = 0; i < jugador.tablero.matriz.length; i++) {
          let lineaHorizontalCompleta = true;
          let lineaVerticalCompleta = true;
          for (let j = 0; j < jugador.tablero.matriz[i].length; j++) {
            if (jugador.tablero.matriz[i][j] !== 'X') {
              lineaHorizontalCompleta = false;
              cartonLleno = false;
            }
            if (jugador.tablero.matriz[j][i] !== 'X') {
              lineaVerticalCompleta = false;
            }
          }
          if (lineaHorizontalCompleta) puntos += 1;
          if (lineaVerticalCompleta) puntos += 1;
        }
      
        // Calcular diagonales
        let diagonalPrincipalCompleta = true;
        let diagonalSecundariaCompleta = true;
        for (let i = 0; i < jugador.tablero.matriz.length; i++) {
          if (jugador.tablero.matriz[i][i] !== 'X') diagonalPrincipalCompleta = false;
          if (jugador.tablero.matriz[i][jugador.tablero.matriz.length - 1 - i] !== 'X') diagonalSecundariaCompleta = false;
        }
        if (diagonalPrincipalCompleta) puntos += 3;
        if (diagonalSecundariaCompleta) puntos += 3;
      
        // Cartón lleno
        if (cartonLleno) puntos += 5;
      
        jugador.puntaje = puntos;
      }
      
      //Validar fin de juego
      function verificarCondicionesDeParada() {
        let puntaje_maximo = (2*tamaño+11);
        const cartonLleno = jugadores.some(jugador => jugador.puntaje >= puntaje_maximo);
        if (cartonLleno || ronda >= maxRondas) {
          localStorage.setItem('jugadores', JSON.stringify(jugadores));
          window.location.href = 'resultados.html';
        }
      }
      
      //Actualizar atributos de cada jugador
      function actualizarJuego(numeroGenerado) {
        marcarNumeros(numeroGenerado);
        jugadores.forEach(jugador => calcularPuntos(jugador));
        verificarCondicionesDeParada();
      }
      
      /*RESULTS -FRAME 3*/

      document.addEventListener('DOMContentLoaded', () => {
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        // Ordena jugadores por puntaje de mayor a menor
        jugadores.sort((a, b) => b.puntaje - a.puntaje);
      
        const tablaResultados = document.getElementById('results-table');
      
        jugadores.forEach((jugador, index) => {
          const fila = tablaResultados.insertRow();
          let celdaPosicion = fila.insertCell(0);
          let celdaNombre = fila.insertCell(1);
          let celdaPuntos = fila.insertCell(2);
      
          celdaPosicion.textContent = index + 1;
          celdaNombre.textContent = jugador.nombre;
          celdaPuntos.textContent = jugador.puntaje;
        });

        actualizarVictorias();

      });

      // Función para actualizar las victorias y guardar en localStorage
    function actualizarVictorias() {
      let victorias = JSON.parse(localStorage.getItem('victorias')) || {};
      const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
      jugadores.sort((a, b) => b.puntaje - a.puntaje);
      let maxPuntos = jugadores[0]?.puntaje || 0;

      jugadores.forEach(jugador => {
          if (jugador.puntaje === maxPuntos && maxPuntos > 0) {
              victorias[jugador.nombre] = (victorias[jugador.nombre] || 0) + 1;
          }
      });

      localStorage.setItem('victorias', JSON.stringify(victorias));
    }

      // Función para mostrar el ranking
      function mostrarRanking() {
        let victorias = JSON.parse(localStorage.getItem('victorias')) || {};
        let jugadoresOrdenados = Object.entries(victorias)
            .map(([nombre, victorias]) => ({ nombre, victorias }))
            .sort((a, b) => b.victorias - a.victorias);

        const tablaRanking = document.getElementById('rank-table');
        jugadoresOrdenados.forEach((jugador, index) => {
            let fila = tablaRanking.insertRow(-1);
            let celdaPosicion = fila.insertCell(0);
            let celdaNombre = fila.insertCell(1);
            let celdaVictorias = fila.insertCell(2);

            celdaPosicion.textContent = index + 1;
            celdaNombre.textContent = jugador.nombre;
            celdaVictorias.textContent = jugador.victorias;
        });
      }

      document.addEventListener('DOMContentLoaded', () => {
        mostrarRanking();
      });






      
      
  
  
   


  