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
    public class SaleExchangeController : Controller
    {
        public JsonResult GetReturnDays()
        {
            try
            {
                int days = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["ReturnIndays"]);
                return Json(days, JsonRequestBehavior.AllowGet);
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
        public string SaveSale(pos_Sale _pos_Sale, List<pos_SaleDetail> pos_SaleDetailLst, List<pos_SaleDetail> exchange_pos_SaleDetailLst, List<pos_SaleDetailCharge> pos_SaleDetailChargeLst, List<pos_SaleDetailFree> pos_SaleDetailFreeLst, List<pos_SalePayment> pos_SalePaymentLst, ad_Customer nonRegCustomer, List<pos_SaleDetailAdAttribute> pos_SaleDetailAdAttributeLst, List<pos_SaleDetailAdAttribute> exchangePos_SaleDetailAdAttributeLst)
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
                                        if (pos_SaleDetailFreeLst != null )
                                        {
                                            apos_SaleDetailAdAttribute.AttributeQtyFree = pos_SaleDetailFreeLst.Where(p => p.ItemAddAttId == apos_SaleDetailAdAttribute.ItemAddAttId).Sum(s => s.FreeQuantity);
                                        }
                                        else
                                        {
                                            apos_SaleDetailAdAttribute.AttributeQtyFree = 0;
                                        }
                                        apos_SaleDetailAdAttribute.SaleDetailId = saleDetailId;
                                        Facade.pos_SaleDetailAdAttribute.Add(apos_SaleDetailAdAttribute);
                                    }
                                }
                            }
                            if (pos_SaleDetailFreeLst != null && pos_SaleDetailFreeLst.Count > 0)
                            {
                                foreach (pos_SaleDetailFree apos_SaleDetailFree in pos_SaleDetailFreeLst)
                                {
                                    if (apos_SaleDetailFree.SaleDetailId == apos_SaleDetail.SaleDetailId)
                                    {
                                        apos_SaleDetailFree.SaleDetailId = saleDetailId;
                                        Facade.pos_SaleDetailFree.Add(apos_SaleDetailFree);
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
                        if (exchange_pos_SaleDetailLst != null && exchange_pos_SaleDetailLst.Count>0)
                        {
                            foreach (pos_SaleDetail aexchange_pos_SaleDetailLst in exchange_pos_SaleDetailLst)
                            {
                               // aexchange_pos_SaleDetailLst.Quantity = aexchange_pos_SaleDetailLst.Quantity * -1;
                                Int64 saleDetailId = Facade.pos_SaleDetail.Add(aexchange_pos_SaleDetailLst);
                                if (exchangePos_SaleDetailAdAttributeLst != null && exchangePos_SaleDetailAdAttributeLst.Count > 0)
                                {
                                    foreach (pos_SaleDetailAdAttribute apos_SaleDetailAdAttribute in exchangePos_SaleDetailAdAttributeLst)
                                    {
                                        if (apos_SaleDetailAdAttribute.ItemId == aexchange_pos_SaleDetailLst.ItemId)
                                        {
                                            apos_SaleDetailAdAttribute.AttributeQty = aexchange_pos_SaleDetailLst.Quantity;
                                            apos_SaleDetailAdAttribute.SaleDetailId = saleDetailId;
                                            Facade.pos_SaleDetailAdAttribute.Add(apos_SaleDetailAdAttribute);
                                        }
                                    }
                                }
                                if (pos_SaleDetailFreeLst != null && pos_SaleDetailFreeLst.Count > 0)
                                {
                                    foreach (pos_SaleDetailFree apos_SaleDetailFree in pos_SaleDetailFreeLst)
                                    {
                                        if (apos_SaleDetailFree.SaleDetailId == aexchange_pos_SaleDetailLst.SaleDetailId)
                                        {
                                            apos_SaleDetailFree.SaleDetailId = saleDetailId;
                                            Facade.pos_SaleDetailFree.Add(apos_SaleDetailFree);
                                        }
                                    }
                                }
                                if (pos_SaleDetailChargeLst != null && pos_SaleDetailChargeLst.Count > 0)
                                {
                                    foreach (pos_SaleDetailCharge apos_SaleDetailCharge in pos_SaleDetailChargeLst)
                                    {
                                        if (apos_SaleDetailCharge.SaleDetailId == aexchange_pos_SaleDetailLst.SaleDetailId)
                                        {
                                            apos_SaleDetailCharge.SaleDetailId = saleDetailId;
                                            apos_SaleDetailCharge.ChargeAmount = apos_SaleDetailCharge.ChargeAmount * aexchange_pos_SaleDetailLst.Quantity;
                                            Facade.pos_SaleDetailCharge.Add(apos_SaleDetailCharge);
                                        }
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
                var result = new { InvoiceMaster = JsonConvert.SerializeObject(dt), Exchangedetails = Exchangedetails, InvoiceDetails = InvoiceDetails };
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
    }
}