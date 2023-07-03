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
        if (this.webHooks.find(w => w == webHookHost)){
            return;
        }

        this.webHooks.push(webHookHost);
    }

    public Notify(busNumber : number) : void {
        this.webHooks.forEach(async webHook => {
            //await fetch(webHook, { method: 'POST', body: busNumber.toString()})
        });
    }
}

class DataBase {
    private busses = new Array<Bus>();
    private busStops = new Array<string>();
    private busRoutes = new Array<number>();

    constructor() {
        this.busses.push(new Bus(69, 1111));
        this.busses.push(new Bus(228, 1112));

        this.busStops.push("sexual harassment");

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

const express = require('express');
const app = express();
const HOST = '127.0.0.1';
const PORT = 8080;
const dataBase = new DataBase();
const notifier = new Notifier(); 

app.use(express.json());

app.post('/start', (req : any, res : any) => {

});

app.post('/:busNumber', (req : any, res : any) => {
    const { busNumber } = req.params;
    const { nextBusStop } = req.body;

    dataBase.SetNextBusStop(busNumber, nextBusStop);
    notifier.Notify(busNumber);
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

    if (busses.length == 0){
        res.status(404).send({
            "Status" : "No such a bus route idiot"
        });
        
        return;
    }

    res.status(200).send({
        busses
    });
});

app.get('/BusStops/:busStopName', (req : any, res : any) => {
    const { busStopName } = req.params;
    var busses = dataBase.GetBusses().filter(b => b.GetNextBusStopName() == busStopName)

    if (busses.length == 0){
        res.status(404).send({
            "Status" : "No such a bus stop idiot"
        });

        return;
    }

    res.status(200).send({
        busses
    });
});

app.put('/hook', (req : any, res : any) => {
    const { webhookHost } = req.body;
    console.log(req.body);
    notifier.AddWebhook(webhookHost);
    res.status(200).send({
        "Status" : "Fine"
    });
});

app.listen(
    PORT, HOST,
    () => console.log(`Started on http://${HOST}:${PORT}`) 
);
