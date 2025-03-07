import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateCosts } from '../lib/api';
import type { CalculationInput, CalculationResult } from '../types';

export function CalculatorPage() {
  const [input, setInput] = useState<CalculationInput>({
    kilometros: 0,
    consumo: 0,
    precio: 0,
    viajeros: 1
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
              Consumo (L/100km)
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
              Precio Combustible (€/L)
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

        <button
          type="submit"
          disabled={calculating}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {calculating ? 'Calculando...' : 'Calcular Costos'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Costo Total</p>
              <p className="text-2xl font-bold text-gray-900">{result.precioTotal.toFixed(2)}€</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Costo por Viajero</p>
              <p className="text-2xl font-bold text-blue-600">{result.precioPorViajero.toFixed(2)}€</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Consumo total: {(result.kilometros * result.consumoMedio / 100).toFixed(2)} litros</p>
            <p>Distancia: {result.kilometros} km</p>
            <p>Precio combustible: {result.precioCombustible}€/L</p>
          </div>
        </div>
      )}
    </div>
  );
}