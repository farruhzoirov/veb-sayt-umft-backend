const DefaultController = require('../crud.controller')
const PageController = require('../../models/data/page.model')
const pageTranslate = require('../../models/translate/page.model')

class PageController extends DefaultController {
    constructor() {
        super(null);
    }
    async shortFil(query) {
        let name = query.name || null
        let status = +query.status || null

        let fil = {}

        if (name) fil = { ...fil, 'name': { $regex: new RegExp(name.toLowerCase(), 'i') } }
        if (status) fil = { ...fil, status }

        return fil
    }
    async all(req, res) {
        let limit = req.query.limit || 20;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;
        let select = req.query.select || [];


        let language = req.query.language || 'uz';
        let pages = await PageController.find({ status: 0 }).sort({ _id: -1 }).limit(limit).select(select).skip(skip).lean();

        pages = await Promise.all(pages.map(async item => {
            let pageTrans = await pageTranslate.findOne({ key: item._id, language: language }).select(select).lean()
            return {...item, ...serviceTrans}

        }))
        pages = pages.filter(el=>el.title)
        const count = await PageController.find({ status: 0 }).limit(limit).count()

        res.status(200).json({ pages, count, language });
    }
    async getOneForFront(req,res){
        let slug = req.params.slug || null
        let language = req.query.language || "uz"
        if(!slug) res.status(404).send({msg:'slug topilmdi'})
        let page = await  PageController.findOne({slug}).lean()

        let translate = await pageTranslate.findOne({key:page._id, language}).select('title text description').lean()

        res.send({...page, ...translate})
    }

}

module.exports = PageController;