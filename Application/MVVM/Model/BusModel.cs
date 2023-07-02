using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.MVVM.Model
{
    public class BusModel
    {
        public int BusRoute { get; set; }
        public int BusNumber { get; set; }
        public BusStopModel NextBusStop { get; set; }
    }
}
