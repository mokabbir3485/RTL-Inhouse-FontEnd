using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class OverHeadController : Controller
    {
        //
        // GET: /OverHead/
        public ActionResult Index()
        {
            return View();
        }
      
        public JsonResult GetAllOverhead()
        {
            try
            {
                var list = Facade.OverHead.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OverHeadController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllOverheadPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.OverHead.GetPaged(StartRecordNo, RowPerPage, "", "OverHeadName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OverHeadController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetOverheadDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.OverHead.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OverheadController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_OverHead overhead)
        {
            int ret = 0;
            overhead.CreateDate = DateTime.Now;
            overhead.UpdateDate = DateTime.Now;
            try
            {
                if (overhead.AccountCode == null)
                {
                    overhead.AccountCode = "";
                }
                if (overhead.OverHeadId == 0)
                {
                    ret = Facade.OverHead.Add(overhead);
                }
                else
                {
                    ret = Facade.OverHead.Update(overhead);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OverHeadController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int overheadId)
        {
            int ret = 0;
            try
            {

                ret = Facade.OverHead.Delete(overheadId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OverHeadController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}