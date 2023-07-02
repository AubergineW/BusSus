using BusSus.APICommunication;
using BusSus.MVVM.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.MVVM.ViewModel
{
    public class BussesViewModel : BaseViewModel
    {
        public List<BusRouteModel> BusRoutes { get; set; }
        private BusRouteModel _selectedBusRoute;
        public BusRouteModel SelectedBusRoute
        {
            get { return _selectedBusRoute; }
            set
            {
                _selectedBusRoute = value;
                OnPropertyChanged();
            }
        }

        private IAPICommunicator _api;

        public BussesViewModel(IAPICommunicator api)
        {
            _api = api;
        }
    }
}
