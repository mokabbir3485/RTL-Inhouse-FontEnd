using Security.UI.Controllers;
using InventoryBLL;
using InventoryEntity;
using System;
using System.Web.Mvc;
using DbExecutor;
using System.Collections.Generic;

namespace Security.UI.Controllers
{
    public class ProductionController : Controller
    {
        public JsonResult GetDynamicProduction(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.pro_Production.GetDynamic(searchCriteria,orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ProductionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 Save(pro_Production pro_Production, List<pro_ProductionDetail> pro_ProductionDetailList)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                long ret = 0;
                pro_Production.ProductionNo = pro_Production.ProductionNo == null ? "" : pro_Production.ProductionNo;
                pro_Production.Remarks = pro_Production.Remarks == null ? "" : pro_Production.Remarks;

                pro_Production.CreateDate = DateTime.Now;
                pro_Production.UpdateDate = DateTime.Now;
                try
                {
                    ret = Facade.pro_Production.Add(pro_Production);
                    if (pro_ProductionDetailList != null && pro_ProductionDetailList.Count > 0)
                    {
                        foreach (pro_ProductionDetail pro_ProductionDetail in pro_ProductionDetailList)
                        {

                            pro_ProductionDetail.ProductionId = ret;
                            Facade.pro_ProductionDetail.Add(pro_ProductionDetail);
                        }
                    }
                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "ProductionController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }
        public JsonResult GetMaxProductionNo(string deliveryDate)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(deliveryDate))
                {
                    var date = DateTime.ParseExact(deliveryDate, "dd/MM/yyyy", null);
                    long maxNumber = Facade.pro_Production.GetMaxProductionNo(date);

                    return Json(maxNumber, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ProductionController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult CheckDuplicateProductionNo(string ProductionNo, string date)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(ProductionNo) && !String.IsNullOrWhiteSpace(date))
                {
                    DateTime cDate = DateTime.ParseExact(date, "dd/MM/yyyy", null);

                    Common aCommon = new Common();
                    FiscalYear aFiscalYear = aCommon.GetFiscalFormDateAndToDate(cDate);
                    string formatedProductionNo = "PN/" + aFiscalYear.FromDate.Year.ToString().Substring(2, 2) + "-"
                                  + aFiscalYear.ToDate.Year.ToString().Substring(2, 2) + "/" + ProductionNo;

                    var production = Facade.pro_Production.GetDynamic("[ProductionNo]= '" + formatedProductionNo + "'", "[ProductionDate]");

                    return Json(production, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}