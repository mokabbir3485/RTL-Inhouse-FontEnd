using ReceivableEntity;
using ReceivableBLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class SaleAdjustmentController : Controller
    {
        //
        // GET: /SaleAdjustment/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public Int64 Save(List<rcv_SaleAdjustment> lstSaleAdjustment)
        {
            Int64 ret = 0;

            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    foreach (rcv_SaleAdjustment item in lstSaleAdjustment)
                    {
                        ret = Facade.rcv_SaleAdjustment.Add(item);
                    }

                    if (ret > 0)
                        ts.Complete();
                }
            }
            catch (Exception ex)
            {
                ret = 0;
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleAdjustmentController";
                new ErrorLogPosController().CreateErrorLog(error);
            }

            return ret;
        }
	}
}