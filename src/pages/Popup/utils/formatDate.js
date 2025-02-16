export const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Convert to local time (IST automatically applied if your system is set to IST)
    const localDate = new Date(date.getTime() + (new Date().getTimezoneOffset() * 60000));

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);



    return `${localDate.getDate()}-${localDate.getMonth() + 1}-${localDate.getFullYear()}`;

};
