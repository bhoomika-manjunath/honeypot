export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';

    let date;
    // Check if timestamp is seconds (Unix epoch)
    if (typeof timestamp === 'number') {
        // If it's small (e.g. 1764...), it's seconds. If huge, it's ms.
        // 1 trillion is roughly year 2001 in ms.
        if (timestamp < 1000000000000) {
            date = new Date(timestamp * 1000);
        } else {
            date = new Date(timestamp);
        }
    } else {
        // Try parsing string
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleString('en-US', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
};

export const formatTimeOnly = (timestamp) => {
    if (!timestamp) return 'N/A';

    let date;
    if (typeof timestamp === 'number') {
        if (timestamp < 1000000000000) {
            date = new Date(timestamp * 1000);
        } else {
            date = new Date(timestamp);
        }
    } else {
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return 'Invalid Time';

    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
};
