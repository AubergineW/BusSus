using BusSus.APICommunication;
using BusSus.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusSus.MVVM.ViewModel
{
    public class MainViewModel : BaseViewModel
    {
        private BaseViewModel _currentViewModel;
        public BaseViewModel CurrentViewModel 
        { 
            get { return _currentViewModel; }
            set
            {
                _currentViewModel = value;
                OnPropertyChanged();
            }
        }

        private StartViewModel _startVM;
        private BussesViewModel _bussesVM;
        private BusStopsViewModel _busStopsVM;

        private IAPICommunicator _apiCommunicator;

        public MainViewModel()
        {
            InitializeAPICommunicator = new RelayCommand(async o =>
            {
                _apiCommunicator = new APICommunicator();
                await _apiCommunicator.Initialize();
            });

            _startVM = new StartViewModel();
            _bussesVM = new BussesViewModel(_apiCommunicator);
            _busStopsVM = new BusStopsViewModel();

            StartVMCommand = new RelayCommand(ob =>
            {
                CurrentViewModel = _startVM;
            });

            BussesVMCommand = new RelayCommand(ob =>
            {
                CurrentViewModel = _bussesVM;
            });

            BusStopsVMCommand = new RelayCommand(ob =>
            {
                CurrentViewModel = _busStopsVM;
            });

            CurrentViewModel = _startVM;
        }

        public RelayCommand StartVMCommand { get; set; }
        public RelayCommand BussesVMCommand { get; set; }
        public RelayCommand BusStopsVMCommand { get; set; }
        public RelayCommand InitializeAPICommunicator { get; set; }
    }
}
