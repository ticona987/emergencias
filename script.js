// Parámetros del problema
const lambda = 6;   // Pacientes que llegan por hora
const mu = 4;       // Pacientes atendidos por hora
const C = 12;       // Número de camas

const inputTime = document.getElementById('inputTime');
const btnCalcular = document.getElementById('btnCalcular');
const numPacientes = document.getElementById('numPacientes');
const pacientesEspera = document.getElementById('pacientesEspera');
const tiempoEspera = document.getElementById('tiempoEspera');

const ctx = document.getElementById('chart').getContext('2d');

let chart; // Variable para el gráfico

function calcularValores(t) {
  const N = Math.max(0, (lambda - mu) * t);
  const Q = Math.max(0, N - C);
  const W = Q > 0 ? Q / mu : 0;
  return { N, Q, W };
}

function generarDatosParaGrafico(tMax) {
  const labels = [];
  const dataN = [];
  const dataQ = [];
  const dataW = [];

  // Generamos datos para t desde 0 hasta tMax con pasos de 0.5 horas
  for (let t = 0; t <= tMax; t += 0.5) {
    labels.push(t.toFixed(1));
    const { N, Q, W } = calcularValores(t);
    dataN.push(N.toFixed(2));
    dataQ.push(Q.toFixed(2));
    dataW.push(W.toFixed(2));
  }

  return { labels, dataN, dataQ, dataW };
}

function crearGrafico(tMax) {
  const { labels, dataN, dataQ, dataW } = generarDatosParaGrafico(tMax);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Pacientes totales N(t)',
          data: dataN,
          borderColor: '#457b9d',
          backgroundColor: 'rgba(69,123,157,0.2)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Pacientes esperando cama Q(t)',
          data: dataQ,
          borderColor: '#e76f51',
          backgroundColor: 'rgba(231,111,81,0.2)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: 'Tiempo promedio de espera W(t) (horas)',
          data: dataW,
          borderColor: '#2a9d8f',
          backgroundColor: 'rgba(42,157,143,0.2)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Pacientes',
          },
          min: 0,
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Tiempo (horas)',
          },
          grid: {
            drawOnChartArea: false,
          },
          min: 0,
        },
        x: {
          title: {
            display: true,
            text: 'Tiempo (horas)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true,
          mode: 'nearest',
          intersect: false,
        }
      }
    }
  });
}

btnCalcular.addEventListener('click', () => {
  const t = parseFloat(inputTime.value);

  if (isNaN(t) || t < 0) {
    alert('Por favor ingresa un tiempo válido (mayor o igual a 0).');
    return;
  }

  const { N, Q, W } = calcularValores(t);

  numPacientes.textContent = N.toFixed(2);
  pacientesEspera.textContent = Q.toFixed(2);
  tiempoEspera.textContent = W.toFixed(2);

  crearGrafico(Math.max(t, 12)); // mostramos datos hasta t o 12 horas mínimo
});
