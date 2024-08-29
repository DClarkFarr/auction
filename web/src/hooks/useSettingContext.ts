import { Context, useContext } from "react";
import { SiteSetting } from "../types/SiteSetting";
import {
    SettingContext,
    SiteSettingContexts,
} from "../providers/ScopedSettingProvider";

const useSettingContext = <K extends SiteSetting>() =>
    useContext(SettingContext as Context<SiteSettingContexts[K]>);

export default useSettingContext;
