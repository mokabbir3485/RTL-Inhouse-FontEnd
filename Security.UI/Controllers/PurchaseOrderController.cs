using System;
using System.Web.Mvc;
using InventoryEntity;
using InventoryBLL;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class PurchaseOrderController : Controller
    {
        //
        // GET: /PurchaseOrder/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public int SavePurchaseOrder(inv_PurchaseOrder inv_PurchaseOrder)
        {
            int ret = 0;
            inv_PurchaseOrder.CreateDate = DateTime.Now;
            inv_PurchaseOrder.UpdateDate = DateTime.Now;

            if (inv_PurchaseOrder.ShipmentInfo == null)
                inv_PurchaseOrder.ShipmentInfo = "";
            if (inv_PurchaseOrder.Remarks == null)
                inv_PurchaseOrder.Remarks = "";
            try
            {
                //ret = 8;
                ret = InventoryBLL.Facade.PurchaseOrder.Add(inv_PurchaseOrder);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int UpdatePurchaseOrder(inv_PurchaseOrder inv_PurchaseOrder)
        {
            int ret = 0;
            inv_PurchaseOrder.CreateDate = DateTime.Now;
            inv_PurchaseOrder.UpdateDate = DateTime.Now;

            if (inv_PurchaseOrder.ShipmentInfo == null)
                inv_PurchaseOrder.ShipmentInfo = "";
            if (inv_PurchaseOrder.Remarks == null)
                inv_PurchaseOrder.Remarks = "";
            try
            {
                //ret = 8;
                ret = InventoryBLL.Facade.PurchaseOrder.Update(inv_PurchaseOrder);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SavePurchaseOrderDetail(inv_PurchaseOrderDetail inv_PurchaseOrderDetail, int pOId)
        {
            int ret = 0;
            try
            {
                //if (inv_PurchaseBillDetail == null)
                //    stockReceiveDetail.FreeUnitName = "";
                inv_PurchaseOrderDetail.POId = pOId;
                //ret = 14;
                ret = InventoryBLL.Facade.PurchaseOrderDetail.Add(inv_PurchaseOrderDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
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
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        //SavePODetailAdAttribute
        [HttpPost]
        public int SavePurchaseOrderDetailAdAttribute(inv_PurchaseOrderDetailAdAttribute inv_PurchaseOrderDetailAdAttribute, int pODetailId)
        {
            int ret = 0;
            try
            {
                inv_PurchaseOrderDetailAdAttribute.PODetailId = pODetailId;
                // ret = 1;
                ret = InventoryBLL.Facade.PurchaseOrderDetailAdAttribute.Add(inv_PurchaseOrderDetailAdAttribute);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SavePurchaseOrderDetailAdAttributeDetail(inv_PurchaseOrderDetailAdAttributeDetail inv_PurchaseOrderDetailAdAttributeDetail, int pODetailAdAttId)
        {
            int ret = 0;
            try
            {
                inv_PurchaseOrderDetailAdAttributeDetail.PODetailAdAttId = pODetailAdAttId;
                if (inv_PurchaseOrderDetailAdAttributeDetail.AttributeValue == null)
                    inv_PurchaseOrderDetailAdAttributeDetail.AttributeValue = "";
                ret = InventoryBLL.Facade.PurchaseOrderDetailAdAttributeDetail.Add(inv_PurchaseOrderDetailAdAttributeDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
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
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAllPO(int? poId = null)
        {
            try
            {
                var list = Facade.PurchaseOrder.GetAll(poId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTopPOForPurchaseBill(int top)
        {
            try
            {
                var list = Facade.PurchaseOrder.GetTopForPurchaseBill(top);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetPOById(int id)
        {
            try
            {
                var list = Facade.PurchaseOrder.GetById(id);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPurchaseOrderDetailByPOId(Int64 POId)
        {
            try
            {
                var list = Facade.PurchaseOrderDetail.GetByPOId(POId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPurchaseOrderDetailAdAttributeByPODetailId(int PODetailId)
        {
            try
            {
                var list = Facade.PurchaseOrderDetailAdAttribute.GetByPODetailId(PODetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetPurchaseOrderDetailAdAttributeDetailByPODetailAdAttId(Int64 PODetailAdAttId)
        {
            try
            {
                var list = Facade.PurchaseOrderDetailAdAttributeDetail.GetByPODetailAdAttId(PODetailAdAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetPurchaseOrderDetailAdAttributeDetailByPODetailAdAttIdAndItemAddAttId(Int64 pODetailAdAttId, Int32 itemAddAttId)
        {
            try
            {
                var list = Facade.PurchaseOrderDetailAdAttributeDetail.GetByPODetailAdAttIdAndItemAddAttId(pODetailAdAttId, itemAddAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int CancelPurchaseOrder(int POId)
        {
            int ret = 0;
            try
            {
                ret = InventoryBLL.Facade.PurchaseOrder.Delete(POId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpGet]
        public JsonResult Get_Mushak6_1(int PBId)
        {
            try
            {
                var list = Facade.PurchaseBill.Get_Mushak6_1(PBId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult Get_Mushak6_2(int PBId)
        {
            try
            {
                var list = Facade.PurchaseBill.Get_Mushak6_2(PBId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseOrderController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

    }
}