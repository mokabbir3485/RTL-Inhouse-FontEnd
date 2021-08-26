using DbExecutor;
using Newtonsoft.Json;
using PosBLL;
using PosEntity;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class SaleController : Controller
    {
        public JsonResult GetHasPOS()
        {
            try
            {
                var HasPo = System.Configuration.ConfigurationManager.AppSettings["HasPOS"].ToString();
                return Json(HasPo, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        public JsonResult GetPOSScreenFull()
        {
            try
            {
                bool POSScreenFull = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["POSScreenFull"]);
                return Json(POSScreenFull, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        public JsonResult SaleDetailAdAttributeGetByDepartmentAndBarcode(Int32 departmentId, string barcode)
        {
            try
            {
                var res = Facade.pos_SaleDetailAdAttribute.GetByDepartmentAndBarcode(departmentId, barcode);
                return Json(res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        [HttpPost]
        public string SaveSale(pos_Sale _pos_Sale, List<pos_SaleDetail> pos_SaleDetailLst, List<pos_SaleDetailCharge> pos_SaleDetailChargeLst, List<pos_SaleDetailFree> pos_SaleDetailFreeLst, List<pos_SalePayment> pos_SalePaymentLst, ad_Customer nonRegCustomer, List<pos_SaleDetailAdAttribute> pos_SaleDetailAdAttributeLst)
        {
            _pos_Sale.CreateDate = DateTime.Now;
            _pos_Sale.UpdateDate = DateTime.Now;
            string ret = string.Empty;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    string nonRegCusCode = string.Empty;
                    if (nonRegCustomer != null && nonRegCustomer.CustomerId == 0 && nonRegCustomer.Mobile != null && nonRegCustomer.Mobile != "" && nonRegCustomer.FirstName != null && nonRegCustomer.FirstName != "")
                    {
                        nonRegCustomer.Title = string.IsNullOrEmpty(nonRegCustomer.Title) ? "" : nonRegCustomer.Title;
                        nonRegCustomer.FirstName = string.IsNullOrEmpty(nonRegCustomer.FirstName) ? "" : nonRegCustomer.FirstName;
                        nonRegCustomer.MiddleName = string.IsNullOrEmpty(nonRegCustomer.MiddleName) ? "" : nonRegCustomer.MiddleName;
                        nonRegCustomer.LastName = string.IsNullOrEmpty(nonRegCustomer.LastName) ? "" : nonRegCustomer.LastName;
                        // nonRegCustomer.BranchId = string.IsNullOrEmpty(nonRegCustomer.BranchId) ? 0 : nonRegCustomer.BranchId;
                        nonRegCustomer.CustomerTypeId = 0;
                        nonRegCustomer.DateOfBirth = _pos_Sale.CreateDate;
                        nonRegCustomer.Gender = "Male";
                        nonRegCustomer.CustomerCode = nonRegCustomer.Web = nonRegCustomer.TradingAs = string.Empty;
                        nonRegCustomer.IsActive = true;
                        nonRegCustomer.IsPayable = false;
                        nonRegCustomer.ManualCustomerCode = "";
                        nonRegCustomer.CreatorId = nonRegCustomer.UpdatorId = _pos_Sale.CreatorId;
                        nonRegCustomer.CreateDate = nonRegCustomer.UpdateDate = _pos_Sale.CreateDate;
                        nonRegCusCode = SecurityBLL.Facade.Customer.Add(nonRegCustomer);
                        if (nonRegCusCode != null && nonRegCusCode != string.Empty)
                        {
                            ad_CustomerAddress cusAddress = new ad_CustomerAddress();
                            cusAddress.CustomerCode = nonRegCusCode;
                            cusAddress.AddressType = "Mailing";
                            cusAddress.Mobile = nonRegCustomer.Mobile;
                            cusAddress.Address = cusAddress.ContactPerson = cusAddress.ContactDesignation = cusAddress.Phone = cusAddress.Email = cusAddress.Fax = string.Empty;
                            cusAddress.IsDefault = true;
                            cusAddress.CreatorId = cusAddress.UpdatorId = _pos_Sale.CreatorId;
                            cusAddress.CreateDate = cusAddress.UpdateDate = _pos_Sale.CreateDate;
                            SecurityBLL.Facade.CustomerAddress.Add(cusAddress);
                            _pos_Sale.CustomerCode = nonRegCusCode;
                        }
                    }
                    else if (nonRegCustomer.CustomerId > 0)
                    {
                        _pos_Sale.CustomerCode = nonRegCustomer.CustomerCode;
                    }
                    if (_pos_Sale.SaleId == 0)
                    {
                        ret = Facade.pos_Sale.Add(_pos_Sale);
                        foreach (pos_SaleDetail apos_SaleDetail in pos_SaleDetailLst)
                        {
                            apos_SaleDetail.InvoiceNo = ret;
                            apos_SaleDetail.Quantity = pos_SaleDetailAdAttributeLst.Where(i => i.ItemId == apos_SaleDetail.ItemId).Sum(s => s.AttributeQty);
                            Int64 saleDetailId = Facade.pos_SaleDetail.Add(apos_SaleDetail);
                            if (pos_SaleDetailAdAttributeLst != null && pos_SaleDetailAdAttributeLst.Count > 0)
                            {
                                foreach (pos_SaleDetailAdAttribute apos_SaleDetailAdAttribute in pos_SaleDetailAdAttributeLst)
                                {
                                    if (apos_SaleDetailAdAttribute.ItemId == apos_SaleDetail.ItemId)
                                    {
                                        apos_SaleDetailAdAttribute.SaleDetailId = saleDetailId;
                                        if (pos_SaleDetailFreeLst != null && pos_SaleDetailFreeLst.Count > 0)
                                        {
                                            apos_SaleDetailAdAttribute.AttributeQtyFree = pos_SaleDetailFreeLst.Where(p => p.ItemAddAttId == apos_SaleDetailAdAttribute.ItemAddAttId).Sum(s => s.FreeQuantity);
                                        }
                                        else
                                        {
                                            apos_SaleDetailAdAttribute.AttributeQtyFree = 0;
                                        }
                                        Facade.pos_SaleDetailAdAttribute.Add(apos_SaleDetailAdAttribute);
                                    }
                                }
                            }
                            if (pos_SaleDetailChargeLst != null && pos_SaleDetailChargeLst.Count > 0)
                            {
                                foreach (pos_SaleDetailCharge apos_SaleDetailCharge in pos_SaleDetailChargeLst)
                                {
                                    if (apos_SaleDetailCharge.SaleDetailId == apos_SaleDetail.SaleDetailId)
                                    {
                                        apos_SaleDetailCharge.SaleDetailId = saleDetailId;
                                        apos_SaleDetailCharge.ChargeAmount = apos_SaleDetailCharge.ChargeAmount * apos_SaleDetail.Quantity;
                                        Facade.pos_SaleDetailCharge.Add(apos_SaleDetailCharge);
                                    }
                                }
                            }
                        }
                        foreach (pos_SalePayment apos_SalePayment in pos_SalePaymentLst)
                        {
                            apos_SalePayment.InvoiceNo = ret;
                            apos_SalePayment.CurrencyId = 1;
                            if (apos_SalePayment.CardNumber == "" || apos_SalePayment.CardNumber == null) { apos_SalePayment.CardNumber = ""; }
                            if (apos_SalePayment.CardName == "" || apos_SalePayment.CardName == null) { apos_SalePayment.CardName = ""; }
                            if (apos_SalePayment.RefNumber == "" || apos_SalePayment.RefNumber == null) { apos_SalePayment.RefNumber = ""; }

                            if (apos_SalePayment.PaymentTypeName.ToLower() == "cash")
                            {
                                apos_SalePayment.Amount = (apos_SalePayment.Amount - _pos_Sale.ChangeAmount);
                            }

                            Facade.pos_SalePayment.Add(apos_SalePayment);
                        }
                        ts.Complete();
                    }
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                ret = "";
            }

            return ret;
        }

        /*
        [HttpPost]
        public int SaveSaleVoid(pos_Sale _pos_Sale, List<pos_SaleDetail> pos_SaleDetailLst)
        {
            _pos_Sale.CreateDate = DateTime.Now;
          
            Int32 ret = 0;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    ret = Facade.pos_Sale.UpdateIsVoid(_pos_Sale);
                    if (ret > 0)
                    {
                        foreach (pos_SaleDetail a_pos_SaleDetailLst in pos_SaleDetailLst)
                        {
                            Facade.pos_SaleDetail.UpdateIsVoid(a_pos_SaleDetailLst);
                        }
                        ts.Complete();
                    }
                }
            }
            catch (Exception ex)
            {
                ret = 0;
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
            }
            return ret;

        }
        */

        public string GetInvoiceMasterBy(string InvoiceNo)
        {
            try
            {
                DataTable dt = Facade.pos_Sale.GetByInvoiceNo(InvoiceNo);
                List<pos_SaleDetail> Exchangedetails = new List<pos_SaleDetail>();
                string MemoNo = (from DataRow dr in dt.Rows select (string)dr["MemoNo"]).FirstOrDefault();
                if (MemoNo != "N/A")
                {
                    Exchangedetails = Facade.pos_SaleDetail.GetByInvoiceNoForExchange(MemoNo);
                }

                var InvoiceDetails = Facade.pos_SaleDetail.GetByInvoiceNo(InvoiceNo);
                var FreeDetails = Facade.pos_SaleDetail.GetFreeByInvoiceNo(InvoiceNo);
                var result = new { InvoiceMaster = JsonConvert.SerializeObject(dt), Exchangedetails = Exchangedetails, InvoiceDetails = InvoiceDetails, FreeDetails = FreeDetails };
                return JsonConvert.SerializeObject(result);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        public string GetInvoiceNo(int terminalId, DateTime saleDate)
        {
            try
            {
                DataTable dt = Facade.pos_Sale.GetInvoiceNo(terminalId, saleDate);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }

        public string GetItemOfferInfo(DateTime saleDate, int itemId, int saleUnitId, decimal quantity)
        {
            try
            {
                DataTable dt = Facade.pos_Offer.GetItemOfferInfo(saleDate, itemId, saleUnitId, quantity);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        /*
        public string MatchAuthorizationPassword(int roleId, string pass)
        {
            try
            {
                DataTable dt = Facade.pos_Sale.MatchAuthorizationPassword(roleId, pass);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        */
        public JsonResult GetSaleDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.pos_Sale.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogPosController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetSaleDetailById(string invoiceNo)
        {
            try
            {
                var list = Facade.pos_SaleDetail.GetByInvoiceNo(invoiceNo);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "DepartmentController";
                new ErrorLogPosController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        /*
        public string GetMonthlyComparison()
        {
            try
            {
                DataTable dt = Facade.pos_Sale.GetMonthlyComparison();
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        */
        /*
        public JsonResult GetSaleAndDetailsByInvoiceNo(string InvoiceNo, string DepertmentId)
        {
            try
            {
                string whereCondition = "InvoiceNo='" + InvoiceNo + "' AND SaleDate='" + System.DateTime.Now.Date + "' AND DepartmentId=" + DepertmentId + " AND RefInvoiceNo='' AND IsVoid=0";
                var SaleMaster = JsonConvert.SerializeObject(Facade.pos_Sale.GetDynamic(whereCondition, "CustomerName"));
                var SaleDetails = Facade.pos_SaleDetail.GetByInvoiceNo(InvoiceNo);
                var SalePayment = Facade.pos_SalePayment.GetByInvoiceNo(InvoiceNo);
                if (SaleMaster == "[]")
                {
                    SaleDetails = null;
                    SalePayment = null;
                }

                var result = new { SaleMaster = SaleMaster, SaleDetails = SaleDetails, SalePayment = SalePayment };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
        */
        /*
        [HttpPost]
        public string SaveReIssueSale(pos_Sale _pos_Sale, List<pos_SaleDetail> pos_SaleDetailLst, List<pos_SalePayment> pos_SalePaymentLst, pos_Sale Pre_pos_Sale, List<pos_SaleDetail> Pre_pos_SaleDetailLst)
        {
            _pos_Sale.CreateDate = DateTime.Now;
            _pos_Sale.UpdateDate = DateTime.Now;
            string ret = string.Empty;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    if (_pos_Sale.RefCustomerCode == "" || _pos_Sale.RefCustomerCode == null) { _pos_Sale.RefCustomerCode = ""; }

                    ret = Facade.pos_Sale.Add(_pos_Sale);
                    foreach (pos_SaleDetail apos_SaleDetail in pos_SaleDetailLst)
                    {
                        apos_SaleDetail.InvoiceNo = ret;
                        Int64 saleDetailId = Facade.pos_SaleDetail.Add(apos_SaleDetail);
                    }
                    foreach (pos_SalePayment apos_SalePayment in pos_SalePaymentLst)
                    {
                        apos_SalePayment.InvoiceNo = ret;
                        Facade.pos_SalePayment.Add(apos_SalePayment);
                    }

                    Pre_pos_Sale.VoidDate = DateTime.Now;
                    Pre_pos_Sale.VoidBy = _pos_Sale.CreatorId;
                    Pre_pos_Sale.VoidReason = "For ReIssue (" + ret + ")";
                    Pre_pos_Sale.IsVoid = true;
                    int retVoid = Facade.pos_Sale.UpdateIsVoid(Pre_pos_Sale);
                    if (retVoid > 0)
                    {
                        foreach (pos_SaleDetail a_pos_SaleDetail in Pre_pos_SaleDetailLst)
                        {
                            Facade.pos_SaleDetail.UpdateIsVoid(a_pos_SaleDetail);
                        }
                    }
                    
                    ts.Complete();
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "SaleController";
                new ErrorLogPosController().CreateErrorLog(error);
            }
            return ret;
        }
        */
    }
}