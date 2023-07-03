var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        if (this.webHooks.find(function (w) { return w == webHookHost; })) {
            return;
        }
        this.webHooks.push(webHookHost);
    };
    Notifier.prototype.Notify = function (busNumber) {
        var _this = this;
        this.webHooks.forEach(function (webHook) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
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
        this.busStops.push("sexual harassment");
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
var express = require('express');
var app = express();
var HOST = '127.0.0.1';
var PORT = 8080;
var dataBase = new DataBase();
var notifier = new Notifier();
app.use(express.json());
app.post('/start', function (req, res) {
});
app.post('/:busNumber', function (req, res) {
    var busNumber = req.params.busNumber;
    var nextBusStop = req.body.nextBusStop;
    dataBase.SetNextBusStop(busNumber, nextBusStop);
    notifier.Notify(busNumber);
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
    if (busses.length == 0) {
        res.status(404).send({
            "Status": "No such a bus route idiot"
        });
        return;
    }
    res.status(200).send({
        busses: busses
    });
});
app.get('/BusStops/:busStopName', function (req, res) {
    var busStopName = req.params.busStopName;
    var busses = dataBase.GetBusses().filter(function (b) { return b.GetNextBusStopName() == busStopName; });
    if (busses.length == 0) {
        res.status(404).send({
            "Status": "No such a bus stop idiot"
        });
        return;
    }
    res.status(200).send({
        busses: busses
    });
});
app.put('/hook', function (req, res) {
    var webhookHost = req.body.webhookHost;
    console.log(req.body);
    notifier.AddWebhook(webhookHost);
    res.status(200).send({
        "Status": "Fine"
    });
});
app.listen(PORT, HOST, function () { return console.log("Started on http://".concat(HOST, ":").concat(PORT)); });
