import { useCurrentModule } from "../../../hooks/useCurrentModule";
import { useDashboardConfig } from "../../../hooks/useDashboardConfig";
import FeatureCard from "./main_components/FeatureCard";

function ManageFeaturesHome() {
    const currentModule = useCurrentModule();
    const { flags, isLoading } = useDashboardConfig();

    if (isLoading) return <p>Flags not loaded yet.</p>

    return (
        <div className="p-4">
            <h1 className="font-bold text-lg">Manage features</h1>
            <div className="cards-area">
                {Array.from(flags).map((flag) => (
                    <FeatureCard key={flag.flagId} flag={flag}/>
                ))}
            </div>
        </div>
    )
}

export default ManageFeaturesHome;