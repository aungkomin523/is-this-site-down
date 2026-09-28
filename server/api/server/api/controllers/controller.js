const Service = require('../services/service');

class Controller{
    static async controller(req, res){
        const {url} = req.body;
        console.log(url);
        const results = await Service.checkFromAllRegions(url);
        return res.status(200).json(results);
    }
}

module.exports = Controller;