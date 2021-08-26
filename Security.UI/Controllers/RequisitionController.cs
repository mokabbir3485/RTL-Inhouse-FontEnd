using System;
using System.Web.Mvc;
using InventoryEntity;
using InventoryBLL;
using DbExecutor;
using System.Collections.Generic;
using System.Linq;

namespace Security.UI.Controllers
{
    public class RequisitionController : Controller
    {
        //
        // GET: /Requisition/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllRequisitionEntry()
        {
            try
            {
                var list = InventoryBLL.Facade.Requisition.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public Int64 Save(inv_Requisition requisition, List<inv_RequisitionDetail> requisitionDetail, List<inv_RequisitionDetailAdAttribute> _inv_RequisitionDetailAdAttribute)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                long ret = 0;
                requisition.CreateDate = DateTime.Now;
                requisition.UpdateDate = DateTime.Now;
                if (requisition.Remarks == null)
                {
                    requisition.Remarks = "";
                }
                try
                {
                    if (requisition.RequisitionId == 0)
                    {
                        ret = Facade.Requisition.Add(requisition);
                        if (ret > 0)
                        {
                            foreach (inv_RequisitionDetailAdAttribute aRequisitionDetail in _inv_RequisitionDetailAdAttribute)
                            {
                                inv_RequisitionDetail adetail = new inv_RequisitionDetail()
                                {
                                    RequisitionId = ret,
                                    ItemId = aRequisitionDetail.ItemAddAttId,
                                    RequisitionUnitId = requisitionDetail.Where(d => d.RequisitionDetailId == aRequisitionDetail.RequisitionDetailId).FirstOrDefault().RequisitionUnitId,
                                    RequisitionQuantity = aRequisitionDetail.AttributeQty,
                                    RequisitionPurposeId = aRequisitionDetail.RequisitionPurposeId,
                                    ItemName = requisitionDetail.Where(a => a.RequisitionDetailId == aRequisitionDetail.RequisitionDetailId).FirstOrDefault().ItemName,
                                    //ItemCode = requisitionDetail.Where(a => a.RequisitionDetailId == aRequisitionDetail.RequisitionDetailId).Select(i => i.ItemCode).FirstOrDefault(),
                                    RequisitionUnitName = requisitionDetail.Where(d => d.RequisitionDetailId == aRequisitionDetail.RequisitionDetailId).FirstOrDefault().RequisitionUnitName,
                                    RequisitionPurposeName = aRequisitionDetail.RequisitionPurposeName
                                };

                                int requisitonDetailId = InventoryBLL.Facade.RequisitionDetail.Add(adetail);
                            }
                        }
                    }
                    else
                    {
                        ret = Facade.Requisition.Update(requisition);
                        if (ret > 0)
                        {
                            foreach (inv_RequisitionDetail aRequisitionDetail in requisitionDetail)
                            {
                                aRequisitionDetail.RequisitionId = ret;
                                InventoryBLL.Facade.RequisitionDetail.Add(aRequisitionDetail);
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
                    error.FileName = "RequisitionController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }

        //[HttpPost]
        //public Int64 SaveRequisitionDetailAdAttribute(inv_RequisitionDetailAdAttribute _inv_RequisitionDetailAdAttribute)
        //{
        //    Int64 ret = 0;
        //    try
        //    {
        //        ret = InventoryBLL.Facade.RequisitionDetailAdAttribute.Add(_inv_RequisitionDetailAdAttribute);
        //    }
        //    catch (Exception ex)
        //    {

        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "RequisitionController";
        //        new ErrorLogInventoryController().CreateErrorLog(error);
        //    }
        //    return ret;
        //}

        //[HttpPost]
        //public Int64 SaveRequisitionDetailAdAttributeDetail(inv_RequisitionDetailAdAttributeDetail _inv_RequisitionDetailAdAttributeDetail)
        //{
        //    Int64 ret = 0;
        //    try
        //    {
        //        if (_inv_RequisitionDetailAdAttributeDetail.AttributeValue == null)
        //            _inv_RequisitionDetailAdAttributeDetail.AttributeValue = "";
        //        ret = InventoryBLL.Facade.RequisitionDetailAdAttributeDetail.Add(_inv_RequisitionDetailAdAttributeDetail);
        //    }
        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "RequisitionController";
        //        new ErrorLogInventoryController().CreateErrorLog(error);

        //    }
        //    return ret;
        //}

        [HttpPost]
        public int Delete(int RequisitionId)
        {
            int ret = 0;
            try
            {

                ret = Facade.Requisition.Delete(RequisitionId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetRequisitionById(Int64 id)
        {
            try
            {
                var list = Facade.Requisition.GetById(id);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetTopRequisitionForIssue(int topQty)
        {
            try
            {
                var list = InventoryBLL.Facade.Requisition.GetTopForIssue(topQty);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetRequisitionDetailByRequisitionId(Int64 id)
        {
            try
            {
                var list = Facade.RequisitionDetail.GetByRequisitionId(id);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllReuisitionDetailAdAttributeByReuisitionDetailId(Int64 requisitionDetailId)
        {
            try
            {
                var list = Facade.RequisitionDetailAdAttribute.GetByRequisitionDetailId(requisitionDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllRequisitionDetailAdAttributeByReuisitionDetailAdAttId(Int64 requisitionDetailAdAttId)
        {
            try
            {
                var list = Facade.RequisitionDetailAdAttributeDetail.GetByRequisitionDetailAdAttId(requisitionDetailAdAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);

            }
        }

        public JsonResult GetMaxIssueNoWithoutReqByDate(string requDate)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(requDate))
                {
                    var date = DateTime.ParseExact(requDate, "dd/MM/yyyy", null);
                    var maxNumber = Facade.Requisition.GetGeneralMaxRequNoByDate(date);

                    return Json(maxNumber, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult GetMaxRequNoByDate(string requDate)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(requDate))
                {
                    var date = DateTime.ParseExact(requDate, "dd/MM/yyyy", null);
                    var maxNumber = Facade.Requisition.GetGeneralMaxRequNoByDate(date);

                    return Json(maxNumber, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult CheckDuplicateRN(string RequisitionNo, string date)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(RequisitionNo) && !String.IsNullOrWhiteSpace(date))
                {
                    DateTime cDate = DateTime.ParseExact(date, "dd/MM/yyyy", null);

                    Common aCommon = new Common();
                    FiscalYear aFiscalYear = aCommon.GetFiscalFormDateAndToDate(cDate);
                    string formatedReqNo = "RN/" + aFiscalYear.FromDate.Year.ToString().Substring(2, 2) + "-"
                                  + aFiscalYear.ToDate.Year.ToString().Substring(2, 2) + "/" + RequisitionNo;

                    var requistion = Facade.Requisition.GetDynamic("[RequisitionNo]= '" + formatedReqNo + "'", "[RequisitionDate]");

                    return Json(requistion, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "RequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}