using System;
using System.Web.Mvc;
using DbExecutor;
using SecurityBLL;

namespace Security.UI.Controllers
{
    public class Rpt_MonthYearController : Controller
    {
        // GET: Rpt_MonthYear
        public JsonResult Get()
        {
            try
            {
                var list = Facade.Rpt_MonthYear.Get();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "Rpt_MonthYearController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}