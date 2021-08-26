using Newtonsoft.Json;
using PosBLL;
using PosEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class OfferController : Controller
    {
        //
        // GET: /Offer/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public Int64 SaveOffer(pos_Offer _pos_Offer, List<pos_OfferDetail> pos_OfferDetailLts)
        {
            _pos_Offer.CreateDate = DateTime.Now;
            _pos_Offer.UpdateDate = DateTime.Now;
            Int64 ret = 0;
            try
            {
                if (_pos_Offer.OfferId == 0)
                {
                    ret = Facade.pos_Offer.Add(_pos_Offer);
                    if (pos_OfferDetailLts != null && pos_OfferDetailLts.Count > 0)
                    {
                        foreach (pos_OfferDetail apos_OfferDetailLts in pos_OfferDetailLts)
                        {
                            apos_OfferDetailLts.OfferId = ret;
                            Facade.pos_OfferDetail.Add(apos_OfferDetailLts);
                        }
                    }
                }
                else
                {
                    ret = Facade.pos_Offer.Update(_pos_Offer);
                    foreach (pos_OfferDetail apos_OfferDetailLts in pos_OfferDetailLts)
                    {
                        if (pos_OfferDetailLts != null && pos_OfferDetailLts.Count > 0)
                        {
                            apos_OfferDetailLts.OfferId = _pos_Offer.OfferId;
                            Facade.pos_OfferDetail.Add(apos_OfferDetailLts);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OfferController";
                new ErrorLogPosController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetAll()
        {
            try
            {
                var list = Facade.pos_Offer.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OfferController";
                new ErrorLogPosController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAllDetail(int OfferId)
        {
            try
            {
                var list = Facade.pos_OfferDetail.GetByOfferId(OfferId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "OfferController";
                new ErrorLogPosController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public string GetTopPrecentageOff(DateTime saleDate)
        {
            try
            {
                DataTable dt = Facade.pos_Offer.GetTopPrecentageOff(saleDate);
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
    }
}