import { useLocation } from "react-router-dom";
import navConfig from "../configurations/navConfig";

export function useCurrentModule() {
    const location = useLocation();

    const currentItem = navConfig.find(item => location.pathname.endsWith(item.path) || location.pathname === item.path)

    return currentItem?.module;
}