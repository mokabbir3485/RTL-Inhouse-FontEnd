﻿app.controller("DeliveryChallanReportController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    Clear();

    function Clear() {
        GetCIMasterByCIid();
        GetCIInfoDetailReport();
        GetTableHtmlForCi();
        $scope.PONoList = [];
        $scope.PODateList = [];
        GetPOReference();
        GetDateTimeFormat();
        $scope.disQtyAmount = true;
        $scope.disUnmage = true;
        $scope.disMage = true;
        $scope.disDrag = true;
        $scope.disSort = true;
        
    }
     
    function GetDateTimeFormat() {
        function formatDate(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
        }
        var currentDatetime = new Date();
        $scope.currentDatetimeFormated = formatDate(currentDatetime);

    }

    function GetPOReference() {
        $http({
            url: '/ExpCommercialInvoice/GetPOReference?DocType=CI' + "&DocumentId=" + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length) {


                $scope.POReferencelist = [];
                angular.forEach(data, function (aPODetail) {
                    var res2 = aPODetail.PODate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aPODetail.PODate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd.MM.yyyy')).toString();
                        aPODetail.PODate = date1;
                    }
                    $scope.PONoList.push(aPODetail.PONo);
                    $scope.PODateList.push(aPODetail.PODate);
                    $scope.POReferencelist.push(aPODetail);
                })

            }

        });
    }

    function GetCIMasterByCIid() {
        $http({
            url: '/ExpCommercialInvoice/GetCIMasterByInvoiceId?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CommercialInvoiceMasterList = data;
            $scope.CommercialInvoiceMasterList[0].PiRefNo = $scope.CommercialInvoiceMasterList[0].PiRefNo.split(",");
            $scope.CommercialInvoiceMasterList[0].PiRefDate = $scope.CommercialInvoiceMasterList[0].PiRefDate.split(",");

            //$scope.CommercialInvoiceMasterList[0].PONo = $scope.CommercialInvoiceMasterList[0].PONo.split(",");
            //$scope.CommercialInvoiceMasterList[0].PODate = $scope.CommercialInvoiceMasterList[0].PODate.split(",");

            $("#exporterInfo").append($scope.CommercialInvoiceMasterList[0].ExporterInfo);
            $("#exporterBankInfo").append($scope.CommercialInvoiceMasterList[0].ExporterBankInfo);
            $scope.CommercialInvoiceMasterList[0].CommercialInvoiceNo= $scope.CommercialInvoiceMasterList[0].CommercialInvoiceNo.replace("CI", "DC");


            //$('#dc tbody tr td table:first-child').find('p').text(function () {
            //    //$(this).css('background', 'red');
            //    $scope.CommercialInvoiceMasterList[0].CommercialInvoiceNo = $(this).text().replace("CI", "DC");

            //})
        });
    }

    function GetCIInfoDetailReport() {
        $http({
            url: '/ExpCommercialInvoice/GetCIInfoDetailReport?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CiInfoDetailReportList = data;
        });
    }


    function GetTableHtmlForCi() {
        $http({
            url: '/ExpCommercialInvoice/GetTableHtmlForCi?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.TableHtmlForCi = data;

            var SubTable = $scope.TableHtmlForCi[0].HtmlData.split('<thead>');
            var margeSubTable = '<table id="ciTable" border="1" class="JCLRFlex" style="width: 100% !important; font-size: .9em; font-family: "Times New Roman", Times, serif; color:#000000; text-align: center; margin:0; padding:0;"> <thead>' + SubTable[1];

            var removeTfoot1 = margeSubTable.split('<tfoot>');
            var removeTfoot2 = removeTfoot1[1].split('</tfoot>');
            var tfootPart = removeTfoot2[0];
            var splitWithTbody = margeSubTable.split('</tbody>');
            var tfootIntoTbody = splitWithTbody[0] + tfootPart + '</tbody>' + removeTfoot2[1];

            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }
            function replaceAll(str, term, replacement) {
                return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
            }

            $("#HtmlData").append(tfootIntoTbody);
            $('#ciTable thead tr th:eq(0)').html("Sl No");

            $('#ciTable tbody tr td').each(function () {
                var preStyle = $(this).attr("style");
                if (preStyle != undefined) {
                    var pos = preStyle.indexOf("display: none;");
                    var finalStyle;
                    if (pos == -1) {
                        $(this).attr("contenteditable", false);
                        finalStyle = 'text-align: center; padding: 0 !important; margin: 0 !important;';
                    }
                    else {
                        $(this).remove();
                    }

                } 
                $(this).css("cssText", finalStyle);
            });
            $('#ciTable tbody tr').each((indextr, tr) => {
                $(tr).children('td').each((indextd, td) => {
                    if (indextd > $('#ciTable thead tr th').length - 4) {
                        var tdvalue = parseFloat(td.innerText);
                        td.innerText = parseFloat(tdvalue).toLocaleString('en');
                    }
                });
            });
            //var descriptionIndex;
            //$('#ciTable thead tr').each((tndextr, tr) => {
            //    $(tr).children('th').each((indexth, th) => {
            //        if (th.innerHTML == 'Description Of Goods') {
            //            descriptionIndex = indexth;
            //        }
            //    });
            //});
            //$('#ciTable tbody tr').each((indextr, tr) => {
            //    $(tr).children('td').each((indextd, td) => {
            //        if (indextd == descriptionIndex) {
            //            var preStyles = $(td).attr("style");
            //            var pos = preStyles.indexOf("text-align: center;");
            //            var finalStyles
            //            if (pos != -1) {
            //                preStyles = replaceAll(preStyles, 'text-align: center;', 'text-align: left !important;');
            //                preStyles = replaceAll(preStyles, 'padding: 0px !important;', 'padding-top: 0px !important; padding-bottom: 0px !important; padding-right: 0px !important; padding-left: 5px !important;');
            //                finalStyles = preStyles;

            //            }
            //            else {
            //                preStyles = replaceAll(preStyles, 'padding: 0px !important;', 'padding-top: 0px !important; padding-bottom: 0px !important; padding-right: 0px !important; padding-left: 5px !important;');
            //                finalStyles = preStyles + ' text-align: left !important;';
            //            }


            //            $(td).css("cssText", finalStyles);
            //        }
            //    });
            //});
            var remainderQty = 0;
            var jqueryFun = $('#ciTable tbody tr').eq($('#ciTable tbody tr').length - 1).find('td').eq($('#ciTable thead tr th').length - 3);
            var itemQuantity = jqueryFun.prevObject.prevObject.prevObject[$('#ciTable tbody tr').length - 1].children[$('#ciTable thead tr th').length - 3].innerHTML;
            var parseItemQuantity = parseInt(itemQuantity);
            remainderQty = itemQuantity - parseItemQuantity;
            itemQuantity = parseFloat(itemQuantity);

            if (remainderQty > 0) {
                jqueryFun.prevObject.prevObject.prevObject[$('#ciTable tbody tr').length - 1].children[$('#ciTable thead tr th').length - 3].innerHTML = itemQuantity.toLocaleString('en', { minimumFractionDigits: 2 });
            }
            else {
                jqueryFun.prevObject.prevObject.prevObject[$('#ciTable tbody tr').length - 1].children[$('#ciTable thead tr th').length - 3].innerHTML = parseFloat(parseItemQuantity).toLocaleString('en');
            }

            $('#ciTable tbody').find("span").each(function () {
                $(this).css("white-space", "pre-line");
            });

            //$('#ciTable tbody tr td:eq(1)').each(function () {
            //    $(this).css({ 'font-size': '14px', 'max-width': '100px', 'width': '130px' });
            //});
            $("#ciTable tbody tr").each(function () {
                var firstChild = $(this).children(':first');
                firstChild.text('');
            });

            $('#ciTable thead tr th').each(function () {
                $(this).attr("contenteditable", false);
            });

        });
        

    }

    //Display Row Number
    $("#HtmlData").on("click",
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            //$(e).toggleClass("red-cell");
            if ($(e.target).is("#ciTable tbody tr td")) {
                $("#ciTable tbody tr td").each(function () {
                    $(this).css("background", "#F5F5F5");
                });
                $(e.target).css("background", "yellow");


                var column_num = parseInt($(e.target).index()) + 1; //need this one
                var row_num = parseInt($(e.target).parent().index()) + 1;

                $("#result").html("<h3>Row Number: " + row_num + "  ,  Column Number: " + column_num + "</h3>");
                
            }
            
        });

    $scope.ShowTotalQuantityAndAmount = function (checked) {
        if (checked) {
            $('#ciTable tbody tr:last-child').each(function (tdIndex, tr) {
                tr.children[tr.children.length - 2].innerHTML = 'Total Quantity ';

            })
        }
        else {
            $('#ciTable tbody tr:last-child').each(function (tdIndex, tr) {
                tr.children[tr.children.length - 2].innerHTML = '';
            })
        }
        $('#ciTable tbody tr th:nth-last-child(2)').each(function () {
            //$(this).css('background', 'red');
            $(this).removeClass("t-cell-center");
            $(this).css('text-align', 'right');
            $(this).css("padding-right", "5px");
        })
    }

    $scope.ShowDollar = function (checked) {
        if (checked) {
            $('#ciTable tbody tr th:nth-last-child(1)').each(function () {
                //$(this).css('background', 'red');
                $(this).removeClass("t-cell-center");
                $(this).css("padding-right", "10px");
                $(this).css('text-align', 'right');
                $(this).append("<span style = 'float: left; text-indent :1em;'>$</span>");
            })
            $('#ciTable tbody tr td:nth-last-child(-n+2)').each(function () {
                //$(this).css('background', 'red');
                $(this).removeClass("t-cell-center");
                $(this).css("padding-right", "10px");
                $(this).css('text-align', 'right');
                $(this).append("<span style = 'float: left; text-indent :1em;'>$</span>");
            })
        } 
        else {
            $('#ciTable tbody tr th:nth-last-child(1)').each(function () {
                $("#ciTable tbody tr th:nth-last-child(1)").find("span").remove();
            })

            $('#ciTable tbody tr td:nth-last-child(-n+2)').each(function () {
                $("#ciTable tbody tr td:nth-last-child(-n+2)").find("span").remove();
            })

        }

    }

    //Sort & resize 
    $scope.tableSortResize = function () {
        unMerged();
        $('#ciTable thead th').removeClass('sorter-false');
        $("#ciTable").trigger("update");
        //$('#ciTable thead th').removeClass('sorter-false');
        $("#ciTable th:nth-last-child(1)").each(function () {
            $(this).attr("id", "disSort");
        });
        $("#ciTable th:nth-child(1)").each(function () {
            $(this).attr("id", "disSort");
        });
        $("#ciTable").tablesorter({
            widgets: ["resizable"],
            widgetOptions: {
                // storage_useSessionStorage : true, deprecated in v2.28.8
                // use first letter (s)ession
                resizable_addLastColumn: true

            },
            headers: {
                '#disSort': {
                    sorter: false
                },
            }
        })
        //    .on("sortEnd", function () {
        //    $(this).find('tbody td:first-child').text(function (i) {
        //        return i + 1;
        //    });
        //});
        $scope.isRemoved = true;

    }

    $scope.mergeTableData = function () {
        $('#ciTable thead th').addClass('sorter-false');
        var dimension_col = null;
        dimension_col = 1;
        // first_instance holds the first instance of identical td
        var first_instance = null;
        var rowspan = 1;
        var columnCount = $("#ciTable tr:first th").length;
        //	for (dimension_col = 1; dimension_col <= columnCount; dimension_col++) {
        var i;
        var currnt_image_list = prompt("Please enter your Cloumn Number", ""); //'2,4,5';
        var substr = currnt_image_list.split(","); // array here
        for (i = 0; i < substr.length; ++i) {
            //alert(Number(substr[i]));

            dimension_col = Number(substr[i]);

            var first_instance = null;
            var rowspan = 1;
            $("#ciTable").find("tr:visible").each(function () {
                var dimension_td = $(this).find("td:nth-child(" + dimension_col + "):visible");
                if (first_instance == null) {
                    // must be the first row 
                    first_instance = dimension_td;
                } else if (dimension_td.text().replace(/\s/g, '') == first_instance.text().replace(/\s/g, '') &&
                    dimension_td.text().replace(/\s/g, '') != "") {
                    // the current td is identical to the previous
                    // remove the current td
                    //var myBg = dimension_td.css('background-color');
                    dimension_td.hide();
                    ++rowspan;
                    // increment the rowspan attribute of the first instance
                    first_instance.attr("rowspan", rowspan);
                    first_instance.css("vertical-align", "middle");
                    first_instance.css("background-color", "#FFFFFF");
                } else {
                    // this cell is different from the last
                    first_instance = dimension_td;
                    rowspan = 1;
                }
            });

        }


    };

    //UNMERGE
    function unMerged() {

        $temp = $("#ciTable td[rowspan]");

        $temp.each(function () {
            $(this).removeAttr("rowspan"); 
        });

        $("#ciTable td:hidden").show();

        $("#ciTable td").css("background-color", "");
        $("#ciTable tr:not(:has(th))").css("background-color", "#FFFFFF");
        $("#ciTable tr:not(:has(th)):odd").css("background-color", "#FFFFFF");
        $("#ciTable thead tr").each(function () {
            $("th").show();
        });

        $("#ciTable tbody tr").each(function () {
            $("td").show();
        }
        );

        $scope.isRemoved = false;
    }

    $scope.unmergeTableData = function () {
        //$scope.isFinalized = false;

        unMerged();
    };
    $scope.alignLeft = function () {
        $scope.disAlign = true;
        $scope.disQtyAmount = false;
        $scope.disUnmage = false;
        $scope.disMage = false;
        $scope.disDrag = false;
        $scope.disSort = false;
        $('#ciTable tbody tr td:nth-child(2)').each(function () {
            //$(this).css('background', 'red');
            $(this).removeClass("t-cell-center");
            $(this).css("padding-left", "5px");
            $(this).attr("contenteditable", true);
        })
        $('#ciTable tbody tr td:nth-child(3)').each(function () {
            //$(this).css('background', 'red');
            $(this).removeClass("t-cell-center");
            $(this).css("padding-left", "5px");
            $(this).attr("contenteditable", true);
        })
        //$('#ciTable tbody tr td:nth-last-child(4)').each(function () {
        //    //$(this).css('background', 'red');
        //    $(this).attr("contenteditable", true);
        //})
        //$("#ciTable tbody tr td:nth-last-child(4)").keydown(function (e) {
        //    if (e.keyCode !== 13 && e.keyCode !== 17 && e.keyCode !== 90) {
        //        e.preventDefault();
        //    }
        //});
        $("#ciTable tbody tr td:nth-child(2)").keydown(function (e) {
            if (e.keyCode !== 13 && e.keyCode !== 17 && e.keyCode !== 90) {
                e.preventDefault();
            }
        });

        $("#ciTable tbody tr td:nth-child(3)").keydown(function (e) {
            if (e.keyCode !== 13 && e.keyCode !== 17 && e.keyCode !== 90) {
                e.preventDefault();
            }
        });

        $('#ciTable tbody tr th:nth-last-child(-n+2)').each(function () {
            //$(this).css('background', 'red');
            $(this).remove();

        })
        $('#ciTable tbody tr td:nth-last-child(-n+2)').each(function () {
            //$(this).css('background', 'red');
            $(this).remove();

        })
        $('#ciTable thead tr th:nth-last-child(-n+2)').each(function () {
            //$(this).css('background', 'red');
            $(this).remove();

        })
        $('#HtmlData').show();

        $('#footer').each(function () {
            $(this).attr("contenteditable", true);
        })

        $("#footer").keydown(function (e) {
            if (e.keyCode !== 13 && e.keyCode !== 17 && e.keyCode !== 90 && e.keyCode !== 8) {
                e.preventDefault();
            }
        });

        $('#ciTable tbody tr:last-child').each(function (tdIndex, tr) {
            tr.children[tr.children.length - 2].innerHTML = 'Total Quantity ';

        })

        $('#ciTable tbody tr th:nth-last-child(2)').each(function () {
            //$(this).css('background', 'red');
            $(this).removeClass("t-cell-center");
            $(this).css('text-align', 'right');
            $(this).css("padding-right", "5px");
        })

    }

    $scope.enableDrag = function () {
        $("#ciTable th:not(:nth-last-child(1)").each(function () {
            $(this).attr("id", "txtInput");
        });
        $("#ciTable th:nth-child(1)").each(function () {
            $(this).attr("id", "");
        });
        $('#ciTable tbody').sortable();
        $scope.hideSortBtn = true;
        var r = confirm("Please Sort Before Enable Drag-Drop");
        if (r == true) {
            $('#ciTable').dragtable({ dragaccept: '#txtInput' });
        }
        else {
            alertify.confirm().destroy();
        }
    }

    $scope.ShowPackInfo = function (checked) {
        $scope.showPackInfo = checked;
    }
    

});