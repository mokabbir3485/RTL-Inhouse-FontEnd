using DbExecutor;
using Newtonsoft.Json;
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
using InventoryBLL;
using System.Data;
using PayableEntity;

namespace Security.UI.Controllers
{
    public class SupplierPaymentAndAdjustmentController : Controller
    {
        // GET: SupplierPaymentAndAdjustment
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public Int64 SaveSupplierPayment(proc_SupplierPayment _SupplierPayment,List<proc_SupplierPaymentDetail>proc_SupplierPaymentsdetail)
        {
            Int64 ret = 0;
            _SupplierPayment.UpdatedDate = DateTime.Now;
            //   _SupplierPayment.PBDate = _SupplierPayment.PBDate == null ? DateTime.Now: _SupplierPayment.PBDate;
            //_SupplierPayment.PaymentDate = _SupplierPayment.PaymentDate == null ? DateTime.Now : _SupplierPayment.PaymentDate;

            if (_SupplierPayment.PBDate != null || _SupplierPayment.ChequeDate != null)
            {
             //   _SupplierPayment.ChequeDate = DateTime.Now;
                _SupplierPayment.PBDate = DateTime.Now;
              
            }
            if (_SupplierPayment.PaymentDate == null)
            {
                _SupplierPayment.PaymentDate = DateTime.Now;
            }
            //if (_SupplierPayment.IsCheque==false )
            //{ 
            //    _SupplierPayment.ChequeDate=null;
               
                
            //}

             _SupplierPayment.ChequeDate = _SupplierPayment.IsCheque == false ? null : _SupplierPayment.ChequeDate;
            _SupplierPayment.Remarks = _SupplierPayment.Remarks == null ? "" : _SupplierPayment.Remarks;
            _SupplierPayment.ChequeType = _SupplierPayment.ChequeType == null ? "" : _SupplierPayment.ChequeType;
            _SupplierPayment.ChequeNo = _SupplierPayment.ChequeNo == null ? "" : _SupplierPayment.ChequeNo;
  
            //_SupplierPayment.ChequeDate = _SupplierPayment.ChequeDate ==null? "" : _SupplierPayment.ChequeDate.ToString("")
           
            try
            {
                if (_SupplierPayment.SupplierPaymentId == 0)
                {
                    ret = Facade.proc_SupplierPaymentAndAdjustmentBLL.Add(_SupplierPayment);
                }

                var SupplierPaymentId =ret;

                foreach (var supplierDetail in proc_SupplierPaymentsdetail)
                {
                    supplierDetail.SupplierPaymentId = ret;
                    Facade.proc_SupplierPaymentAndAdjustmentBLL.AddDetail(supplierDetail);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierPaymentAndAdjustmentController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpGet]
        public JsonResult SupplierAdjustmentGetById(Int32 supId)
        {

            try
            {
                var supplierPaymentList = Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierPaymentAdjustmemtGetBySupplierId(supId);
                return Json(supplierPaymentList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierPaymentAndAdjustmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult SupplierAdjustmentDetailGetById(Int32 SPAId)
        {

            try
            {
                var supplierPaymentList = Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierAdjustmentDetailGetById(SPAId);
                return Json(supplierPaymentList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierPaymentAndAdjustmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult SupplierPaymentGetById(Int32 supId)
        {

            try
            {
                var supplierPaymentList = Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierPaymentGetBySupplierId(supId);
                return Json(supplierPaymentList,JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierPaymentAndAdjustmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        

        [HttpPost]
        public Int64 Post(proc_SupplierPaymentAdjustment proc_SupplierPaymentAdjustment, List<proc_SupplierPaymentAdjustmentDetail> proc_SupplierPaymentAdjustmentDetail)
        {

            if (proc_SupplierPaymentAdjustment.Remarks == null) { proc_SupplierPaymentAdjustment.Remarks = ""; }

            proc_SupplierPaymentAdjustment.JVNo = null;

            Int64 ret = 0;
            Int64 SPAId = 0;
            if (proc_SupplierPaymentAdjustment.SPADate !=null)
            {
                proc_SupplierPaymentAdjustment.SPADate = DateTime.Now;
            }
            SPAId = proc_SupplierPaymentAdjustment.SPAId;
            try
             {
                if (proc_SupplierPaymentAdjustment.SPAId == 0)
                {
                    //proc_SupplierPaymentAdjustment.UpdatedBy = proc_SupplierPaymentAdjustment.UpdatedBy;
                    proc_SupplierPaymentAdjustment.UpdatedDate = DateTime.Now;
                    ret = Facade.proc_SupplierPaymentAndAdjustmentBLL.Post(proc_SupplierPaymentAdjustment);

                    if (proc_SupplierPaymentAdjustmentDetail != null)
                    {
                        foreach (var AdjustmentDetail in proc_SupplierPaymentAdjustmentDetail)
                        {
                            AdjustmentDetail.SPAId = Convert.ToInt64(ret);
                            Facade.proc_SupplierPaymentAndAdjustmentBLL.PostDetail(AdjustmentDetail);

                        }
                    }


                }
                else
                {
                    proc_SupplierPaymentAdjustment.UpdatedDate = DateTime.Now;
                    ret = Facade.proc_SupplierPaymentAndAdjustmentBLL.Post(proc_SupplierPaymentAdjustment);
                    if (proc_SupplierPaymentAdjustmentDetail != null)
                    {
                        SPAId = Convert.ToInt64(ret);
                        Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierPaymentAdjustmentDetailDeleteBySPAId(SPAId);
                        //Facade.inv_BillOfMaterialBLL.DeleteDetailByBOMId(ret);
                        foreach (var AdjustmentDetail in proc_SupplierPaymentAdjustmentDetail)
                        {
                            AdjustmentDetail.SPADetailId = 0;
                            AdjustmentDetail.SPAId = Convert.ToInt64(ret);
                            Facade.proc_SupplierPaymentAndAdjustmentBLL.PostDetail(AdjustmentDetail);
                        }
                    }


                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierPaymentAndAdjustmentController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetSupplierPaymentAdjustmentPaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.proc_SupplierPaymentAndAdjustmentBLL.GetPaged(startRecordNo, rowPerPage, whereClause, "SPAId", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SupplierPaymentAndAdjustmentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult GetSupplierPaymentGetPaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.proc_SupplierPaymentAndAdjustmentBLL.proc_SupplierPayment_GetPaged(startRecordNo, rowPerPage, whereClause, "ChequeNo", "desc", ref rows),
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

        [HttpGet]
        public JsonResult GetAllSupplierLedger(int supplierId, string formDate, string toDate)
        {
            try
            {
                if (supplierId==0)
                {
                    var AllsupplierLedger = Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierLedger_Get(supplierId, formDate, toDate);
                    return Json(AllsupplierLedger, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var supplierLedger = Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierLedger_Get(supplierId, formDate, toDate);
                    return Json(supplierLedger, JsonRequestBehavior.AllowGet);
                }
             
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




        //[HttpGet]

        //public JsonResult SupplierAdjustmentDetailGetById(Int32 SPAId)
        //{

        //    try
        //    {
        //        var supplierPaymentList = Facade.proc_SupplierPaymentAndAdjustmentBLL.SupplierAdjustmentDetailGetById(SPAId);
        //        return Json(supplierPaymentList, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "SupplierPaymentAndAdjustmentController";
        //        new ErrorLogController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }
        //}
    }
}

