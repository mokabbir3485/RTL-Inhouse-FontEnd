using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class CustomerTypeController : Controller
    {

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }
        public JsonResult GetAllCustomertypePaged(int StartRecordNo, int RowPerPage, int rows, int userId)
        {
            try
            {
                string whereClause = " C.BranchId IN (SELECT BranchId FROM ad_Department D INNER JOIN s_UserDepartment UD ON UD.DepartmentId=D.DepartmentId AND UD.UserId=" + userId + ")";
                var customMODEntity = new
                {
                    ListData = Facade.ad_CustomerType.GetPaged(StartRecordNo, RowPerPage, "", "CustomerTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCustomerTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ad_CustomerType.GetPaged(StartRecordNo, RowPerPage, "", "CustomerTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChargeTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCustomertypeDynamic(string searchCriteria, string orderBy)
        {

            try
            {
                //string orderBy = "CategoryName, SubCategoryName, ItemName";
                var list = Facade.ad_CustomerType.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAllCustomer(int? customerTypeId = null)
        {

            try
            {
                var list = Facade.ad_CustomerType.GetAll(customerTypeId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Save(ad_CustomerType _ad_CustomerType)
        {
            _ad_CustomerType.CreateDate = DateTime.Now;
            _ad_CustomerType.UpdateDate = DateTime.Now;
            int ret = 0;
            try
            {
                if (_ad_CustomerType.CustomerTypeId == 0)
                {
                    ret = Facade.ad_CustomerType.Add(_ad_CustomerType);
                }
                else
                {
                    ret = Facade.ad_CustomerType.Update(_ad_CustomerType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerTypeController";
                new ErrorLogController().CreateErrorLog(error);
                
            }
            return ret;
        }
        [HttpPost]
        public int Delete(int   customerTypeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ad_CustomerType.Delete(customerTypeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerTypeController";
                new ErrorLogController().CreateErrorLog(error);

            }
            return ret;
        }

	}
}