using System;
using System.Collections.Generic;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class temp
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public int ScreenId { get; set; }
        public string ScreenName { get; set; }
        public string Description { get; set; }
        public List<s_ScreenDetail> DetailList { get; set; }
    }
    /*
    public class tempPermission
    {
        public bool CanView { get; set; }
        public string ModuleName { get; set; }
        public long PermissionId { get; set; }
        public int RoleId { get; set; }
        public int ScreenId { get; set; }
        public string ScreenName { get; set; }
        public List<s_PermissionDetail> DetailList { get; set; }
    }
    */
    public class PermissionController : Controller
    {
        public JsonResult GetAllScreen()
        {
            try
            {
                List<temp> t = new List<temp>();
                var list = Facade.Screen.GetAll();
                for (int i = 0; i < list.Count; i++)
                {
                    temp tt = new temp();
                    var lst2 = Facade.ScreenDetail.GetByScreenId(list[i].ScreenId);
                    tt.ModuleId = list[i].ModuleId;
                    tt.ModuleName = list[i].ModuleName;
                    tt.ScreenId = list[i].ScreenId;
                    tt.ScreenName = list[i].ScreenName;
                    tt.Description = list[i].Description;
                    tt.DetailList = lst2;
                    t.Add(tt);
                }

                return Json(t, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        /*
        public JsonResult GetDetailByScreenId(int screenId)
        {
            try
            {
                var List = Facade.ScreenDetail.GetByScreenId(screenId);
                return Json(List, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        */
        public JsonResult GetPermissionByRoleId(int roleId)
        {
            try
            {
                var permissionList = Facade.Permission.GetByRoleId(roleId);
                /*
                List<tempPermission> t = new List<tempPermission>();
                var list = Facade.Permission.GetByRoleId(roleId);
                for (int i = 0; i < list.Count; i++)
                {
                    tempPermission tt = new tempPermission();
                    var lst2 = Facade.PermissionDetail.GetByPermissionId(list[i].PermissionId);
                    tt.CanView = list[i].CanView;
                    tt.PermissionId = list[i].PermissionId;
                    tt.RoleId = list[i].RoleId;
                    tt.ModuleName = list[i].ModuleName;
                    tt.ScreenId = list[i].ScreenId;
                    tt.ScreenName = list[i].ScreenName;
                    tt.DetailList = lst2;
                    t.Add(tt);
                }

                return Json(t, JsonRequestBehavior.AllowGet);
                */
                return Json(permissionList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDetailByPermissionId(int permissionId)
        {
            try
            {
                var List = Facade.PermissionDetail.GetByPermissionId(permissionId);
                return Json(List, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
       
        /*
        [HttpPost]
        public int PermissionDeleteByRoleId(int roleId)
        {
            int ret = 0;
            try
            {
                ret = Facade.Permission.DeleteByRoleId(roleId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
            }

            return ret;
        }
        
        [HttpPost]
        public int SavePermission(s_Permission permission)
        {
            int ret = 0;
            try
            {
                permission.CreateDate = DateTime.Now;
                permission.UpdateDate = DateTime.Now;
                ret = Facade.Permission.Add(permission);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int SavePermissionDtl(s_PermissionDetail detail)
        {
            int ret = 0;
            try
            {
                return Facade.PermissionDetail.Add(detail);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }
        */

        [HttpPost]
        public int SavePermissionWithDetails(int roleId, List<s_Permission> PermissionLst, List<s_PermissionDetail> DetailList)
        {
            int ret = 0;
            using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
            {
                try
                {
                    ret = Facade.Permission.DeleteByRoleId(roleId);
                    foreach (s_Permission aPermission in PermissionLst)
                    {
                        aPermission.CreateDate = DateTime.Now;
                        aPermission.UpdateDate = DateTime.Now;
                        ret = Facade.Permission.Add(aPermission);

                        foreach (s_PermissionDetail aPermissionDetail in DetailList)
                        {
                            if (aPermission.ScreenId == aPermissionDetail.ScreenId)
                            {
                                aPermissionDetail.PermissionId = ret;
                                Facade.PermissionDetail.Add(aPermissionDetail);
                            }
                        }
                    }

                    ts.Complete();
                }
                catch (Exception ex)
                {
                    error_Log error = new error_Log();
                    error.ErrorMessage = ex.Message;
                    error.ErrorType = ex.GetType().ToString();
                    error.FileName = "PermissionController";
                    new ErrorLogController().CreateErrorLog(error);
                }
                return ret;
            }
        }
        //Screen Lock

        public JsonResult CheckScreenLock(int userId, int screenId)
        {
            try
            {
                var screenList = Facade.ScreenLock.GetByUserAndScreen(userId, screenId);
                return Json(screenList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public int CreateScreenLock(s_ScreenLock screenLock)
        {
            int ret = 0;
            try
            {
                ret = Facade.ScreenLock.Add(screenLock);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int RemoveScreenLock(int userId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ScreenLock.UnLockAll(userId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
            }

            return ret;
        }

        public JsonResult GetUsersPermissionDetails(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.PermissionDetail.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "PermissionController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}