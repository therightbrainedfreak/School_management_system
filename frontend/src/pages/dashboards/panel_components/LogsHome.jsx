import { useCurrentModule } from "../../../hooks/useCurrentModule";
import { useDashboardConfig } from "../../../hooks/useDashboardConfig";

function LogsHome() {
    const currentModule = useCurrentModule();
    const { flags } = useDashboardConfig();

    return (
        <div className="p-4">
            This is where all the logs can be viewed e.g., account logs or system logs.
            <p className="text-green-400">More features coming...</p>
            <p>Current Module: {currentModule}</p>
            <p>{flags.map(item => {
                return (
                    <p>{item.key + " " + item.module}</p>
                )
            })}</p>
        </div>
    )
}

export default LogsHome;