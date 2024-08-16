export function getNumberFormatter({
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    style,
}) {
    return new Intl.NumberFormat("en-US", {
        style,
        currency: "USD",
        minimumFractionDigits,
        maximumFractionDigits,
    });
}

export function formatCurrency(
    value,
    options = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }
) {
    return getNumberFormatter({ ...options, style: "currency" }).format(value);
}

export function formatNumber(
    value,
    options = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }
) {
    return getNumberFormatter({ ...options, style: "decimal" }).format(value);
}

export function smartFormatCurrency(value) {
    if (value >= 1000000000000) {
        return formatCurrency(value / 1e12) + "T";
    } else if (value >= 1000000000) {
        return formatCurrency(value / 1e9) + "B";
    } else if (value >= 1000000) {
        return formatCurrency(value / 1e6) + "M";
    } else if (value >= 1000) {
        return formatCurrency(value / 1e3) + "K";
    } else if (value > 1) {
        return formatCurrency(value);
    } else {
        const decimalDepth =
            String(1 + value).match(/\.(0+)[1-9]/)?.[1]?.length || 0;

        if (decimalDepth > 0) {
            return formatCurrency(value, {
                minimumFractionDigits: decimalDepth + 2,
                maximumFractionDigits: decimalDepth + 4,
            });
        }

        return formatCurrency(value);
    }
}

export function smartFormatNumber(value) {
    if (value >= 1e12) {
        return formatNumber(value / 1e12) + "T";
    } else if (value >= 1e9) {
        return formatNumber(value / 1e9) + "B";
    } else if (value >= 1e6) {
        return formatNumber(value / 1e6) + "M";
    } else if (value >= 1e3) {
        return formatNumber(value / 1e3) + "K";
    } else if (value > 1) {
        return formatNumber(value);
    } else {
        const decimalDepth =
            String(1 + value).match(/\.(0+)[1-9]/)?.[1]?.length || 0;

        if (decimalDepth > 0) {
            return formatNumber(value, {
                minimumFractionDigits: decimalDepth + 2,
                maximumFractionDigits: decimalDepth + 4,
            });
        }

        return formatNumber(value);
    }
}
