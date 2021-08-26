using DbExecutor;
using ExportBLL;
using ExportEntity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class ExpCommercialInvoiceController : Controller
    {
        // GET: CommercialInvoice
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCIMasterByInvoiceId(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_ExpReports.GetCiMasterForReport(commercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllPaymentProcessType()
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetPaymentProcessTypeAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetBankDocForReport(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_ExpReports.GetBankDocForReport(commercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetConsumptionCertificateReport(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_ExpReports.GetConsumptionCertificateReport(commercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetConsumptionCertificateDescriptionReport(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_ExpReports.GetConsumptionCertificateDescriptionReport(commercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetConsumptionCertificateRawMaterialsReport(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_ExpReports.GetConsumptionCertificateRawMaterialsReport(commercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBillOfExchangeForReport(int commercialInvoiceId, string BOE1 = "BOE1")
        {
            try
            {
                var list = Facade.exp_ExpReports.GetBillOfExchangeForReport(commercialInvoiceId, BOE1);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult GetAllCommercialInvoice()
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetAll();

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCommercialInvoicePaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.exp_CommercialInvoice.GetPaged(startRecordNo, rowPerPage, whereClause, "CommercialInvoiceNo", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetItemByCI(int CiId) 
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetItemByCI(CiId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult CommercialInvoiceDetailDeleteByCommercialInvoiceId(Int64 commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.CommercialInvoiceDetailDeleteByCommercialInvoiceId(commercialInvoiceId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCommercialInvoiceDetailByCommercialInvoiceId(Int64 CiId)  
        { 
            try 
            {
                var list = Facade.exp_CommercialInvoice.CommercialInvoiceDetailGetByCommercialInvoiceId(CiId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetAllCommercialInvoiceInfo(int CiId)
        {
            try
            {
                var list = Facade.expCommercialInvoiceInfo.GetByCiId(CiId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCIInfoDetailReport(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_ExpReports.GetCIInfoDetailReport(commercialInvoiceId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetExpCommercialInvoiceDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCommercialInvoiceDetailModifiedDataForCiUpdate(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetCommercialInvoiceDetailModifiedDataForCiUpdate(commercialInvoiceId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCommercialInvoiceDetailModifiedDataGetByInvoiceId(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetCommercialInvoiceDetailModifiedDataGetByInvoiceId(commercialInvoiceId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllTruckChallan(int? commercialInvoiceId = null)
        {
            try
            {
                var list = Facade.exp_TruckChallan.Get(commercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]

        public Int64 SaveTruckChallan(exp_TruckChallan[] exp_TruckChallan)
        {
            if (exp_TruckChallan != null)
            {
                foreach (var ciInfo in exp_TruckChallan)
                {
                    if (ciInfo.TruckNo == null) { ciInfo.TruckNo = ""; }
                    if (ciInfo.Footers == null) { ciInfo.Footers = ""; }
                }

            }
            Int64 ret = 0;
            try
            {
                if (exp_TruckChallan != null)
                {
                    foreach (var TCInfo in exp_TruckChallan)
                    {
                        //TCInfo.CommercialInvoiceId = Convert.ToInt64(exp_CommercialInvoice.CommercialInvoiceId);
                        ret = Facade.exp_TruckChallan.Post(TCInfo);
                    }
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetPOReference(string DocType, Int64 DocumentId)
        {
            try
            {
                return Json(Facade.exp_POReferenceBLL.GetPOReference(DocType, DocumentId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetPackingInfo(Int64 CommercialInvoiceId)
        {
            try
            {
                return Json(Facade.exp_CommercialInvoice_PackingInfo.GetAll(CommercialInvoiceId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
   
        public Int64 Save(exp_CommercialInvoice exp_CommercialInvoice, exp_CommercialInvoiceInfo[] exp_CommercialInvoiceInfo, exp_CommercialInvoiceDetail[] exp_CommercialInvoiceDetail, List<exp_CommercialInvoiceDetail_ModifiedData> modifiedDataList, exp_CommercialInvoiceDetail_TableHtml tableHtmlData, List<exp_POReference> POReferencelist, exp_CommercialInvoice_PackingInfo exp_CommercialInvoice_PackingInfo)
        {
            if (exp_CommercialInvoice.CommercialInvoiceNo == null) { exp_CommercialInvoice.CommercialInvoiceNo = ""; }
            if (exp_CommercialInvoice.DcGateNo == null) { exp_CommercialInvoice.DcGateNo = ""; }
            if (exp_CommercialInvoice.VehicleRegNo == null) { exp_CommercialInvoice.VehicleRegNo = ""; }
            if (exp_CommercialInvoice.LcScNo == null) { exp_CommercialInvoice.LcScNo = ""; }
            if (exp_CommercialInvoice.ImporterBankBin == null) { exp_CommercialInvoice.ImporterBankBin = ""; }
            if (exp_CommercialInvoice.ExpNo == null) { exp_CommercialInvoice.ExpNo = ""; }
            if (exp_CommercialInvoice.ShipmentMode == null) { exp_CommercialInvoice.ShipmentMode = ""; }
            if (exp_CommercialInvoice.CountryOfOrigin == null) { exp_CommercialInvoice.CountryOfOrigin = ""; }
            if (exp_CommercialInvoice.Covering == null) { exp_CommercialInvoice.Covering = ""; }
            if (exp_CommercialInvoice.TermsOfPayment == null) { exp_CommercialInvoice.TermsOfPayment = ""; }
            if (exp_CommercialInvoice.MasterContactNo == null) { exp_CommercialInvoice.MasterContactNo = ""; }
            if (exp_CommercialInvoice_PackingInfo.CartonMeasurement == null) { exp_CommercialInvoice_PackingInfo.CartonMeasurement = ""; }

            if (exp_CommercialInvoiceInfo != null)
            {
                foreach (var ciInfo in exp_CommercialInvoiceInfo)
                {
                    if (ciInfo.InfoLabel == null) { ciInfo.InfoLabel = ""; }
                    if (ciInfo.InfoType == null) { ciInfo.InfoType = ""; }
                    if (ciInfo.InfoValue == null) { ciInfo.InfoValue = ""; }
                    if (ciInfo.Sorting == null) { ciInfo.Sorting = 0; }
                }

            }

            exp_CommercialInvoice.UpdatedDate = DateTime.Now;
            Int64 ret = 0;
            Int64 commercialInvoiceId = 0;
            commercialInvoiceId = exp_CommercialInvoice.CommercialInvoiceId;
            try
            {
                if (exp_CommercialInvoice.CommercialInvoiceId == 0)
                {
                    ret = Facade.exp_CommercialInvoice.Post(exp_CommercialInvoice);

                    if (exp_CommercialInvoiceInfo != null)
                    {
                        foreach (var CiInfo in exp_CommercialInvoiceInfo)
                        {
                            CiInfo.CommercialInvoiceId = Convert.ToInt64(ret);
                            Facade.expCommercialInvoiceInfo.Post(CiInfo);

                        }
                    }

                    if (exp_CommercialInvoiceDetail != null)
                    {
                        foreach (var CiDetail in exp_CommercialInvoiceDetail)
                        {
                            CiDetail.CommercialInvoiceId = Convert.ToInt64(ret);
                            Facade.exp_CommercialInvoice.AddDetail(CiDetail);

                        }
                    }
                    exp_CommercialInvoice_PackingInfo.UpdatedDate = DateTime.Now;
                    exp_CommercialInvoice_PackingInfo.CommercialInvoiceId = ret;
                    Facade.exp_CommercialInvoice_PackingInfo.Add(exp_CommercialInvoice_PackingInfo);

                }
                else
                {
                    ret = Facade.exp_CommercialInvoice.UpdateChallanGate(exp_CommercialInvoice);
                    ret = Facade.exp_CommercialInvoice.Post(exp_CommercialInvoice);
                    Facade.expCommercialInvoiceInfo.Delete(Convert.ToInt32(ret));
                    if (exp_CommercialInvoiceInfo != null)
                    {
                        foreach (var CiInfo in exp_CommercialInvoiceInfo)
                        {
                            CiInfo.CommercialInvoiceId = Convert.ToInt64(ret);
                            Facade.expCommercialInvoiceInfo.Post(CiInfo);
                        }
                    }
                    if (exp_CommercialInvoiceDetail != null)
                    {
                        foreach (var CiDetail in exp_CommercialInvoiceDetail)
                        {
                            CiDetail.CommercialInvoiceId = Convert.ToInt64(ret);
                            Facade.exp_CommercialInvoice.AddDetail(CiDetail);

                        }
                    }

                }

                tableHtmlData.CommercialInvoiceId = Convert.ToInt64(ret);
                Facade.exp_CommercialInvoice.AddCommercialInvoiceDetailTableHtml(tableHtmlData);

                if (modifiedDataList.Count != null)
                {
                    Facade.exp_CommercialInvoice.DeleteCommercialInvoiceDetailModifiedData(commercialInvoiceId);
                }
                

                foreach (var modifiedData in modifiedDataList)
                {
                    
                    if (modifiedData.Id == null)
                    {
                        modifiedData.Id = 0;
                    }
                    if (modifiedData.ColValue == null)
                        modifiedData.ColValue = "";

                    modifiedData.CommercialInvoiceId = Convert.ToInt64(ret);

                    Facade.exp_CommercialInvoice.AddCommercialInvoiceDetailModifiedData(modifiedData);
                }

                if (POReferencelist != null && POReferencelist.Count > 0 && ret > 0)
                {
                    foreach (exp_POReference aPOReferencelist in POReferencelist)
                    {
                        Int64 PO_ret;

                        aPOReferencelist.DocumentId = ret;
                        PO_ret = Facade.exp_POReferenceBLL.Add(aPOReferencelist);
                    }
                }
                exp_CommercialInvoice_PackingInfo.UpdatedDate = DateTime.Now;
                exp_CommercialInvoice_PackingInfo.CommercialInvoiceId = Convert.ToInt64(ret);
                Facade.exp_CommercialInvoice_PackingInfo.Update(exp_CommercialInvoice_PackingInfo);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetTableHtmlForCi(int commercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_CommercialInvoice.GetCommercialInvoiceDetailTableHtml(commercialInvoiceId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult Update(exp_CommercialInvoice exp_CommercialInvoice)
        {
            try
            {

                return Json(Facade.exp_CommercialInvoice.Update(exp_CommercialInvoice), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Delete(int commercialInvoiceId)
        {
            int ret = 0;
            try
            {
                ret = Facade.exp_CommercialInvoice.Delete(commercialInvoiceId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpCommercialInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}