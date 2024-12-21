const cron = require('node-cron');
const Flight = require('../models/FlightModel');

let flightStatusUpdateTask = null;

// Function to update flight statuses
const updateFlightStatuses = async () => {
    try {
        const now = new Date();
        const flights = await Flight.find();

        for (const flight of flights) {
            if (flight.arrivalTime <= now) {
                flight.flightStatus = 'Landed';
            } else if (flight.departureTime <= now && flight.arrivalTime > now) {
                flight.flightStatus = 'In flight';
            } else if (flight.flightStatus !== "Delayed" && (flight.departureTime <= new Date(now.getTime() + 30 * 60 * 1000) && flight.arrivalTime > now)) {
                flight.flightStatus = 'On time';
            }

            await flight.save();
        }

        console.log('Flight statuses updated successfully');
    } catch (error) {
        console.error('Error updating flight statuses:', error);
    }
};

// Function to start the scheduler
const startScheduler = () => {
    if (!flightStatusUpdateTask) {
        console.log('Running flight status update task immediately on start...');
        updateFlightStatuses();

        flightStatusUpdateTask = cron.schedule('*/20 * * * *', async () => {
            console.log('Running flight status update task...');
            await updateFlightStatuses();
        });

        console.log('Flight status update scheduler started.');
    } else {
        console.log('Scheduler is already running.');
    }
};

// Function to stop the scheduler
const stopScheduler = () => {
    if (flightStatusUpdateTask) {
        flightStatusUpdateTask.stop();
        flightStatusUpdateTask = null;
        console.log('Flight status update scheduler stopped.');
    } else {
        console.log('Scheduler is not running.');
    }
};

// Function to check if the scheduler is active
const isSchedulerActive = () => {
    return !!flightStatusUpdateTask;
};

module.exports = {
    startScheduler,
    stopScheduler,
    isSchedulerActive,
};
