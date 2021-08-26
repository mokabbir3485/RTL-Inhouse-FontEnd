using DbExecutor;
using Newtonsoft.Json;
using PosBLL;
using ReceivableBLL;
using PosEntity;
using ReceivableEntity;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using InventoryEntity;
using System.Text;
using System.Web.Script.Serialization;
using SecurityEntity;
using System.Data;
using PayableEntity;

namespace Security.UI.Controllers
{
    public class AccountsTransactionController : Controller
    {
        //
        // GET: /AccountsTransaction/
        [HttpPost]
        public int Acknowledge(AccountsTransaction accountsTransaction, List<pos_SalesOrder> salesOrderList, List<inv_PurchaseBill> purBillList)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                var client = new RestClient("http://103.4.147.82:86");
                var request = new RestRequest("api/action/RetailPos.insertData", Method.POST);

                request.AddParameter("data[tx_number]", "0");
                request.AddParameter("data[action_type]", accountsTransaction.ActionType);
                request.AddParameter("data[ref_type]", accountsTransaction.RefType);
                request.AddParameter("data[from_account_code]", accountsTransaction.FromAccountCode);
                request.AddParameter("data[to_account_code]", accountsTransaction.ToAccountCode);
                request.AddParameter("data[tx_date]", accountsTransaction.TxDate);
                request.AddParameter("data[ref_Number]", accountsTransaction.RefNumber);
                request.AddParameter("data[amount]", accountsTransaction.Amount);
                request.AddParameter("data[narration]", accountsTransaction.Narration);

                string voucherNo = string.Empty;

                int ret = 0;
                try
                {
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
                        if (accountsTransaction.RefType == "Sale")
                        {
                            foreach (pos_SalesOrder item in salesOrderList)
                            {
                                item.VoucherNo = voucherNo;
                                item.IsAcknowledged = true;
                                ret = PosBLL.Facade.pos_SalesOrderBLL.Acknowledge(item);
                            }
                            //pos_SalesOrder salesOrder = new pos_SalesOrder();
                            //salesOrder.SalesOrderId = accountsTransaction.RefNumber;
                            //salesOrder.IsAcknowledged = true;
                            //salesOrder.AcknowledgedBy = accountsTransaction.CreatorId;
                            //salesOrder.AcknowledgedDate = accountsTransaction.TxDate;
                            //salesOrder.VoucherNo = voucherNo;
                            //ret = PosBLL.Facade.pos_SalesOrderBLL.Acknowledge(salesOrder);
                        }
                        else
                        {
                            foreach (inv_PurchaseBill item in purBillList)
                            {
                                item.VoucherNo = voucherNo;
                                item.IsApproved = true;
                                ret = InventoryBLL.Facade.PurchaseBill.Acknowledge(item);
                            }
                            //inv_PurchaseBill purchaseBill = new inv_PurchaseBill();
                            //purchaseBill.PBId = accountsTransaction.RefNumber;
                            //purchaseBill.IsApproved = true;
                            //purchaseBill.ApprovedBy = accountsTransaction.CreatorId;
                            //purchaseBill.ApprovedDate = accountsTransaction.TxDate;
                            //purchaseBill.VoucherNo = voucherNo;
                            //ret = InventoryBLL.Facade.PurchaseBill.Acknowledge(purchaseBill);
                        }

                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "AccountsTransactionController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }

                return ret;
            }
        }

        [HttpPost]
        public Int64 Realization(AccountsTransaction accountsTransaction)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                var client = new RestClient("http://103.4.147.82:86");
                var request = new RestRequest("api/action/RetailPos.insertData", Method.POST);

                request.AddParameter("data[tx_number]", "0");
                request.AddParameter("data[action_type]", accountsTransaction.ActionType);
                request.AddParameter("data[ref_type]", accountsTransaction.RefType);
                request.AddParameter("data[from_account_code]", accountsTransaction.FromAccountCode);
                request.AddParameter("data[to_account_code]", accountsTransaction.ToAccountCode);
                request.AddParameter("data[tx_date]", accountsTransaction.TxDate);
                request.AddParameter("data[ref_Number]", accountsTransaction.RefNumber);
                request.AddParameter("data[amount]", accountsTransaction.Amount);
                request.AddParameter("data[narration]", accountsTransaction.Narration);

                request.AddParameter("data[vendor_type]", (accountsTransaction.RefType == "Sale Collection" ? "Customer" : "Supplier"));
                request.AddParameter("data[vendor_name]", accountsTransaction.VendorName);

                request.AddParameter("data[cheque_no]", accountsTransaction.ChequeNo);
                request.AddParameter("data[cheque_date]", accountsTransaction.ChequeDate);
                request.AddParameter("data[cheque_bank]", accountsTransaction.ChequeBank);

                string voucherNo = string.Empty;
                Int64 ret = 0;

