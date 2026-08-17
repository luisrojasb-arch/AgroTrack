import HealthHeader from "@/components/health/HealthHeader";
import HealthStats from "@/components/health/HealthStats";
export default function HealthPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <HealthHeader />
      <HealthStats />
    
    </div>
  );
}