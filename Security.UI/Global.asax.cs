using System.Configuration;
using System.Data.SqlClient;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Security.UI
{
    public class MvcApplication : System.Web.HttpApplication
    {
        //string constring = ConfigurationManager.ConnectionStrings["dbCon"].ConnectionString;
        protected void Application_Start()
        {
            try
            {
                GlobalConfiguration.Configure(WebApiConfig.Register);
                GlobalConfiguration.Configuration.Formatters.Clear();
                GlobalConfiguration.Configuration.Formatters.Add(new System.Net.Http.Formatting.JsonMediaTypeFormatter());
                AreaRegistration.RegisterAllAreas();
                RouteConfig.RegisterRoutes(RouteTable.Routes);

                //FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
                BundleConfig.RegisterBundles(BundleTable.Bundles);
            }
            catch (System.Exception)
            {

                throw;
            }
        }
        protected void Application_End()
        {
            //SqlDependency.Stop(constring);
        }
    }
}

//RouteConfig.RegisterRoutes method

