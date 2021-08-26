using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using System.Web.Mvc;
using DbExecutor;
using System.Net;
using ExportBLL;
using ExportDAL;
using ExportEntity;

namespace Security.UI.Controllers
{
    public class CertificateOfOriginController : Controller
    {
        // GET: CertificateOfOrigin
        public ActionResult Index()
        {
            return View();
        }

        //public JsonResult GetAllCertificateOfOrigin()
        //{
        //    try
        //    {
        //        var list = Facade.exp_PackingInfo.GetAll();
        //        return Json(list, JsonRequestBehavior.AllowGet);
        //    }

        //    catch (Exception ex)
        //    {
        //        error_Log error = new error_Log();
        //        error.ErrorMessage = ex.Message;
        //        error.ErrorType = ex.GetType().ToString();
        //        error.FileName = "CertificateOfOriginController";
        //        new ErrorLogController().CreateErrorLog(error);
        //        return Json(null, JsonRequestBehavior.AllowGet);
        //    }

        //}

        public JsonResult GetAllPackingInfo()
        {
            try
            {
                var list = Facade.exp_PackingInfo.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult GetConsumptionCertificatePaged(int startRecordNo, int rowPerPage, string whereClause, int rows)
        {
            // whereClause = "[SO].[SalesOrderDate] between '2020-10-16' and '2020-10-20'";
            //  whereClause = "[SO].[SalesOrderDate]'2020-10-17' between '20/11/2020'";
            try
            {

                var customMODEntity = new
                {

                    ListData = Facade.exp_ConsumptionCertificate.GetPaged(startRecordNo, rowPerPage, whereClause, "CommercialInvoiceNo", "ASC", ref rows),
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

        public JsonResult GetDynamic(string whereCondition, string orderByExpression)
        {
            try
            {
                var list = Facade.exp_ConsumptionCertificate.GetDynamic(whereCondition, orderByExpression);
                string contentType = "application/json";
                return Json(list, contentType, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }




        public JsonResult GetDynamicCertificateOfOrigin(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.exp_PackingInfo.GetDynamic(searchCriteria, orderBy);
                string contentType = "application/json";
                return Json(list, contentType, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public Int64 SaveCoo(exp_PackingInfo exp_PackingInfo)
        {
            exp_PackingInfo.UpdatedDate = DateTime.Now;
            Int64 ret = 0;
            try
            {
                if (exp_PackingInfo.PackingInfoId == 0)
                {
                    ret = Facade.exp_PackingInfo.Add(exp_PackingInfo);
                }
                else
                {
                    ret = Facade.exp_PackingInfo.UpdateCertificateOfOrigin(exp_PackingInfo);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }



        //GetConsumptionCertificateReport





        public Int64 SaveCc(List<exp_ConsumptionCertificateDescription> _exp_ConsumptionCertificateDescription, exp_ConsumptionCertificate exp_ConsumptionCertificate, List<exp_ConsumptionCertificateRawMaterials> exp_ConsumptionCertificateRawMaterials)
        {
            Int64 ret = 0;
            try
            {
                if (exp_ConsumptionCertificate.BillOfEntryNo == null) { exp_ConsumptionCertificate.BillOfEntryNo = ""; }
                if (exp_ConsumptionCertificate.BillOfEntryDate == null) { exp_ConsumptionCertificate.BillOfEntryDate = ""; }
                if (exp_ConsumptionCertificate.EpzPermissionNo == null) { exp_ConsumptionCertificate.EpzPermissionNo = ""; }
                if (exp_ConsumptionCertificate.EpzPermissionDate == null) { exp_ConsumptionCertificate.EpzPermissionDate = ""; }
                exp_ConsumptionCertificate.UpdatedDate = DateTime.Now;

                Int64 consumptionCertificateId = exp_ConsumptionCertificate.ConsumptionCertificateId;
                if (exp_ConsumptionCertificate.ConsumptionCertificateId == 0)
                {

                    ret = Facade.exp_ConsumptionCertificate.Add(exp_ConsumptionCertificate);
                    consumptionCertificateId = ret;
                }
                else
                {
                    ret = exp_ConsumptionCertificate.ConsumptionCertificateId;
                    Facade.exp_ConsumptionCertificate.Update(exp_ConsumptionCertificate);

                }

                if (exp_ConsumptionCertificateRawMaterials != null && exp_ConsumptionCertificateRawMaterials.Count > 0 && ret > 0)
                {
                    foreach (var _exp_ConsumptionCertificateRawMaterials in exp_ConsumptionCertificateRawMaterials)
                    {

                        _exp_ConsumptionCertificateRawMaterials.UpdatedDate = DateTime.Now;
                        Int64 od_ret;


                        if (_exp_ConsumptionCertificateRawMaterials.ConsumptionCertificateRawMaterialsId == 0)
                        {
                            _exp_ConsumptionCertificateRawMaterials.ConsumptionCertificateId = ret;
                            od_ret = Facade.exp_ConsumptionCertificateRawMaterials.Add(_exp_ConsumptionCertificateRawMaterials);
                        }
                        else
                        {
                            Facade.exp_ConsumptionCertificateRawMaterials.Update(_exp_ConsumptionCertificateRawMaterials);
                        }

                    }

                    foreach (var _exp_ConsumptionCertifDescription in _exp_ConsumptionCertificateDescription)
                    {
                        _exp_ConsumptionCertifDescription.UpdatedDate = DateTime.Now;
                        Int64 conCerDescription;


                        if (_exp_ConsumptionCertifDescription.ConsumptionCertificateId == 0)
                        {
                            _exp_ConsumptionCertifDescription.ConsumptionCertificateId = ret;
                            conCerDescription = Facade.exp_ConsumptionCertificateDescription.Add(_exp_ConsumptionCertifDescription);
                        }


                    }

                }


            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpGet]
        public JsonResult GetAllCertificateOforigin()
        {

            try
            {
                var list = Facade.exp_ConsumptionCertificateDescription.GetAll();


                // string contentType = "application/json";
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult GetAllCertificateOforiginType(Int64 CommercialInvoiceId, string CertificateType)
        {

            try
            {


                var certificateOfOriginList = Facade.exp_ExpReports.GetForCertificateOfOrigin(CommercialInvoiceId, CertificateType);
                // string contentType = "application/json";
                return Json(certificateOfOriginList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetChalanReportNoTwoList(Int64 CommercialInvoiceId)
        {

            try
            {

                var certificateOfOriginList = Facade.exp_ExpReports.GetDeliveryChalanGetReport(CommercialInvoiceId);
                // string contentType = "application/json";
                return Json(certificateOfOriginList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult GetChalanReportNoTwoDetails(Int64 CommercialInvoiceId)
        {

            try
            {

                var chalanDetails = Facade.exp_ExpReports.GetDeliveryChalanGetReportDetails(CommercialInvoiceId);
                // string contentType = "application/json";
                return Json(chalanDetails, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult ConsuptionCertificate(Int64 CommercialInvoiceId)
        {

            try
            {
                var list = Facade.exp_ConsumptionCertificate.GetByConsumptionCertificateForReports(CommercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult GetAllConsuptionCertificate()
        {

            try
            {
                var list = Facade.exp_ConsumptionCertificate.GetAll();

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ConsumptionCertificateRawMatrialDelete(Int64 ConsumptionCertificateRawMatrialId)
        {

            try
            {
                var list = Facade.exp_ConsumptionCertificateRawMaterials.Delete(ConsumptionCertificateRawMatrialId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetConsumptionCertificateReport(int ciId)
        {
            try
            {
                var list = Facade.exp_ConsumptionCertificate.GetByConsumptionCertificateForReports(ciId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "CertificateOfOriginController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult ConsuptionCertificateRawMatrial(Int64 CommercialInvoiceId)
        {

            try
            {
                var list = Facade.exp_ConsumptionCertificateRawMaterials.GetByConsumptionCertificateRawMetrialByCiId(CommercialInvoiceId);

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CertificateOfOriginController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }



        public JsonResult GetDescriptionOfGoods(int ciId)
        {
            try
            {
                var list = Facade.exp_ConsumptionCertificateDescription.Get_DescriptionOfGoods(ciId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "CertificateOfOriginController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDescriptionOfGoodsUpdate(Int64? ConsumptionCertificateId, Int64? ConsumptionCertificateDescriptionId)
        {
            try
            {
                var list = Facade.exp_ConsumptionCertificateDescription.GetAll(ConsumptionCertificateDescriptionId, ConsumptionCertificateId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log
                {
                    ErrorMessage = ex.Message,
                    ErrorType = ex.GetType().ToString(),
                    FileName = "CertificateOfOriginController"
                };
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }




    }
}
