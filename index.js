var DataBase = /** @class */ (function () {
    function DataBase() {
        this.fs = require("fs");
    }
    DataBase.prototype.busStopExists = function (busStop) {
        return false;
    };
    DataBase.prototype.busRouteExists = function (busRoute) {
        return this.fs.existsSync("./information/Busses/".concat(busRoute));
    };
    DataBase.prototype.busExists = function (bus) {
        return this.fs.existsSync("./information/Busses/".concat(bus.getBusRoute(), "/").concat(bus.getBusNumber(), ".txt"));
    };
    DataBase.prototype.createBus = function (bus) {
        this.fs.writeFile("./information/Busses/".concat(bus.getBusRoute(), "/").concat(bus.getBusNumber(), ".txt"), "full kex", function (error) {
            if (error) {
                console.log(error);
                return;
            }
            console.log("Created Successfully!");
        });
    };
    DataBase.prototype.createBusRoute = function (busRoute) {
        this.fs.mkdirSync("./information/Busses/".concat(busRoute));
    };
    DataBase.prototype.createBusStop = function (busStop) {
        this.fs.writeFile("./information/BusStops/".concat(busStop.GetName()));
    };
    DataBase.prototype.getBusStopComingBusses = function (busStop) {
        return [new Bus(69, 228)];
    };
    DataBase.prototype.getNextBusStop = function (bus) {
        var data = this.fs.readFileSync("./information/Busses/".concat(bus.getBusRoute(), "/").concat(bus.getBusNumber(), ".txt"), 'utf8', function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
        });
        return data.split('\n')[0].split(':')[1].replace("\r", "");
    };
    DataBase.prototype.getPreviousBusStop = function (bus) {
        var data = this.fs.readFileSync("./information/Busses/".concat(bus.getBusRoute(), "/").concat(bus.getBusNumber(), ".txt"), 'utf8', function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
        });
        return data.split('\n')[1].split(':')[1];
    };
    DataBase.prototype.setBusStopComingBusses = function (busStop, comingBusses) {
    };
    DataBase.prototype.setBusNextBusStop = function (bus, busStop) {
        var data = this.fs.readFileSync("./information/Busses/".concat(bus.getBusRoute(), "/").concat(bus.getBusNumber(), ".txt"), 'utf8', function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
        });
        data.split('\n')[1].split(':')[1] = data.split('\n')[0].split(':')[1];
        data.split('\n')[0].split(':')[1] = busStop.GetName();
    };
    DataBase.prototype.getRouteBusses = function (busRoute) {
        var busses = new Array;
        this.fs.readdirSync("./information/Busses/".concat(busRoute)).
            forEach(function (file) {
            busses.push(new Bus(busRoute, file.replace(".txt", "")));
        });
        return busses;
    };
    return DataBase;
}());
var DataBaseProvider = /** @class */ (function () {
    function DataBaseProvider() {
        this.dataBase = new DataBase();
    }
    DataBaseProvider.prototype.getDataBase = function () {
        return this.dataBase;
    };
    return DataBaseProvider;
}());
var Bus = /** @class */ (function () {
    function Bus(busRoute, busNumber) {
        this.busRoute = busRoute;
        this.busNumber = busNumber;
    }
    Bus.prototype.getBusRoute = function () {
        return this.busRoute;
    };
    Bus.prototype.getBusNumber = function () {
        return this.busNumber;
    };
    return Bus;
}());
var BusStop = /** @class */ (function () {
    function BusStop(busStopName) {
        this.busStopName = busStopName;
    }
    BusStop.prototype.GetName = function () {
        return this.busStopName;
    };
    return BusStop;
}());
var express = require('express');
var app = express();
var HOST = '26.88.209.221';
var PORT = 8080;
var dataBase = new DataBaseProvider().getDataBase();
app.use(express.json());
app.get('/Busses/:busRoute', function (req, res) {
    var busRoute = req.params.busRoute;
    res.status(200).send({
        "Busses": dataBase.getRouteBusses(busRoute)
    });
});
app.get('/Busses/:busRoute/:busNumber', function (req, res) {
    var _a = req.params, busRoute = _a.busRoute, busNumber = _a.busNumber;
    res.status(200).send({
        "Next": dataBase.getNextBusStop(new Bus(busRoute, busNumber)),
        "Previous": dataBase.getPreviousBusStop(new Bus(busRoute, busNumber))
    });
});
app.get('/BusStops', function (req, res) {
});
app.post('/Busses/:busRoute/:busNumber', function (req, res) {
    var _a = req.params, busRoute = _a.busRoute, busNumber = _a.busNumber;
    var _b = res.body, nextBusStop = _b.nextBusStop, previousBusStop = _b.previousBusStop;
    var bus = new Bus(busRoute, busNumber);
    if (dataBase.busExists(bus) == false)
        dataBase.createBus(bus);
    dataBase.setBusNextBusStop(bus, new BusStop(nextBusStop));
});
app.post('/BusStops/:busStopName', function (req, res) {
    var busStopName = req.params.busStopName;
    var comingBusses = res.body.comingBusses;
});
app.listen(PORT, HOST, function () { return console.log("Started on http://".concat(HOST, ":").concat(PORT)); });
