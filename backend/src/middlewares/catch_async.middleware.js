/**
 * @description Envuelve funciones asíncronas para pasar los errores automáticamente al manejador de errores de Express.
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};