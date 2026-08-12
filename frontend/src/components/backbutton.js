"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button"; //componente

export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant="white" size="42" onClick={() => router.back()}>
      Volver Atrás
    </Button>
  );
}