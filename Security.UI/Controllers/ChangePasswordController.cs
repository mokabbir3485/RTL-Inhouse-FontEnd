using System;
using System.Security.Cryptography;
using System.Text;
using System.Web.Mvc;
using SecurityBLL;
using SecurityEntity;
using DbExecutor;

namespace Security.UI.Controllers
{
    public class ChangePasswordController : Controller
    {
        //
        // GET: /ChangePassword/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public int CheckOldPassword(int userId, string oldPassword)
        {
            int ret = 0;
            try
            {

                s_User s_User = Facade.User.GetByUserId(userId);
                if (s_User.Password == oldPassword)
                {
                    ret = 1;
                }
                else
                {
                    ret = 0;
                }

            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChangePasswordController";
                new ErrorLogController().CreateErrorLog(error);
            }
           
            return ret;
        }

        [HttpPost]
        public int ChangePasswordByUserId(s_User s_User)
        {
            int ret = 0;
            s_User.CreateDate = DateTime.Now;
            s_User.UpdateDate = DateTime.Now;
            if (string.IsNullOrEmpty(s_User.AuthorizationPassword))
                s_User.AuthorizationPassword = "";
            try
            {
                s_User.Password = EncryptPassword(s_User.Password);
                ret = Facade.User.UpdatePassword(s_User);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "ChangePasswordController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
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

	}
}