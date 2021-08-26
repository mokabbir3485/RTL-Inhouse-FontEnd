using PosBLL;
using PosEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class CashTransferController : Controller
    {
        [HttpPost]
        public Int64 Save(pos_CashDeposit _pos_CashDeposit)
        {
            if (_pos_CashDeposit.Remarks == null)
                _pos_CashDeposit.Remarks = "";
            _pos_CashDeposit.CreateDate = DateTime.Now;
            _pos_CashDeposit.UpdateDate = DateTime.Now;
            Int64 ret = 0;
            try
            {
                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    if (_pos_CashDeposit.DepositId == 0)
                    {
                        ret = Facade.pos_CashDeposit.Add(_pos_CashDeposit);
                    }
                    else
                    {
                        ret = Facade.pos_CashDeposit.Update(_pos_CashDeposit);
                    }
                    ts.Complete();
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "CashTransferController";
                new ErrorLogPosController().CreateErrorLog(error);
            }
            return ret;
        }
    }
}