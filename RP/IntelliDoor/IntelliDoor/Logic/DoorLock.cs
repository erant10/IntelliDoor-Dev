using IntelliDoor.Infrastructure;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Windows.UI.Xaml;

namespace IntelliDoor.Logic
{
    class DoorLock
    {
        private LedLight led;  // simulates locking/unlocking the door
        private Timer timer;

        private DoorLock()
        {
            timer = new Timer(Lock, null, Timeout.Infinite, Timeout.Infinite);
        }

        public static DoorLock Create()
        {
            var doorLock = new DoorLock() { led = LedLight.Create() };
            return doorLock;
        }

        public void Unlock()
        {
            Debug.WriteLine("unlock invoked");
            timer.Change(5000, Timeout.Infinite);
            led.TurnOn();
        }

        public void Lock(object sender)
        {
            Debug.WriteLine("lock invoked");
            timer.Change(Timeout.Infinite, Timeout.Infinite);
            led.TurnOff();
        }

    }
}
