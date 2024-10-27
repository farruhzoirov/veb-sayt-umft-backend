const DefaultController = require('../crud.controller')
const News = require('../../models/data/news')
const newsTranslate = require('../../models/translate/news')

class NewsController extends DefaultController {
    constructor() {
        super(null);
    }

    async shortFil(query) {
        let name = query.name || null
        let status = +query.status || null

        let fil = {}

        if (name) fil = {...fil, 'name': {$regex: new RegExp(name.toLowerCase(), 'i')}}
        if (status) fil = {...fil, status}

        return fil
    }

    async all(req, res) {
        let limit = req.query.limit || 20;
        let news = req.query.news || 1;
        let skip = (news - 1) * limit;
        let select = req.query.select || [];
        let language = req.query.language || 'uz';
        let Allnews = await News.find({status: 0}).sort({_id: -1}).select(select).limit(limit).skip(skip).lean();

        Allnews = await Promise.all(Allnews.map(async item => {
            let newsTrans = await newsTranslate.findOne({key: item._id, language: language}).select(select).lean()
            return {...item, ...newsTrans}
        }))
        Allnews = Allnews.filter(el => el.title)
        const count = await News.find({status: 0}).limit(limit).count()

        res.status(200).json({Allnews, count, language});
    }

    async get_one(req, res) {
        let language = req.query.language || 'uz';
        let Onenews = await News.findOne({_id: req.params.id}).lean();
        let newsTrans = await newsTranslate.findOne({key: Onenews._id, language: language})
        Onenews.title = newsTrans.title
        Onenews.text = newsTrans.text
        Onenews.description = newsTrans.description
        res.status(200).json({Onenews, language});
    }

    async getOneForFront(req, res) {
        let slug = req.params.slug || null
        let language = req.query.language || "uz"
        let select = req.query.select || []

        if (!slug) res.status(404).send({msg: 'Slug not found'})
        let news = await News.findOne({
            slug
        }).lean()
        await News.findByIdAndUpdate(news._id, {$inc: {view: 1}}, {new: true})
        let translate = await newsTranslate.findOne({key: news._id, language}).select(select).lean()
        if (translate) news = {...news, ...translate}
        let others = await News.find({
            slug: {$ne: slug},
            status: 0
        }).sort({_id: -1}).limit(10).select(select).lean() || []

        if (others) {
            others = await Promise.all(others.map(async item => {
                let newsTrans = await newsTranslate.findOne({key: item._id, language: language}).select(select).lean()
                return {...item, ...newsTrans}
            }))
        }
        res.send({...news, ...translate, others})
    }
}

module.exports = NewsController;