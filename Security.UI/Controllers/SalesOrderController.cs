using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using DbExecutor;
using Newtonsoft.Json;
using PosBLL;
using PosDAL;
using PosEntity;
using SecurityEntity;
using System.Web.Mvc;
using RestSharp;
using Newtonsoft.Json.Linq;

namespace Security.UI.Controllers
{
    public class SalesOrderController : Controller
    {
        // GET: /SalesOrder/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetItemForIWO(Int64 salesOrderId)
        {
            try
            {
                var list = Facade.pos_SalesOrderDetailBLL.GetItemForIWO(salesOrderId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllRole()
        {
            var list = Facade.pos_SalesOrderBLL.GetAll();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSalesOrderPaged(int startRecordNo, int rowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.pos_SalesOrderBLL.GetPaged(startRecordNo, rowPerPage, "", "SalesOrderNo", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
       
        public JsonResult GetSalesOrderDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.pos_SalesOrderBLL.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController"; 
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetSalesOrderForPiUpdate(Int64 InvoiceId, Int32 CompanyId)
        {
            try
            {
                var list = Facade.pos_SalesOrderBLL.GetForPiUpdate(InvoiceId, CompanyId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult pos_SalesOrderAmendment_GetForEdit(string approvalType, string approvalPassword)
        {
            try
            {
                var pos_SalesOrderAmendmenList = Facade.pos_SalesOrderBLL.pos_SalesOrderAmendment_GetForEdit(approvalType, approvalPassword);
                return Json(pos_SalesOrderAmendmenList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "SalesOrderController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetSalesOrderForEdit(DateTime fromDate, DateTime toDate, int? companyId)
        {
            try
            {
                var list = Facade.pos_SalesOrderBLL.SalesOrderGetForEdit(fromDate, toDate, companyId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetSalesOrderForPI(int companyId)
        {
            try
            {
                var list = Facade.pos_SalesOrderBLL.SalesOrderGetForPI(companyId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTopForDelivery(int topQty)
        {
            try
            {
                var list = Facade.pos_SalesOrderBLL.GetTopForDelivery(topQty);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetSalesOrderDetailDynamic(string searchCriteria, string orderBy)
        {
            try
            {
               var list = Facade.pos_SalesOrderDetailBLL.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 Save(pos_SalesOrder salesOrder, List<pos_SalesOrderDetail> pos_SaleOrderBillDetaillst, List<pos_POReference> POReferencelist)
        {

            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                Int64 ret = 0;
                if (salesOrder.ReferenceNo == null){salesOrder.ReferenceNo = "";}
                if (salesOrder.Remarks == null){salesOrder.Remarks = "";}
                if (salesOrder.RefEmployeeName == null){salesOrder.RefEmployeeName = "";}
                //if (salesOrder.SalesOrderId == 0){ salesOrder.CreateDate = DateTime.Now; }
                //salesOrder.UpdateDate = DateTime.Now;

                try
                {

                    ret = Facade.pos_SalesOrderBLL.Add(salesOrder);
                    if (pos_SaleOrderBillDetaillst != null && pos_SaleOrderBillDetaillst.Count > 0 && ret > 0)
                    {
                        foreach (pos_SalesOrderDetail apos_SalesOrderDetail in pos_SaleOrderBillDetaillst)
                        {
                            Int64 od_ret;
                            if (apos_SalesOrderDetail.BuyerName == null)
                            {
                                apos_SalesOrderDetail.BuyerName = "";
                            }
                            apos_SalesOrderDetail.SalesOrderId = ret;
                            od_ret=Facade.pos_SalesOrderDetailBLL.Add(apos_SalesOrderDetail);
                        }
                    }

                    if (POReferencelist != null && POReferencelist.Count > 0 && ret > 0)
                    {
                        foreach (pos_POReference aPOReferencelist in POReferencelist)
                        {
                            Int64 PO_ret;

                            aPOReferencelist.DocumentId = ret;
                            PO_ret = Facade.pos_POReferenceBLL.Add(aPOReferencelist);
                        }
                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "SalesOrderController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }

        public JsonResult GetPOReference(string DocType, Int64 DocumentId)
        {
            try
            {
                return Json(Facade.pos_POReferenceBLL.GetPOReference(DocType, DocumentId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public string GetSalesOrderNo(DateTime SalesOrderDate)
        {
            try
            {
                var maxNumber = Facade.pos_SalesOrderBLL.GetMaxSalesOrderNo(SalesOrderDate);
                return JsonConvert.SerializeObject(maxNumber);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        public JsonResult GetSalesOrderDetailBySalesOrderId(int salesOrderId)
        {
            try
            {
                return Json(Facade.pos_SalesOrderDetailBLL.GetBySalesOrderId(salesOrderId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPaged(int startRecordNo, int rowPerPage, string fromDate, string toDate, string wildCard, string sortColumn)
        {
            try
            {

                if (!String.IsNullOrEmpty(startRecordNo.ToString()) && !String.IsNullOrEmpty(fromDate) && !String.IsNullOrEmpty(toDate))
                {
                    string whereClause = "SalesOrderDate BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
                    if (!String.IsNullOrEmpty(wildCard.Trim()))
                    {
                        whereClause += " AND SalesOrderNo LIKE '%" + wildCard + "%'";
                    }
                    var pbList = new
                    {
                        ListData = Facade.pos_SalesOrderBLL.GetPaged(startRecordNo, rowPerPage, whereClause, sortColumn, "DESC", ref rowPerPage),
                        TotalRecord = rowPerPage
                    };
                    return Json(pbList, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetSalesOrderPaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.pos_SalesOrderBLL.GetPaged(startRecordNo, rowPerPage, whereClause, "SalesOrderNo", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int Acknowledge(pos_SalesOrder salesOrder)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                //Save in Accounts First
                var client = new RestClient("http://local.rtacct.com");
                var request = new RestRequest("api/action/RetailPos.insertData", Method.POST);

                request.AddParameter("data[tx_number]", "");
                request.AddParameter("data[action_type]", "Journal");
                request.AddParameter("data[ref_type]", "Sale");
                request.AddParameter("data[from_account_code]", "4001");
                request.AddParameter("data[to_account_code]", "1001");
                request.AddParameter("data[tx_date]", salesOrder.AcknowledgedDate);
                request.AddParameter("data[ref_Number]", salesOrder.SalesOrderId);
                request.AddParameter("data[amount]", salesOrder.Amount);

                bool accDataInsert = false;
                string voucherNo = string.Empty;

                int ret = 0;
                try
                {
                    IRestResponse response = client.Execute(request);

                    var jsonResult = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(response.Content);

                    foreach (var kv in jsonResult)
                    {
                        if (kv.Key == "error" && kv.Value == false)
                            accDataInsert = true;
                        else if (kv.Key == "data" && kv.Value != null)
                        {
                            voucherNo = (string)kv.Value["tx_number"];
                        }
                    }

                    if (accDataInsert && !string.IsNullOrEmpty(voucherNo))
                    {
                        salesOrder.IsAcknowledged = true;
                        salesOrder.VoucherNo = voucherNo;
                        ret = Facade.pos_SalesOrderBLL.Acknowledge(salesOrder);
                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "SalesOrderController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }

                return ret;
            }
        }
        public JsonResult GetForRealization(int financialCycleId, int companyId)
        {
            try
            {
                var list = Facade.pos_SalesOrderBLL.GetForRealization(financialCycleId, companyId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SalesOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}