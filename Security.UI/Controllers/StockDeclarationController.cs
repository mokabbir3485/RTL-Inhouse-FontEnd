using InventoryBLL;
using InventoryEntity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class StockDeclarationController : Controller
    {
        public JsonResult GetAllStockDeclarationType()
        {
            try
            {
                var list = SecurityBLL.Facade.StockDeclarationType.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public Int64 SaveStockDeclaration(inv_StockDeclaration stockDeclaration, List<inv_StockDeclarationDetail> stockDeclarationDetailList, List<inv_StockDeclarationDetailAdAttribute> stockDeclarationDetailAdAttribute, List<inv_StockDeclarationDetailAdAttributeDetail> stockDeclarationDetailAdAttributeDetail)
        {
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                Int64 ret = 0;
                stockDeclaration.CreateDate = DateTime.Now;
                stockDeclaration.UpdateDate = DateTime.Now;
                stockDeclaration.Remarks = string.IsNullOrEmpty(stockDeclaration.Remarks) ? "" : stockDeclaration.Remarks;

                try
                {
                    if (stockDeclaration.DeclarationId == 0)
                    {
                        ret = InventoryBLL.Facade.StockDeclaration.Add(stockDeclaration);
                        if (ret > 0)
                        {
                            foreach (inv_StockDeclarationDetail stockDeclarationDetail in stockDeclarationDetailList)
                            {
                                stockDeclarationDetail.DeclarationId = ret;
                                Int64 declerationDetailId = InventoryBLL.Facade.StockDeclarationDetail.Add(stockDeclarationDetail);
                                if (stockDeclarationDetailList != null && stockDeclarationDetailAdAttribute!=null)
                                {
                                    foreach (inv_StockDeclarationDetailAdAttribute aStockDeclarationDetailAdAttribute in stockDeclarationDetailAdAttribute)
                                    {
                                        if (aStockDeclarationDetailAdAttribute.DeclarationDetailId == stockDeclarationDetail.DeclarationDetailId)
                                        {
                                            aStockDeclarationDetailAdAttribute.DeclarationDetailId = declerationDetailId;
                                            Int64 addAttId = InventoryBLL.Facade.StockDeclarationDetailAdAttribute.Add(aStockDeclarationDetailAdAttribute);
                                            if (stockDeclarationDetailAdAttributeDetail != null && stockDeclarationDetailAdAttributeDetail.Count > 0)
                                            {
                                                foreach (inv_StockDeclarationDetailAdAttributeDetail aStockDeclarationDetailAdAttributeDetail in stockDeclarationDetailAdAttributeDetail)
                                                {
                                                    aStockDeclarationDetailAdAttributeDetail.DeclarationDetailAdAttId = Convert.ToInt16(addAttId);
                                                    InventoryBLL.Facade.StockDeclarationDetailAdAttributeDetail.Add(aStockDeclarationDetailAdAttributeDetail);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        ret = InventoryBLL.Facade.StockDeclaration.Update(stockDeclaration);
                        if (ret > 0)
                        {
                            foreach (inv_StockDeclarationDetail stockDeclarationDetail in stockDeclarationDetailList)
                            {
                                stockDeclarationDetail.DeclarationId = stockDeclaration.DeclarationId;
                                InventoryBLL.Facade.StockDeclarationDetail.Add(stockDeclarationDetail);
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
                    error.FileName = "StockDeclarationController";
                    new ErrorLogInventoryController().CreateErrorLog(error);
                }
                return ret;
            }
        }

        //[HttpPost]
        //public Int64 SaveStockDeclarationDetail(inv_StockDeclarationDetail stockDeclarationDetail, int DeclarationId)
        //{
        //    Int64 ret = 0;
        //    try
        //    {
        //        stockDeclarationDetail.DeclarationId = DeclarationId;
        //        //ret = 14;
        //        ret = InventoryBLL.Facade.StockDeclarationDetail.Add(stockDeclarationDetail);
        //    }
        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "StockDeclarationController";
        //        new ErrorLogInventoryController().CreateErrorLog(error);
        //    }
        //    return ret;
        //}

        [HttpPost]
        public Int64 SaveStockDeclarationDetailAdAttribute(inv_StockDeclarationDetailAdAttribute stockDeclarationDetailAdAttribute)
        {
            Int64 ret = 0;
            try
            {
                ret = InventoryBLL.Facade.StockDeclarationDetailAdAttribute.Add(stockDeclarationDetailAdAttribute);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public Int64 SaveStockDeclarationDetailAdAttributeDetail(inv_StockDeclarationDetailAdAttributeDetail stockDeclarationDetailAdAttributeDetail)
        {
            Int64 ret = 0;
            try
            {
                if (stockDeclarationDetailAdAttributeDetail.AttributeValue == null)
                    stockDeclarationDetailAdAttributeDetail.AttributeValue = "";
                ret = InventoryBLL.Facade.StockDeclarationDetailAdAttributeDetail.Add(stockDeclarationDetailAdAttributeDetail);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAllstockDeclaration(Int64? id = null)
        {
            try
            {
                var list = Facade.StockDeclaration.GetAll(id);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetStockDeclarationDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.StockDeclaration.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllGetAllstockDeclarationDetailById(Int64 declarationId)
        {
            try
            {
                var list = Facade.StockDeclarationDetail.GetByDeclarationId(declarationId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllDeclarationDetailAdAttributeByDeclarationDetailId(Int64 DeclarationDetailId)
        {
            try
            {
                var list = Facade.StockDeclarationDetailAdAttribute.GetByDeclarationDetailId(DeclarationDetailId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllDeclarationDetailAdAttributeByDeclarationDetailAdAttId(Int64 DeclarationDetailAdAttId)
        {
            try
            {
                var list = Facade.StockDeclarationDetailAdAttributeDetail.GetByDeclarationDetailAdAttId(DeclarationDetailAdAttId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "StockDeclarationController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}