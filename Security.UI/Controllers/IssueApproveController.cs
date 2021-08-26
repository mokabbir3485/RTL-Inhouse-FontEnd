using InventoryEntity;
using System;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class IssueApproveController : Controller
    {
        //
        // GET: /IssueApprove/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public int IssueApproveDetail(inv_StockIssueDetail issueDetailApprove)
        {
            int ret = 0;
            try
            {
                //ret = 1;
                ret = InventoryBLL.Facade.StockIssueDetail.UpdateApprove(issueDetailApprove);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "IssueApproveController";
                new ErrorLogInventoryController().CreateErrorLog(error);
            }
            return ret;
        }
        
	}
}