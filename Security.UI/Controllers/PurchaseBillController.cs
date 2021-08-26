using DbExecutor;
using InventoryBLL;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using System.Data;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Reflection;

namespace Security.UI.Controllers
{
    public class PurchaseBillController : Controller
    {
        public JsonResult GetHasPO()
        {
            try
            {
                var HasPo = System.Configuration.ConfigurationManager.AppSettings["HasPO"].ToString();
                return Json(HasPo, JsonRequestBehavior.AllowGet);
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

        [HttpPost]
        public Int64 Save(inv_PurchaseBill ainv_PurchaseBill, List<inv_PurchaseBillDetail> inv_PurchaseBillDetailLst,  List<inv_PurchaseBillDetailSerial> inv_PurchaseBillDetailSerial)
        {

            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                long ret = 0;
                ainv_PurchaseBill.CreateDate = DateTime.Now;
                ainv_PurchaseBill.UpdateDate = DateTime.Now;
                ainv_PurchaseBill.ApprovedDate = DateTime.Now;
                //ainv_PurchaseBill.PBDate = DateTime.Now;
                ainv_PurchaseBill.VoucherNo = ainv_PurchaseBill.VoucherNo == null? "" : ainv_PurchaseBill.VoucherNo;
                ainv_PurchaseBill.Address = ainv_PurchaseBill.Address ==null? "" : ainv_PurchaseBill.Address;
                ainv_PurchaseBill.PONo = ainv_PurchaseBill.PONo == null ? "" : ainv_PurchaseBill.PONo;
                ainv_PurchaseBill.ShipmentInfo = ainv_PurchaseBill.ShipmentInfo == null ? "" : ainv_PurchaseBill.ShipmentInfo;
                ainv_PurchaseBill.Remarks = ainv_PurchaseBill.Remarks == null ? "" : ainv_PurchaseBill.Remarks;

               

                try
                {
                    if (ainv_PurchaseBill.PBId==0)
                    {
                        ret = Facade.PurchaseBill.Add(ainv_PurchaseBill);
                    }
                   
                   
                    if (inv_PurchaseBillDetailLst != null && inv_PurchaseBillDetailLst.Count > 0)
                    {
                        foreach (inv_PurchaseBillDetail ainv_PurchaseBillDetail in inv_PurchaseBillDetailLst)
                        {
                            ainv_PurchaseBillDetail.HsCode = ainv_PurchaseBillDetail.HsCode == null ? "" : ainv_PurchaseBillDetail.HsCode;
                           
                            ainv_PurchaseBillDetail.PBId = ret;
                            long pBDetailId = 0;
                            if (ainv_PurchaseBillDetail.PBDetailId==0)
                            {
                                 pBDetailId = InventoryBLL.Facade.PurchaseBillDetail.Add(ainv_PurchaseBillDetail);
                            }
                            
                            if (inv_PurchaseBillDetailSerial != null)
                            {
                                var serialListByItemAttId = inv_PurchaseBillDetailSerial.Where(x => x.ItemId == ainv_PurchaseBillDetail.ItemId).ToList();

                                foreach (var serialtem in serialListByItemAttId)
                                {
                                    serialtem.PBDetailId = pBDetailId;
                                    serialtem.ItemId = ainv_PurchaseBillDetail.ItemId;
                                    InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.Add(serialtem);
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
                    error.FileName = "PurchaseBillController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }



        [HttpPost]
        public Int64 LocalPBSave(inv_LocalPurchaseBill Local_inv_PurchaseBill, List<inv_LocalPurchaseBillDetail> Local_inv_PurchaseBillDetailLst,  List<inv_LocalPurchaseBillDetailSerial> inv_LocalPurchaseBillDetailSerial)
        {

            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                long ret = 0;
                Local_inv_PurchaseBill.CreateDate = DateTime.Now;
                Local_inv_PurchaseBill.UpdateDate = DateTime.Now;
                Local_inv_PurchaseBill.PBDate = DateTime.Now;
               // Local_inv_PurchaseBill.PBDate = DateTime.Now;
                Local_inv_PurchaseBill.ApprovedDate = DateTime.Now;
                Local_inv_PurchaseBill.Address = Local_inv_PurchaseBill.Address == null ? "" : Local_inv_PurchaseBill.Address;
                Local_inv_PurchaseBill.PONo = Local_inv_PurchaseBill.PONo == null ? "" : Local_inv_PurchaseBill.PONo;
                Local_inv_PurchaseBill.PreparedBy = Local_inv_PurchaseBill.PreparedBy = "" == null ? "" : Local_inv_PurchaseBill.PreparedBy;
                Local_inv_PurchaseBill.VoucherNo = Local_inv_PurchaseBill.VoucherNo == null ? "" : Local_inv_PurchaseBill.VoucherNo;
                Local_inv_PurchaseBill.ShipmentInfo = Local_inv_PurchaseBill.ShipmentInfo == null ? "" : Local_inv_PurchaseBill.ShipmentInfo;
                Local_inv_PurchaseBill.Remarks = Local_inv_PurchaseBill.Remarks == null ? "" : Local_inv_PurchaseBill.Remarks;



                try
                {
                    if (Local_inv_PurchaseBill.LPBId == 0)
                    {
                        ret = Facade.PurchaseBill.LocalPBAdd(Local_inv_PurchaseBill);
                    }
                   

                    if (Local_inv_PurchaseBillDetailLst != null && Local_inv_PurchaseBillDetailLst.Count > 0)
                    {
                        foreach (inv_LocalPurchaseBillDetail Localainv_PurchaseBillDetail in Local_inv_PurchaseBillDetailLst)
                        {
                            Localainv_PurchaseBillDetail.HsCode = Localainv_PurchaseBillDetail.HsCode == null ? "" : Localainv_PurchaseBillDetail.HsCode;
                            Localainv_PurchaseBillDetail.LPBId = ret;
                            long pBDetailId = 0;
                            if (Localainv_PurchaseBillDetail.LPBDetailId == 0)
                            {
                                pBDetailId = InventoryBLL.Facade.PurchaseBillDetail.LocalPBDetailAdd(Localainv_PurchaseBillDetail);
                            }
                         

                            if (inv_LocalPurchaseBillDetailSerial != null)
                            {
                                var serialListByItemAttId = inv_LocalPurchaseBillDetailSerial.Where(x => x.ItemId == Localainv_PurchaseBillDetail.ItemId).ToList();

                                foreach (var serialtem in serialListByItemAttId)
                                {
                                    serialtem.LPBDetailId = pBDetailId;
                                    serialtem.ItemId = Localainv_PurchaseBillDetail.ItemId;
                                    InventoryBLL.Facade.inv_PurchaseBillDetailSerialBLL.AddForLocalPurchaseBill(serialtem);
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
                    error.FileName = "PurchaseBillController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }


        [HttpPost]
        public long SavePB(inv_PurchaseBill pb)
        {
            long ret = 0;
            pb.CreateDate = DateTime.Now;
            pb.UpdateDate = DateTime.Now;
            if (pb.PONo == null)
                pb.PONo = "";
            if (pb.ShipmentInfo == null)
                pb.ShipmentInfo = "";
            if (pb.Remarks == null)
                pb.Remarks = "";
            try
            {
                ret = Facade.PurchaseBill.Add(pb);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int RevisePB(inv_PurchaseBill pb)
        {
            int ret = 0;
            pb.CreateDate = DateTime.Now;
            pb.UpdateDate = DateTime.Now;
            if (pb.PONo == null)
                pb.PONo = "";
            if (pb.ShipmentInfo == null)
                pb.ShipmentInfo = "";
            if (pb.Remarks == null)
                pb.Remarks = "";
            try
            {
                ret = Facade.PurchaseBill.Update(pb);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public long SavePBDetail(inv_PurchaseBillDetail pbDetail)
        {
            long ret = 0;
            try
            {
                ret = Facade.PurchaseBillDetail.Add(pbDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SaveOverHead(inv_PurchaseBillOverHead overHead)
        {
            int ret = 0;
            try
            {
                ret = Facade.PurchaseBillOverHead.Add(overHead);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public int SavePBCharge(inv_PurchaseBillDetailCharge pdCharge)
        {
            int ret = 0;
            try
            {
                ret = Facade.PurchaseBillDetailCharge.Add(pdCharge);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public Int64 SavePurchaseBillDetailAdAttribute(inv_PurchaseBillDetailAdAttribute inv_PurchaseBillDetailAdAttribute)
        {
            Int64 ret = 0;
            try
            {
                ret = InventoryBLL.Facade.PurchaseBillDetailAdAttribute.Add(inv_PurchaseBillDetailAdAttribute);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public Int64 SavePurchaseBillDetailAdAttributeDetail(inv_PurchaseBillDetailAdAttributeDetail inv_PurchaseBillDetailAdAttributeDetail)
        {
            Int64 ret = 0;
            try
            {
                if (inv_PurchaseBillDetailAdAttributeDetail.AttributeValue == null)
                    inv_PurchaseBillDetailAdAttributeDetail.AttributeValue = "";
                ret = InventoryBLL.Facade.PurchaseBillDetailAdAttributeDetail.Add(inv_PurchaseBillDetailAdAttributeDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

       

        public JsonResult GetPBById(int id)
        {
            try
            {
                return Json(Facade.PurchaseBillDetail.GetByPBId(id), JsonRequestBehavior.AllowGet);
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
        [HttpGet]
        public JsonResult GetLocalPBById(int id)
        {
            try
            {
                var localGetById = Facade.PurchaseBillDetail.LocalGetByPBId(id);
                return Json(localGetById, JsonRequestBehavior.AllowGet);
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

        [HttpGet]
        public JsonResult LocalSuppilerPBId(int supId)
        {
            try
            {
                var localSupplierGetById = Facade.PurchaseBill.GetByLocalSupplierId(supId);
                return Json(localSupplierGetById, JsonRequestBehavior.AllowGet);
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
        [HttpGet]
        public JsonResult GetAllSuppilerPBId(int supId)
        {
            try
            {
                var localSupplierGetById = Facade.PurchaseBill.GetBySupplierId(supId);
                return Json(localSupplierGetById, JsonRequestBehavior.AllowGet);
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
        [HttpGet]
        public JsonResult LocalGetAll()
        {
            try
            {
                var localGetAll = Facade.PurchaseBill.LocalGetAll();
                return Json(localGetAll, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetPBDynamic(string where, string orderBy)
        {
            try
            {
                var list = Facade.PurchaseBill.GetDynamic(where, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetTopForReceive(int amount)
        {
            try
            {
                var list = Facade.PurchaseBill.GetTopForReceive(amount);
                return Json(list, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetTopForLocalReceive(int amount)
        {
            try
            {
                var list = Facade.PurchaseBill.GetTopForLocalReceive(amount);
                return Json(list, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetTopForLocalWarrentyAndSerialNo(int top)
        {
            try
            {
                var list = Facade.PurchaseBill.GetTopForLocalWarrentyAndSerialNo(top);
                return Json(list, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetTopForImportWarrentyAndSerialNo(int top)
        {
            try
            {
                var list = Facade.PurchaseBill.GetTopForImportWarrentyAndSerialNo(top);
                return Json(list, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetAllPBById(int id)
        {
            try
            {
                var list = Facade.PurchaseBillDetail.GetByPBId(id);
                return Json(list, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetAllPBOverHeadById(int id)
        {
            try
            {
                var list = Facade.PurchaseBillOverHead.GetByPBId(id);
                return Json(list, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetPBDetailChargeByPbDetailId(Int64 pbDetailId)
        {
            try
            {
                var list = Facade.PurchaseBillDetailCharge.GetByPBDetailId(pbDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetMaxPurchaseBillNo()
        {
            try
            {

                var dt = new DataTable();
                dt.Load(Facade.PurchaseBill.GetMaxPurchaseBillNo());

                List<string[]> results =
                    dt.Select()
                        .Select(drr =>
                            drr.ItemArray
                                .Select(x => x.ToString())
                                .ToArray())
                        .ToList();

                return Json(results, JsonRequestBehavior.AllowGet);

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


        public JsonResult GetMaxLocalPurchaseBillNo()
        {
            try
            {

                var dt = new DataTable();
                dt.Load(Facade.PurchaseBill.GetMaxLocalPurchaseBillNo());

                List<string[]> results =
                    dt.Select()
                        .Select(drr =>
                            drr.ItemArray
                                .Select(x => x.ToString())
                                .ToArray())
                        .ToList();

                return Json(results, JsonRequestBehavior.AllowGet);

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

        public JsonResult CheckDuplicatePBNo(string PBNo,string date)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(PBNo) && !String.IsNullOrWhiteSpace(date))
                {
                    DateTime cDate = DateTime.ParseExact(date, "dd/MM/yyyy", null);

                    Common aCommon=new Common();
                    FiscalYear aFiscalYear = aCommon.GetFiscalFormDateAndToDate(cDate);
                    string formatedPBNo = "PB/" + aFiscalYear.FromDate.Year.ToString().Substring(2, 2)+"-" 
                                  + aFiscalYear.ToDate.Year.ToString().Substring(2, 2)+"/"+PBNo;

                    var purchaseBill = Facade.PurchaseBill.GetDynamic("[PBNo]= '" + formatedPBNo + "'", " [PBNo]");

                    return Json(purchaseBill, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
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
        [HttpGet]
        public JsonResult GetLocalPBReport(Int64 LPBId)
        {
            try
            {

                var localPBList = Facade.PurchaseBill.GetLocalPB(LPBId);
                return Json(localPBList, JsonRequestBehavior.AllowGet);
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

        //public JsonResult GetPaged(int startRecordNo, int rowPerPage, string fromDate, string toDate, string wildCard, string sortColumn)
        //{
        //    try
        //    {

        //        if (!String.IsNullOrEmpty(startRecordNo.ToString()) && !String.IsNullOrEmpty(fromDate) && !String.IsNullOrEmpty(toDate))
        //        {
        //            string whereClause = "PBDate BETWEEN '"+ fromDate +"' AND '"+ toDate +"' ";
        //            if (!String.IsNullOrEmpty(wildCard.Trim()))
        //            {
        //                whereClause += " AND PBNo LIKE '%" + wildCard +"%'";
        //            }
        //            var pbList = new
        //            {
        //                ListData = Facade.PurchaseBill.GetPaged(startRecordNo, rowPerPage, whereClause, sortColumn, "DESC", ref rowPerPage),
        //                TotalRecord = rowPerPage
        //            };
        //            return Json(pbList, JsonRequestBehavior.AllowGet);
        //        }
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {

        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "PurchaseBillController";
        //        new ErrorLogInventoryController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }
        //}
        public JsonResult GetForRealization(int financialCycleId, int supplierId)
        {
            try
            {
                var list = Facade.PurchaseBill.GetForRealization(financialCycleId, supplierId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetPagedPB(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.PurchaseBill.ImportGetPaged(startRecordNo, rowPerPage, whereClause, "PONo", "desc", ref rows),
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
        public JsonResult ImportPagedPB(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.PurchaseBill.ImportGetPaged(startRecordNo, rowPerPage, whereClause, "PBNo", "ASC", ref rows),
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
        public JsonResult LocalPagedPB(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.PurchaseBill.LocalGetPaged(startRecordNo, rowPerPage, whereClause, "PBNo", "desc", ref rows),
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
        public JsonResult WarrantyAndSerialGetPaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            try
            {

                var customMODEntity = new
                {
                    ListData = Facade.PurchaseBill.WarrantyAndSerialGetPaged(startRecordNo, rowPerPage, whereClause, "PBNo", "desc", ref rows),
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
        public JsonResult PurchaseBillDetailGetByPBId( int pbId)
        {
            try
            {
                var list = Facade.PurchaseBillDetail.GetByPBId(pbId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetAllWarrentyAndSerial()
        {
            try
            {
                var list = Facade.inv_PurchaseBillDetailSerialBLL.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult PurchaseBillDetailSerialSerialId(Int64 SerialId)
        {
            try
            {
                var list = Facade.inv_PurchaseBillDetailSerialBLL.GetBySerialAndWarrantyId(SerialId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult PurchaseBillDetailGetByOverHead(Int64 PbId)
        {
            try
            {
                var list = Facade.PurchaseBillOverHead.GetByPBId(PbId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PurchaseBillController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


       
    }
}
