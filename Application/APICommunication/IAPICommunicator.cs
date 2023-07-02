using BusSus.MVVM.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.APICommunication
{
    public interface IAPICommunicator
    {
        event EventHandler BusCameToBusStop;
        Task Initialize();
        Task<List<BusStopModel>> GetBusStops();
        Task<List<BusRouteModel>> GetBusRoutes();
    }
}
