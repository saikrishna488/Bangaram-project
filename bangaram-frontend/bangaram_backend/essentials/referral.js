const generateReferral = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
};

export { generateReferral };

const isOneDayCompleted = (lastCheckIn) => {
    const now = new Date();
    const lastCheckInDate = new Date(lastCheckIn);
    const elapsedTime = now - lastCheckInDate;
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return elapsedTime >= oneDayInMillis;
};

export { isOneDayCompleted };
