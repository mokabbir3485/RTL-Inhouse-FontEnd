using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ReturnReasonController : Controller
    {
        public JsonResult GetAllReturnReason()
        {
            try
            {
                var list = Facade.ReturnReason.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnReasonController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetReturnReasonPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {                   
                    ListData = Facade.ReturnReason.GetPaged(StartRecordNo, RowPerPage, "", "ReturnReasonName", "ASC", ref rows),
                    TotalRecord = rows 
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PriceTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetReturnReasonDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ReturnReason.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnReasonController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_ReturnReason returnReason)
        {
            int ret = 0;
            returnReason.CreateDate = DateTime.Now;
            returnReason.UpdateDate = DateTime.Now;
            try
            {
                if (returnReason.ReturnReasonId == 0)
                {
                    ret = Facade.ReturnReason.Add(returnReason);
                }
                else
                {
                    ret = Facade.ReturnReason.Update(returnReason);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnReasonController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int returnReasonId)
        {
            int ret = 0;
            try
            {

                ret = Facade.ReturnReason.Delete(returnReasonId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "returnReasonController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllReturnReasonPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    Listdata = Facade.ReturnReason.GetPaged(StartRecordNo, RowPerPage, "", "ReturnReasonName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnReasonController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
	}
}