using DbExecutor;
using Newtonsoft.Json;
using PayableBLL;
using PayableEntity;
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
    public class SupplierAdvanceController : Controller
    {
        //
        // GET: /SupplierAdvance/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult SupplierAdvanceGetDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.pay_SupplierAdvance.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierAdvanceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SupplierOpeningBalanceGetDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.pay_SupplierOpeningBalance.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";

                return Json(list, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierAdvanceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public string CheckVoucherNoExists(string voucherNo)
        {
            try
            {
                DataTable dt = Facade.pay_SupplierAdvance.CheckVoucherNoExists(voucherNo);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierAdvanceController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        [HttpPost]
        public Int64 SaveSupplierAdvanceOrOpeningBalance(pay_SupplierAdvance supplierAdvance, string advanceType)
        {
            Int64 ret = 0;
            //supplierAdvance.VoucherNo = string.IsNullOrEmpty(supplierAdvance.VoucherNo) ? string.Empty : supplierAdvance.VoucherNo;
            pay_SupplierOpeningBalance openingBalance = new pay_SupplierOpeningBalance();

            string voucherNo = string.Empty;
            string actionType = advanceType == "openingBalance" ? "Journal" : "Receipt";
            string refType = advanceType == "openingBalance" ? "Supplier Opening Balance" : "Supplier Advance";

            if (advanceType == "openingBalance")
            {
                openingBalance.FinancialCycleId = supplierAdvance.FinancialCycleId;
                openingBalance.SupplierId = supplierAdvance.SupplierId;
                openingBalance.OpeningDate = supplierAdvance.AdvanceDate;
                openingBalance.Amount = supplierAdvance.Amount;
                openingBalance.UpdatorId = supplierAdvance.UpdatorId;
                openingBalance.UpdateDate = supplierAdvance.UpdateDate;
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
                    request.AddParameter("data[tx_date]", supplierAdvance.AdvanceDate);
                    request.AddParameter("data[ref_Number]", "0");
                    request.AddParameter("data[amount]", supplierAdvance.Amount);

                    if (advanceType == "openingBalance")
                    {
                        request.AddParameter("data[from_account_code]", "9001");
                        request.AddParameter("data[to_account_code]", "1001");
                        request.AddParameter("data[narration]", "Opening Balance For Supplier " + supplierAdvance.SupplierName);

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
                            ret = Facade.pay_SupplierOpeningBalance.Add(openingBalance);
                        }
                    }
                    else
                    {
                        request.AddParameter("data[from_account_code]", supplierAdvance.PaymentTypeId.ToString());
                        request.AddParameter("data[to_account_code]", "6001");
                        request.AddParameter("data[narration]", "Advance To Supplier " + supplierAdvance.SupplierName);

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
                            supplierAdvance.VoucherNo = voucherNo;
                            ret = Facade.pay_SupplierAdvance.Add(supplierAdvance);
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
                error.FileName = "SupplierAdvanceController";
                new ErrorLogPosController().CreateErrorLog(error);
            }

            return ret;
        }
    }
}