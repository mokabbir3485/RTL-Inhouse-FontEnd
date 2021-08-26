using SecurityBLL;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Web.Mvc;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class UserController : Controller
    {
        public JsonResult GetUserForLogin(string userName, string password)
        {
            try
            {
                if (userName != null && password != null)
                {
                    password = EncryptPassword(password);
                }
                var list = Facade.User.GetByUsernameAndPassword(userName, password);
                if (list != null)
                {
                    System.Web.HttpContext.Current.Session["UserId"] = list.UserId;
                }
                return Json(list, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                return Json(error.ErrorMessage, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public int SaveLoginInfo(ad_LoginLogoutLog logInLogOutLog)
        {
            int ret = 0;
            System.Web.HttpContext.Current.Session["IP"] = logInLogOutLog.IpAddress;
            try
            {
                ret = Facade.LoginLogoutLog.Add(logInLogOutLog);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int UpdateLoginInfo(ad_LoginLogoutLog logInLogOutLog)
        {
            int ret = 0;
            try
            {
                ret = Facade.LoginLogoutLog.UpdateLogout(logInLogOutLog);

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int SaveUser(s_User user, List<s_UserDepartment> userDepartmentList)
        {
            int ret = 0;
            user.CreatorId = 1;
            user.CreateDate = DateTime.Now;
            user.UpdatorId = 1;
            user.UpdateDate = DateTime.Now;
            user.Password = EncryptPassword(user.Password);
            if (string.IsNullOrEmpty(user.SmsMobileNo))
                user.SmsMobileNo = "";
            if (string.IsNullOrEmpty(user.AuthorizationPassword))
                user.AuthorizationPassword = "";
            try
            {
                if (user.UserId == 0)
                {
                    ret = Facade.User.Add(user);

                    foreach (s_UserDepartment userDept in userDepartmentList)
                    {
                        userDept.UserId = ret;
                        Facade.s_UserDepartment.Add(userDept);
                    }
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int UpdateUser(s_User user, List<s_UserDepartment> userDepartmentList)
        {
            int ret = 0;
            user.CreatorId = 1;
            user.CreateDate = DateTime.Now;
            user.UpdatorId = 1;
            user.UpdateDate = DateTime.Now;
            user.Password = EncryptPassword(user.Password);
            if (string.IsNullOrEmpty(user.SmsMobileNo))
                user.SmsMobileNo = "";
            if (string.IsNullOrEmpty(user.AuthorizationPassword))
                user.AuthorizationPassword = "";
            try
            {
                ret = Facade.User.Update(user);

                foreach (s_UserDepartment userDept in userDepartmentList)
                {
                    userDept.UserId = user.UserId;
                    Facade.s_UserDepartment.Add(userDept);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int DeleteUser(int employeeId)
        {
            int ret = 0;
            try
            {
                ret = Facade.User.Delete(employeeId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public JsonResult GetUserByEmployeeId(int EmployeeId)
        {
            var roleList = Facade.User.GetByEmployeeId(EmployeeId);
            roleList.Password = DecryptPassword(roleList.Password);
            return Json(roleList, JsonRequestBehavior.AllowGet);
        }

        //Password Encrupt Decrypt;
        public static string EncryptPassword(string password)
        {
            byte[] encryptResults;
            UTF8Encoding UTF8 = new UTF8Encoding();
            MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
            byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(""));
            TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();
            TDESAlgorithm.Key = TDESKey;
            TDESAlgorithm.Mode = CipherMode.ECB;
            TDESAlgorithm.Padding = PaddingMode.PKCS7;
            byte[] DataToEncrypt = UTF8.GetBytes(password); /// it will encrypt your password
            try
            {
                ICryptoTransform Encryptor = TDESAlgorithm.CreateEncryptor();
                encryptResults = Encryptor.TransformFinalBlock(DataToEncrypt, 0, DataToEncrypt.Length);
            }
            finally
            {
                TDESAlgorithm.Clear();
                HashProvider.Clear();
            }
            return Convert.ToBase64String(encryptResults);
        }

        public static string DecryptPassword(string password)
        {
            byte[] Results;
            UTF8Encoding UTF8 = new UTF8Encoding();
            MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
            byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(""));
            TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();
            TDESAlgorithm.Key = TDESKey;
            TDESAlgorithm.Mode = CipherMode.ECB;
            TDESAlgorithm.Padding = PaddingMode.PKCS7;
            byte[] DataToDecrypt = Convert.FromBase64String(password); /// it will dycrpt your password
            try
            {
                ICryptoTransform Decryptor = TDESAlgorithm.CreateDecryptor();
                Results = Decryptor.TransformFinalBlock(DataToDecrypt, 0, DataToDecrypt.Length);
            }
            finally
            {
                TDESAlgorithm.Clear();
                HashProvider.Clear();
            }
            return UTF8.GetString(Results);
        }

        public JsonResult GetUserDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.User.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUserDepartmentByUserId(int userId)
        {
            try
            {
                var list = Facade.s_UserDepartment.GetByUserId(userId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUserStoreByUserId(int userId)
        {
            try
            {
                var list = Facade.s_UserDepartment.GetAllUserStore(userId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UserController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }
    }
}