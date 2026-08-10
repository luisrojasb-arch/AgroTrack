import StatCard from '@/components/layout/StatCard';
export default function OverviewStats({ stats }) {

    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <p>{stats}</p>
        </div>
    );
}