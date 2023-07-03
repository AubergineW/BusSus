using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.MVVM.Model
{
    public class BusStopModel
    {
        public string Name { get; set; }
        public List<BusModel> ComingBusses { get; set; }
    }
}
