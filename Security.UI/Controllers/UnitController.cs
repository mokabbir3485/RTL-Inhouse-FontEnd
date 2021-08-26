using SecurityBLL;
using SecurityEntity;
using System;
using System.Web.Mvc;
using DbExecutor;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.IO;

namespace Security.UI.Controllers
{
    public class UnitController : Controller
    {

        public JsonResult GetAllUnit()
        {
            try
            {
                var list = Facade.ItemUnit.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UnitController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUnitPaged(int StartRecordNo, int RowPerPage, int rows)
        {
            try
            {
                var customMODEntity = new
                {
                    ListData = Facade.ItemUnit.GetPaged(StartRecordNo, RowPerPage, "", "UnitName", "ASC", ref rows),
                    TotalRecord = rows
                };
                return Json(customMODEntity, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UnitController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUnitDynamic(string searchCriteria, string orderBy)
        {
            try
            {
                var list = Facade.ItemUnit.GetDynamic(searchCriteria, orderBy);
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UnitController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUnitType()
        {
            try
            {
                var list = Facade.UnitConversion.GetAll();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UnitController";
                new ErrorLogController().CreateErrorLog(error);
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public int Save(ad_ItemUnit unit)
        {
            int ret = 0;
            try
            {
                unit.CreateDate = DateTime.Now;
                unit.UpdateDate = DateTime.Now;

                if (unit.ItemUnitId == 0)
                {
                    ret = Facade.ItemUnit.Add(unit);
                }
                else
                {
                    ret = Facade.ItemUnit.Update(unit);
                }
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UnitController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }

        [HttpPost]
        public int Delete(int ItemUnitId)
        {
            int ret = 0;
            try
            {
                ret = Facade.ItemUnit.Delete(ItemUnitId);
            }
            catch (Exception ex)
            {
                error_Log error = new error_Log();
                error.ErrorMessage = ex.Message;
                error.ErrorType = ex.GetType().ToString();
                error.FileName = "UnitController";
                new ErrorLogController().CreateErrorLog(error);
            }
            return ret;
        }


        private string _ConnectionString = ConfigurationManager.ConnectionStrings["dbCon"].ToString();
        public void Backup()
        {
            //BackupDatabase("D:\\","ARMalikDb_Ishwardi");

            string _BackupName = "ShahjalalStore" + "_" + DateTime.Now.Day.ToString() + "_" + DateTime.Now.Month.ToString() + "_" + DateTime.Now.Year.ToString() + ".bak";

            SqlConnection sqlConnection = new SqlConnection();
            sqlConnection.ConnectionString = _ConnectionString;
            sqlConnection.Open();
            // string sqlQuery = "BACKUP DATABASE " + _DatabaseName + " TO DISK = 'D:\\New folder\\" + _BackupName + "' WITH FORMAT, MEDIANAME = 'Z_SQLServerBackups', NAME = '" + _BackupName + "';";
            string sqlQuery = "BACKUP DATABASE APOS TO DISK = 'D:\\" + _BackupName + "'WITH INIT;";
            SqlCommand sqlCommand = new SqlCommand(sqlQuery, sqlConnection);
            sqlCommand.CommandType = CommandType.Text;
            int iRows = sqlCommand.ExecuteNonQuery();
            sqlConnection.Close();






           // String YourFilepath = "D:\\ELMS2017-4-29-577.bak";
           // System.IO.FileInfo file = new System.IO.FileInfo(YourFilepath); // full file path on disk
           // Response.ClearContent(); // neded to clear previous (if any) written content
           // Response.AddHeader("Content-Disposition", "attachment; filename=" + file.Name);
           // Response.AddHeader("Content-Length", file.Length.ToString());
           // Response.ContentType = "text/plain";
           // Response.TransmitFile(file.FullName);
           // Response.End();


           
            
        }

        public bool BackupDatabase(string path, string dbName)
        {
            string sql = "";
            string sqlNow = "";
            sql = "";
            sqlNow = DateTime.Now.ToString("yyyy_MM_dd__hh_mm");

            //CancelTrans();
            sql = "sp_addumpdevice 'disk', '@Database_Device_" + sqlNow + "','" + path + "@Database" + sqlNow + "'";
            sql = sql.Replace("@Database", dbName);

            //Execute(sql);
            SqlConnection _dbConnection = new SqlConnection(_ConnectionString);
            _dbConnection.Open();
            SqlCommand _dbCommand = new SqlCommand(sql, _dbConnection);

            int affectedRows = _dbCommand.ExecuteNonQuery();

            sql = ("BACKUP DATABASE @Database TO @Database_Device_" + sqlNow).Replace("@Database", dbName);
            _dbCommand = new SqlCommand(sql, _dbConnection);

            _dbCommand.CommandTimeout = int.MaxValue;
            affectedRows = _dbCommand.ExecuteNonQuery();

            return true;
        }
    }
}