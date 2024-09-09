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

function getRemainingTime(lastCheckin) {
    const now = new Date();
    const nextAvailableCheckin = new Date(new Date(lastCheckin).getTime() + 24 * 60 * 60 * 1000);
    const timeDifference = nextAvailableCheckin - now;

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}

export {getRemainingTime}