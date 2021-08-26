using DbExecutor;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using InventoryBLL;

namespace Security.UI.Controllers
{
    public class ReceiveController : Controller
    {
        #region Get

        public JsonResult GetHasPB()
        {
            try
            {
                var hasPB = System.Configuration.ConfigurationManager.AppSettings["HasPB"].ToString(); ;
                return Json(hasPB, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetHasFreeQtyInReceive()
        {
            try
            {
                var FreeQtyInReceive = System.Configuration.ConfigurationManager.AppSettings["FreeQtyInReceive"].ToString();
                return Json(FreeQtyInReceive, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPriceInReceive()
        {
            try
            {
                var hasPB = System.Configuration.ConfigurationManager.AppSettings["PriceInReceive"].ToString(); ;
                return Json(hasPB, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTopPBByNumber(int number)
        {
            try
            {
                var pbList = InventoryBLL.Facade.PurchaseBill.GetTopForReceive(number);
                return Json(pbList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPBByQty(int qty)
        {
            try
            {
                var pbList = InventoryBLL.Facade.PurchaseBill.GetTopForReceive(qty);
                return Json(pbList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetLocalPBByQty(int qty)
        {
            try
            {
                var pbList = InventoryBLL.Facade.PurchaseBill.GetTopForLocalReceive(qty);
                return Json(pbList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPBDetail(Int64 PBId)
        {
            try
            {
                var pbDetailList = InventoryBLL.Facade.PurchaseBillDetail.GetByPBId(PBId);
                return Json(pbDetailList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetItemAdditionalAttributeValueByItemAddAttId(int itemAddAttId)
        {
            try
            {
                var list = SecurityBLL.Facade.ItemAdditionalAttributeValue.GetByItemAddAttId(itemAddAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTopReceiveForReturn(string whereCondition, string topQty)
        {
            try
            {
                var list = InventoryBLL.Facade.StockReceive.GetTopForReturn(whereCondition, topQty);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetReceiveById(Int64 srId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockReceive.GetById(srId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public int UpdateStockReceive(inv_StockReceive stockReceive)
        {
            stockReceive.CreateDate = DateTime.Now;
            stockReceive.UpdateDate = DateTime.Now;
            if (stockReceive.PONo == null)
                stockReceive.PONo = "";
            if (stockReceive.PBNo == null)
                stockReceive.PBNo = "";
            if (stockReceive.Remarks == null)
                stockReceive.Remarks = "";

            int ret = 0;

            try
            {
                ret = InventoryBLL.Facade.StockReceive.Update(stockReceive);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetItemAdditionalAttributeOperationalByItemId(int itemId)
        {
            try
            {
                var list = SecurityBLL.Facade.ItemAdditionalAttribute.GetOperationalByItemId(itemId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPurchaseBillDetailAdAttributeByPBDetailId(int pBDetailId)
        {
            try
            {
                var list = InventoryBLL.Facade.PurchaseBillDetailAdAttribute.GetByPBDetailId(pBDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPurchaseBillDetailAdAttributeDetailByPBDetailAdAttId(int pBDetailAdAttId)
        {
            try
            {
                var list = InventoryBLL.Facade.PurchaseBillDetailAdAttributeDetail.GetByPBDetailAdAttId(pBDetailAdAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetReceiveDynamic(string whereCondition)
        {
            try
            {
                var list = InventoryBLL.Facade.StockReceive.GetDynamic(whereCondition, "");
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetMaxStockReciveIdByDate(string stockReciveDate)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(stockReciveDate))
                {
                    var date = DateTime.ParseExact(stockReciveDate, "dd/MM/yyyy", null);
                    var maxNumber = InventoryBLL.Facade.StockReceive.GetMaxStockReciveIdByDate(date);

                    return Json(maxNumber, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult CheckDuplicateSRNo(string ReceiveNo, string date)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(ReceiveNo) && !String.IsNullOrWhiteSpace(date))
                {
                    DateTime cDate = DateTime.ParseExact(date, "dd/MM/yyyy", null);

                    Common aCommon = new Common();
                    FiscalYear aFiscalYear = aCommon.GetFiscalFormDateAndToDate(cDate);
                    string formatedPBNo = "SR/" + aFiscalYear.FromDate.Year.ToString().Substring(2, 2) + "-"
                                  + aFiscalYear.ToDate.Year.ToString().Substring(2, 2) + "/" + ReceiveNo;

                    var stockRecive = InventoryBLL.Facade.StockReceive.GetDynamic("[ReceiveNo]= '" + formatedPBNo + "'", " [ReceiveDate]");

                    return Json(stockRecive, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region Post

        [HttpPost]

        public Int64 StockSave(inv_StockReceive stockReceive, List<inv_StockReceiveDetail> stockReceiveDetailLst, List<inv_PurchaseBillDetailSerial> serialList,List<inv_LocalPurchaseBillDetailSerial>localSerialList)
        {
            Int64 ret = 0;
            try
            {
                stockReceive.ReceiveDate = DateTime.Now;
                stockReceive.CreateDate = DateTime.Now;
                stockReceive.ApprovedDate = DateTime.Now;
                stockReceive.UpdateDate = DateTime.Now;
               // stockReceive.PBNo = stockReceive.PBNo == null ? "" : stockReceive.PBNo;
                stockReceive.PONo = stockReceive.PONo == null ? "" : stockReceive.PONo;
                stockReceive.LotNo = stockReceive.LotNo == null ? "" : stockReceive.LotNo;
                stockReceive.ChallanNo = stockReceive.PBNo;
               // stockReceive.ReceiveNo = stockReceive.ReceiveNo == null ? "" : stockReceive.ReceiveNo;
                stockReceive.Remarks = stockReceive.Remarks == null ? "" : stockReceive.Remarks;
                stockReceive.DepartmentName = stockReceive.DepartmentName == null ? "" : stockReceive.DepartmentName;
                stockReceive.ReceivedBy = stockReceive.ReceivedBy == null ? "" : stockReceive.ReceivedBy;
                //stockReceive.TotalReceiveQty = 0;
                stockReceive.TotalReceiveQty = stockReceiveDetailLst
                                               .Where(item => item.SRQuantity > 0)
                                               .Sum(item => item.SRQuantity);
                //, ref tring savedReceiveNo
                ret = Facade.StockReceive.StockRCAdd(stockReceive);

                if (ret > 0)
                {
                    if (stockReceiveDetailLst != null && stockReceiveDetailLst.Count > 0)
                    {
                        foreach (inv_StockReceiveDetail ainv_StockReceiveDetail in stockReceiveDetailLst)
                        {
                            if (ainv_StockReceiveDetail.SRQuantity > 0)
                            {
                                ainv_StockReceiveDetail.SRId = ret;
                                ainv_StockReceiveDetail.SRUnitId = 1; 
                                Facade.StockReceiveDetail.Add(ainv_StockReceiveDetail);
                            }
                        }
                    }
                    if (serialList != null)
                    {      
                        foreach (var serial in serialList)
                        {
                                Facade.inv_PurchaseBillDetailSerialBLL.UpdateDepartment(serial.PBDetailSerialId, serial.DepartmentId);
                        }    
                    }
                    if (localSerialList !=null)
                    {
                        foreach (var LocalSerial in localSerialList)
                        {
                            Facade.inv_PurchaseBillDetailSerialBLL.LocalUpdateDepartment(LocalSerial.LPBDetailSerialId, LocalSerial.DepartmentId);
                        }
                    }
                   

                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReceiveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
             
            }
            return ret;
        }

        [HttpPost]
        public ActionResult SaveStockReceive(inv_StockReceive stockReceive, List<inv_StockReceiveDetail> stockReceiveDetailLst, List<inv_PurchaseBillDetailSerial> serialList)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                Int64 ret = 0;
                try
                {
                    stockReceive.CreateDate = DateTime.Now;
                    stockReceive.UpdateDate = DateTime.Now;
                    stockReceive.ApprovedDate = DateTime.Now;
                    stockReceive.ReceiveDate = DateTime.Now;
                
                    if (stockReceive.PONo == null)
                        stockReceive.PONo = "";
                    if (stockReceive.PBNo == null)
                        stockReceive.PBNo = "";
                    if (stockReceive.ChallanNo == null)
                        stockReceive.ChallanNo = "";
                    if (stockReceive.Remarks == null)
                        stockReceive.Remarks = "";

                    stockReceive.PBNo = stockReceive.PBNo == null ? "" : stockReceive.PBNo;
                    stockReceive.PONo = stockReceive.PONo == null ? "" : stockReceive.PONo;
                    stockReceive.LotNo = stockReceive.LotNo == null ? "" : stockReceive.LotNo;
                    stockReceive.ChallanNo = stockReceive.ChallanNo == null ? "" : stockReceive.ChallanNo;
                    stockReceive.ReceiveNo = stockReceive.ReceiveNo == null ? "" : stockReceive.ReceiveNo;
                    stockReceive.Remarks = stockReceive.Remarks == null ? "" : stockReceive.Remarks;
                    stockReceive.DepartmentName = stockReceive.DepartmentName == null ? "" : stockReceive.DepartmentName;
                    stockReceive.ReceivedBy = stockReceive.ReceivedBy == null ? "" : stockReceive.ReceivedBy;
                   // stockReceive.IsApproved = stockReceive.IsApproved == 0 ? 1 : stockReceive.IsApproved;
                    stockReceive.SupplierId = 0;
                   // stockReceive.ApprovedDate = stockReceive.ApprovedDate == null ? "" : stockReceive.ApprovedDate.ToShortDateString("");

                    if (stockReceive.SRId == 0)
                    {
                        string savedReceiveNo = "";
                        stockReceive.TotalReceiveQty = stockReceiveDetailLst
                                                .Where(item => item.SRQuantity > 0)
                                                .Sum(item => item.SRQuantity);
                        //, ref tring savedReceiveNo
                        ret =Facade.StockReceive.Add(stockReceive,ref savedReceiveNo);
                        if (ret > 0)
                        {
                            if (stockReceiveDetailLst != null && stockReceiveDetailLst.Count > 0)
                            {
                                foreach (inv_StockReceiveDetail ainv_StockReceiveDetail in stockReceiveDetailLst)
                                {
                                    if (ainv_StockReceiveDetail.SRQuantity > 0)
                                    {
                                        ainv_StockReceiveDetail.SRId = ret;
                                        ainv_StockReceiveDetail.SRUnitId = 1;
                                       Facade.StockReceiveDetail.Add(ainv_StockReceiveDetail);
                                    }
                                }
                            }

                        }
                        if (serialList != null)
                        {
                            foreach (var serial in serialList)
                            {
                              Facade.inv_PurchaseBillDetailSerialBLL.UpdateDepartment(serial.PBDetailSerialId, serial.DepartmentId);
                            }
                        }
                        var data = new
                        {
                            SRId = ret,
                            StockReciveNo = savedReceiveNo
                        };
                        ts.Complete();
                        return Json(data, JsonRequestBehavior.AllowGet);
                    }
                    ts.Complete();
                    var data2 = new
                    {
                        SRId = 0,
                        StockReciveNo = ""
                    };
                    return Json(data2, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "ReceiveController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                    var data3 = new
                    {
                        SRId = 0,
                        StockReciveNo = ""
                    };
                    return Json(data3, JsonRequestBehavior.AllowGet);
                }
            }
        }

        #endregion

    }
}