const config = require('../../../config/config');
const axios = require("axios");

class GetClassifiersService {
    async getClassifier(classifier) {
        const response = await axios.get(`${config.HEMIS_API_URL}/classifier-list?classifier=${classifier}`, {
            headers: {
                Authorization: `Bearer ${config.HEMIS_API_TOKEN}`,
            },
        });
        return response.data.data;
    }
}

module.exports = GetClassifiersService;