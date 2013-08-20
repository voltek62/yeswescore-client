using System;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Runtime.Serialization;
using Microsoft.Phone.Tasks;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class YWSSocialShare : BaseCommand
    {
        public void shareStatus(string serializedMessage)
        {
            string message = JSON.JsonHelper.Deserialize<string>(serializedMessage);
            ShareStatusTask shareStatusTask = new ShareStatusTask();
            shareStatusTask.Status = message;
            shareStatusTask.Show();
            this.DispatchCommandResult();
        }
    }
}