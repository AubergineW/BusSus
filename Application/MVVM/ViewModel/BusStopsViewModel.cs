using BusSus.MVVM.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.MVVM.ViewModel
{
    public class BusStopsViewModel : BaseViewModel
    {
        public List<BusStopModel> BusStops;
        public BusStopModel SelectedBusStop;

        public BusStopsViewModel()
        {

        }
    }
}
