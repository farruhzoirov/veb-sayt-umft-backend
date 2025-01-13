const config = require('../../../config/config');
const axios = require("axios");

class GetClassifiersService {
    async getClassifier(req) {
        const classifier = req.params.classifier;
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const response = await axios.get(`${config.HEMIS_API_URL}/classifier-list?page=${page}&limit=${limit}&classifier=${classifier}`, {
            headers: {
                Authorization: `Bearer ${config.HEMIS_API_TOKEN}`,
            },
        });
        return response.data;
    }
}

module.exports = GetClassifiersService;