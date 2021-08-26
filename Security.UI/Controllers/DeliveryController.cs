using InventoryBLL;
using InventoryEntity;
using System;
using System.Web.Mvc;
using DbExecutor;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Security.UI.Controllers
{
    public class DeliveryController : Controller
    {
        [HttpPost]
        public ActionResult SaveDelivery(inv_StockDelivery inv_stockDelivery, List<inv_StockDeliveryDetail> inv_stockDeliveryDetail, List<inv_PurchaseBillDetailSerial> serialList)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                Int64 ret = 0;
                inv_stockDelivery.CreateDate = DateTime.Now;
                inv_stockDelivery.UpdateDate = DateTime.Now;
                inv_stockDelivery.DeliveryToDepartmentName = string.Empty;
                if (inv_stockDelivery.ReceivedBy == null)
                {
                    inv_stockDelivery.ReceivedBy = "";
                }
                try
                {
                    
                    if (inv_stockDelivery.DeliveryId == 0)
                    {
                        string savedDeliveryNo = "";
                        inv_stockDelivery.TotalDeliveryQty = inv_stockDeliveryDetail
                                                             .Where(item=>item.DeliveryQuantity>0)
                                                             .Sum(item => item.DeliveryQuantity);
                        ret = Facade.StockDelivery.Add(inv_stockDelivery,ref savedDeliveryNo);
                        if (ret > 0)
                        {
                            if (inv_stockDeliveryDetail != null && inv_stockDeliveryDetail.Count > 0)
                            {
                                foreach (inv_StockDeliveryDetail ainv_stockDeliveryDetail in inv_stockDeliveryDetail)
                                {
                                    ainv_stockDeliveryDetail.DeliveryId = ret;
                                    //ainv_stockDeliveryDetail.IsLastDelivery = true;
                                    if (ainv_stockDeliveryDetail.ItemName == null)
                                    {
                                        ainv_stockDeliveryDetail.ItemName = "";
                                    }
                                    if (ainv_stockDeliveryDetail.DeliveryUnitName == null)
                                    {
                                        ainv_stockDeliveryDetail.DeliveryUnitName = "";
                                    }

                                    long sdID = InventoryBLL.Facade.StockDeliveryDetail.Add(ainv_stockDeliveryDetail);
                                    if (serialList != null)
                                    {
                                        var dSerialByItemAttAddId = serialList.Where(x => x.ItemId == ainv_stockDeliveryDetail.ItemId).ToList();
                                        foreach (var deliveryItemSerial in dSerialByItemAttAddId)
                                        {
                                            Facade.inv_PurchaseBillDetailSerialBLL.UpdateDelivered(deliveryItemSerial.PBDetailSerialId, sdID);
                                        }
                                    }

                                }
                            }
                            var data = new
                            {
                                DeliveryId = ret,
                                SavedDeliveryNo = savedDeliveryNo
                            };
                            ts.Complete();
                            return Json(data, JsonRequestBehavior.AllowGet);
                        }
                    }
                    var data2 = new
                    {
                        DeliveryId = 0,
                        SavedDeliveryNo = ""
                    };
                    ts.Complete();
                    return Json(data2, JsonRequestBehavior.AllowGet);                    
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "DeliveryController";
                    new ErrorLogInventoryController().CreateErrorLog(error);

                    return Json(null, JsonRequestBehavior.AllowGet);
                }
               
            }
        }
        public JsonResult GetMaxDeliveryNo(string deliveryDate)
        {
            try
            {
                if (!String.IsNullOrEmpty(deliveryDate))
                {
                    var date = DateTime.ParseExact(deliveryDate, "dd/MM/yyyy", null);
                    var dt = Facade.StockDelivery.GetMaxDeliveryNo(date);
                    return Json(dt, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeliveryController";
                new ErrorLogPosController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDeliveryNoDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.StockDelivery.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeliveryController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetSalesOrderDetailDynamic(int salesOrderId, string orderBy)
        {
            try
            {
                //SOD.SalesOrderId = 30894 AND IWO.IsApproved = 1
                //Goes in SalesOrderDetail
                //string searchCriteria = "SalesOrderId=" + salesOrderId + " AND (C.CategoryName<>'Finished Goods' OR (SOD.[ItemAddAttId] IN (SELECT ItemId FROM pro_ProductionDetail PD INNER JOIN pro_Production P ON P.ProductionId=PD.ProductionId WHERE PD.ItemId=SOD.ItemAddAttId AND P.InternalWorkOrderId=(SELECT TOP 1 InternalWorkOrderId FROM inv_InternalWorkOrder WHERE SalesOrderId=SOD.SalesOrderId)))) AND ( SELECT IsLastDelivery FROM inv_StockDeliveryDetail DD LEFT JOIN inv_StockDelivery D ON D.DeliveryId=DD.DeliveryId WHERE D.OrderId=SOD.SalesOrderId AND DD.ItemId=SOD.ItemAddAttId) = 0";
                string searchCriteria = "SOD.[SalesOrderId]=" + salesOrderId + "AND (IWO.IsApproved=1 )  AND (C.CategoryName<>'Finished Goods' OR (SOD.[ItemAddAttId] IN (SELECT ItemId FROM pro_ProductionDetail PD INNER JOIN pro_Production P ON P.ProductionId=PD.ProductionId WHERE PD.ItemId=SOD.ItemAddAttId AND P.InternalWorkOrderId IN (SELECT InternalWorkOrderId FROM inv_InternalWorkOrder WHERE SalesOrderId=SOD.SalesOrderId )))) ";
                PosBLL.pos_SalesOrderDetailBLL salesOrderDetails = new PosBLL.pos_SalesOrderDetailBLL();
                var list = salesOrderDetails.GetDynamic(searchCriteria, orderBy);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeliveryController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPaged(int startRecordNo, int rowPerPage, string fromDate, string toDate, string wildCard, string sortColumn)
        {
            try
            {

                if (!String.IsNullOrEmpty(startRecordNo.ToString()) && !String.IsNullOrEmpty(fromDate) && !String.IsNullOrEmpty(toDate))
                {
                    string whereClause = "DeliveryDate BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
                    if (!String.IsNullOrEmpty(wildCard.Trim()))
                    {
                        whereClause += " AND DeliveryNo LIKE '%" + wildCard + "%'";
                    }
                    var pbList = new
                    {
                        ListData = Facade.StockDelivery.GetPaged(startRecordNo, rowPerPage, whereClause, sortColumn, "DESC", ref rowPerPage),
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
                error.FileName = "DeliveryController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult CheckDuplicateDeliveryNo(string DeliveryNo, string date)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(DeliveryNo) && !String.IsNullOrWhiteSpace(date))
                {
                    DateTime cDate = DateTime.ParseExact(date, "dd/MM/yyyy", null);

                    Common aCommon = new Common();
                    FiscalYear aFiscalYear = aCommon.GetFiscalFormDateAndToDate(cDate);
                    string formatedDeliveryNo = "DN/" + aFiscalYear.FromDate.Year.ToString().Substring(2, 2) + "-"
                                  + aFiscalYear.ToDate.Year.ToString().Substring(2, 2) + "/" + DeliveryNo;

                    var aDelivery = Facade.StockDelivery.GetDynamic("[DeliveryNo]= '" + formatedDeliveryNo + "'", "[DeliveryDate]");

                    return Json(aDelivery, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeliveryController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int DeliveryUpdateApprove(List<inv_StockDelivery> lstStockDelivery)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                int ret = 0;
                try
                {
                    foreach (inv_StockDelivery item in lstStockDelivery)
                    {
                        ret = Facade.StockDelivery.UpdateApprove(item);                        
                    }
                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "DeliveryController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }

                return ret;
            }
        }

        [HttpGet]
        public JsonResult GetAllDeliveryReport(Int64 DeliveryId)
        {
            try
            {
                var deliveryReportList = Facade.StockDeliveryDetail.xRpt_DeliveryGetByDeliveryId(DeliveryId); //inv_StockDeliveryDetail
                return Json(deliveryReportList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DeliveryController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public JsonResult GetPagedDelivery(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.StockDelivery.GetPaged(startRecordNo, rowPerPage, whereClause, "OrderNo", "DESC", ref rows),
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

    }
}
