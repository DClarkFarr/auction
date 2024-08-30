import SiteSettingsModel from "../models/SiteSettingModel.js";

export default class SiteService {
    /**
     * @param {string} key
     * @param {object} value
     */
    static async saveSetting(key, value) {
        const siteSettingsModel = new SiteSettingsModel();
        const updated = await siteSettingsModel.table.upsert({
            where: {
                key,
            },
            update: {
                value,
            },
            create: {
                key,
                value,
            },
        });

        return updated;
    }

    /**
     * @param {string} key
     */
    static async getSetting(key) {
        const siteSettingsModel = new SiteSettingsModel();

        return siteSettingsModel.findByKey(key);
    }

    /**
     * @param {string[]} keys
     */
    static async getSettings(keys) {
        return await Promise.all(keys.map((key) => this.getSetting(key)));
    }
}
