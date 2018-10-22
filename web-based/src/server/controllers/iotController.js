const { iotService } = require('../services/iotService');

var control = function (req, res) {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        iotService(req).
            then((result) => {
                res.send(result);
                res.end();
            }).
            catch((err) => {
                res.status(err.status || 500);
                res.send(err);
                res.end();
            });
    }
    catch (err) {
        res.status(err.status || 500);
        res.send(err);
        res.end();
    }
};

var home = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    var data = {
        version: "002",
        status: "OK",
        "message": "Service is up and running!",
        urls: [
            {
                method: "POST",
                url: "/control",
                description: "Control IoT"
            }
        ]
    };
    res.send(data);
    res.end();
};

/*Module exports*/
var iotController = function () {
    return {
        home,
        control
    };
};

module.exports = iotController();