import Image from "next/image";

/**
 * @description Layout dividido para pantallas de login/registro (imagen y formulario).
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del formulario.
 */

export default function AuthSplitLayout({ children }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-64px)]">
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        <Image
          src="/Header-Lateral.png"
          alt="Cerdos en granja"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#00943E]/[0.702] backdrop-blur-[10px]" />
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
