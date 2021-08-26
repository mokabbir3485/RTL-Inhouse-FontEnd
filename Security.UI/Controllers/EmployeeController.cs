using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class EmployeeController : Controller
    {
        public JsonResult GetAllEmployee()
        {
            try
            {
                var list = Facade.Employee.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetAllContractType()
        {
            try
            {
                var list = HrAndPayrollBLL.Facade.hr_ContractType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message; 
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetEmployeePaged(int StartRecordNo, int RowPerPage, int rows, string whClause)
        {
            try
            {
                if (whClause == null || whClause == "") { whClause = ""; }

                var customMODEntity = new
                {
                    ListData = Facade.Employee.GetPaged(StartRecordNo, RowPerPage, whClause, "BranchName,DepartmentName,FirstName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public int SaveEmployee(ad_Employee employee)
        {
            int ret = 0;
            //  employee.CreatorId = 1;
            employee.CreateDate = DateTime.Now;
            //  employee.UpdatorId = 1;
            employee.UpdateDate = DateTime.Now;
            if (employee.MiddleName == null)
                employee.MiddleName = "";
            if (employee.ContactNo == null)
                employee.ContactNo = "";
            if (employee.Email == null)
                employee.Email = "";
            if (employee.PresentAddress == null)
                employee.PresentAddress = "";
            if (employee.LastName == null)
                employee.LastName = "";
            if (employee.Title == null)
                employee.Title = "";
            if (employee.DateOfBirth == null)
                employee.DateOfBirth = DateTime.Now;
            try
            {
                if (employee.EmployeeId == 0)
                {
                    ret = Facade.Employee.Add(employee);
                }
                else
                {
                    ret = Facade.Employee.Update(employee);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int DeleteEmployee(int EmployeeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.Employee.Delete(EmployeeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

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
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }


        }
        public JsonResult GetUserDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.Employee.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDesignationById(int designationId)
        {
            try
            {
                var designationList = Facade.Designation.GetById(designationId);
                return Json(designationList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetEmployeeEmailByDocumentRef(int refEmployeeId, int PaymentProcessTypeId)
        {
            try
            {
                var designationList = Facade.Employee.GetEmployeeEmailByDocumentRef(refEmployeeId, PaymentProcessTypeId);
                return Json(designationList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetSectionByDepartmentId(int departmentId)
        {
            try
            {
                var sectionList = Facade.ad_DepartmentWiseSection.GetSectionByDepartmentId(departmentId);
                return Json(sectionList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "EmployeeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }
    }
}