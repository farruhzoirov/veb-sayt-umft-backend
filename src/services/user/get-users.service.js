const User = require("../../models/user/user.model");


class GetAllUsersService {
    async shortFilter(req) {
        let name = req.query.name || null;
        let status = +req.query.status || null
        let fil = {}
        if (name) fil = {...fil, 'name': {$regex: new RegExp(name.toLowerCase(), 'i')}}
        if (status) fil = { ...fil, status }
        return fil
    }
    async getAllUsers(req, res)  {
        const page = +req.query.page || 1
        const limit = req.query.limit || 20
        let select = req.query.select || []
        let sort = req.query.sort || {
            _id: -1
        }
        const skip = (page - 1) * limit
        let fil = this.shortFilter(req);
        let data = await User.find({...fil})
            .select(select.toString())
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .lean() || []
        let count = await User
            .find({ ...fil })
            .countDocuments() || 0
       return res.send({
            data, count, page, limit
        })
    }
}


module.exports =  GetAllUsersService;