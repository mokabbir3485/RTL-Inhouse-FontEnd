using System;
using System.Web.Mvc;
using DbExecutor;
using SecurityBLL;
using SecurityEntity;

namespace Security.UI.Controllers
{
    public class BankAccountController : Controller
    {
        // GET: BankAccount
        public JsonResult GetAllBankAccount()
        {
            try
            {
                var list = Facade.BankAccountBLL.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                var error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankAccountController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public int Save(ad_BankAccount ad_BankAccount)
        {
            if (ad_BankAccount.AccountName == null) ad_BankAccount.AccountName = "";
            if (ad_BankAccount.BranchName == null) ad_BankAccount.BranchName = "";
            if (ad_BankAccount.AccountNo == null) ad_BankAccount.AccountNo = "";
            if (ad_BankAccount.SwiftCode == null) ad_BankAccount.SwiftCode = "";
            if (ad_BankAccount.BIN == null) ad_BankAccount.BIN = "";
            ad_BankAccount.UpdatedDate = DateTime.Now;
        
            var ret = 0;
            try
            {
                if (ad_BankAccount.BankAccountId == 0)
                    ret = Facade.BankAccountBLL.Add(ad_BankAccount);
                else
                    ret = Facade.BankAccountBLL.Update(ad_BankAccount);
            }
            catch (Exception ex)
            {
                var error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankAccountController";
                new ErrorLogController().CreateErrorLog(error);
            }

            return ret;
        }

        [HttpPost]
        public int Delete(int BankAccountId)
        {
            var ret = 0;
            try
            {
                ret = Facade.BankAccountBLL.Delete(BankAccountId);
            }
            catch (Exception ex)
            {
                var error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankAccountController";
                new ErrorLogController().CreateErrorLog(error);
            }

            return ret;
        }

        public JsonResult GetBankAccountPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.BankAccountBLL.GetPaged(StartRecordNo, RowPerPage, "", "AccountName", "ASC",
                        ref rows),
                    TotalRecord = rows
                };  
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                var error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankAccountController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBankAccountDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ad_Bank.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                var error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankAccountController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBankAccountByTypeAndRefId(string searchCriteria)
        {
            try
            {
                //var searchCriteria="";
                //if (accountRefId == 0)
                //{
                //    searchCriteria = "AccountFor = '" + accountFor + "'";
                //}
                //else
                //{
                //    searchCriteria = "AccountFor = '" + accountFor + "' AND AccountRefId = " + accountRefId;
                //}
                var list = Facade.ad_BankAccount.GetDynamic(searchCriteria, "BankName");
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                var error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankAccountController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}