                try
                {
                    IRestResponse responseAmt = client.Execute(request);
                    var jsonResult = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(responseAmt.Content);
                    foreach (var kv in jsonResult)
                    {
                        if (kv.Key == "data" && kv.Value != null)
                        {
                            voucherNo = (string)kv.Value["tx_number"];
                        }
                    }

                    if (accountsTransaction.FromAdvance > 0)
                    {
                        request.AddParameter("data[tx_number]", voucherNo);
                        request.AddParameter("data[to_account_code]", "6001");
                        request.AddParameter("data[amount]", accountsTransaction.FromAdvance);
                        IRestResponse responseFromAdv = client.Execute(request);
                    }

                    if (accountsTransaction.TDS > 0)
                    {
                        request.AddParameter("data[tx_number]", voucherNo);
                        request.AddParameter("data[to_account_code]", "7001");
                        request.AddParameter("data[amount]", accountsTransaction.TDS);
                        IRestResponse responseTDS = client.Execute(request);
                    }

                    if (accountsTransaction.VDS > 0)
                    {
                        request.AddParameter("data[tx_number]", voucherNo);
                        request.AddParameter("data[to_account_code]", "8001");
                        request.AddParameter("data[amount]", accountsTransaction.VDS);
                        IRestResponse responseVDS = client.Execute(request);
                    }

                    if (!string.IsNullOrEmpty(voucherNo))
                    {
                        if (accountsTransaction.RefType == "Sale Collection")
                        {
                            rcv_SaleRealization realization = new rcv_SaleRealization();
                            realization.FinancialCycleId = accountsTransaction.FinancialCycleId;
                            realization.CompanyId = accountsTransaction.CompanyId;
                            realization.SalesOrderId = accountsTransaction.RefNumber;
                            realization.PaymentTypeId = accountsTransaction.PaymentTypeId;
                            realization.PaymentDate = accountsTransaction.TxDate;
                            realization.Amount = accountsTransaction.Amount;
                            realization.FromAdvance = accountsTransaction.FromAdvance;
                            realization.TDS = accountsTransaction.TDS;
                            realization.VDS = accountsTransaction.VDS;
                            realization.VoucherNo = voucherNo;
                            realization.UpdatorId = accountsTransaction.CreatorId;
                            realization.UpdateDate = accountsTransaction.TxDate;
                            realization.ChequeNo = accountsTransaction.ChequeNo;
                            realization.ChequeBank = accountsTransaction.ChequeBank;
                            realization.ChequeDate = accountsTransaction.ChequeDate == DateTime.MinValue ? null : accountsTransaction.ChequeDate;
                            ret = ReceivableBLL.Facade.rcv_SaleRealization.Add(realization);
                        }
                        else
                        {
                            pay_PurchaseRealization realization = new pay_PurchaseRealization();
                            realization.FinancialCycleId = accountsTransaction.FinancialCycleId;
                            realization.SupplierId = accountsTransaction.SupplierId;
                            realization.PBId = accountsTransaction.RefNumber;
                            realization.PaymentTypeId = accountsTransaction.PaymentTypeId;
                            realization.PaymentDate = accountsTransaction.TxDate;
                            realization.Amount = accountsTransaction.Amount;
                            realization.FromAdvance = accountsTransaction.FromAdvance;
                            realization.TDS = accountsTransaction.TDS;
                            realization.VDS = accountsTransaction.VDS;
                            realization.VoucherNo = voucherNo;
                            realization.UpdatorId = accountsTransaction.CreatorId;
                            realization.UpdateDate = accountsTransaction.TxDate;
                            ret = PayableBLL.Facade.pay_PurchaseRealization.Add(realization);
                        }
                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "AccountsTransactionController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }

                return ret;
            }
        }

        public JsonResult GetCashAndBankAccounts()
        {
            var client = new RestClient("http://103.4.147.82:86");
            var request = new RestRequest("api/action/ripon.getAccounts", Method.GET);

            try
            {
                IRestResponse response = client.Execute(request);
                var jsonResult = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(response.Content);

                List<ad_PaymentType> lstPT = new List<ad_PaymentType>();

                if (jsonResult.First().Key == "data" && jsonResult.First().Value != null)
                {
                    foreach (var item in jsonResult.First().Value)
                    {
                        int code = (int)item["account_code"];
                        string name = (string)item["name"];

                        ad_PaymentType pt = new ad_PaymentType();
                        pt.PaymentTypeId = code;
                        pt.PaymentTypeName = name;
                        lstPT.Add(pt);
                    }
                }

                string contentType = "application/json";
                return Json(lstPT, contentType, Encoding.UTF8, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountsTransactionController";
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public string GetCompanyTotals(int financialCycleId, int companyId)
        {
            try
            {
                DataTable dt = ReceivableBLL.Facade.rcv_SaleRealization.GetCompanyTotals(financialCycleId, companyId);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountsTransactionController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        public string GetSupplierTotals(int financialCycleId, int supplierId)
        {
            try
            {
                DataTable dt = PayableBLL.Facade.pay_PurchaseRealization.GetSupplierTotals(financialCycleId, supplierId);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AccountsTransactionController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
    }

    public class AccountsTransaction
    {
        public string ActionType { get; set; }
        public string RefType { get; set; }
        public string FromAccountCode { get; set; }
        public string ToAccountCode { get; set; }
        public string Narration { get; set; }
        public DateTime TxDate { get; set; }
        public Int64 RefNumber { get; set; }
        public Decimal Amount { get; set; }
        public Decimal FromAdvance { get; set; }
        public Decimal TDS { get; set; }
        public Decimal VDS { get; set; }
        public Int32 CreatorId { get; set; }
        public Int32 FinancialCycleId { get; set; }
        public Int32 CompanyId { get; set; }
        public Int32 SupplierId { get; set; }
        public Int32 PaymentTypeId { get; set; }
        public string ChequeNo { get; set; }
        public Nullable<DateTime> ChequeDate { get; set; }
        public string ChequeBank { get; set; }
        public string VendorName { get; set; }
    }
}