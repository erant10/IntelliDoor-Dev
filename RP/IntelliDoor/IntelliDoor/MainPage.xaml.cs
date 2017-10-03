using Windows.UI.Xaml.Controls;
using System.Diagnostics;
using IntelliDoor.Infrastructure;
using IntelliDoor.Logic;
using System.Threading;
using System.Threading.Tasks;
using System;
using Windows.Web.Http;
using Microsoft.Azure.Devices.Client;
using Newtonsoft.Json;
using Windows.Storage.Streams;


// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace IntelliDoor
{

    public sealed partial class MainPage : Page
    {
        private WebCam webCam;
        private KeyPad keypad;
        private DoorLock doorLock;
        private ManualResetEvent resetEvent = new ManualResetEvent(false);
        static DeviceClient deviceClient;
        static string deviceId = "building1";
        static string iotHubUri = "IntelliDoorIOTHub.azure-devices.net";
        static string deviceKey = "SQ/ETVH3vwoXJIvEMFwQ9aBi67cxAlm3woAfCaypsIA=";
        private HttpClient httpClient;
        private string baseUri;
        private HttpResponseMessage httpResponse;
        ImgurApi imgurClient;


        public MainPage()
        {
            this.InitializeComponent();

            webCam = WebCam.Create();
            webCam.StartLiveStreamAsync(liveStreamElement);  // display camera's live stream in UI
            imgurClient = new ImgurApi();

            keypad = new KeyPad();
            Debug.WriteLine("keypad created");
            keypad.OnPress += UpdateApartmentTextBoxAsync;  // UI
            keypad.OnRing += HandleVisitorAsync;
            keypad.OnReset += ResetApartmentTextBoxAsync;   // UI

            doorLock = DoorLock.Create();

            httpClient = new HttpClient();
            baseUri = "https://prod-07.northeurope.logic.azure.com:443/workflows/b6551691604a461db4a0c06801cf0df3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xcu2NJIVZXpy-AxTEP3tkk-Gei_P08uoyOP-hpr7RNc";
            httpResponse = new HttpResponseMessage();

            deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithRegistrySymmetricKey(deviceId, deviceKey), TransportType.Mqtt);

            // wait for a visitor to enter an apartment number
            Task a = Task.Run( () => {
                while (true)
                {
                    resetEvent.Reset();
                    keypad.GetAparmentNumber();
                    resetEvent.WaitOne();
                }
            }
            );
        }

        private async void UpdateApartmentTextBoxAsync(string input)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                aptNumElement.Text += input;
                Debug.WriteLine(input);
            });
        }

        private async void ResetApartmentTextBoxAsync()
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                aptNumElement.Header = "Welcome! Please insert apartment #";
                aptNumElement.Text = "";
            });
        }

        private async void HandleVisitorAsync(string aptNum)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                aptNumElement.Header = "Smile to the camera :)";
            });
            var url = CaptureImage();

            // send Get request that includes aptNum and url to server and get reply
            var requestUri = new Uri(baseUri);
            var requestBody = new
            {
                aptNumber = aptNum,
                imageURL = url,
                //imageURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Nikolaj_Coster-Waldau_by_Gage_Skidmore.jpg/170px-Nikolaj_Coster-Waldau_by_Gage_Skidmore.jpg",
                deviceId = deviceId
            };
            var requestBodyJson = JsonConvert.SerializeObject(requestBody);
            httpResponse = await httpClient.PostAsync(requestUri, new HttpStringContent(requestBodyJson, UnicodeEncoding.Utf8, "application/json"));
            if (httpResponse.IsSuccessStatusCode)
            {
                Debug.WriteLine("200-OK response");
            }
            ReceiveC2d();

            resetEvent.Set();
        }

        private string CaptureImage()
        {
            // capture snapshot of visitor
            var photo = webCam.TakePhotoAsync().GetAwaiter().GetResult();

            // upload the photo to imgur (to get url)
            var url = imgurClient.UploadImageFromFileAsync(photo).GetAwaiter().GetResult();

            return url;
        }

        private void ReceiveC2d()
        {
            Debug.WriteLine("waiting for message");
            Message receivedMessage = deviceClient.ReceiveAsync(TimeSpan.FromSeconds(60)).GetAwaiter().GetResult();
            if (receivedMessage == null) return;

            Task t = deviceClient.CompleteAsync(receivedMessage);
            
            Debug.WriteLine("received message: " + receivedMessage);
            doorLock.Unlock();
            while (!t.IsCompleted) // wait until message removed from queue
            {
                Debug.WriteLine("t is not completed");
            }
        }
    }
}
