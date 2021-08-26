﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Security.UI.ErpReports
{
    public partial class RV_Pos_SalesOrderBySalesOrderId : System.Web.UI.Page
    {
        public Int64 SalesOrderId = 0;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    SalesOrderId = Convert.ToInt64(Request.QueryString["SalesOrderId"]);
                }
                catch (Exception)
                {
                    SalesOrderId = 0;
                }
            }
        }

        protected void ObjectDataSource1_Selecting(object sender, ObjectDataSourceSelectingEventArgs e)
        {
            e.InputParameters["SalesOrderId"] = SalesOrderId;
        }
    }
}