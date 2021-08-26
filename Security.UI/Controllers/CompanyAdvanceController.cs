using DbExecutor;
using Newtonsoft.Json;
using ReceivableBLL;
using ReceivableEntity;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class CompanyAdvanceController : Controller
    {
        //
        // GET: /CompanyAdvance/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult CompanyAdvanceGetDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.rcv_CompanyAdvance.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult CompanyOpeningBalanceGetDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.rcv_CompanyOpeningBalance.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public string CheckVoucherNoExists(string voucherNo)
        {
            try
            {
                DataTable dt = Facade.rcv_CompanyAdvance.CheckVoucherNoExists(voucherNo);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        [HttpPost]
        public Int64 SaveCompanyAdvanceOrOpeningBalance(rcv_CompanyAdvance companyAdvance, string advanceType)
        {
            Int64 ret = 0;
            //companyAdvance.VoucherNo = string.IsNullOrEmpty(companyAdvance.VoucherNo) ? string.Empty : companyAdvance.VoucherNo;
            rcv_CompanyOpeningBalance openingBalance = new rcv_CompanyOpeningBalance();

            string voucherNo = string.Empty;
            string actionType = advanceType == "openingBalance" ? "Journal" : "Receipt";
            string refType = advanceType == "openingBalance" ? "Customer Opening Balance" : "Customer Advance";

            if (advanceType == "openingBalance")
            {
                openingBalance.FinancialCycleId = companyAdvance.FinancialCycleId;
                openingBalance.CompanyId = companyAdvance.CompanyId;
                openingBalance.OpeningDate = companyAdvance.AdvanceDate;
                openingBalance.Amount = companyAdvance.Amount;
                openingBalance.UpdatorId = companyAdvance.UpdatorId;
                openingBalance.UpdateDate = companyAdvance.UpdateDate;
            }

            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    var client = new RestClient("http://local.rtacct.com");
                    var request = new RestRequest("api/action/RetailPos.insertData", Method.POST);

                    request.AddParameter("data[tx_number]", "0");
                    request.AddParameter("data[action_type]", actionType);
                    request.AddParameter("data[ref_type]", refType);
                    request.AddParameter("data[tx_date]", companyAdvance.AdvanceDate);
                    request.AddParameter("data[ref_Number]", "0");
                    request.AddParameter("data[amount]", companyAdvance.Amount);

                    if (advanceType == "openingBalance")
                    {
                        request.AddParameter("data[from_account_code]", "9001");
                        request.AddParameter("data[to_account_code]", "1001");
                        request.AddParameter("data[narration]", "Opening Balance From Customer " + companyAdvance.CompanyName);

                        IRestResponse response = client.Execute(request);

                        var jsonResult = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(response.Content);

                        foreach (var kv in jsonResult)
                        {
                            if (kv.Key == "data" && kv.Value != null)
                            {
                                voucherNo = (string)kv.Value["tx_number"];
                            }
                        }

                        if (!string.IsNullOrEmpty(voucherNo))
                        {
                            ret = Facade.rcv_CompanyOpeningBalance.Add(openingBalance);
                        }
                    }
                    else
                    {
                        request.AddParameter("data[from_account_code]", companyAdvance.PaymentTypeId.ToString());
                        request.AddParameter("data[to_account_code]", "6001");
                        request.AddParameter("data[narration]", "Advance From Customer " + companyAdvance.CompanyName);

                        IRestResponse response = client.Execute(request);

                        var jsonResult = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(response.Content);

                        foreach (var kv in jsonResult)
                        {
                            if (kv.Key == "data" && kv.Value != null)
                            {
                                voucherNo = (string)kv.Value["tx_number"];
                            }
                        }

                        if (!string.IsNullOrEmpty(voucherNo))
                        {
                            companyAdvance.VoucherNo = voucherNo; 
                            ret = Facade.rcv_CompanyAdvance.Add(companyAdvance);
                        }
                    }

                    if (ret > 0)
                        ts.Complete();
                }
            }
            catch (Exception ex)
            {
                ret = 0;
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CompanyAdvanceController";
                new ErrorLogPosController().CreateErrorLog(error);
            }

            return ret;
        }
    }
}