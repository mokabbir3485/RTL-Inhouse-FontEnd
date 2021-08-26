using System;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class DesignationController : Controller
    {
        public JsonResult GetAllDesignation()
        {
            try
            {
                var designationList = Facade.Designation.GetAll();
                return Json(designationList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDesignationPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Designation.GetPaged(StartRecordNo, RowPerPage, "", "DesignationName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDesignationDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.Designation.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllByDepartmentId(int departmentId)
        {
            try
            {
                var list = Facade.Designation.GetAllByDepartmentId(departmentId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllActiveByDepartmentId(int departmentId)
        {
            try
            {
                var list = Facade.Designation.GetAllActiveByDepartmentId(departmentId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_Designation ad_Designation)
        {
            if (ad_Designation.ContactNo == null)
                ad_Designation.ContactNo = "";
            ad_Designation.CreateDate = DateTime.Now;
            ad_Designation.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (ad_Designation.DesignationId == 0)
                {
                    ret = Facade.Designation.Add(ad_Designation);
                }
                else
                {
                    ret = Facade.Designation.Update(ad_Designation);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int Delete(int DesignationId)
        {
            int ret = 0;
            try
            {
                ret = Facade.Designation.Delete(DesignationId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DesignationController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
	}
}