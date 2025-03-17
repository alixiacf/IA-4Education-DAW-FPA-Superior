import React from 'react';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ allTags, selectedTags, onTagSelect }) => {
  // Función para asignar colores a las etiquetas
  const getTagColor = (tag: string): string => {
    const tagColors: Record<string, string> = {
      'RPG': '#8b5cf6', // Púrpura
      'Acción': '#ef4444', // Rojo
      'Aventura': '#f59e0b', // Ámbar
      'Estrategia': '#0891b2', // Cian
      'Deportes': '#16a34a', // Verde
      'Simulación': '#1d4ed8', // Azul
      'Multijugador': '#db2777', // Rosa
      'Indie': '#6366f1', // Índigo
      'Mundo abierto': '#65a30d', // Lima
      'Shooter': '#b91c1c', // Rojo oscuro
    };

    return tagColors[tag] || '#6b7280'; // Gris por defecto
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Filtrar por etiquetas:</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                isSelected ? 'text-white' : 'text-gray-800'
              }`}
              style={{ 
                backgroundColor: isSelected ? getTagColor(tag) : '#e5e7eb',
                borderWidth: '2px',
                borderColor: getTagColor(tag),
                opacity: isSelected ? 1 : 0.8
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilter;