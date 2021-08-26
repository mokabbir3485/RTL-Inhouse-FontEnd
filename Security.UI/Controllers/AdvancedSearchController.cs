using Newtonsoft.Json;
using SecurityBLL;
using SecurityEntity;
using System;
using System.Data;
using System.Web.Mvc;
using DbExecutor;
using System.Data.SqlClient;
using System.Configuration;

namespace Security.UI.Controllers
{
    public class AdvancedSearchController : Controller
    {
        //
        // GET: /AdvancedSearch/
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllSearchTableColumn()
        {

            try
            {
                int screenId = 0;
                if (System.Web.HttpContext.Current.Session["ScreenId"] != null)
                {
                    screenId = Convert.ToInt32(System.Web.HttpContext.Current.Session["ScreenId"].ToString());

                }
                var list = Facade.AdvancedSearchProperty.GetColumnNames(screenId);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int AddScreenId(int screenId)
        {
            int ret = 0;

            try
            {
                System.Web.HttpContext.Current.Session["ScreenId"] = screenId;
                ret = 1;
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public void SetScreenIdsToSession(int screenId, int fromScreenId)
        {

            try
            {
                System.Web.HttpContext.Current.Session["ScreenId"] = screenId;
                System.Web.HttpContext.Current.Session["FromScreenId"] = fromScreenId;
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
            }
        }

        public string GetSearchResult(string craitaria)
        {
            try
            {
                int screenId = 0;
                if (System.Web.HttpContext.Current.Session["ScreenId"] != null)
                {
                    screenId = Convert.ToInt32(System.Web.HttpContext.Current.Session["ScreenId"].ToString());
                    //System.Web.HttpContext.Current.Session["Craitaria"] = craitaria;

                }

                int fromScreenId = 0;
                if (System.Web.HttpContext.Current.Session["FromScreenId"] != null)
                {
                    fromScreenId = Convert.ToInt32(System.Web.HttpContext.Current.Session["FromScreenId"].ToString());
                    //System.Web.HttpContext.Current.Session["Craitaria"] = craitaria;
                }

                DataTable dt = Facade.AdvancedSearchProperty.SearchByScreenId(screenId, fromScreenId, craitaria);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }

        public string GetSearchResultForApproval(int screenId, int fromScreenId)
        {
            try
            {
                DataTable dt = Facade.AdvancedSearchProperty.SearchByScreenId(screenId, fromScreenId, " 1=1 ");
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }

        public string GetItemSearchCriteria()
        {
            try
            {
                string SearchCriteria = "";
                if (System.Web.HttpContext.Current.Session["Craitaria"] != null)
                {
                    SearchCriteria = System.Web.HttpContext.Current.Session["Craitaria"].ToString();
                    System.Web.HttpContext.Current.Session["Craitaria"] = "";
                }

                return SearchCriteria;
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }

        [HttpPost]
        public int SetSearchId(int id)
        {
            int ret = 0;

            try
            {
                System.Web.HttpContext.Current.Session["SearchId"] = id;
                ret = 1;
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        public string GetSearchId()
        {
            try
            {
                string id = "";
                if (System.Web.HttpContext.Current.Session["SearchId"] != null)
                {
                    id = System.Web.HttpContext.Current.Session["SearchId"].ToString();
                    System.Web.HttpContext.Current.Session["SearchId"] = null;
                }
                return id;
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }

        public string GetSearchResultForApprovalDetails(int screenId, string Pkid)
        {
            try
            {
                DataTable dt = Facade.AdvancedSearchProperty.GetDetail(screenId, Pkid);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "AdvancedSearchController";
                new ErrorLogController().CreateErrorLog(error);
                return null;
            }
        }

        public int GetNewPunchCount(string branchName)
        {
            System.Diagnostics.Process.Start("D:\\DD\\DataDownload.WIN.exe");

            int ret = 0;

            string lastPunch = Facade.AdvancedSearchProperty.GetLastPunch(branchName);

            string qry = "SELECT COUNT(*) FROM [CHECKINOUT] WHERE [CHECKTIME]>'" + lastPunch + "'";

            string connString = string.Empty;

            try
            {
                if (branchName == "Uttara")
                    connString = System.Configuration.ConfigurationManager.ConnectionStrings["dbConUttara"].ConnectionString;
                else if (branchName == "Savar")
                    connString = System.Configuration.ConfigurationManager.ConnectionStrings["dbConSavar"].ConnectionString;
            }
            catch (Exception)
            {
                ret = -1;
            }


            if (!string.IsNullOrEmpty(connString))
            {
                using (SqlConnection con = new SqlConnection(connString))
                {
                    using (var cmd = new SqlCommand(qry, con))
                    {
                        try
                        {
                            con.Open();
                            var dr = cmd.ExecuteReader();
                            ret = dr.Read() ? dr.GetInt32(0) : 0;
                        }
                        catch (Exception)
                        {
                            ret = 0;
                        }

                    }
                }
            }

            return ret;
        }

        public int UploadPunch(string branchName, int count)
        {
            int ret = 0;

            string lastPunch = Facade.AdvancedSearchProperty.GetLastPunch(branchName);

            string connString = string.Empty;

            try
            {
                if (branchName == "Uttara")
                    connString = System.Configuration.ConfigurationManager.ConnectionStrings["dbConUttara"].ConnectionString;
                else if (branchName == "Savar")
                    connString = System.Configuration.ConfigurationManager.ConnectionStrings["dbConSavar"].ConnectionString;
            }
            catch (Exception)
            {
                ret = -1;
            }

            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(connString))
            {
                try
                {
                    con.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter("SELECT TOP " + count + " * FROM [CHECKINOUT] WHERE [CHECKTIME]>'" + lastPunch + "' ORDER BY [CHECKTIME]", con))
                    {
                        da.Fill(dt);
                    }
                }
                catch (Exception)
                {
                    ret = -1;
                }
            }

            if (dt.Rows.Count > 0)
            {
                string conName = string.Empty;
                if (branchName == "Uttara")
                    conName = "dbConAttUttara";
                else if (branchName == "Savar")
                    conName = "dbConAttSavar";

                using (SqlBulkCopy bulkCopy = new SqlBulkCopy((ConfigurationManager.ConnectionStrings[conName]).ToString()))
                {
                    bulkCopy.DestinationTableName = "dbo.[CHECKINOUT]";

                    bulkCopy.ColumnMappings.Add("USERID", "USERID");
                    bulkCopy.ColumnMappings.Add("CHECKTIME", "CHECKTIME");
                    bulkCopy.ColumnMappings.Add("CHECKTYPE", "CHECKTYPE");
                    bulkCopy.ColumnMappings.Add("VERIFYCODE", "VERIFYCODE");
                    bulkCopy.ColumnMappings.Add("SENSORID", "SENSORID");
                    bulkCopy.ColumnMappings.Add("Memoinfo", "Memoinfo");
                    bulkCopy.ColumnMappings.Add("WorkCode", "WorkCode");
                    bulkCopy.ColumnMappings.Add("sn", "sn");
                    bulkCopy.ColumnMappings.Add("UserExtFmt", "UserExtFmt");
                    bulkCopy.WriteToServer(dt);
                    ret = 1;
                }
            }
            else
                ret = -2;

            return ret;
        }
    }
}