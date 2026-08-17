import Button from "@/components/ui/Button";

export default function CtaSection() {
  return (
    <section className="w-full px-6 md:px-8 lg:px-12 py-10 bg-white">
      <div className="max-w-350 mx-auto bg-primary rounded-4xl px-6 py-16 md:py-20 flex flex-col items-center text-center shadow-lg">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          ¿Listo para profesionalizar tu granja?
        </h2>

        <p className="text-[16px] md:text-[18px] text-white/90 max-w-2xl mb-10 leading-relaxed">
          Únete a cientos de productores que ya usan AgroTrack para aumentar su
          productividad y rentabilidad.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button variant="white" size="42" href="/register">
            Regístrate
          </Button>
          <Button variant="white" size="42" href="/contact">
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}
