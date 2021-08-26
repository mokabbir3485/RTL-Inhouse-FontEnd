using DbExecutor;
using ExportBLL;
using System;
using System.Web.Mvc;
using ExportDAL;
using ExportEntity;

namespace Security.UI.Controllers
{
    public class ExpAmendmentReasonController : Controller
    {
        public JsonResult GetAllAmendmentReason()
        {
            try
            {
                var amendmentReasonList = Facade.exp_AmendmentReason.GetAll();
                return Json(amendmentReasonList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "ExpAmendmentReasonController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}