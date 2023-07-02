class Bus{
    private busRouteNumber : number;
    private busNumber : number;
    private nextBusStop : string;

    constructor(busRouteNumber : number, busNumber : number) {
        this.busRouteNumber = busRouteNumber;
        this.busNumber = busNumber;
        this.nextBusStop = "";
    }

    SetNextBusStop(nextBusStop : string) : void {
        this.nextBusStop = nextBusStop;
    }

    GetNextBusStopName() : string {
        return this.nextBusStop;
    }

    GetBusRouteNumber () : number{
        return this.busRouteNumber;
    }

    GetBusNumber () : number{
        return this.busNumber;
    }
}

class Notifier {
    private webHooks = new Array<string>();

    public AddWebhook(webHookHost : string) : void {
        this.webHooks.push(webHookHost);
    }

    public Notify() : void {

    }
}

class DataBase {
    private busses = new Array<Bus>();
    private busStops = new Array<string>();
    private busRoutes = new Array<number>();

    constructor() {
        this.busses.push(new Bus(69, 1111));
        this.busses.push(new Bus(228, 1112));

        this.busStops.push("Остановка 1", "Остановка 2", "Остановка 3", "Остановка 4");

        this.busRoutes.push(69, 228);
    }

    SetNextBusStop(busNumber : number, busStop : string) : void {
        this.busses.find(b => b.GetBusNumber() == busNumber)?.SetNextBusStop(busStop);
    }

    GetBusses() : Array<Bus> {
        return this.busses;
    }

    GetBusStops() : Array<string> {
        return this.busStops;
    }

    GetBusRoutes() : Array<number> {
        return this.busRoutes;
    }
}

const request = require('request');
const express = require('express');
const app = express();
const HOST = '127.0.0.1';
const PORT = 8080;
const dataBase = new DataBase();
const notifier = new Notifier(); 

app.use(express.json());

app.post('/:busNumber', (req : any, res : any) => {
    const { busNumber } = req.params;
    const { nextBusStop } = req.body;

    dataBase.SetNextBusStop(busNumber, nextBusStop);
    notifier.Notify();
})

app.get('/BusRoutes', (req : any, res : any) => {
    var busRoutes = dataBase.GetBusRoutes();
    res.status(200).send({
        busRoutes  
    });
});

app.get('/BusStops', (req : any, res : any) => {
    var busStops = dataBase.GetBusStops();
    res.status(200).send({
        busStops
    });
});

app.get('/BusRoutes/:busRouteNumber', (req : any, res : any) => {
    const { busRouteNumber } = req.params;
    var busses = dataBase.GetBusses().filter(b => b.GetBusRouteNumber() == busRouteNumber)

    res.status(200).send({
        busses
    });
});

app.get('/BusStops/:busStopName', (req : any, res : any) => {
    const { busStopName } = req.params;
    var busses = dataBase.GetBusses().filter(b => b.GetNextBusStopName() == busStopName)
    res.status(200).send({
        busses
    });
});

app.put('/hooks', (req : any, res : any) => {
    const { webhookHost } = req.body;
    notifier.AddWebhook(webhookHost);
    res.status(200).send({
        "Status" : "Fine"
    });
});

app.listen(
    PORT, HOST,
    () => console.log(`Started on http://${HOST}:${PORT}`) 
);
