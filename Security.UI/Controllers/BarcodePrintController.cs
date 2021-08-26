using System;
using System.Collections.Generic;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class BarcodePrintController : Controller
    {
        //
        // GET: /BarcodePrint/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public Int64 SaveBarcode(List<ad_BarcodePrint> barcodePrintLst)
        {
            Int64 ret = 0;
            int loop = 0;
            try
            {
                foreach (ad_BarcodePrint item in barcodePrintLst)
                {
                    item.Delete = loop == 0 ? true : false;
                    ret = Facade.ad_BarcodePrint.Add(item);
                    loop += 1;
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BarcodePrintController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}