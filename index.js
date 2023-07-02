var Bus = /** @class */ (function () {
    function Bus(busRouteNumber, busNumber) {
        this.busRouteNumber = busRouteNumber;
        this.busNumber = busNumber;
        this.nextBusStop = "";
    }
    Bus.prototype.SetNextBusStop = function (nextBusStop) {
        this.nextBusStop = nextBusStop;
    };
    Bus.prototype.GetNextBusStopName = function () {
        return this.nextBusStop;
    };
    Bus.prototype.GetBusRouteNumber = function () {
        return this.busRouteNumber;
    };
    Bus.prototype.GetBusNumber = function () {
        return this.busNumber;
    };
    return Bus;
}());
var Notifier = /** @class */ (function () {
    function Notifier() {
        this.webHooks = new Array();
    }
    Notifier.prototype.AddWebhook = function (webHookHost) {
        this.webHooks.push(webHookHost);
    };
    Notifier.prototype.Notify = function () {
    };
    return Notifier;
}());
var DataBase = /** @class */ (function () {
    function DataBase() {
        this.busses = new Array();
        this.busStops = new Array();
        this.busRoutes = new Array();
        this.busses.push(new Bus(69, 1111));
        this.busses.push(new Bus(228, 1112));
        this.busStops.push("Остановка 1", "Остановка 2", "Остановка 3", "Остановка 4");
        this.busRoutes.push(69, 228);
    }
    DataBase.prototype.SetNextBusStop = function (busNumber, busStop) {
        var _a;
        (_a = this.busses.find(function (b) { return b.GetBusNumber() == busNumber; })) === null || _a === void 0 ? void 0 : _a.SetNextBusStop(busStop);
    };
    DataBase.prototype.GetBusses = function () {
        return this.busses;
    };
    DataBase.prototype.GetBusStops = function () {
        return this.busStops;
    };
    DataBase.prototype.GetBusRoutes = function () {
        return this.busRoutes;
    };
    return DataBase;
}());
var request = require('request');
var express = require('express');
var app = express();
var HOST = '127.0.0.1';
var PORT = 8080;
var dataBase = new DataBase();
var notifier = new Notifier();
app.use(express.json());
app.post('/:busNumber', function (req, res) {
    var busNumber = req.params.busNumber;
    var nextBusStop = req.body.nextBusStop;
    dataBase.SetNextBusStop(busNumber, nextBusStop);
    notifier.Notify();
});
app.get('/BusRoutes', function (req, res) {
    var busRoutes = dataBase.GetBusRoutes();
    res.status(200).send({
        busRoutes: busRoutes
    });
});
app.get('/BusStops', function (req, res) {
    var busStops = dataBase.GetBusStops();
    res.status(200).send({
        busStops: busStops
    });
});
app.get('/BusRoutes/:busRouteNumber', function (req, res) {
    var busRouteNumber = req.params.busRouteNumber;
    var busses = dataBase.GetBusses().filter(function (b) { return b.GetBusRouteNumber() == busRouteNumber; });
    res.status(200).send({
        busses: busses
    });
});
app.get('/BusStops/:busStopName', function (req, res) {
    var busStopName = req.params.busStopName;
    var busses = dataBase.GetBusses().filter(function (b) { return b.GetNextBusStopName() == busStopName; });
    res.status(200).send({
        busses: busses
    });
});
app.put('/hooks', function (req, res) {
    var webhookHost = req.body.webhookHost;
    notifier.AddWebhook(webhookHost);
    res.status(200).send({
        "Status": "Fine"
    });
});
app.listen(PORT, HOST, function () { return console.log("Started on http://".concat(HOST, ":").concat(PORT)); });
