import Link from "next/link";

/**
 * @description Componente de botón o enlace reutilizable para la interfaz de usuario.
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido interno del botón.
 * @param {"green" | "white"} [props.variant="green"] - Estilo visual del botón.
 * @param {"36" | "42" | "46" | "full"} [props.size="42"] - Altura predefinida del botón.
 * @param {boolean} [props.fullWidth=false] - Si es true, el botón ocupará el 100% del contenedor padre.
 * @param {string} [props.className=""] - Clases CSS adicionales.
 * @param {string} [props.href] - Si se proporciona, el botón se renderizará como un enlace de navegación de Next.js.
 * @returns {JSX.Element} Componente renderizado (Link o Button).
 */
export default function Button({
  children,
  variant = "green",
  size = "42",
  fullWidth = false,
  className = "",
  href,
  ...props
}) {
  const baseStyles =
    "flex items-center justify-center px-[32px] text-[16px] font-bold rounded-[8px] transition-all duration-200 cursor-pointer";

  const variants = {
    green: "bg-gradient-green text-white hover:opacity-90 shadow-sm",
    white:
      "bg-gradient-white text-black border border-border-agro hover:brightness-95 shadow-sm",
  };

  const heights = {
    36: "h-[36px]",
    42: "h-[42px]",
    46: "h-[46px]",
    full: "h-full",
  };

  const widthClass = fullWidth ? "w-full" : "w-fit";

  const combinedClassName = `${baseStyles} ${variants[variant]} ${heights[size]} ${widthClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
