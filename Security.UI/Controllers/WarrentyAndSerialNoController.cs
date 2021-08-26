using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Security.UI.Controllers;
using SecurityEntity;
using System.Web.Mvc;
using DbExecutor;
using InventoryBLL;
using InventoryEntity;
using InventoryDAL;

namespace Security.UI.Controllers
{
    public class WarrentyAndSerialNoController : Controller
    {
        // GET: /WarrentyAndSerialNo/
        public ActionResult Index()
        {
            return View();
        }
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 SaveWarrantyAndSerialNo(List<inv_PurchaseBillDetailSerial> inv_PurchaseBillDetailSerial,List<inv_LocalPurchaseBillDetailSerial>inv_localDetailseriallist)
        {
            Int64 ret = 0;
            //foreach (var inv_PurchaseBill in inv_PurchaseBillDetailSerial)
            //{
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {

                    try
                    {
                        if (inv_PurchaseBillDetailSerial !=null)
                        {
                            foreach (var inv_PurchaseBill in inv_PurchaseBillDetailSerial)
                            {

                                if (inv_PurchaseBill.PBDetailSerialId == 0 )
                                {
                                    if (InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.Add(inv_PurchaseBill) > 0)
                                    {
                                        ret++;
                                    }
                                }
                            }
                        }

                        if (inv_localDetailseriallist !=null)
                        {
                            foreach (var localSerialList in inv_localDetailseriallist)
                            {
                                if (localSerialList.LPBDetailSerialId == 0)
                                {
                                    if (InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.AddForLocalPurchaseBill(localSerialList) > 0)
                                    {
                                        ret++;
                                    }
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
                        error.FileName = "WarrentyAndSerialNoController";
                        new ErrorLogInventoryController().CreateErrorLog(error);
                    }
                }
            //}
            return ret;
        }
        [HttpPost]
        public Int64 UpdateWarrantyAndSerialNo(List<inv_PurchaseBillDetailSerial> _inv_PurchaseBillDetailSerial)
        {
            Int64 ret = 0;
            //using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            //{

                try
                {
                    if (_inv_PurchaseBillDetailSerial != null)
                    {
                        foreach (var ainv_WarrentyAndSerialNo in _inv_PurchaseBillDetailSerial)
                        {

                        InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.Update(ainv_WarrentyAndSerialNo);
                                

                        };
                    }

                    //ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "WarrentyAndSerialNoController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
            //}
            //}
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
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
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetWarrantyAndSerialNoDynamic(List<inv_PurchaseBillDetailSerial> pPurchaseBillDetailSerialList)
        {
            try
            {
                inv_PurchaseBillDetailSerial aPurchaseBillDetailSerial = new inv_PurchaseBillDetailSerial();
                foreach (var item in pPurchaseBillDetailSerialList)
                {
                    var criteria = " [SerialNo]='" + item.SerialNo + "' And [ItemId]=" + item.ItemId;
                    if (item.PBDetailSerialId > 0)
                        criteria += " AND PBDetailSerialId<>" + item.PBDetailSerialId;
                    var list = InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.GetDynamic(criteria, "SerialNo");
                    if (list.Count > 0)
                    {
                        aPurchaseBillDetailSerial = item;
                        break;
                    }

                }
                return Json(aPurchaseBillDetailSerial, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetLocalWarrantyAndSerialNoDynamic(List<inv_LocalPurchaseBillDetailSerial> pPurchaseBillDetailSerialList)
        {
            try
            {
                inv_LocalPurchaseBillDetailSerial aPurchaseBillDetailSerial = new inv_LocalPurchaseBillDetailSerial();
                foreach (var item in pPurchaseBillDetailSerialList)
                {
                    var criteria = " [SerialNo]='" + item.SerialNo + "' And [ItemId]=" + item.ItemId;
                    if (item.LPBDetailSerialId > 0)
                        criteria += " AND LPBDetailSerialId<>" + item.LPBDetailSerialId;
                    var list = InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.LocalGetDynamic(criteria, "SerialNo");
                    if (list.Count > 0)
                    {
                        aPurchaseBillDetailSerial = item;
                        break;
                    }

                }
                return Json(aPurchaseBillDetailSerial, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetWarrantyAndSerialNoDynamicForSingle(string whereCondition)
        {
            
            try
            {
                var list = InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.GetDynamic(whereCondition, "SerialNo");
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetLocalWarrantyAndSerialNoDynamicForSingle(string whereCondition)
        {

            try
            {
                var list = InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.LocalGetDynamic(whereCondition, "SerialNo");
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdateDepartment(List<inv_PurchaseBillDetailSerial> serialList)
        {
            if (serialList != null)
            {
                var rowInserted = 0;
                foreach (var serial in serialList)
                {
                    if (Facade.inv_PurchaseBillDetailSerialBLL.UpdateDepartment(serial.PBDetailSerialId, serial.DepartmentId) < 1)
                    {
                        rowInserted--;
                    }
                }
                return Json(rowInserted, JsonRequestBehavior.AllowGet);
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWarrantyAndSerialNoPaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.inv_PurchaseBillDetailSerialBLL.GetPaged(startRecordNo, rowPerPage, whereClause, "ItemName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "WarrentyAndSerialNoController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


    }
}