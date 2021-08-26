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
    public class ChartOfAccountsController : Controller
    {
        //
        // GET: /ChartOfAccounts/
        [HttpPost]
        public int SaveChartofAccounts(ac_ChartOfAccount chartOfAccounts)
        {
            int ret = 0;

            chartOfAccounts.AccountDescription = string.IsNullOrEmpty(chartOfAccounts.AccountDescription) ? "" : chartOfAccounts.AccountDescription;

            chartOfAccounts.IsDefault = false;
            chartOfAccounts.UpdatorId = 1;
            chartOfAccounts.UpdateDate = DateTime.Now;
            try
            {
                if (chartOfAccounts.AccountId == 0)
                {
                    ret = Facade.chartOfAccountBLL.Add(chartOfAccounts);
                }
                else
                {
                    ret = Facade.chartOfAccountBLL.Update(chartOfAccounts);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChartOfAccountsController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAccountPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.chartOfAccountBLL.GetPaged(StartRecordNo, RowPerPage, "", "AccountName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChartOfAccountsController";
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

        public JsonResult GetChartOfAcountsPaged( int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.chartOfAccountBLL.GetPaged(StartRecordNo, RowPerPage, "", "AccountName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChartOfAccountsController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


	}
}