using Security.UI.hub;
using SecurityEntity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;

namespace Security.UI.Controllers
{
    public class NoticeController : Controller
    {
        public IEnumerable<ad_Notice> GetNoticeD(Int64 UserId)
        {
            List<ad_Notice> noticeList = new List<ad_Notice>();
            try
            {

                using (SqlConnection con = Connection.GetConnection())
                {
                    using (SqlCommand command = new SqlCommand("ad_Notice_GetByUserId", con))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Notification = null;

                        SqlDependency.Start(ConfigurationManager.ConnectionStrings["dbCon"].ConnectionString);
                        SqlDependency dependency = new SqlDependency(command);
                        dependency.OnChange += new OnChangeEventHandler(dependency_OnChange);
                        command.Parameters.AddWithValue("UserId", UserId);

                        SqlDataReader reader = command.ExecuteReader();
                        while (reader.Read())
                        {
                            ad_Notice notice = new ad_Notice();
                            notice.NoticeId = Convert.ToInt32(reader["NoticeId"]);
                            notice.NoticeContent = reader["NoticeContent"].ToString();
                            notice.SenderName = reader["SenderName"].ToString();
                            notice.CreateDate = Convert.ToDateTime(reader["CreateDate"]);
                            noticeList.Add(notice);
                        }
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return noticeList;
        }
        private void dependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            NotificationHub.Show();
        }
        public JsonResult GetNotice(Int64 UserId)
        {
            return Json(GetNoticeD(UserId), JsonRequestBehavior.AllowGet);
        }
    }
    public class Connection
    {
        public static SqlConnection GetConnection()
        {
            string constring = ConfigurationManager.ConnectionStrings["dbCon"].ConnectionString;
            // string constring = @"Data Source=RAJON-PC\MSSQLSERVER_2014; Initial Catalog=SchoolProjectTesting; Persist Security Info=True; User ID=sa; Password=Touhid123;";
            SqlConnection con = new SqlConnection(constring);
            con.Open();
            return con;
        }
    }
}