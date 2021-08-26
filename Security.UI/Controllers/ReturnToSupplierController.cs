using System;
using System.Web.Mvc;
using InventoryEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ReturnToSupplierController : Controller
    {
        public JsonResult GetSearchResult(string searchCriteria)
        {
            try
            {
                string orderBy = "ReceiveNo";
                var list = InventoryBLL.Facade.StockReceive.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplier";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetReturnToSupplierById(Int64 id)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnToSupplier.GetAll(id);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplierController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetReturnToSupplierDetailById(Int64 id)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnToSupplierDetail.GetByReturnId(id);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplierController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllReturnToSupplierDetailAdAttributeByReturnToSupplierDetailId(Int64 returnToSupplierDetailId)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnToSupplierDetailAdAttribute.GetByReturnDetailId(returnToSupplierDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplier";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);

            }
        }

        public JsonResult GetAllReturnToSupplierAdAttributeDetailByReturnToSupplierAddAttId(Int64 returnToSupplierDetailAddattId)
        {
            try
            {
                var list = InventoryBLL.Facade.ReturnToSupplierDetailAdAttributeDetail.GetByReturnDetailAdAttId(returnToSupplierDetailAddattId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplier";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);

            }
        }



        
        public JsonResult GetAllReturnReason()
        {
            try
            {
                var list = SecurityBLL.Facade.ReturnReason.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplier";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 SaveReturnToSupplier(inv_ReturnToSupplier returnToSupplier)
        {
            Int64 ret = 0;
            returnToSupplier.CreateDate = DateTime.Now;
            returnToSupplier.UpdateDate = DateTime.Now;

            //  returnToSupplier.CreatorId = 1;
            //  returnToSupplier.UpdatorId = 1;
            //Approved data
            //returnToSupplier.IsApproved = true;
            // returnToSupplier.ApprovedBy = 1;
            // returnToSupplier.ApprovedDate = DateTime.Now;

            if (returnToSupplier.Remarks == null)
                returnToSupplier.Remarks = "";
            if (returnToSupplier.ReturnBy == null)
                returnToSupplier.ReturnBy = "";
            try
            {
                //ret = 1;
                ret = InventoryBLL.Facade.ReturnToSupplier.Add(returnToSupplier);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplier";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public Int64 SaveReturnToSupplierDetail(inv_ReturnToSupplierDetail returnToSupplierDetail, int returnId)
        {
            Int64 ret = 0;
            try
            {
                //if (inv_PurchaseBillDetail == null)
                //    stockReceiveDetail.FreeUnitName = "";
                returnToSupplierDetail.ReturnId = returnId;
                //ret = 14;
                ret = InventoryBLL.Facade.ReturnToSupplierDetail.Add(returnToSupplierDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplier";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public Int64 SaveReturnToSupplierrDetailAdAttribute(inv_ReturnToSupplierDetailAdAttribute _inv_ReturnToSupplierDetailAdAttribute)
        {
            Int64 ret = 0;
            try
            {
                ret = InventoryBLL.Facade.ReturnToSupplierDetailAdAttribute.Add(_inv_ReturnToSupplierDetailAdAttribute);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplierController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public Int64 SaveReturnToSupplierAdAttributeDetail(inv_ReturnToSupplierDetailAdAttributeDetail _inv_ReturnToSupplierDetailAdAttributeDetail)
        {
            Int64 ret = 0;
            try
            {
                if (_inv_ReturnToSupplierDetailAdAttributeDetail.AttributeValue == null)
                    _inv_ReturnToSupplierDetailAdAttributeDetail.AttributeValue = "";
                ret = InventoryBLL.Facade.ReturnToSupplierDetailAdAttributeDetail.Add(_inv_ReturnToSupplierDetailAdAttributeDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ReturnToSupplierController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        //public JsonResult GetStockReceiveDetailAdAttributeByDetailId(Int64 reciveDetailId)
        //{
        //    try
        //    {
        //        var list = InventoryBLL.Facade.StockReceiveDetailAdAttribute.GetBySRDetailId(reciveDetailId);
        //        return Json(list, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "ReturnToSupplier";
        //        new ErrorLogInventoryController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //public JsonResult GetStockReceiveDetailAdAttributeDetailByAddAttId(Int64 reciveDetaiAddAttlId)
        //{
        //    try
        //    {
        //        var list = InventoryBLL.Facade.StockReceiveDetailAdAttributeDetail.GetBySRDetailAdAttId(reciveDetaiAddAttlId);
        //        return Json(list, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "ReturnToSupplier";
        //        new ErrorLogInventoryController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }
        //}

    }
}