using DbExecutor;
using ExportBLL;
using ExportEntity;
using System;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class ExpPaymentProcessController : Controller
    {
        // GET: PaymentProcess
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllPaymentProcess()
        {
            try
            {
                var list = Facade.exp_PaymentProcess.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpPaymentProcessController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetExpPaymentProcessDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.exp_PaymentProcess.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpPaymentProcessController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        //public JsonResult GetItemByPaymentProcess(Int64 id, string docType) 
        //{
        //    try
        //    {
        //        var list = Facade.exp_PaymentProcess.GetItemByPaymentProcess(id, docType);
        //        return Json(list, JsonRequestBehavior.AllowGet);
        //    }

        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "ExpPaymentProcessController";
        //        new ErrorLogController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }

        //}
        [HttpPost]
        public Int64 Save(exp_PaymentProcess exp_PaymentProcess)
        {
            exp_PaymentProcess.LcDate = exp_PaymentProcess.LcDate == DateTime.MinValue ? DateTime.Now : exp_PaymentProcess.LcDate;
            exp_PaymentProcess.ExportContactDate = exp_PaymentProcess.ExportContactDate == DateTime.MinValue ? DateTime.Now : exp_PaymentProcess.ExportContactDate;
            exp_PaymentProcess.UpdatedDate = DateTime.Now;
            if (exp_PaymentProcess.LcNo == null) { exp_PaymentProcess.LcNo = ""; }
            if (exp_PaymentProcess.ExportContactNo == null) { exp_PaymentProcess.ExportContactNo = ""; }
            if (exp_PaymentProcess.BbDcNo == null) { exp_PaymentProcess.BbDcNo = ""; }
            if (exp_PaymentProcess.IrcNo == null) { exp_PaymentProcess.IrcNo = ""; }
            if (exp_PaymentProcess.LcaNo == null) { exp_PaymentProcess.LcaNo = ""; }
            if (exp_PaymentProcess.ExpNo == null) { exp_PaymentProcess.ExpNo = ""; }

            Int64 ret = 0;
            try
            {
                if (exp_PaymentProcess.PaymentProcessId == 0)
                {
                    ret = Facade.exp_PaymentProcess.Add(exp_PaymentProcess);
                }
                else
                {
                    ret = Facade.exp_PaymentProcess.Update(exp_PaymentProcess);
                }
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpPaymentProcessController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int PaymentProcessId)
        {
            int ret = 0;
            try
            {
                ret = Facade.exp_PaymentProcess.Delete(PaymentProcessId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpPaymentProcessController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}