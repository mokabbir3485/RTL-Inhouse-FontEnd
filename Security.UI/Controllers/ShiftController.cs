using Newtonsoft.Json;
using PosBLL;
using PosEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ShiftController : Controller
    {
        public JsonResult GetUsersShift(string searchCriteria, string orderBy)
        {

            try
            {
                var list = Facade.pos_Shift.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ShiftController";
                new ErrorLogPosController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public Int64 SaveShift(pos_Shift _pos_Shift)
        {
            _pos_Shift.OpenTime = DateTime.Now;
            _pos_Shift.IsClose = false;
            _pos_Shift.CurrencyId = 0;
            _pos_Shift.SystemOpenCash = _pos_Shift.InputOpenCash;

            //if (_pos_Shift.OwnCashIn == null) { _pos_Shift.OwnCashIn = 0; }
            //if (_pos_Shift.InputOpenCash == null) { _pos_Shift.InputOpenCash = 0; }

            Int64 ret = 0;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    ret = Facade.pos_Shift.Add(_pos_Shift);
                    ts.Complete();
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ShiftController";
                new ErrorLogPosController().CreateErrorLog(error);
            }
            return ret;
        }
        [HttpPost]
        public Int64 CloseShift(pos_Shift _pos_Shift)
        {
            _pos_Shift.CloseTime = DateTime.Now;
            _pos_Shift.IsClose = true;
            _pos_Shift.WithdrawnCash = 0;
            Int64 ret = 0;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    ret = Facade.pos_Shift.Update(_pos_Shift);
                    ts.Complete();
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ShiftController";
                new ErrorLogPosController().CreateErrorLog(error);
            }
            return ret;
        }
        public JsonResult GetSalePaymentByShift(int shiftId, string UserId)
        {
            try
            {
                var criteria = "S.UserId=" + UserId + " AND IsClose = 0";
                var Shift = Facade.pos_Shift.GetDynamic(criteria, "UserId");
                var ShiftDetails = JsonConvert.SerializeObject(Facade.pos_SalePayment.GetSalePaymentByShift(shiftId));
                var result = new { Shift = Shift, ShiftDetails = ShiftDetails };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ShiftController";
                new ErrorLogPosController().CreateErrorLog(error);
                return null;
            }
        }
    }
}