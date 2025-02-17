export const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Convert to local time (IST automatically applied if your system is set to IST)
    const localDate = new Date(date.getTime() + (new Date().getTimezoneOffset() * 60000));

    const today = new Date(date.getTime() + (new Date().getTimezoneOffset() * 60000));
    const yesterday = new Date(date.getTime() + (new Date().getTimezoneOffset() * 60000));
    yesterday.setDate(today.getDate() - 1);

    if (
        localDate.getDate() === today.getDate() &&
        localDate.getMonth() === today.getMonth() &&
        localDate.getFullYear() === today.getFullYear()
    ) {
        return "Today";
    } else if (
        localDate.getDate() === yesterday.getDate() &&
        localDate.getMonth() === yesterday.getMonth() &&
        localDate.getFullYear() === yesterday.getFullYear()
    ) {
        return "Yesterday";
    } else {
        return `${localDate.getDate()}-${localDate.getMonth() + 1}-${localDate.getFullYear()}`;
    }
};
