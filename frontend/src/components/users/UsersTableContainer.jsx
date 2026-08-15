"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import UsersTableControls from "./UsersTableControls";
import UsersTable from "./UsersTable";
import PermissionsTable from "./PermissionsTable";

import UserFormModal from "./modalsUsers/UserFormModal";
import DeleteUserModal from "./modalsUsers/DeleteUserModal";
import {
  createMiembroAction,
  updateMiembroAction,
  deleteMiembroAction,
} from "@/actions/user.actions";

export default function UsersTableContainer({ initialData }) {
  const usuarios = initialData?.usuarios || [];

  const paginacion = initialData?.paginacion || {
    totalRegistros: 0,
    paginaActual: 1,
    limite: 10,
    totalPaginas: 1,
  };

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isUserDeleteOpen, setIsUserDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setIsUserDeleteOpen(true);
  };

  const handleSubmitUserForm = async (formData) => {
    const res = selectedUser
      ? await updateMiembroAction(selectedUser.id, formData)
      : await createMiembroAction(formData);

    if (res.success) {
      setIsUserFormOpen(false);
      setSelectedUser(null);
      toast.success(
        selectedUser
          ? "Usuario actualizado correctamente"
          : "Usuario registrado correctamente",
      );
    } else {
      toast.error(res.error);
    }
  };

  const handleConfirmDeleteUser = async (id) => {
    const res = await deleteMiembroAction(id);
    if (res.success) {
      setIsUserDeleteOpen(false);
      setSelectedUser(null);
      toast.success("Usuario eliminado correctamente");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold text-black leading-tight">
              Usuarios
            </h2>
            <p className="text-[14px] font-medium text-gray-agro mt-1">
              Administra cuentas de usuario y permisos
            </p>
          </div>
          <Button
            variant="green"
            onClick={handleAddUser}
            className="w-full sm:w-auto"
          >
            Agregar Usuario
          </Button>
        </div>

        <UsersTableControls />
        <UsersTable
          usuarios={usuarios}
          onEdit={handleEditUser}
          onDelete={handleDeleteUserClick}
        />

        <div className="mt-6">
          <Pagination
            totalRegistros={paginacion.totalRegistros}
            totalPaginas={paginacion.totalPaginas}
            paginaActual={paginacion.paginaActual}
            limite={paginacion.limite}
          />
        </div>
      </div>

      <div className="bg-gradient-card border border-border-agro rounded-2xl p-6 w-full shadow-sm relative">
        <div className="flex flex-col mb-6">
          <h2 className="text-[20px] font-bold text-black leading-tight">
            Permisos de Roles
          </h2>
          <p className="text-[14px] font-medium text-gray-agro mt-1">
            Visualiza los niveles de acceso al sistema
          </p>
        </div>

        <PermissionsTable />
      </div>

      <UserFormModal
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        userToEdit={selectedUser}
        onSubmit={handleSubmitUserForm}
      />
      <DeleteUserModal
        isOpen={isUserDeleteOpen}
        onClose={() => setIsUserDeleteOpen(false)}
        user={selectedUser}
        onConfirm={handleConfirmDeleteUser}
      />
    </div>
  );
}
