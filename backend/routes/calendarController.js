const axios = require('axios');

async function fetchCalendarEvents(accessToken, userEmail) {
    try {
        const response = await axios.get(`https://graph.microsoft.com/v1.0/users/${userEmail}/calendar/events`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data.value; // Assuming events are returned in the `value` property
    } catch (error) {
        throw error;
    }
}

module.exports = {
    fetchCalendarEvents
};
