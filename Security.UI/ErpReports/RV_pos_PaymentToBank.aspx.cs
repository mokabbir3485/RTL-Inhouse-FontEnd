﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_pos_PaymentToBank : System.Web.UI.Page
    {
        public DateTime FromDate = DateTime.Now;
        public DateTime ToDate = DateTime.Now;
        public string BranchId = string.Empty;
        public Int32? BankId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    FromDate = Convert.ToDateTime(Request.QueryString["FromDate"]);
                }
                catch (Exception)
                {
                    FromDate = DateTime.Now;
                }

                try
                {
                    ToDate = Convert.ToDateTime(Request.QueryString["ToDate"]);
                }
                catch (Exception)
                {
                    ToDate = DateTime.Now;
                }
                try
                {
                    BranchId = Convert.ToString(Request.QueryString["BranchId"]);
                }
                catch (Exception)
                {
                    BranchId = null;
                }
                try
                {
                    BankId = Convert.ToInt32(Request.QueryString["BankId"]);
                }
                catch (Exception)
                {
                    BankId = null;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["FromDate"] = FromDate;
            e.InputParameters["ToDate"] = ToDate;
            e.InputParameters["BranchId"] = BranchId;
            e.InputParameters["BankId"] = BankId;
        }
    }
}