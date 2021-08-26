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
    public class BankDocumentController : Controller
    {
        // GET: BankDocument
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllBankDocument()
        {
            try
            {
                var list = Facade.exp_BankDocument.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankDocumentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult GetAllBankDocumentDetail(int? BankDocumentId, int? BankDocumentDetailId)
        {
            try
            {
                var list = Facade.exp_BankDocumentDetail.GetAll(BankDocumentDetailId, BankDocumentId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "BankDocumentController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public Int64 Save(exp_BankDocument exp_BankDocument, List<exp_BankDocumentDetail> exp_BankDocumentDetail)
        {
            Int64 ret = 0;
            try
            {
                exp_BankDocument.UpdatedDate = DateTime.Now;

                Int64 bankDocumentId = exp_BankDocument.BankDocumentId;
                if (exp_BankDocument.BankDocumentId == 0)
                {
                    ret = Facade.exp_BankDocument.Add(exp_BankDocument);
                    bankDocumentId = ret;
                }
                else
                {

                    ret = Facade.exp_BankDocument.Update(exp_BankDocument);
                }

                foreach (var _exp_BankDocumentDetail in exp_BankDocumentDetail)
                {
                    
                    _exp_BankDocumentDetail.UpdatedDate = DateTime.Now;
                    Int64 bankDocumentDetailId = _exp_BankDocumentDetail.BankDocumentDetailId;

                    if (_exp_BankDocumentDetail.BankDocumentDetailId == 0)
                    {
                        _exp_BankDocumentDetail.BankDocumentId = bankDocumentId;
                        Facade.exp_BankDocumentDetail.Add(_exp_BankDocumentDetail);
                        bankDocumentDetailId = ret;
                    }
                    else
                    {
                        Facade.exp_BankDocumentDetail.Update(_exp_BankDocumentDetail);
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

        [HttpPost]
        public int DeleteBankDocumentName(int BankDocumentDetailId)
        {
            int ret = 0;
            try
            {
                ret = Facade.exp_BankDocumentDetail.Delete(BankDocumentDetailId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CustomerEntryController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }


    }
}