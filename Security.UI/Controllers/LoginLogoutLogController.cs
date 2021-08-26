using SecurityBLL;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class LoginLogoutLogController : Controller
    {
        //
        // GET: /LoginLogoutLog/
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetUserCurrentStatus(int userId)
        {
            var list = Facade.LoginLogoutLog.GetLastByUserId(userId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
	}
}