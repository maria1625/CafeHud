export const formatCOP = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "COP 0";
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value));
};
