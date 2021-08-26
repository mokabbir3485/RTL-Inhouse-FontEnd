using AccountsEntity;
using AccountsBLL;
using DbExecutor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

namespace Security.UI.Controllers
{
    public class AccountTypeController : Controller
    {
        //
        // GET: /AccountType/
        [HttpPost]
        public int SaveAccountType(ac_AccountType accountType)
        {
            int ret = 0;
            //accountType.IsActive = true;
            accountType.IsDefault = false;
            accountType.DisplayName = accountType.AccountTypeName;
            accountType.UpdatorId = 1;
            accountType.UpdateDate = DateTime.Now;
            try
            {
                if (accountType.AccountTypeId == 0)
                {
                    ret = Facade.accountTypeBLL.Add(accountType);
                }
                else
                {
                    ret = Facade.accountTypeBLL.Update(accountType);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountTypeController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAccountTypePaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.accountTypeBLL.GetPaged(StartRecordNo, RowPerPage, "", "AccountTypeName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public int SaveAccountTypeDetail(ac_AccountTypeDetail accountTypeDetail)
        {
            int ret = 0;
            //accountTypeDetail.IsActive = true;
            accountTypeDetail.IsDefault = false;
            accountTypeDetail.DetailDisplayName = accountTypeDetail.AccountTypeDetailName;
            accountTypeDetail.UpdatorId = 1;
            accountTypeDetail.UpdateDate = DateTime.Now;
            try
            {
                if (accountTypeDetail.AccountTypeDetailId == 0)
                {
                    ret = Facade.accountTypeDetailBLL.Add(accountTypeDetail);
                }
                else
                {
                    ret = Facade.accountTypeDetailBLL.Update(accountTypeDetail);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountTypeDetailController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAccountTypeDetailPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.accountTypeDetailBLL.GetPaged(StartRecordNo, RowPerPage, "", "AccountTypeDetailName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAccountTypeDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.accountTypeBLL.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAccountTypeDetailDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.accountTypeDetailBLL.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountTypeController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
	}
}