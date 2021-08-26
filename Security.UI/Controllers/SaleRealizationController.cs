using DbExecutor;
using Newtonsoft.Json;
using ReceivableBLL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class SaleRealizationController : Controller
    {
        //
        // GET: /SaleRealization/
        public ActionResult Index()
        {
            return View();
        }

        public string GetCompanyTotals(int financialCycleId, int companyId)
        {
            try
            {
                DataTable dt = Facade.rcv_SaleRealization.GetCompanyTotals(financialCycleId, companyId);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleRealizationController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
	}
}