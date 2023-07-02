using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.MVVM.Model
{
    public class BusRouteModel
    {
        public int BusRouteNumber { get; set; }
        public List<BusModel> Busses { get; set; }
    }
}
