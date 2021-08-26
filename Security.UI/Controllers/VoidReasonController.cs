using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class VoidReasonController : Controller
    {
        public JsonResult GetAllVoidReason()
        {
            try
            {
                var list = Facade.VoidReason.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "VoidReasonController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetVoidReasonPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.VoidReason.GetPaged(StartRecordNo, RowPerPage, "", "VoidReasonName", "ASC", ref rows),
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

        public JsonResult GetVoidReasonDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.VoidReason.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "VoidReasonController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_VoidReason voidReason)
        {
            int ret = 0;
            voidReason.CreateDate = DateTime.Now;
            voidReason.UpdateDate = DateTime.Now;
            try
            {
                if (voidReason.VoidReasonId == 0)
                {
                    ret = Facade.VoidReason.Add(voidReason);
                }
                else
                {
                    ret = Facade.VoidReason.Update(voidReason);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "VoidReasonController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int voidReasonId)
        {
            int ret = 0;
            try
            {

                ret = Facade.VoidReason.Delete(voidReasonId);
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

        public JsonResult GetAllVoidReasonPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    Listdata = Facade.VoidReason.GetPaged(StartRecordNo, RowPerPage, "", "VoidReasonName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "VoidReasonController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}