interface IDataBase{
    busStopExists: (busStop : BusStop) => boolean;
    busRouteExists: (busRoute : number) => boolean;
    busExists: (bus : Bus) => boolean;
    createBusStop: (busStop : BusStop) => void;
    createBusRoute: (busRoute : number) => void;
    createBus: (bus : Bus) => void;
    setBusNextBusStop: (bus : Bus, busStop : BusStop) => void;
    getNextBusStop: (bus : Bus) => BusStop;
    getPreviousBusStop: (bus : Bus) => BusStop;
    getBusStopComingBusses: (busStop : string) => Bus[];
    setBusStopComingBusses: (busStop : BusStop, comingBusses : Bus[]) => void;
    getRouteBusses: (busRoute : number) => Bus[];
}

class DataBase implements IDataBase{
    private fs : any;

    constructor (){
        this.fs = require("fs");
    }

    busStopExists (busStop: BusStop): boolean{
        return false;
    }

    busRouteExists (busRoute: number): boolean{
        return this.fs.existsSync(`./information/Busses/${busRoute}`);
    }

    busExists (bus: Bus): boolean{
        return this.fs.existsSync(`./information/Busses/${bus.getBusRoute()}/${bus.getBusNumber()}.txt`);
    }

    createBus (bus: Bus): void{
        this.fs.writeFile(`./information/Busses/${bus.getBusRoute()}/${bus.getBusNumber()}.txt`, "full kex", function(error : any){
            if (error){
                console.log(error)
                return;
            }

            console.log("Created Successfully!")
        })
    }

    createBusRoute (busRoute: number): void{
        this.fs.mkdirSync(`./information/Busses/${busRoute}`);
    }

    createBusStop (busStop: BusStop): void{
        this.fs.writeFile(`./information/BusStops/${busStop.GetName()}`)
    }

    getBusStopComingBusses (busStop : string): Bus[]{
        return [new Bus(69, 228)];
    }

    getNextBusStop(bus : Bus): BusStop{
        let data = this.fs.readFileSync(`./information/Busses/${bus.getBusRoute()}/${bus.getBusNumber()}.txt`,
        'utf8', function(error : any, data : any){
            if (error){
                console.log(error);
                return;
            }
        });
        return data.split('\n')[0].split(':')[1].replace("\r", "");
    }

    getPreviousBusStop(bus : Bus): BusStop{
        let data = this.fs.readFileSync(`./information/Busses/${bus.getBusRoute()}/${bus.getBusNumber()}.txt`,
        'utf8', function(error : any, data : any){
            if (error){
                console.log(error);
                return;
            }
        });
        return data.split('\n')[1].split(':')[1];
    }

    setBusStopComingBusses (busStop : BusStop, comingBusses : Bus[]): void{
        comingBusses.forEach((comingBus : Bus) => {
            this.fs.appendFileSync(`${comingBus.getBusRoute()}:${comingBus.getBusNumber()},`)
        });
    }

    setBusNextBusStop (bus : Bus, busStop : BusStop) : void{
        let data = this.fs.readFileSync(`./information/Busses/${bus.getBusRoute()}/${bus.getBusNumber()}.txt`,
        'utf8', function(error : any, data : any){
            if (error){
                console.log(error);
                return;
            }
        });
        data.split('\n')[1].split(':')[1] = data.split('\n')[0].split(':')[1]
        data.split('\n')[0].split(':')[1] = busStop.GetName();
    }

    getRouteBusses (busRoute : number) : Bus[]{
        let busses : Bus[] = new Array<Bus>;
        this.fs.readdirSync(`./information/Busses/${busRoute}`).
            forEach((file : any) => {
                busses.push(new Bus(busRoute, file.replace(".txt", "")));
            });
        return busses;
    }

}

class DataBaseProvider{
    private dataBase : DataBase = new DataBase();

    getDataBase() : DataBase {
        return this.dataBase;
    }
}

class Bus{
    private busRoute : number;
    private busNumber : number;

    constructor(busRoute : number, busNumber : number) {
        this.busRoute = busRoute;
        this.busNumber = busNumber;
    }

    getBusRoute () : number{
        return this.busRoute;
    }

    getBusNumber () : number{
        return this.busNumber;
    }
}

class BusStop{
    private busStopName : string;

    constructor(busStopName : string) {
        this.busStopName = busStopName;
    }

    public GetName() : string{
        return this.busStopName;
    }
}

const express = require('express');
const app = express();
const HOST = '26.88.209.221';
const PORT = 8080;
const dataBase : IDataBase = new DataBaseProvider().getDataBase();

app.use(express.json());

app.get('/Busses/:busRoute', (req : any, res : any) => {
    const {busRoute} = req.params;
    res.status(200).send({
        "Busses" : dataBase.getRouteBusses(busRoute)
    })
});

app.get('/Busses/:busRoute/:busNumber', (req : any, res : any) => {
    const {busRoute, busNumber} = req.params;
    res.status(200).send({
        "Next" : dataBase.getNextBusStop(new Bus(busRoute, busNumber)),
        "Previous" : dataBase.getPreviousBusStop(new Bus(busRoute, busNumber))
    })
});

app.get('/BusStops/:busStop', (req : any, res : any) => {

});

app.post('/Busses/:busRoute/:busNumber', (req : any, res : any) => {
    const {busRoute, busNumber} = req.params;
    const {nextBusStop} = res.body;
    let bus : Bus = new Bus(busRoute, busNumber)

    if (dataBase.busExists(bus) == false)
        dataBase.createBus(bus)
    
    dataBase.setBusNextBusStop(bus, new BusStop(nextBusStop))
});

app.post('/BusStops/:busStopName', (req : any, res : any) => {
    const {busStopName} = req.params;
    const {comingBusses} = res.body;
    let busses : Bus[] = new Array<Bus>;
    comingBusses.forEach((comingBus : any) => {
        busses.push(new Bus(comingBus[0], comingBus[1]))
    });

    dataBase.setBusStopComingBusses(new BusStop(busStopName), comingBusses)

});

app.listen(
    PORT, HOST,
    () => console.log(`Started on http://${HOST}:${PORT}`) 
)