export function uploadedAsset(path: string) {
    return import.meta.env.VITE_CDN_BASE + path;
}
