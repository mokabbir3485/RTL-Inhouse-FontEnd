using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using System.Web.Mvc;
using DbExecutor;
using System.Net;
using System.Transactions;
using ExportBLL;
using ExportDAL;
using ExportEntity;
using Newtonsoft.Json;


namespace Security.UI.Controllers
{
    public class ExpInvoiceController : Controller
    {
        // GET: ExpInvoice
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetInvoiceMasterByInvoiceId(long invoiceId)
        {
            try
            {
                var piMasterList = Facade.exp_ExpReports.GetPiMasterForReport(invoiceId);
                return Json(piMasterList, JsonRequestBehavior.AllowGet);
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


        public JsonResult GetAllExporter()
        {
            try
            {
                var list = Facade.exp_Exporter.GetAll();
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

        public JsonResult GetAllInvoiceType()
        {
            try
            {
                var list = Facade.exp_Invoice.GetPaymentProcessTypeAll();
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

        public JsonResult GetAllInvoice()
        {
            try
            {
                var list = Facade.exp_Invoice.GetAll();
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
        public JsonResult GetItemByInvoice(int invoiceId)
        {
            try
            {
                var list = Facade.exp_Invoice.GetItemByInvoice(invoiceId);
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

        public JsonResult GetExpInvoiceDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.exp_Invoice.GetDynamic(searchCriteria, orderBy);
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

        public JsonResult GetExpInvoiceForCiUpdate(int CompanyId, Int64 CommercialInvoiceId)
        {
            try
            {
                var list = Facade.exp_Invoice.GetForCiUpdate(CompanyId, CommercialInvoiceId);
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

        public JsonResult ExpInvoiceGetForEdit(DateTime fromDate, DateTime toDate, int? companyId)
        {
            try
            {
                var list = Facade.exp_Invoice.exp_Invoice_GetForEdit(fromDate, toDate, companyId);
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
        public JsonResult GetInvoicePaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.exp_Invoice.GetPaged(startRecordNo, rowPerPage, whereClause, "InvoiceNo", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
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

        public string GetInvoiceNo(DateTime invoiceDate, Int32 ExporterId)
        {
            try
            {
                var maxNumber = Facade.exp_Invoice.GetMaxInvoiceNo(invoiceDate, ExporterId);
                return JsonConvert.SerializeObject(maxNumber);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExpInvoiceController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        public JsonResult InvoiceDetailGetByInvoiceId(Int64 invoiceId)
        {
            try
            {
                var list = Facade.exp_Invoice.InvoiceDetailGetByInvoiceId(invoiceId);
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

        public JsonResult InvoiceDetailGetBySalesOrderId(Int64 salesOrerId)
        {
            try
            {
                var list = Facade.exp_Invoice.InvoiceDetailGetBySalesOrderId(salesOrerId);
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

        public JsonResult InvoiceDetailDeleteByInvoiceId(Int64 invoiceId)
        {
            try
            {
                var list = Facade.exp_Invoice.InvoiceDetailDeleteByInvoiceId(invoiceId);
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

        public JsonResult PackingInfoGetByInvoiceId(Int64 invoiceId)
        {
            try
            {
                var list = Facade.exp_PackingInfo.GetDynamic("InvoiceId=" + invoiceId, string.Empty);
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
                error.FileName = "ExpInvoiceController";
                new ErrorLogInventoryController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public string Post(exp_Invoice exp_Invoice, List<exp_InvoiceDetail> invoiceDetailList, exp_PackingInfo exp_PackingInfo, exp_InvoiceDetail_TableHtml tableHtmlData, List<exp_InvoiceDetail_ModifiedData> modifiedDataList, List<exp_POReference> POReferencelist)
        {
            if (exp_Invoice.InvoiceNo == null)
                exp_Invoice.InvoiceNo = "";
            if (exp_Invoice.FinalDestination == null)
                exp_Invoice.FinalDestination = "";
            if (exp_Invoice.TypeOfCarrier == null)
                exp_Invoice.TypeOfCarrier = "";
            if (exp_Invoice.PlaceOfLoading == null)
                exp_Invoice.PlaceOfLoading = "";
            if (exp_Invoice.DescriptionOfGoods == null)
                exp_Invoice.DescriptionOfGoods = "";
            if (exp_Invoice.MasterContactNo == null)
                exp_Invoice.MasterContactNo = "";




            exp_Invoice.MasterContactDate = exp_Invoice.MasterContactDate == DateTime.MinValue ? DateTime.Now : exp_Invoice.MasterContactDate;

            exp_Invoice.UpdatedDate = DateTime.Now;
            string ret = string.Empty;
            Int64 invoiceId = 0;

            
            try
            {
                using (TransactionScope ts = new TransactionScope())
                {
					ret = Facade.exp_Invoice.Post(exp_Invoice);

					if (ret.Contains("successfully"))
						invoiceId = Convert.ToInt64(ret.Split(':')[1]);


					tableHtmlData.InvoiceId = invoiceId;
					Facade.exp_Invoice.AddInvoiceDetailTableHtmletail(tableHtmlData);


					//if (invoiceId > 0)
					//{
					foreach (exp_InvoiceDetail item in invoiceDetailList)
					{
						if (item.DescriptionTwo == null)
							item.DescriptionTwo = "";
						if (item.ContainerSize == null)
							item.ContainerSize = "";
						item.InvoiceId = invoiceId;
						Facade.exp_Invoice.AddDetail(item);
					}

					if (modifiedDataList.Count != null)
					{
						Facade.exp_Invoice.DeleteInvoiceDetailModifiedData(invoiceId);
					}
					foreach (var modifiedData in modifiedDataList)
					{
						if (modifiedData.Id == null)
						{
							modifiedData.Id = 0;
						}

						if (modifiedData.ColValue == null)
							modifiedData.ColValue = "";

						modifiedData.InvoiceId = invoiceId;

						Facade.exp_Invoice.AddInvoiceDetailModifiedData(modifiedData);
					}

                    if (POReferencelist != null && POReferencelist.Count > 0 && invoiceId > 0)
                    {
                        foreach (exp_POReference aPOReferencelist in POReferencelist)
                        {
                            Int64 PO_ret;

                            aPOReferencelist.DocumentId = invoiceId;
                            PO_ret = Facade.exp_POReferenceBLL.Add(aPOReferencelist);
                        }
                    }

                    if (exp_PackingInfo.PortOfLoading == null) exp_PackingInfo.PortOfLoading = "";
					if (exp_PackingInfo.PortOfDischarge == null) exp_PackingInfo.PortOfDischarge = "";
					if (exp_PackingInfo.FinalDestination == null) exp_PackingInfo.FinalDestination = "";
					if (exp_PackingInfo.CartonMeasurement == null) exp_PackingInfo.CartonMeasurement = "";
					exp_PackingInfo.UpdatedBy = exp_Invoice.UpdatedBy;
					exp_PackingInfo.UpdatedDate = DateTime.Now;
					exp_PackingInfo.InvoiceId = invoiceId;
					Facade.exp_PackingInfo.Add(exp_PackingInfo);

					ts.Complete();
                }
                
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ExportInvoiceController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }



        public JsonResult GetTableHtml(int? invoiceId = null)
        {
            try
            {
                var list = Facade.exp_Invoice.GetInvoiceDetailTableHtml(invoiceId);
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

        public JsonResult GetInvoiceDetailModifiedDataForUpdate(int invoiceId)
        {
            try
            {
                var list = Facade.exp_Invoice.GetInvoiceDetailModifiedDataForUpdate(invoiceId);
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


    }


}