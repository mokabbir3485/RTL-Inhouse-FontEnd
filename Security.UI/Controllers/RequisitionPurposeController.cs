using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class RequisitionPurposeController : Controller
    {
        //
        // GET: /RequisitionPurpose/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllRequisitionPurpose()
        {
            try
            {
                var list = Facade.RequisitionPurpose.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionPurposeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetRequisitionPurposePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    //ListData = Facade.PriceType.GetPaged(StartRecordNo, RowPerPage, "", "PriceTypeName", "ASC", ref rows),
                    //TotalRecord = rows


                    ListData = Facade.RequisitionPurpose.GetPaged(StartRecordNo, RowPerPage, "", "RequisitionPurposeName", "ASC", ref rows),
                    TotalRecord = rows 
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionPurpose";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetRequisitionPurposeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.RequisitionPurpose.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionPurposeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_RequisitionPurpose requisitionPurpose)
        {
            int ret = 0;
            requisitionPurpose.CreateDate = DateTime.Now;
            requisitionPurpose.UpdateDate = DateTime.Now;
            try
            {
                if (requisitionPurpose.RequisitionPurposeId == 0)
                {
                    ret = Facade.RequisitionPurpose.Add(requisitionPurpose);
                }
                else
                {
                    ret = Facade.RequisitionPurpose.Update(requisitionPurpose);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionPurposeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int requisitionPurposeId)
        {
            int ret = 0;
            try
            {

                ret = Facade.RequisitionPurpose.Delete(requisitionPurposeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionPurposeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}