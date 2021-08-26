using System;
using System.Collections.Generic;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class DepartmentController : Controller
    {
        //
        // GET: /Department/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllDepartment()
        {
            try
            {
                var departmentList = Facade.Department.GetAll();
                return Json(departmentList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDepartmentPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.Department.GetPaged(StartRecordNo, RowPerPage, "", "DepartmentName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllStore()
        {
            try
            {
                var storeList = Facade.Department.GetAllStore();
                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllFactory()
        {
            try
            {
                var storeList = Facade.Department.GetAllFactory();
                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllUserDepartment(int userId)
        {
            try
            {
                var storeList = Facade.Department.GetAllUserDepartment(userId);
                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllActiveByBranchId(int branchId, Int32? departmentId = null)
        {
            try
            {
                var storeList = Facade.Department.GetAllActiveByBranchId(branchId, departmentId);
                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetByBranchAndGrade(int branchId, int gradeId)
        {
            try
            {
                var storeList = Facade.Department.GetByBranchAndGrade(branchId,gradeId);
                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetTypeWiseDepartmentByDepartmentId(int depId)
        {
            try
            {
                var TypeWiseDepartmenList = Facade.TypeWiseDepartment.GetByDepartmentId(depId);
                return Json(TypeWiseDepartmenList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDepartmentDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                //string orderBy = "CategoryName, SubCategoryName, ItemName";
                var list = Facade.Department.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllDepartmentType()
        {           
            try
            {
                var departmentTypeList = Facade.DepartmentType.GetAll();
                return Json(departmentTypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int SaveTypeWiseDepartment(List<ad_TypeWiseDepartment> ad_TypeWiseDepartmentlist)
        {
            int ret = 0;
            try
            {
                foreach (ad_TypeWiseDepartment adTypeWiseDepartment in ad_TypeWiseDepartmentlist)
                {
                    ret = Facade.TypeWiseDepartment.Add(adTypeWiseDepartment);
                }
                
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Save(ad_Department ad_Department)
        {
            if (ad_Department.Address == null)
                ad_Department.Address = "";
            if (ad_Department.ContactNo == null)
                ad_Department.ContactNo = "";
            if (ad_Department.Fax == null)
                ad_Department.Fax = "";
            if (ad_Department.Email == null)
                ad_Department.Email = "";
           // ad_Department.CreatorId = 1;
            ad_Department.CreateDate = DateTime.Now;
          //  ad_Department.UpdatorId = 1;
            ad_Department.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (ad_Department.DepartmentId == 0)
                {
                   
                    ret = Facade.Department.Add(ad_Department);
                }
                else
                {
                    // DeletePysicalFiles(ad_Branch.Logo);
                    ret = Facade.Department.Update(ad_Department);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int DepartmentId)
        {
            int ret = 0;
            try
            {

                ret = Facade.Department.Delete(DepartmentId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogController().CreateErrorLog(error);
            }
          return ret;
        }
	}
}