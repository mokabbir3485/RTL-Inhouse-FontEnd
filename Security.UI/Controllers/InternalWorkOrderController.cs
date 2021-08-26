using Security.UI.Controllers;
using InventoryBLL;
using InventoryEntity;
using System;
using System.Web.Mvc;
using DbExecutor;
using System.Collections.Generic;
using PosEntity;
using System.IO;

namespace Security.UI
{
    public class InternalWorkOrderController : Controller
    {
        /// <summary>
        /// ///////////
        /// </summary>
        /// <returns></returns>
        public JsonResult GetBy_inv_CIFProductReports(Int64 CompanyId, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                var iwolist = Facade.inv_InternalWorkOrderBLL.GetBy_inv_CIFProductReports(CompanyId, startDate, endDate);
                return Json(iwolist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBy_inv_CIFCustomerReports(Int64 CompanyId)
        {
            try
            {
                var iwolist = Facade.inv_InternalWorkOrderBLL.GetBy_inv_CIFCustomerReports(CompanyId);
                return Json(iwolist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// //////////////
        /// </summary>
        /// <returns></returns>

        public JsonResult GetAllInternalWorkOrder()
        {
            try
            {
                var iwolist = Facade.inv_InternalWorkOrderBLL.GetAll();
                return Json(iwolist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetInternalWorkOrderDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.inv_InternalWorkOrderBLL.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult inv_InternalWorkOrder_ForProduction()
        {
            try
            {
                var list = Facade.inv_InternalWorkOrderBLL.inv_InternalWorkOrder_ForProduction();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 Save(inv_InternalWorkOrder inv_InternalWorkOrder, List<inv_InternalWorkOrderDetail> inv_InternalWorkOrderDetailList)
        {          
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                inv_InternalWorkOrder.InternalWorkOrderDate = DateTime.Now;

                long ret = 0;                
                inv_InternalWorkOrder.InternalWorkOrderNo = inv_InternalWorkOrder.InternalWorkOrderNo == null ? "" : inv_InternalWorkOrder.InternalWorkOrderNo;
                inv_InternalWorkOrder.Remarks = inv_InternalWorkOrder.Remarks == null ? "" : inv_InternalWorkOrder.Remarks;

                inv_InternalWorkOrder.CreateDate = DateTime.Now;
                inv_InternalWorkOrder.UpdateDate = DateTime.Now;
                try
                {
                    if (inv_InternalWorkOrder.InternalWorkOrderId==0)
                    {
                        ret = Facade.inv_InternalWorkOrderBLL.Add(inv_InternalWorkOrder);
                    }
                    else
                    {
                       Facade.inv_InternalWorkOrderBLL.Update(inv_InternalWorkOrder);
                    }
                 
                    if (inv_InternalWorkOrderDetailList != null && inv_InternalWorkOrderDetailList.Count > 0)
                    {
                        foreach (inv_InternalWorkOrderDetail inv_InternalWorkOrderDetail in inv_InternalWorkOrderDetailList)
                        {


                            //inv_InternalWorkOrderDetail.InternalWorkOrderId=inv_InternalWorkOrder.InternalWorkOrderId;

                            if (String.IsNullOrEmpty(inv_InternalWorkOrderDetail.DetailRemarks))
                            {
                                inv_InternalWorkOrderDetail.DetailRemarks = "";
                            }
                            inv_InternalWorkOrderDetail.RollDirection = inv_InternalWorkOrderDetail.RollDirection == null ? "" : inv_InternalWorkOrderDetail.RollDirection;

                          

                            if (inv_InternalWorkOrderDetail.InternalWorkOrderDetailId==0)
                            {
                                inv_InternalWorkOrderDetail.InternalWorkOrderId = ret;
                                InventoryBLL.Facade.inv_InternalWorkOrderDetailBLL.Add(inv_InternalWorkOrderDetail);

                                pos_SalesOrderDetail soDetail = new pos_SalesOrderDetail();
                                soDetail.SalesOrderId = inv_InternalWorkOrder.SalesOrderId;
                                soDetail.ItemAddAttId = inv_InternalWorkOrderDetail.FinishedItemId;
                                soDetail.OrderQty = inv_InternalWorkOrderDetail.OrderQty;
                                soDetail.SalesOrderDetailId = inv_InternalWorkOrderDetail.SalesOrderDetailId;

                                PosBLL.Facade.pos_SalesOrderDetailBLL.UpdateOrderQty(soDetail);
                            }
                            else
                            {
                               Facade.inv_InternalWorkOrderDetailBLL.Update(inv_InternalWorkOrderDetail);

                                pos_SalesOrderDetail soDetail = new pos_SalesOrderDetail();
                                soDetail.SalesOrderId = inv_InternalWorkOrder.SalesOrderId;
                                soDetail.ItemAddAttId = inv_InternalWorkOrderDetail.FinishedItemId;
                                soDetail.OrderQty = inv_InternalWorkOrderDetail.OrderQty;
                                soDetail.SalesOrderDetailId = inv_InternalWorkOrderDetail.SalesOrderDetailId;
                              //  soDetail.SalesOrderId = inv_InternalWorkOrderDetail.InternalWorkOrderId;
                             

                                PosBLL.Facade.pos_SalesOrderDetailBLL.UpdateOrderQty(soDetail);
                            }
                        }
                    }
                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "InternalWorkOrderController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }
        public JsonResult GetConfirmationMessageForAdmin()
        {
            try
            {
                var ConfirmationMessageForAdmin = System.Configuration.ConfigurationManager.AppSettings["ConfirmationMessageForAdmin"].ToString();
                return Json(ConfirmationMessageForAdmin, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetExpairDate(DateTime date)
        {
            int daysCount = 0;
            DateTime myDate = new DateTime(date.Year, date.Month, date.Day + 1);
            while (daysCount < 30)
            {
                if (myDate.DayOfWeek != DayOfWeek.Saturday && myDate.DayOfWeek != DayOfWeek.Friday)
                {
                    daysCount++;
                }
                myDate = myDate.AddDays(1);
            }
            var x = myDate.AddDays(-1).ToString("dd/MM/yyyy");
            return Json(x, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetMaxInternalWorkerNo(string deliveryDate)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(deliveryDate))
                {
                    var date = DateTime.ParseExact(deliveryDate, "dd/MM/yyyy", null);
                    var maxNumber = InventoryBLL.Facade.inv_InternalWorkOrderBLL.GetMaxInternalWorkerNo(date);

                    return Json(maxNumber, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult CheckDuplicateIWO(string InternalWorkOrderNo, string date)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(InternalWorkOrderNo) && !String.IsNullOrWhiteSpace(date))
                {
                    DateTime cDate = DateTime.ParseExact(date, "dd/MM/yyyy", null);

                    Common aCommon = new Common();
                    FiscalYear aFiscalYear = aCommon.GetFiscalFormDateAndToDate(cDate);
                    string formatedIWONo = "IWO/" + aFiscalYear.FromDate.Year.ToString().Substring(2, 2) + "-"
                                  + aFiscalYear.ToDate.Year.ToString().Substring(2, 2) + "/" + InternalWorkOrderNo;

                    var internalWorkOrder = InventoryBLL.Facade.inv_InternalWorkOrderBLL.GetDynamic("[InternalWorkOrderNo]= '" + formatedIWONo + "'", " [InternalWorkOrderDate]");

                    return Json(internalWorkOrder, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetInternalWorkOrderDetailByInternalWorkOrderId(int internalWorkId)
        {
            try
            {
                var getInternalWorkOrder = InventoryBLL.Facade.inv_InternalWorkOrderDetailBLL.GetByInternalWorkOrderId(internalWorkId);
                return Json(getInternalWorkOrder, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetInternalWorkOrderDetailByInternalWorkOrderIdForRequisition(int internalWorkId)
        {
            try
            {
                var getInternalWorkOrder = InventoryBLL.Facade.inv_InternalWorkOrderDetailBLL.GetByInternalWorkOrderIdForRequisition(internalWorkId);
                return Json(getInternalWorkOrder, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetInternalWorkOrderDetailByInternalWorkOrderIdForProduction(int internalWorkId)
        {
            try
            {
                var getInternalWorkOrder = InventoryBLL.Facade.inv_InternalWorkOrderDetailBLL.GetByInternalWorkOrderIdForProduction(internalWorkId);
                return Json(getInternalWorkOrder, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "InternalWorkOrderController";
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
                    string whereClause = "InternalWorkOrderDate BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
                    if (!String.IsNullOrEmpty(wildCard.Trim()))
                    {
                        whereClause += " AND InternalWorkOrderNo LIKE '%" + wildCard + "%'";
                    }
                    var pbList = new
                    {
                        ListData = Facade.inv_InternalWorkOrderBLL.GetPaged(startRecordNo, rowPerPage, whereClause, sortColumn, "DESC", ref rowPerPage),
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
                error.FileName = "InternalWorkOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetPagedIWO(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.inv_InternalWorkOrderBLL.GetPaged(startRecordNo, rowPerPage, whereClause, "InternalWorkOrderNo", "DESC", ref rows),
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