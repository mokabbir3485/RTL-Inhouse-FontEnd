using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class AuditTypeController : Controller
    {
        //
        // GET: /AuditType/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAddDeduct()
        {

            try
            {
                var list = Facade.StockAuditGroup.GetAllActive();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AuditTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllAuditType()
        {
            try
            {
                var list = Facade.StockAuditType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AuditTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAuditTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.StockAuditType.GetPaged(StartRecordNo, RowPerPage, "", "AuditTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AuditTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAuditTypeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.StockAuditType.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AuditTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_StockAuditType stockAuditType)
        {
            int ret = 0;
            stockAuditType.CreateDate = DateTime.Now;
            stockAuditType.UpdateDate = DateTime.Now;
            try
            {
                if (stockAuditType.AuditTypeId == 0)
                {

                    ret = Facade.StockAuditType.Add(stockAuditType);
                }
                else
                {
                   
                    ret = Facade.StockAuditType.Update(stockAuditType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AuditTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int auditTypeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.StockAuditType.Delete(auditTypeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AuditTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
           
            return ret;
        }
	}
}