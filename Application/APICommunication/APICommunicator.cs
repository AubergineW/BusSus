using BusSus.MVVM.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BusSus.APICommunication
{
    public class APICommunicator : IAPICommunicator
    {
        public event EventHandler BusCameToBusStop;

        private HttpListener _listener;

        private const string HOST = "http://localhost:9999/";

        public async Task Initialize()
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add(HOST);
            _listener.Start();

            await RegistrateWebhookHandler(HOST);

            _listener.BeginGetContext(new AsyncCallback(OnInformationReceive), _listener);
        }

        public Task<List<BusStopModel>> GetBusStops()
        {
            throw new NotImplementedException();
        }

        public Task<List<BusRouteModel>> GetBusRoutes()
        {
            throw new NotImplementedException();
        }

        private async Task RegistrateWebhookHandler(string host)
        {

        }

        private void OnInformationReceive(IAsyncResult result)
        {
            HttpListenerContext context = _listener.EndGetContext(result);

            BusCameToBusStop?.Invoke(this, new EventArgs());

            _listener.BeginGetContext(new AsyncCallback(OnInformationReceive), _listener);
        }
    }
}
