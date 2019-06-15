using System;
using System.Collections.Generic;
using System.Text;

namespace Lineup.Coach.Application.Notifications
{
    public class Message
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
