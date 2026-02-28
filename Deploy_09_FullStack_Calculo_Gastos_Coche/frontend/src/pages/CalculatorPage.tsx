import React, { FormEvent, useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateCosts } from '../lib/api';
import type { CalculationInput, CalculationResult } from '../types';

export function CalculatorPage() {
  const [input, setInput] = useState<CalculationInput>({
    kilometros: 0,
    consumo: 0,
    precio: 0,
    viajeros: 1,
    tipoCombustible: 'Gasolina'
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCalculating(true);
    setError(null);

    try {
      const result = await calculateCosts(input);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular costos');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Calculadora de Costos</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tipoCombustible" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Combustible
            </label>
            <select
              id="tipoCombustible"
              value={input.tipoCombustible}
              onChange={(e) => setInput({ ...input, tipoCombustible: e.target.value as CalculationInput['tipoCombustible'] })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diésel</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>
          </div>

          <div>
            <label htmlFor="kilometros" className="block text-sm font-medium text-gray-700 mb-1">
              Kilómetros
            </label>
            <input
              type="number"
              id="kilometros"
              min="0"
              step="1"
              value={input.kilometros}
              onChange={(e) => setInput({ ...input, kilometros: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="consumo" className="block text-sm font-medium text-gray-700 mb-1">
              {input.tipoCombustible === 'Eléctrico' ? 'Consumo (kWh/100km)' : 'Consumo (L/100km)'}
            </label>
            <input
              type="number"
              id="consumo"
              min="0"
              step="0.1"
              value={input.consumo}
              onChange={(e) => setInput({ ...input, consumo: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
              {input.tipoCombustible === 'Eléctrico' ? 'Precio Electricidad (€/kWh)' : 'Precio Combustible (€/L)'}
            </label>
            <input
              type="number"
              id="precio"
              min="0"
              step="0.001"
              value={input.precio}
              onChange={(e) => setInput({ ...input, precio: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="viajeros" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Viajeros
            </label>
            <input
              type="number"
              id="viajeros"
              min="1"
              step="1"
              value={input.viajeros}
              onChange={(e) => setInput({ ...input, viajeros: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={calculating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {calculating ? 'Calculando...' : 'Calcular Costos'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Resultados del Cálculo</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-green-600">Distancia Total</dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">{result.kilometros} km</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-green-600">
                {input.tipoCombustible === 'Eléctrico' ? 'Consumo Medio' : 'Consumo Medio'}
              </dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">
                {result.consumoMedio} {input.tipoCombustible === 'Eléctrico' ? 'kWh/100km' : 'L/100km'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-green-600">
                {input.tipoCombustible === 'Eléctrico' ? 'Precio Electricidad' : 'Precio Combustible'}
              </dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">
                {result.precioCombustible} {input.tipoCombustible === 'Eléctrico' ? '€/kWh' : '€/L'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-green-600">Viajeros</dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">{result.viajeros}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-green-600">Coste Total</dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">{result.precioTotal.toFixed(2)} €</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-green-600">Coste por Viajero</dt>
              <dd className="mt-1 text-lg font-semibold text-green-900">{result.precioPorViajero.toFixed(2)} €</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}