export const formatDate = (timestamp) => {
    const localMilliseconds = Date.now() - (new Date().getTimezoneOffset() * 60000)
    const date = new Date(timestamp);
    const today = new Date(localMilliseconds);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {
        return "Today";
    } else if (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    ) {
        return "Yesterday";
    } else {
        return `${date.getDate() - 1}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }
};