using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Security.UI.Startup))]

namespace Security.UI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
