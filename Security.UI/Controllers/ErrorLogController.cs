using DbExecutor;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class ErrorLogController : Controller
    {
        [HttpPost]
        public void CreateErrorLog(error_Log error)
        {
            try
            {
                if (System.Web.HttpContext.Current.Session["IP"] != null)
                {
                        error.IpAddress =System.Web.HttpContext.Current.Session["IP"].ToString();
                }
                else
                {
                     error.IpAddress = "Session Time Out";
                }
                       
                if (System.Web.HttpContext.Current.Session["UserId"]!= null)
                {
                    error.UserId = Convert.ToInt32(System.Web.HttpContext.Current.Session["UserId"].ToString());
                }
                else
                {
                    error.UserId = 0;
                }
                
                error.ErrorSide = "Server";
                error.IsSolved = false;
                error.ErrorDate = DateTime.Now;
                Facade.ErrorLog.Add(error);
            }
            catch (Exception ex)
            {
                error_Log er = new error_Log();
                er.ErrorSide = "Server";
                er.ErrorMessage = ex.Message;
                er.ErrorType = ex.GetType().ToString();
                er.FileName = "ErrorLogController";
                error.IpAddress = "Session Time Out";
                er.UserId = 0;
                new ErrorLogController().CreateErrorLog(er);
            }
           
        }

        [HttpPost]
        public void CreateErrorLogForClintSite(string message)
        {
            try
            {
                error_Log er = new error_Log();
                er.ErrorSide = "Client";
                er.ErrorMessage = message;
                er.ErrorType = "Angular Error";
                er.FileName = "App";
                if (System.Web.HttpContext.Current.Session["IP"] != null)
                {
                    er.IpAddress = System.Web.HttpContext.Current.Session["IP"].ToString();
                }
                else
                {
                    er.IpAddress = "Session Time Out";
                }

                if (System.Web.HttpContext.Current.Session["UserId"] != null)
                {
                    er.UserId = Convert.ToInt32(System.Web.HttpContext.Current.Session["UserId"].ToString());
                }
                else
                {
                    er.UserId = 0;
                }
                er.IsSolved = false;
                er.ErrorDate = DateTime.Now;
                Facade.ErrorLog.Add(er);
            }
            catch (Exception ex)
            {
                error_Log er = new error_Log();
                er.ErrorSide = "Server";
                er.ErrorMessage = ex.Message;
                er.ErrorType = ex.GetType().ToString();
                er.FileName = "ErrorLogController";
                er.IpAddress = "0";
                er.UserId = 0;
                new ErrorLogController().CreateErrorLog(er);
            }

        }

    }
}