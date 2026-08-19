/**
 * @description Encabezado del módulo de administración de usuarios.
 */

export default function UsersHeader() {
  return (
    <div className="flex flex-col">
      <h1 className="text-[30px] font-bold text-black leading-tight">
        Gestión de Usuarios
      </h1>
      <p className="text-[16px] font-medium text-gray-agro leading-tight mt-1">
        Administra usuarios y sus permisos
      </p>
    </div>
  );
}
