using System;
using System.Web.Mvc;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ApprovalController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetModuleExAdminSecurity()
        {
            try
            {
                var list = SecurityBLL.Facade.Module.GetExAdminSecurity();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ApprovalController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetForApproval(int? moduleId=null)
        {
            try
            {
                var list = SecurityBLL.Facade.Approval.GetForApproval(moduleId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ApprovalController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetByScreenId(int screenId)
        {
            try
            {
                var list = SecurityBLL.Facade.Approval.GetByScreenId(screenId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ApprovalController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Add(ad_Approval _ad_Approval)
        {
            _ad_Approval.CreateDate = DateTime.Now;
            _ad_Approval.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (_ad_Approval.ApprovalId > 0)
                {
                    ret = SecurityBLL.Facade.Approval.Update(_ad_Approval);
                }
                else
                {
                    ret = SecurityBLL.Facade.Approval.Add(_ad_Approval);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ApprovalController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}