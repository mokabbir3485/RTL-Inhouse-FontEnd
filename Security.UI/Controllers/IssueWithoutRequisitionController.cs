using InventoryBLL;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using DbExecutor;
using System.Linq;

namespace Security.UI.Controllers
{
    public class IssueWithoutRequisitionController : Controller
    {
        public JsonResult GetItemAdditionalAttributeOperationalByItemId(int itemId)
        {
            try
            {
                var list1 = SecurityBLL.Facade.ItemAdditionalAttribute.GetOperationalByItemId(itemId);
                var list2 = SecurityBLL.Facade.ItemAdditionalAttributeValue.GetAll();
                var result = new { Attribute = list1, AttributeDetails = list2 };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetStockIssueDetailAdAttributeByDepartmentAndItemId(Int32 DepartmentId,Int32 itemId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockIssueDetailAdAttribute.GetByDepartmentAndItemId(DepartmentId, itemId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 SaveIssueWithoutReq(inv_StockIssue stockIssue, List<inv_StockIssueDetail> issueDetailLst)
        {
            Int64 ret = 0;
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                try
                {
                    stockIssue.CreateDate = DateTime.Now;
                    stockIssue.UpdateDate = DateTime.Now;
                    ret = InventoryBLL.Facade.StockIssue.Add(stockIssue);
                    if (ret > 0)
                    {
                        foreach (inv_StockIssueDetail issueDetail in issueDetailLst)
                        {
                            inv_StockIssueDetail detail = issueDetailLst.FirstOrDefault();
                            detail.IssueId = ret;
                            detail.ItemId = issueDetail.ItemId;
                            detail.IssueQuantity = issueDetail.IssueQuantity;
                            detail.ItemName = issueDetail.ItemName;
                            Facade.StockIssueDetail.Add(detail);
                        }
                        // Comment
                        //foreach (inv_StockIssueDetail issueDetail in issueDetailLst)
                        //{
                        //    issueDetail.IssueId = ret;
                        //    issueDetail.IssueUnitPrice = inv_StockIssueDetailAdAttributeLst.Where(i => i.ItemId == issueDetail.ItemAddAttId).FirstOrDefault().ValuationPrice;
                        //    Int64 IssueDetailId = Facade.StockIssueDetail.Add(issueDetail);
                        //    if (inv_StockIssueDetailAdAttributeLst != null && inv_StockIssueDetailAdAttributeLst.Count > 0)
                        //    {
                        //        foreach (inv_StockIssueDetailAdAttribute s_inv_StockIssueDetailAdAttribute in inv_StockIssueDetailAdAttributeLst)
                        //        {
                        //            if (s_inv_StockIssueDetailAdAttribute.ItemId == issueDetail.ItemAddAttId && s_inv_StockIssueDetailAdAttribute.AttributeQty > 0)
                        //            {
                        //                s_inv_StockIssueDetailAdAttribute.IssueDetailId = IssueDetailId;
                        //                InventoryBLL.Facade.StockIssueDetailAdAttribute.Add(s_inv_StockIssueDetailAdAttribute);
                        //            }
                        //        }
                        //    }
                        //}
                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "IssueWithoutRequisitionController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }

        [HttpPost]
        public int UpdateIssueWithoutReq(inv_StockIssue stockIssue)
        {
            int ret = 0;
            stockIssue.CreateDate = DateTime.Now;
            stockIssue.UpdateDate = DateTime.Now;
            //stockIssue.UpdatorId = 1;
            //stockIssue.ApprovedBy = 0;
            //stockIssue.IssueDate = DateTime.Now;
            try
            {
                //ret = 1;
                ret = InventoryBLL.Facade.StockIssue.Update(stockIssue);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public Int64 SaveIssueWithoutReqDetail(inv_StockIssueDetail issueDetail, Int64 issueId)
        {
            Int64 ret = 0;
            try
            {
                issueDetail.IssueId = issueId;
                ret = Facade.StockIssueDetail.Add(issueDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int IssueApproveWithoutRequesition(inv_StockIssue stockIssue)
        {
            int ret = 0;
            //stockIssue.CreateDate = DateTime.Now;
            //stockIssue.UpdateDate = DateTime.Now;
            //stockIssue.UpdatorId = 1;
            //stockIssue.ApprovedBy = 0;
            //stockIssue.ApprovedDate = DateTime.Now;
            try
            {
                //ret = 1;
                ret = InventoryBLL.Facade.StockIssue.UpdateApprove(stockIssue);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public Int64 SaveStockIssueDetailAdAttribute(inv_StockIssueDetailAdAttribute _inv_StockIssueDetailAdAttribute)
        {
            Int64 ret = 0;
            try
            {
                ret = InventoryBLL.Facade.StockIssueDetailAdAttribute.Add(_inv_StockIssueDetailAdAttribute);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        /*
        [HttpPost]
        public Int64 SaveStockIssueDetailAdAttributeDetail(inv_StockIssueDetailAdAttributeDetail _inv_StockIssueDetailAdAttributeDetail)
        {
            Int64 ret = 0;
            try
            {
                if (_inv_StockIssueDetailAdAttributeDetail.AttributeValue == null)
                    _inv_StockIssueDetailAdAttributeDetail.AttributeValue = "";
                ret = InventoryBLL.Facade.StockIssueDetailAdAttributeDetail.Add(_inv_StockIssueDetailAdAttributeDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
*/
        public JsonResult GetIssueDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = InventoryBLL.Facade.StockIssue.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetIssueByIssueId(Int64 issueId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockIssue.GetById(issueId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetIssueDetailByIssueId(Int64 issueId)
        {
            try
            {
                var list = InventoryBLL.Facade.StockIssueDetail.GetByIssueId(issueId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllStockIssueDetailAdAttributeGetByIssueDetailId(Int64 IssueDetailId)
        {
            try
            {
                var list = Facade.StockIssueDetailAdAttribute.GetByIssueDetailId(IssueDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        /*
        public JsonResult GetAllStockIssueDetailAdAttributeDetailGetByIssueDetailAdAttId(Int64 IssueDetailAdAttId)
        {
            try
            {
                var list = Facade.StockIssueDetailAdAttributeDetail.GetByIssueDetailAdAttId(IssueDetailAdAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }*/
        public JsonResult GetMaxIssueNoWithoutReqByDate(string issueDate)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(issueDate))
                {
                    var date = DateTime.ParseExact(issueDate, "dd/MM/yyyy", null);
                    var maxNumber = InventoryBLL.Facade.StockIssue.GetMaxIssueNoByDate(date);

                    return Json(maxNumber, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueWithoutRequisitionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}