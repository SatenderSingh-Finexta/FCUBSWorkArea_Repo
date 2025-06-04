var objHTTP = null;
var LOVResponseDOM = null;
var LOVAccResponseDOM = null;
var accountData;
var customerData;
var branchCode;
var accountNumber;
var accountObject;
var customerObject;
var brnCode = "";
var mainWin = parent;
var serverURL = "BranchServlet";
var SessionDetails = "";
var timeout_responseXML = "<RESP>TIMEOUT</RESP>";
var timeout_responseText = "TIMEOUT";
var xref = "BRDUMMYCUSTQUERY";
var func = "QRYC";
var brnStat = "";
var dataDOMMAIN = null;
var objHTTP = null;
var ns = "xmlns:fcubs='http://fcubs.iflex.com'";
var strImgInfo = "";
var strSigInfo = "";
var gcurrpage = "1";
var cell1;
var cell2;
var cell3;
var cell4;
var next = "next";
var prev = "prev";
var grecpage = "1";
var accountData = new Array;
var custData = new Array;
var accDataArray = new Array;
var strCustData = "";
var strAccData = "";
var gCurrPage_Cust = "1";
var gCurrPage_Acc = "1";
var custDetails = "";
var listOfAcc = "";
var gCustDataArr = new Array();
var gAccDataArr = new Array();
function fnCSrchKeyEvents(event) {
    var event = window.event || event;
    if (event.keyCode == 13) {
        var eventElem = getEventSourceElement(event);
        if (eventElem.name != "LinkedCustomers") {
            fnCustomerQuery();
            preventpropagate(event);
            return false;
        }
    }
    if (event.keyCode == 120) {
        var eventElem = getEventSourceElement(event);
        if (eventElem.tagName == "INPUT" && eventElem.type.toUpperCase() == "TEXT") {
            if (typeof (eventElem.parentNode.getElementsByTagName("BUTTON")[0]) != "undefined") {
                eventElem.parentNode.getElementsByTagName("BUTTON")[0].click();
                preventpropagate(event);
                return false;
            }
        }
    }
}
function fnEscape(p_Value) {
    var l_Value = p_Value;
    var dquote = new RegExp('"',"g");
    var squote = new RegExp("'","g");
    var newLine = new RegExp("\n","g");
    l_Value = l_Value.replace(dquote, "&dq");
    l_Value = l_Value.replace(squote, "&sq");
    l_Value = l_Value.replace(newLine, "&nl");
    return l_Value;
}
function fnUnEscape(p_Value) {
    var l_Value = p_Value;
    l_Value = l_Value.replace(/&dq/g, '"');
    l_Value = l_Value.replace(/&sq/g, "'");
    l_Value = l_Value.replace(/&nl/g, "\n");
    return l_Value;
}
function fnCustomerQuery(myflag, currpage) {
    mainWin.fnUpdateScreenSaverInterval();
    if (mainWin.CustomerObj != null) {
        alert(mainWin.getItemDesc("LBL_END_PREV_CUST_SESSION"));
        return;
    }
    gCurrPage_Cust = 1;
    clearDisplayedTabs();
    strImgInfo = "";
    strSigInfo = "";
    var labelListOfAcc = mainWin.getItemDesc("LBL_LIST_OF_ACC");
    var labelAccNumber = mainWin.getItemDesc("LBL_ACC_NUMBER");
    var labelBranchCode = mainWin.getItemDesc("LBL_BRANCH_CODE");
    var labelSearchResult = mainWin.getItemDesc("LBL_SEARCH_RESULT");
    var labelCustSearchResult = mainWin.getItemDesc("LBL_CUST_SEARCH_RESULT");
    var labelCustNumber = mainWin.getItemDesc("LBL_CUST_NUMBER");
    var labelCustName = mainWin.getItemDesc("LBL_CUST_NAME");
    var labelAccClass = mainWin.getItemDesc("LBL_ACC_CLASS");
    var labelAccCcy = "";
    var labelDftAcc = "";
    var KatakanaCustName = "";
    var HiraganaCustName = "";
    var multiCurrAccno = "";
    var KanjiCustName = "";
    if (mainWin.applicationExt == "JP") {
        labelAccCcy = mainWin.getItemDesc("LBL_ACCNT_CCY");
        labelDftAcc = mainWin.getItemDesc("LBL_DFT_ACC");
        KanjiCustName = document.getElementById("KanjiCustName").value;
        KatakanaCustName = document.getElementById("KatakanaCustName").value;
        HiraganaCustName = document.getElementById("HiraganaCustName").value;
        multiCurrAccno = document.getElementById("MultiCurrAccNo").value;
    }
    var msgType = "NONWORKFLOW";
    var name = document.getElementById("CustName").value;
    var cfid = document.getElementById("CFid").value;
    var custidval = document.getElementById("CustIdentifier").value;
    var custacno = document.getElementById("CustAccountNo").value;
    var brnacno = document.getElementById("CustBrn").value;
    if (mainWin.applicationExt == "JP") {
        if (name == "%" && cfid == "%" && custidval == "%" && custacno == "%" && brnacno == "%" && document.getElementById("Pid").value == "%" && KanjiCustName == "%" && KatakanaCustName == "%" && HiraganaCustName == "%" && multiCurrAccno == "%") {
            alert(mainWin.getItemDesc("LBL_ENTER_SEARCHCRITERIA"));
            return;
        }
    } else {
        if (name == "%" && cfid == "%" && custidval == "%" && custacno == "%" && brnacno == "%") {
            alert(mainWin.getItemDesc("LBL_ENTER_SEARCHCRITERIA"));
            return;
        }
    }
    var pidSearch = "N";
    if (mainWin.applicationExt == "JP") {
        if (document.getElementById("Pid").value != "" && document.getElementById("Pid").value != "%") {
            pidSearch = "Y";
        }
    }
    var multiccyacSearch = "N";
    if (mainWin.applicationExt == "JP") {
        if (document.getElementById("MultiCurrAccNo").value != "" && document.getElementById("MultiCurrAccNo").value != "%") {
            multiccyacSearch = "Y";
        }
    }
    if (document.getElementById("LinkedCustomers").checked == true) {
        var LinkedCust = "Y";
    } else {
        var LinkedCust = "N";
    }
    objHTTP = createHTTPActiveXObject();
    if (custacno == "%") {
        if (myflag == "next") {
            gCurrPage_Cust = parseInt(currpage) + 1;
        } else {
            if (myflag == "prev") {
                gCurrPage_Cust = parseInt(currpage) - 1;
            }
        }
        if (typeof (myflag) != "undefined") {
            fnCustSearchPost(msgType, name, cfid, custidval, brnacno, LinkedCust, pidSearch, multiccyacSearch, myflag, gCurrPage_Cust);
        } else {
            fnCustSearchPost(msgType, name, cfid, custidval, brnacno, LinkedCust, pidSearch, multiccyacSearch);
        }
        if (dataDOM == null) {
            return;
        }
        var dataXML = getXMLString(dataDOM);
        if (objHTTP.status == 200) {
            if (getBrowser().indexOf("IE") != -1) {
                dataDOM.setProperty("SelectionNamespaces", ns);
            }
            var quote = new RegExp('"',"g");
            dataXML = dataXML.replace(quote, "\\'");
            var newLine = new RegExp("\n","g");
            dataXML = dataXML.replace(newLine, "");
            fnCreateCustomerHtml(gCurrPage_Cust);
            var data = getNodeText(selectSingleNode(dataDOM, "//FCUBS_RES_ENV"));
            data = trimTildaAtEnd(data);
            data = data.substring(0, data.lastIndexOf("!"));
            try {
                data = trim(data);
                data = trimTildaAtEnd(data);
                var dataarray = data.split("~");
                var index = 0;
                var resultTable = document.getElementById("CustQueryResults");
                var tBodyElem = resultTable.tBodies[0];
                var rowLength = resultTable.tBodies[0].rows.length;
                if (dataarray.length >= rowLength) {
                    document.getElementById("custTabBtnPrev1").disabled = false;
                    addEvent(document.getElementById("custTabBtnPrev1"), "onclick", "fnCustomerQuery( '" + prev + "'," + gCurrPage_Cust + ")");
                    document.getElementById("custTabBtnNext1").disabled = false;
                    addEvent(document.getElementById("custTabBtnNext1"), "onclick", "fnCustomerQuery( '" + next + "'," + gCurrPage_Cust + ")");
                }
                for (var rowCnt = 0; rowCnt < rowLength; rowCnt++) {
                    if (dataarray.length > index && data != "") {
                        dataarray[index] = dataarray[index].replace("!", "");
                        var custinfo = dataarray[index] + "~" + dataarray[index + 1];
                        custinfo = fnEscape(custinfo);
                        addEvent(tBodyElem.rows[rowCnt].cells[0], "onkeydown", "return handleCustQueryKeyDownEvents(event)");
                        quote = new RegExp("'","g");
                        custinfo = custinfo.replace(quote, "&apos;");
                        tBodyElem.rows[rowCnt].cells[0].innerHTML = "<a class='Astd' HREF='#' onclick='getCustomerRecords( \"" + custinfo + '",event, "true")\'>' + dataarray[index] + "</a>";
                        addEvent(tBodyElem.rows[rowCnt].cells[1], "onkeydown", "return handleCustQueryKeyDownEvents(event)");
                        tBodyElem.rows[rowCnt].cells[1].innerHTML = "<span class='SPNtext' tabindex=0>" + dataarray[index + 1] + "</span>";
                        if (mainWin.applicationExt == "JP") {
                            tBodyElem.rows[rowCnt].cells[2].innerHTML = "<span class='SPNtext' tabindex=0>" + dataarray[index + 4] + "</span>";
                            tBodyElem.rows[rowCnt].cells[3].innerHTML = "<span class='SPNtext' tabindex=0>" + dataarray[index + 5] + "</span>";
                            tBodyElem.rows[rowCnt].cells[4].innerHTML = "<span class='SPNtext' tabindex=0>" + dataarray[index + 6] + "</span>";
                            tBodyElem.rows[rowCnt].cells[5].innerHTML = "<input type='checkbox' class='TXTstd'  id='rd_" + dataarray[index] + "'>";
                            addEvent(tBodyElem.rows[rowCnt].cells[5], "onkeydown", "return handleCustQueryKeyDownEvents(event)");
                        } else {
                            tBodyElem.rows[rowCnt].cells[2].innerHTML = "<input type='checkbox' class='TXTstd'  id='rd_" + dataarray[index] + "'>";
                            addEvent(tBodyElem.rows[rowCnt].cells[2], "onkeydown", "return handleCustQueryKeyDownEvents(event)");
                        }
                    }
                    if (mainWin.applicationExt == "JP") {
                        index += 7;
                    } else {
                        index += 4;
                    }
                }
            } catch (e) {}
            document.getElementById("btnDivCust").style.visibility = "";
            if (gCurrPage_Cust == 1) {
                document.getElementById("custTabBtnPrev1").disabled = true;
                document.getElementById("custTabBtnPrev1").removeAttribute("onclick");
            }
            if (gCurrPage_Cust >= parseInt(getNodeText(selectSingleNode(dataDOM, "/FCUBS_RES_ENV/TOTALPAGES")))) {
                document.getElementById("custTabBtnNext1").disabled = true;
                document.getElementById("custTabBtnNext1").removeAttribute("onclick");
            }
            if (trim(data) == "") {
                document.getElementById("btnDivCust").style.visibility = "hidden";
                document.getElementById("DIVcaptionSR1").getElementsByTagName("H2")[0].innerHTML += "<span>" + mainWin.getItemDesc("LBL_CUSTTAB_NO_RSLTS") + "</span>";
            }
            document.getElementById("searchCustResultDiv").style.visibility = "";
            if (document.getElementById("CustomerRecordsTable")) {
                var tdArr = document.getElementById("CustomerRecordsTable").getElementsByTagName("TD");
                for (var tdCnt = 0; tdCnt < tdArr.length; tdCnt++) {
                    tdArr[tdCnt].innerHTML = "&nbsp;";
                    tdArr[tdCnt].removeAttribute("onkeydown");
                }
                document.getElementById("btnDivAcc").style.visibility = "hidden";
            }
        }
    } else {
        if (typeof (myflag) !== "undefined" && myflag !== "true") {
            if (myflag == "next") {
                gCurrPage_Acc = parseInt(currpage) + 1;
            } else {
                gCurrPage_Acc = parseInt(currpage) - 1;
            }
        } else {
            gCurrPage_Acc = gCurrPage_Acc;
        }
        if (typeof (myflag) !== "undefined") {
            fnBranchQueryPostforAccount("%", custacno, brnacno, "N", myflag, gCurrPage_Acc);
        } else {
            fnBranchQueryPostforAccount("%", custacno, brnacno, "N");
        }
        var html = "";
        if (objHTTP.status == 200) {
            if (window.ActiveXObject) {
                dataDOM.setProperty("SelectionNamespaces", ns);
            }
            var data = getNodeText(selectSingleNode(dataDOM, "//FCUBS_RES_ENV"));
            data = trimTildaAtEnd(data);
            data = data.substring(0, data.lastIndexOf("!"));
            if (document.getElementById("AccountTable")) {
                var tdArr = document.getElementById("DIVresultsTBL1").getElementsByTagName("TD");
                for (var tdCnt = 0; tdCnt < tdArr.length; tdCnt++) {
                    tdArr[tdCnt].innerHTML = "&nbsp;";
                    tdArr[tdCnt].removeAttribute("onkeydown");
                }
                if (document.getElementById("DIVcaptionSR1")) {
                    var h2Elem = document.getElementById("DIVcaptionSR1").getElementsByTagName("H2")[0];
                    var spanElem = h2Elem.getElementsByTagName("SPAN")[0];
                    if (spanElem) {
                        h2Elem.removeChild(spanElem);
                    }
                }
            } else {
                html = '<div class=\'DIVmultiplebox\' id=\'DIVcaptionSR1\' tabindex="0" onkeydown="return handleCustQueryKeyDownEvents(event)"><h2 class="hh4dash">' + labelListOfAcc + "</h2>";
                html += '<DIV style="PADDING-BOTTOM: 3px; FLOAT: right;" id=btnDivCust>';
                html += "<BUTTON id=custTabBtnPrev1 class=Abut onclick=\"fnCustomerQuery( '" + prev + "'," + gCurrPage_Acc + ')" type=submit disabled>';
                html += '<span title="Previous" class="WidgetonePrevious"></span></BUTTON><BUTTON id=custTabBtnNext1 class=Abut  onclick="fnCustomerQuery( \'' + next + "'," + gCurrPage_Acc + ')" type=submit disabled><span class="WidgetoneNext" title=Next></span>';
                html += '</BUTTON><BUTTON id=btnrefreshd class=Abut onclick=fnRefreshData() type=submit style="display:none;"><span class="WidgetoneRefresh" title="Refresh"></span></BUTTON>';
                html += "</DIV>";
                html += "<div id='DIVresultsTBL1' class='DIVMultipleSmallInner' style='display:block;clear:both;overflow:auto;' >";
                html += "</div></div>";
                document.getElementById("CUSTDETAILS").innerHTML = "";
                document.getElementById("CUSTDETAILS").innerHTML = html;
                document.getElementById("searchCustResultDiv").style.visibility = "hidden";
                document.getElementById("searchCustResultDiv").style.display = "block";
                var tempObj = document.getElementById("DIVcaptionSR1");
                setWidthHeight(tempObj);
                tempObj = document.getElementById("DIVresultsTBL1");
                tempObj.style.width = tempObj.parentNode.offsetWidth - 2 + "px";
                tempObj.style.height = document.getElementById("DIVcaptionSR1").offsetHeight - (document.getElementById("btnDivCust").offsetHeight + 10) + "px";
                if (mainWin.applicationExt == "JP") {
                    html = '<TABLE  id = \'AccountTable\' style="width:100%" class="TBLone" summary="' + labelListOfAcc + '" border="0" cellspacing="0" cellpadding="0">';
                    labelAccCcy;
                    html += "<thead><tr><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccNumber + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccCcy + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccClass + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelBranchCode + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelDftAcc + "</span></th></tr></thead>";
                    html += "<tbody>";
                    for (var rowCnt = 0; rowCnt < 5; rowCnt++) {
                        if (rowCnt % 2 == 0) {
                            html += "<tr class='TBLoneTR'>";
                        } else {
                            html += "<tr class='TBLoneTRalt'>";
                        }
                        html += "<td>&nbsp;</td>";
                        html += "<td>&nbsp;</td>";
                        html += "<td>&nbsp;</td>";
                        html += "<td>&nbsp;</td>";
                        html += "<td>&nbsp;</td>";
                        html += "</tr>";
                    }
                } else {
                    html = '<TABLE  id = \'AccountTable\' style="width:100%" class="TBLone" summary="' + labelListOfAcc + '" border="0" cellspacing="0" cellpadding="0">';
                    html += "<thead><tr><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccNumber + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccClass + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelBranchCode + "</span></th></tr></thead>";
                    html += "<tbody>";
                    for (var rowCnt = 0; rowCnt < 5; rowCnt++) {
                        if (rowCnt % 2 == 0) {
                            html += "<tr class='TBLoneTR'>";
                        } else {
                            html += "<tr class='TBLoneTRalt'>";
                        }
                        html += "<td>&nbsp;</td>";
                        html += "<td>&nbsp;</td>";
                        html += "<td>&nbsp;</td>";
                        html += "</tr>";
                    }
                }
                html += "</tbody></TABLE>";
                document.getElementById("DIVresultsTBL1").innerHTML = html;
            }
            data = trim(data);
            data = trimTildaAtEnd(data);
            var dataarray = data.split("~");
            if (dataarray.length > 0) {
                var resultTable = document.getElementById("AccountTable");
                var tBodyElem = resultTable.tBodies[0];
                var rowLength = resultTable.tBodies[0].rows.length;
                var i = 0;
                if (dataarray.length >= rowLength) {
                    document.getElementById("custTabBtnPrev1").disabled = false;
                    addEvent(document.getElementById("custTabBtnPrev1"), "onclick", "fnCustomerQuery( '" + prev + "'," + gCurrPage_Acc + ")");
                    document.getElementById("custTabBtnNext1").disabled = false;
                    addEvent(document.getElementById("custTabBtnNext1"), "onclick", "fnCustomerQuery( '" + next + "'," + gCurrPage_Acc + ")");
                }
                for (var rowCnt = 0; rowCnt < rowLength; rowCnt++) {
                    if (dataarray.length > i && data != "") {
                        dataarray[i] = dataarray[i].replace("!", "");
                        tBodyElem.rows[rowCnt].cells[0].onkeydown = "return handleCustRecKeyDownEvents(event)";
                        tBodyElem.rows[rowCnt].cells[0].innerHTML = "<A class=\"Astd\" HREF='#' onclick=\"showCustAccDetails('" + dataarray[i] + "', '" + dataarray[i + 1] + "', '" + dataarray[i + 2] + "', '" + dataarray[i + 5] + "',event)\" > " + dataarray[i + 1] + "</A>";
                        if (mainWin.applicationExt == "JP") {
                            tBodyElem.rows[rowCnt].cells[1].innerHTML = '<span class="SPNtext" tabindex=0>' + dataarray[i + 7] + "</span>";
                            tBodyElem.rows[rowCnt].cells[2].innerHTML = '<span class="SPNtext" tabindex=1>' + dataarray[i + 4] + "</span>";
                            tBodyElem.rows[rowCnt].cells[2].onkeydown = "return handleCustRecKeyDownEvents(event)";
                            tBodyElem.rows[rowCnt].cells[3].innerHTML = '<span class="SPNtext" tabindex=2>' + dataarray[i + 2] + "</span>";
                            if (dataarray[i + 6] == "Y") {
                                tBodyElem.rows[rowCnt].cells[4].innerHTML = "<input type='checkbox' class='TXTstd'  id='rd_" + rowCnt + "_" + dataarray[i] + "'disabled  checked >";
                            } else {
                                tBodyElem.rows[rowCnt].cells[4].innerHTML = "<input type='checkbox' class='TXTstd'  id='rd_" + rowCnt + "_" + dataarray[i] + " ' disabled  >";
                            }
                        } else {
                            tBodyElem.rows[rowCnt].cells[1].innerHTML = '<span class="SPNtext" tabindex=0>' + dataarray[i + 4] + "</span>";
                            tBodyElem.rows[rowCnt].cells[2].onkeydown = "return handleCustRecKeyDownEvents(event)";
                            tBodyElem.rows[rowCnt].cells[2].innerHTML = '<span class="SPNtext" tabindex=0>' + dataarray[i + 2] + "</span>";
                        }
                    }
                    if (mainWin.applicationExt == "JP") {
                        i += 8;
                    } else {
                        i += 6;
                    }
                }
                if (gCurrPage_Acc == 1) {
                    document.getElementById("custTabBtnPrev1").disabled = "true";
                    document.getElementById("custTabBtnPrev1").removeAttribute("onclick");
                }
                if (gCurrPage_Acc >= parseInt(getNodeText(selectSingleNode(dataDOM, "/FCUBS_RES_ENV/TOTALPAGES")))) {
                    document.getElementById("custTabBtnNext1").disabled = "true";
                    document.getElementById("custTabBtnNext1").removeAttribute("onclick");
                }
            } else {
                document.getElementById("DIVcaptionSR1").getElementsByTagName("H2")[0].innerHTML += "<span>" + mainWin.getItemDesc("LBL_CUSTTAB_NO_RSLTS") + "</span>";
            }
            document.getElementById("searchCustResultDiv").style.visibility = "";
            document.getElementById("ListofAccDiv").innerHTML = "";
        }
    }
}
function showtable(divid, event, flag) {
    if (divid == "DIVresultsTBL1") {
        if (flag == true) {
            document.getElementById("CustSec1").style.display = "block";
            document.getElementById("CustSec2").style.display = "none";
            document.getElementById("CustSec3").style.display = "none";
        } else {
            document.getElementById("CustSec2").style.display = "block";
            document.getElementById("CustSec1").style.display = "none";
            document.getElementById("CustSec3").style.display = "none";
        }
    } else {
        document.getElementById("CustSec3").style.display = "block";
        document.getElementById("CustSec2").style.display = "none";
        document.getElementById("CustSec1").style.display = "none";
    }
}
function fnCustSearchPost(msgType, name, cfid, custidval, brnacno, LinkedCust, pidSearch, multiccyacSearch, myflag, currpageno) {
    if (typeof (name) !== "undefined") {
        name = name.replace(/\'/g, "%");
    }
    var actionType = "CustSearch";
    var requestString = "";
    name = replaceChar(name);
    cfid = replaceChar(cfid);
    custidval = replaceChar(custidval);
    brnacno = replaceChar(brnacno);
    var redCriteria = "";
    var KanjiCustName = "";
    var KatakanaCustName = "";
    var HiraganaCustName = "";
    if (mainWin.applicationExt == "JP") {
        KanjiCustName = document.getElementById("KanjiCustName").value;
        KatakanaCustName = document.getElementById("KatakanaCustName").value;
        HiraganaCustName = document.getElementById("HiraganaCustName").value;
        KanjiCustName = replaceChar(KanjiCustName);
        KatakanaCustName = replaceChar(KatakanaCustName);
        HiraganaCustName = replaceChar(HiraganaCustName);
        redCriteria = "1!" + name + "|2!" + cfid + "|3!" + custidval + "|4!" + brnacno + "|5!" + KanjiCustName + "|6!" + KatakanaCustName + "|7!" + HiraganaCustName;
    } else {
        redCriteria = "1!" + name + "|2!" + cfid + "|3!" + custidval + "|4!" + brnacno;
    }
    if (pidSearch == "Y") {
        redCriteria = "1!" + document.getElementById("Pid").value;
    }
    if (multiccyacSearch == "Y") {
        redCriteria = "1!" + document.getElementById("MultiCurrAccNo").value;
    }
    if (typeof (myflag) !== "undefined") {
        if (myflag == "next") {
            gcurrpage = parseInt(currpageno);
            objHTTP.open("POST", serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&XREF=" + xref + "&name=" + name + "&cfid=" + cfid + "&LinkedCust=" + LinkedCust + "&pidSearch=" + pidSearch + "&multiccyacSearch=" + multiccyacSearch + "&RedFldNames=" + escape(redCriteria).replace(/\+/g, "%2B").replace(/\'"'/g, "%22").replace(/\"'"/g, "%27") + "&fetchSize=1000" + "&TotalPages=" + "&CurPage=" + gcurrpage, false);
        } else {
            if (currpageno > 1) {
                gcurrpage = parseInt(currpageno);
            } else {
                if (currpageno == "1") {
                    gcurrpage = parseInt(currpageno);
                }
            }
            objHTTP.open("POST", serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&XREF=" + xref + "&name=" + name + "&cfid=" + cfid + "&LinkedCust=" + LinkedCust + "&pidSearch=" + pidSearch + "&multiccyacSearch=" + multiccyacSearch + "&RedFldNames=" + escape(redCriteria).replace(/\+/g, "%2B").replace(/\'"'/g, "%22").replace(/\"'"/g, "%27") + "&fetchSize=1000" + "&TotalPages=" + "&CurPage=" + gcurrpage, false);
        }
    } else {
        objHTTP.open("POST", serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&XREF=" + xref + "&name=" + name + "&cfid=" + cfid + "&LinkedCust=" + LinkedCust + "&pidSearch=" + pidSearch + "&multiccyacSearch=" + multiccyacSearch + "&RedFldNames=" + escape(redCriteria).replace(/\+/g, "%2B").replace(/\'"'/g, "%22").replace(/\"'"/g, "%27") + "&fetchSize=1000" + "&TotalPages=" + "&CurPage=1", false);
    }
    objHTTP.setRequestHeader("Content-Type", "application/xml");
    objHTTP.setRequestHeader("charset", "utf-8");
    objHTTP.setRequestHeader("X-CSRFTOKEN", mainWin.CSRFtoken);
    requestString += "<CUSTNAME>" + name + "</CUSTNAME>";
    requestString += "<CIFID>" + cfid + "</CIFID>";
    requestString += "<CUSTIDVAL>" + custidval + "</CUSTIDVAL>";
    requestString += "<CRITERIA>" + redCriteria + "</CRITERIA>";
    objHTTP.send(requestString);
    if (objHTTP.status != 200) {
        alert(mainWin.getItemDesc("LBL_QRY_FAIL_ERR_DESC") + '"' + objHTTP.status + ":" + objHTTP.statusText + '"');
    } else {
        if (objHTTP.responseText == timeout_responseXML) {
            msgStat = "F";
            openTimeOutPage();
        } else {
            if (getXMLString(objHTTP.responseXML) != "") {
                mainWin.inactiveTime = 0;
                var csrfNode = selectSingleNode(objHTTP.responseXML, "//CSRF");
                if (csrfNode != null && getNodeText(csrfNode) == "SM-00420") {
                    alert(getNodeText(csrfNode) + mainWin.getItemDesc("LBL_REQUEST_TAMPERED"));
                } else {
                    if ((selectSingleNode(objHTTP.responseXML, "//ERROR") != null) && (getNodeText(selectSingleNode(objHTTP.responseXML, "//ERROR")))) {
                        alert(getNodeText(selectSingleNode(objHTTP.responseXML, "//ERROR")));
                    } else {
                        dataDOM = objHTTP.responseXML;
                        if (getBrowser().indexOf("IE") != -1) {
                            dataDOM.setProperty("SelectionNamespaces", ns);
                        }
                    }
                }
            } else {
                alert(mainWin.getItemDesc("LBL_TRANS_FAILED"));
            }
        }
    }
}
function fnCustReset() {
    mainWin.fnUpdateScreenSaverInterval();
    document.getElementById("CustName").value = "%";
    document.getElementById("CFid").value = "%";
    document.getElementById("CustIdentifier").value = "%";
    document.getElementById("CustAccountNo").value = "%";
    document.getElementById("CustBrn").value = "%";
    if (mainWin.applicationExt == "JP") {
        document.getElementById("Pid").value = "%";
        document.getElementById("KanjiCustName").value = "%";
        document.getElementById("KatakanaCustName").value = "%";
        document.getElementById("HiraganaCustName").value = "%";
        document.getElementById("MultiCurrAccNo").value = "%";
    }
    document.getElementById("LinkedCustomers").checked = false;
    var tdArr = document.getElementById("ContentCustomerSearch").getElementsByTagName("TD");
    for (var tdCnt = 0; tdCnt < tdArr.length; tdCnt++) {
        tdArr[tdCnt].innerHTML = "&nbsp;";
        tdArr[tdCnt].removeAttribute("onkeydown");
    }
    if (document.getElementById("btnDivCust")) {
        document.getElementById("btnDivCust").style.visibility = "hidden";
    }
    if (document.getElementById("btnDivAcc")) {
        document.getElementById("btnDivAcc").style.visibility = "hidden";
    }
    if (document.getElementById("DIVcaptionSR1")) {
        var h2Elem = document.getElementById("DIVcaptionSR1").getElementsByTagName("H2")[0];
        var spanElem = h2Elem.getElementsByTagName("SPAN")[0];
        if (spanElem) {
            h2Elem.removeChild(spanElem);
        }
    }
    if (document.getElementById("DIVcaptionSR2")) {
        var h2Elem = document.getElementById("DIVcaptionSR2").getElementsByTagName("H2")[0];
        var spanElem = h2Elem.getElementsByTagName("SPAN")[0];
        if (spanElem) {
            h2Elem.removeChild(spanElem);
        }
    }
    clearDisplayedTabs();
}
function showCustomerImage(branchCode, customerInformationArray) {
    var confirmFlag = false;
    var customerObject = new Object();
    var customerNumber = "";
    var customerName = "";
    var customerAddress = "";
    var customerInformation = customerInformationArray.split("~");
    customerNumber = customerInformation[0];
    customerName = customerInformation[1];
    customerAddress = customerInformation[2];
    confirmFlag = confirm(mainWin.getItemDesc("LBL_SET_CUSTNO_DETAILS"));
    if (confirmFlag) {
        customerObject = mainWin.getCustomer(custId, custName, custAddr, branchCode);
        alert(mainWin.getItemDesc("LBL_CUSTNO_SET_SESSION") + " " + customerNumber);
    } else {
        confirmFlag = false;
    }
}
function fnCancel() {
    var confirmFlag = confirm(mainWin.getItemDesc("LBL_DO_CANCEL_TRANSACTION"));
    if (confirmFlag) {
        window.close();
    }
}
function fnReset() {
    document.getElementById("REL_CUSTOMER").value = "";
    document.getElementById("CUSTOMER_NAME").value = "";
    document.getElementById("UNIQUE_VALUE").value = "";
    deleteAllRows(multipleEntryIDs[0]);
}
function getCustomerRecords(customerInformationArray, e, recflag, currpage) {
    gCurrPage_Acc = 1;
    if (typeof (e) != "undefined") {
        var event = window.event || e;
        var eventElem = getEventSourceElement(event);
        var custLinks = getCustLinks();
        if (eventElem.tagName == "A") {
            highlightCustrec(eventElem, custLinks);
            setTimeout(function() {
                eventElem.focus();
            }, 0);
        }
    }
    if (mainWin.CustomerObj != null) {
        alert(mainWin.getItemDesc("LBL_CUST_SESSION_OPENED_AC") + ":" + accountNumber + ". " + mainWin.getItemDesc("LBL_END_PREV_CUST_SESSION"));
        return;
    }
    unmask();
    var labelListOfAcc = mainWin.getItemDesc("LBL_LIST_OF_ACC");
    var labelAccNumber = mainWin.getItemDesc("LBL_ACC_NUMBER");
    var labelBranchCode = mainWin.getItemDesc("LBL_BRANCH_CODE");
    var labelAccClass = mainWin.getItemDesc("LBL_ACC_CLASS");
    if (typeof (recflag) != "undefined") {
        customerInformationArray = fnUnEscape(customerInformationArray);
        var customerInformation = customerInformationArray.split("~");
        var customerNumber = customerInformation[0];
		// 🔽 Call fnCheckCustomerStatus Servlet
		fnCheckCustomerStatus(customerNumber);
        var localBranchCode = customerInformation[2];
        var custAccNo = "%";
    }
    if (typeof (recflag) != "undefined" && recflag != "true") {
        if (recflag == "next") {
            gCurrPage_Acc = parseInt(currpage) + 1;
        } else {
            gCurrPage_Acc = parseInt(currpage) - 1;
        }
    } else {
        clearDisplayedTabs();
    }
    var html = "";
    if (document.getElementById("rd_" + customerNumber).checked == true) {
        var RelatedCust = "Y";
    } else {
        var RelatedCust = "N";
    }
    if (typeof (recflag) != "undefined") {
        fnBranchQueryPostforAccount(customerNumber, "%", "%", RelatedCust, recflag, gCurrPage_Acc);
    } else {
        fnBranchQueryPostforAccount(customerNumber, "%", "%", RelatedCust);
    }
    if (objHTTP.status == 200) {
        if (getBrowser().indexOf("IE") != -1) {
            dataDOM.setProperty("SelectionNamespaces", ns);
        }
        if (typeof (recflag) != "undefined") {
            var data = getNodeText(selectSingleNode(dataDOM, "//FCUBS_RES_ENV"));
            data = trimTildaAtEnd(data);
            data = data.substring(0, data.lastIndexOf("!"));
        }
        fnCreateAccountHtml(recflag, customerInformationArray);
        if (typeof (recflag) != "undefined") {
            data = trim(data);
            data = trimTildaAtEnd(data);
            var dataarray = data.split("~");
            var index = 0;
            var resultTable = document.getElementById("CustomerRecordsTable");
            var tBodyElem = resultTable.tBodies[0];
            var rowLength = resultTable.tBodies[0].rows.length;
            if (dataarray.length >= rowLength) {
                document.getElementById("custTabBtnPrev2").disabled = false;
                addEvent(document.getElementById("custTabBtnPrev2"), "onclick", "getCustomerRecords( '" + customerInformationArray + "',event,'" + prev + "'," + gCurrPage_Acc + ")");
                document.getElementById("custTabBtnNext2").disabled = false;
                addEvent(document.getElementById("custTabBtnNext2"), "onclick", "getCustomerRecords( '" + customerInformationArray + "',event,'" + next + "'," + gCurrPage_Acc + ")");
            }
            for (var rowCnt = 0; rowCnt < rowLength; rowCnt++) {
                if (dataarray.length > index && data != "") {
                    tBodyElem.rows[rowCnt].cells[0].onkeydown = "return handleCustRecKeyDownEvents(event)";
                    tBodyElem.rows[rowCnt].cells[0].innerHTML = "<A class=\"Astd\" HREF='#' onclick=\"showCustAccDetails('" + customerNumber + "', '" + dataarray[index + 1] + "', '" + dataarray[index + 2] + "', '" + dataarray[index + 5] + "',event)\" > " + dataarray[index + 1] + "</A>";
                    if (mainWin.applicationExt == "JP") {
                        tBodyElem.rows[rowCnt].cells[1].innerHTML = '<span class="SPNtext" tabindex=0>' + dataarray[index + 7] + "</span>";
                        tBodyElem.rows[rowCnt].cells[2].innerHTML = '<span class="SPNtext" tabindex=1>' + dataarray[index + 4] + "</span>";
                        tBodyElem.rows[rowCnt].cells[2].onkeydown = "return handleCustRecKeyDownEvents(event)";
                        tBodyElem.rows[rowCnt].cells[3].innerHTML = '<span class="SPNtext" tabindex=2>' + dataarray[index + 2] + "</span>";
                        if (dataarray[index + 6] == "Y") {
                            tBodyElem.rows[rowCnt].cells[4].innerHTML = "<input type='checkbox' class='TXTstd'  id='rd_" + rowCnt + "_" + dataarray[index] + "'disabled  checked >";
                        } else {
                            tBodyElem.rows[rowCnt].cells[4].innerHTML = "<input type='checkbox' class='TXTstd'  id='rd_" + rowCnt + "_" + dataarray[index] + " ' disabled  >";
                        }
                    } else {
                        tBodyElem.rows[rowCnt].cells[1].innerHTML = '<span class="SPNtext" tabindex=0>' + dataarray[index + 4] + "</span>";
                        tBodyElem.rows[rowCnt].cells[2].onkeydown = "return handleCustRecKeyDownEvents(event)";
                        tBodyElem.rows[rowCnt].cells[2].innerHTML = '<span class="SPNtext" tabindex=0>' + dataarray[index + 2] + "</span>";
                    }
                }
                if (mainWin.applicationExt == "JP") {
                    index += 8;
                } else {
                    index += 6;
                }
            }
        }
        document.getElementById("btnDivAcc").style.visibility = "";
        if (gCurrPage_Acc == 1) {
            document.getElementById("custTabBtnPrev2").disabled = "true";
            document.getElementById("custTabBtnPrev2").removeAttribute("onclick");
        }
        if (gCurrPage_Acc >= parseInt(getNodeText(selectSingleNode(dataDOM, "/FCUBS_RES_ENV/TOTALPAGES")))) {
            document.getElementById("custTabBtnNext2").disabled = "true";
            document.getElementById("custTabBtnNext2").removeAttribute("onclick");
        }
    }
    if (data == "") {
        document.getElementById("btnDivAcc").style.visibility = "hidden";
        document.getElementById("DIVcaptionSR2").getElementsByTagName("H2")[0].innerHTML += "<span>" + mainWin.getItemDesc("LBL_CUSTTAB_NO_RSLTS") + "</span>";
    }
    document.getElementById("ListofAccDiv").style.visibility = "";
    if (typeof (recflag) == "undefined") {
        dispCustImageDB("true");
    }
}
function getCustLinks() {
    var custacobj = document.getElementById("CUSTDETAILS");
    var custacobjlinks = custacobj.getElementsByTagName("A");
    return custacobjlinks;
}
function highlightCustrec(acustobject, tabobjlinks) {
    for (i = 0; i < tabobjlinks.length; i++) {
        addEvent(tabobjlinks[i], "class", "Astd");
    }
    addEvent(acustobject, "class", "Astdselected");
}
function fnBranchQueryPostforAccount(customerNumber, custAccNo, branchCode, RelatedCust, recflag, currpageno) {
    var msgType = "NONWORKFLOW";
    var accountClass = "";
    var actionType = "RecordSearch";
    customerNumber = replaceChar(customerNumber);
    custAccNo = replaceChar(custAccNo);
    branchCode = replaceChar(branchCode);
    var redCriteria = "1!" + customerNumber + "|2!" + custAccNo + "|3!" + branchCode;
    var requestString = "";
    if (typeof (recflag) !== "undefined") {
        if (recflag == "next") {
            grecpage = parseInt(currpageno);
        } else {
            grecpage = parseInt(currpageno);
        }
        objHTTP.open("POST", serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&XREF=" + xref + "&customerNumber=" + customerNumber + "&custAccNo=" + custAccNo + "&branchCode=" + branchCode + "&relatedCust=" + RelatedCust + "&RedFldNames=" + escape(redCriteria).replace(/\+/g, "%2B").replace(/\'"'/g, "%22").replace(/\"'"/g, "%27") + "&fetchSize=1000" + "&TotalPages=" + "&CurPage=" + grecpage, false);
    } else {
        objHTTP.open("POST", serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&XREF=" + xref + "&customerNumber=" + customerNumber + "&custAccNo=" + custAccNo + "&branchCode=" + branchCode + "&relatedCust=" + RelatedCust + "&RedFldNames=" + escape(redCriteria).replace(/\+/g, "%2B").replace(/\'"'/g, "%22").replace(/\"'"/g, "%27") + "&fetchSize=1000" + "&TotalPages=" + "&CurPage=1", false);
    }
    objHTTP.setRequestHeader("Content-Type", "application/xml");
    objHTTP.setRequestHeader("charset", "utf-8");
    objHTTP.setRequestHeader("X-CSRFTOKEN", mainWin.CSRFtoken);
    objHTTP.send(requestString);
    if (objHTTP.status != 200) {
        alert(mainWin.getItemDesc("LBL_QRY_FAIL_ERR_DESC") + '"' + objHTTP.status + ":" + objHTTP.statusText + '"');
    } else {
        if (objHTTP.responseText == timeout_responseXML) {
            msgStat = "F";
            openTimeOutPage();
        } else {
            if (getXMLString(objHTTP.responseXML) != "") {
                mainWin.inactiveTime = 0;
                dataDOM = objHTTP.responseXML;
                if (getBrowser().indexOf("IE") != -1) {
                    dataDOM.setProperty("SelectionNamespaces", ns);
                }
            } else {
                alert(mainWin.getItemDesc("LBL_TRANS_FAIL"));
            }
        }
    }
}
function fnQueryDirectAccount(customerNumber, custacno, branchCode) {
    var msgType = "NONWORKFLOW";
    var actionType = "DirectAccountSearch";
    var redCriteria = "1>" + customerNumber + "~2>" + custacno + "~3>" + branchCode;
    var requestString = "";
    var reqURL = serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&XREF=" + xref + "&customerNumber=" + customerNumber + "&branchCode=" + branchCode + "&custacno=" + custacno + "&RedFldNames=" + redCriteria + "&fetchSize=1000" + "&TotalPages=0" + "&CurPage=1";
    objHTTP.open("POST", encodeURI(reqURL), false);
    objHTTP.setRequestHeader("Content-Type", "application/xml");
    objHTTP.setRequestHeader("charset", "utf-8");
    objHTTP.setRequestHeader("X-CSRFTOKEN", mainWin.CSRFtoken);
    objHTTP.send(requestString);
    if (objHTTP.status != 200) {
        alert(mainWin.getItemDesc("LBL_QRY_FAIL_ERR_DESC") + '"' + objHTTP.status + ":" + objHTTP.statusText + '"');
    } else {
        if (objHTTP.responseText == timeout_responseXML) {
            msgStat = "F";
            openTimeOutPage();
        } else {
            if (getXMLString(objHTTP.responseXML) != "") {
                dataDOM = objHTTP.responseXML;
                if (getBrowser().indexOf("IE") != -1) {
                    dataDOM.setProperty("SelectionNamespaces", ns);
                }
            } else {
                alert(mainWin.getItemDesc("LBL_TRANS_FAIL"));
            }
        }
    }
}
function showAccountInfo(customerInformationArray, accountInformationArray) {
    strImgInfo = "";
    strSigInfo = "";
    var labelSelectedAccDetails = mainWin.getItemDesc("LBL_SEL_ACC_DETAILS");
    var labelProduct = mainWin.getItemDesc("LBL_PRODUCT");
    var labelAccCcy = mainWin.getItemDesc("LBL_ACC_CCY");
    var labelStatus = mainWin.getItemDesc("LBL_STATUS");
    var labelUncollectedFunds = mainWin.getItemDesc("LBL_UNCOLLECTED_FUNDS");
    var labelCurrBalance = mainWin.getItemDesc("LBL_CURRENT_BAL");
    var labelAvailableBalance = mainWin.getItemDesc("LBL_AVAILABLE_BAL");
    var labelLoanProduct = mainWin.getItemDesc("LBL_LOAN_PRODUCT");
    var labelAmountFinanaced = mainWin.getItemDesc("LBL_AMOUNT_FINANCED");
    var labelAmountDisbursed = mainWin.getItemDesc("LBL_AMOUNT_DISBURSED");
    customerInformationArray = fnUnEscape(customerInformationArray);
    accountInformationArray = fnUnEscape(accountInformationArray);
    var accountData = accountInformationArray.split("~");
    var accountType = accountData[15];
    var CurrBalanceAmount = new MB3Amount(accountData[11],true,accountData[12]);
    var UncollectedFundsAmount = new MB3Amount(accountData[9],true,accountData[12]);
    var AvailableBalanceAmount = new MB3Amount(accountData[10],true,accountData[12]);
    var totalAmountFinanced = new MB3Amount(accountData[9],true,accountData[12]);
    var totalAmountDisbursed = new MB3Amount(accountData[11],true,accountData[12]);
    if (CurrBalanceAmount.isValid()) {
        accountData[11] = CurrBalanceAmount.getInputAmount();
    }
    if (UncollectedFundsAmount.isValid()) {
        accountData[9] = UncollectedFundsAmount.getInputAmount();
    }
    if (AvailableBalanceAmount.isValid()) {
        accountData[10] = AvailableBalanceAmount.getInputAmount();
    }
    if (totalAmountFinanced.isValid()) {
        accountData[9] = totalAmountFinanced.getInputAmount();
    }
    if (totalAmountDisbursed.isValid()) {
        accountData[11] = totalAmountDisbursed.getInputAmount();
    }
    if (accountType == "L") {
        var custHTML = "";
        custHTML += '<div class="widgetonecontainer" id="widgetonecontainer3" role="group" aria-labelledby="widgetoneheading3">';
        custHTML += '<h2 class="widgetoneheading" id="widgetoneheading3">Selected Account: <span>' + accountData[6] + " (" + accountData[7] + ")" + "</span></h2>";
        custHTML += '<div class = \'csc\' id="csc"><span class="tr"></span>';
        custHTML += '<div class="widgetonetblbox">';
        custHTML += '<table summary="' + labelSelectedAccDetails + '" class="TBLlyt" width="100%" border="0" cellpadding="0" cellspacing="0">';
        custHTML += "<tbody><tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelLoanProduct + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[14] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th  WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelAccCcy + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[12] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelStatus + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[8] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelAmountFinanaced + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[9] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelAmountDisbursed + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[11] + "</span></td>";
        custHTML += "</tr>";
        custHTML += '<tr><th valign="top" scope="row"><span class="LBLinv">Customer Session</span></th>';
        custHTML += "<td>";
    } else {
        var custHTML = "";
        custHTML += '<div class="widgetonecontainer" id="widgetonecontainer3" role="group" aria-labelledby="widgetoneheading3">';
        custHTML += '<h2 class="widgetoneheading" id="widgetoneheading3">Selected Account: <span>' + accountData[6] + " (" + accountData[7] + ")" + "</span></h2>";
        custHTML += '<div class = \'csc\' id="csc"><span class="tr"></span>';
        custHTML += '<div class="widgetonetblbox">';
        custHTML += '<table summary="' + labelSelectedAccDetails + '" class="TBLlyt" width="100%" border="0" cellpadding="0" cellspacing="0">';
        custHTML += "<tbody><tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelProduct + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[14] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th  WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelAccCcy + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[12] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelStatus + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[8] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelUncollectedFunds + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[9] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelCurrBalance + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[11] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelAvailableBalance + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%" >' + accountData[10] + "</span></td>";
        custHTML += "</tr>";
        custHTML += '<tr><th valign="top" scope="row"><span class="LBLinv">Customer Session</span></th>';
        custHTML += "<td>";
    }
    if (mainWin.CustomerObj == null) {
        customerInformationArray = fnEscape(customerInformationArray);
        accountInformationArray = fnEscape(accountInformationArray);
        custHTML += '<button class="BTNimg" onblur="this.className=\'BTNimg\'" onmouseover="this.className=\'BTNimgH\'" onfocus="this.className=\'BTNimgH\'" onmouseout="this.className=\'BTNimg\'"id="CUSTSESSIONSTART" accesskey="O" onClick="fnStartCustomerSession(\'' + customerInformationArray + "','" + accountInformationArray + '\');" title="' + mainWin.getItemDesc("LBL_START_CUST_SESSION") + '"><span tabindex="-1" id = "CustSessionIMG" class="ICOsessionstart"></span></button>';
        custHTML += "</td>";
        custHTML += "</tr>";
    } else {
        custHTML += '<button class="BTNimg" onblur="this.className=\'BTNimg\'" onmouseover="this.className=\'BTNimgH\'" onfocus="this.className=\'BTNimgH\'" onmouseout="this.className=\'BTNimg\'" id="CUSTSESSIONSTART" accesskey="O" onClick="fnEndCustomerSession();" title="' + mainWin.getItemDesc("LBL_END_CUST_SESSION") + '"><span tabindex="-1" id = "CustSessionIMG" class="ICOsessionend"></span></button>';
        custHTML += '<button class="BTNimg" onblur="this.className=\'BTNimg\'" onmouseover="this.className=\'BTNimgH\'" onfocus="this.className=\'BTNimgH\'" onmouseout="this.className=\'BTNimg\'" onClick="fnLoadActiveSession()" title="' + mainWin.getItemDesc("LBL_VIEW_ACTIVE_SESSION") + '"><span tabindex="-1" id = "CustSessionIMG" class="ICOsessionwho"></span></button>';
        custHTML += "</td>";
        custHTML += "</tr>";
    }
    custHTML += '</table></div><span class="bl"></span> <span class="br"></span></div></div>';
    var imageHTML = showAccountImage(accountData[6], accountData[7], accountInformationArray.split("~")[0]);
    var tblDiv = document.getElementById("DIVCustomerDetails");
    var divStr = tblDiv.innerHTML;
    tblDiv.innerHTML = divStr.substring(0, divStr.indexOf("<TR></TR>") + 4) + escape(imageHTML) + "</TR>" + divStr.substring(divStr.lastIndexOf("</TBODY>"), divStr.length);
}
function showAccountSearchInfo(customerInformationArray, accountInformationArray) {
    strImgInfo = "";
    strSigInfo = "";
    var labelSelectedAccDetails = mainWin.getItemDesc("LBL_SEL_ACC_DETAILS");
    var labelProduct = mainWin.getItemDesc("LBL_PRODUCT");
    var labelAccCcy = mainWin.getItemDesc("LBL_ACC_CCY");
    var labelStatus = mainWin.getItemDesc("LBL_STATUS");
    var labelUncollectedFunds = mainWin.getItemDesc("LBL_UNCOLLECTED_FUNDS");
    var labelCurrBalance = mainWin.getItemDesc("LBL_CURRENT_BAL");
    var labelAvailableBalance = mainWin.getItemDesc("LBL_AVAILABLE_BAL");
    var labelLoanProduct = mainWin.getItemDesc("LBL_LOAN_PRODUCT");
    var labelAmountFinanaced = mainWin.getItemDesc("LBL_AMOUNT_FINANCED");
    var labelAmountDisbursed = mainWin.getItemDesc("LBL_AMOUNT_DISBURSED");
    customerInformationArray = fnUnEscape(customerInformationArray);
    accountInformationArray = fnUnEscape(accountInformationArray);
    var accountData = accountInformationArray.split("~");
    var accountType = accountData[15];
    var CurrBalanceAmount = new MB3Amount(accountData[11],true,accountData[12]);
    var UncollectedFundsAmount = new MB3Amount(accountData[9],true,accountData[12]);
    var AvailableBalanceAmount = new MB3Amount(accountData[10],true,accountData[12]);
    var totalAmountFinanced = new MB3Amount(accountData[9],true,accountData[12]);
    var totalAmountDisbursed = new MB3Amount(accountData[11],true,accountData[12]);
    if (CurrBalanceAmount.isValid()) {
        accountData[11] = CurrBalanceAmount.getInputAmount();
    }
    if (UncollectedFundsAmount.isValid()) {
        accountData[9] = UncollectedFundsAmount.getInputAmount();
    }
    if (AvailableBalanceAmount.isValid()) {
        accountData[10] = AvailableBalanceAmount.getInputAmount();
    }
    if (totalAmountFinanced.isValid()) {
        accountData[9] = totalAmountFinanced.getInputAmount();
    }
    if (totalAmountDisbursed.isValid()) {
        accountData[11] = totalAmountDisbursed.getInputAmount();
    }
    if (accountType == "L") {
        var custHTML = "";
        custHTML += '<div class="widgetonecontainer" id="widgetonecontainer3" role="group" aria-labelledby="widgetoneheading3">';
        custHTML += '<h2 class="widgetoneheading" id="widgetoneheading3">Selected Account: <span>' + accountData[6] + " (" + accountData[7] + ")" + "</span></h2>";
        custHTML += '<div class = \'csc\' id="csc"><span class="tr"></span>';
        custHTML += '<div class="widgetonetblbox">';
        custHTML += '<table summary="' + labelSelectedAccDetails + '" class="TBLlyt" width="100%" border="0" cellpadding="0" cellspacing="0">';
        custHTML += "<tbody><tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelLoanProduct + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[14] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th  WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelAccCcy + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[12] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelStatus + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[8] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelAmountFinanaced + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[9] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelAmountDisbursed + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[11] + "</span></td>";
        custHTML += "</tr>";
        custHTML += '<tr><th valign="top" scope="row"><span class="LBLinv">Customer Session</span></th>';
        custHTML += "<td>";
    } else {
        var custHTML = "";
        custHTML += '<div class="widgetonecontainer" id="widgetonecontainer3" role="group" aria-labelledby="widgetoneheading3">';
        custHTML += '<h2 class="widgetoneheading" id="widgetoneheading3">Selected Account: <span>' + accountData[6] + " (" + accountData[7] + ")" + "</span></h2>";
        custHTML += '<div class = \'csc\' id="csc"><span class="tr"></span>';
        custHTML += '<div class="widgetonetblbox">';
        custHTML += '<table summary="' + labelSelectedAccDetails + '" class="TBLlyt" width="100%" border="0" cellpadding="0" cellspacing="0">';
        custHTML += "<tbody><tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelProduct + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[14] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th  WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelAccCcy + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[12] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelStatus + ": </span></th>";
        custHTML += '<td ><span class="SPNtext">' + accountData[8] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelUncollectedFunds + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[9] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%" valign="top" scope="row" ><span class="SPNtext">' + labelCurrBalance + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%">' + accountData[11] + "</span></td>";
        custHTML += "</tr>";
        custHTML += "<tr>";
        custHTML += '<th WIDTH="40%"  valign="top" scope="row" ><span class="SPNtext">' + labelAvailableBalance + ": </span></th>";
        custHTML += '<td><span class="SPNtext numeric" style="width:99%" >' + accountData[10] + "</span></td>";
        custHTML += "</tr>";
        custHTML += '<tr><th valign="top" scope="row"><span class="LBLinv">Customer Session</span></th>';
        custHTML += "<td>";
    }
    if (mainWin.CustomerObj == null) {
        customerInformationArray = fnEscape(customerInformationArray);
        accountInformationArray = fnEscape(accountInformationArray);
        custHTML += '<button class="BTNimg" onblur="this.className=\'BTNimg\'" onmouseover="this.className=\'BTNimgH\'" onfocus="this.className=\'BTNimgH\'" onmouseout="this.className=\'BTNimg\'"id="CUSTSESSIONSTART" accesskey="O" onClick="fnStartCustomerSession(\'' + customerInformationArray + "','" + accountInformationArray + '\');" title="' + mainWin.getItemDesc("LBL_START_CUST_SESSION") + '"><span tabindex="-1" id = "CustSessionIMG" class="ICOsessionstart"></span></button>';
        custHTML += "</td>";
        custHTML += "</tr>";
    } else {
        custHTML += '<button class="BTNimg" onblur="this.className=\'BTNimg\'" onmouseover="this.className=\'BTNimgH\'" onfocus="this.className=\'BTNimgH\'" onmouseout="this.className=\'BTNimg\'" id="CUSTSESSIONSTART" accesskey="O" onClick="fnEndCustomerSession();" title="' + mainWin.getItemDesc("LBL_END_CUST_SESSION") + '"><span tabindex="-1" id = "CustSessionIMG" class="ICOsessionend"></span></button>';
        custHTML += '<button class="BTNimg" onblur="this.className=\'BTNimg\'" onmouseover="this.className=\'BTNimgH\'" onfocus="this.className=\'BTNimgH\'" onmouseout="this.className=\'BTNimg\'" onClick="fnLoadActiveSession()" title="' + mainWin.getItemDesc("LBL_VIEW_ACTIVE_SESSION") + '"><span tabindex="-1" id = "CustSessionIMG" class="ICOsessionwho"></span></button>';
        custHTML += "</td>";
        custHTML += "</tr>";
    }
    custHTML += '</table></div><span class="bl"></span> <span class="br"></span></div></div>';
    document.getElementById("dashtable").tBodies[0].rows[0].cells[1].innerHTML = "";
    document.getElementById("dashtable").tBodies[0].rows[0].cells[1].innerHTML = custHTML;
    if (document.getElementById("dashtable").tBodies[0].rows[1].cells[1]) {
        document.getElementById("dashtable").tBodies[0].rows[1].cells[1].innerHTML = "";
        document.getElementById("dashtable").tBodies[0].rows[1].removeChild(document.getElementById("dashtable").tBodies[0].rows[1].cells[1]);
    }
    if (document.getElementById("dashtable").tBodies[0].rows[1].cells[0]) {
        document.getElementById("dashtable").tBodies[0].rows[1].cells[0].innerHTML = "";
        document.getElementById("dashtable").tBodies[0].rows[1].removeChild(document.getElementById("dashtable").tBodies[0].rows[1].cells[0]);
    }
    var imageHTML = showAccountImage(accountData[6], accountData[7], accountInformationArray.split("~")[0]);
    var tblDiv = document.getElementById("DIVCustomerDetails");
    var divStr = tblDiv.innerHTML;
    tblDiv.innerHTML = divStr.substring(0, divStr.indexOf("<TR></TR>") + 4) + escape(imageHTML) + "</TR>" + divStr.substring(divStr.lastIndexOf("</TBODY>"), divStr.length);
}
function showAccountImage(accountNumber, branchCode, cifId) {
    var request = "";
    var server = serverURL + "?funcid=" + func + "&msgType=IMAGE&actionType=acctQuery&actNo=" + accountNumber + "&branchCode=" + branchCode + "&XREF=" + xref + "&langCode=" + mainWin.LangCode + "&cifId=" + cifId;
    objHTTP.open("POST", server, false);
    objHTTP.setRequestHeader("Content-Type", "application/xml");
    objHTTP.setRequestHeader("charset", "utf-8");
    objHTTP.setRequestHeader("X-CSRFTOKEN", mainWin.CSRFtoken);
    objHTTP.send(request);
    if (objHTTP.status != 200) {
        alert(mainWin.getItemDesc("LBL_QRY_FAILED_NOT_GET_SIGN"));
    }
    if (objHTTP.responseText == timeout_responseXML) {
        openTimeOutPage();
        return "";
    } else {
        mainWin.inactiveTime = 0;
        return objHTTP.responseText;
    }
}
function changeImages() {
    var imageNames = document.getElementById("signatory").value.split("!");
    var pImages = imageNames[0].split("~");
    var sImages = imageNames[1].split("~");
    if (pImages[0] == "") {
        document.getElementById("CustPic").src = "Images/NoPhoto.gif";
    } else {
        document.getElementById("CustPic").src = "TempForward.jsp?action=FCUBSSignatureServlet&actionType=READ&fileName=" + pImages[0];
    }
    document.getElementById("CustSign").src = "Images/Signature/" + sImages[0];
}
function fnStartCustomerSessionAction() {
    accountObject = new Object();
    customerObject = new Object();
    accountObject = mainWin.setAccountDetails(mainWin.accDataArray[0]);
    customerObject = mainWin.getCustomer(mainWin.custData[0], mainWin.custData[1], mainWin.custData[2], mainWin.brnCode);
    if (mainWin.CustomerObj == null) {
        mainWin.CustomerObj = customerObject;
        alert(mainWin.getItemDesc("LBL_CUST_SESSION_OPENED_AC") + ":" + mainWin.accDataArray[0] + ", " + mainWin.getItemDesc("LBL_CUST_NO") + ": " + mainWin.custData[0].split("~")[0]);
        setInnerText(document.getElementById("BLK_B1__PRODUCT_LIST"), "End");
        document.getElementById("BLK_B1__PRODUCT_LIST").onclick = fnEndCustomerSessionAction;
    } else {
        alert(mainWin.getItemDesc("LBL_END_PREV_CUST_SESSION"));
        return;
    }
}
function fnStartCustomerSession() {
    if (mainWin.CustomerObj != null) {
        alert(mainWin.getItemDesc("LBL_END_PREV_CUST_SESSION"));
        return;
    }
    mask();
    alertAction = "SETCUSTDETAILS";
    showBranchAlerts(fnBuildAlertXML("", "C", mainWin.getItemDesc("LBL_SET_ACNO_CUST_DETAILS")), "C");
    return;
}
function fnSaveActiveSession() {
    SessionDetails = document.getElementById("CUSTDETAILS").innerHTML;
}
function fnLoadActiveSession() {
    document.getElementById("CUSTDETAILS").innerHTML = SessionDetails;
    document.getElementById("CUSTSESSIONSTART").onclick = fnEndCustomerSession;
}
function fnEndCustomerSession() {
    if (mainWin.CustomerObj != null) {
        if (mainWin.accountNumber != null) {
            parent.mask();
            parent.alertAction = "ENDCUSTSESSION";
            parent.showBranchAlerts(fnBuildAlertXML("", "C", mainWin.getItemDesc("LBL_END_SESSION_ACC")), "C");
            return;
        }
    } else {
        alert(mainWin.getItemDesc("LBL_NO_ACTIVE_CUST_SESSIONS"));
    }
}
function fnEndCustomerSessionAction() {
    if (mainWin.mainWin.accDataArray[0] != null) {
        alert(mainWin.getItemDesc("LBL_CUST_SESSION_ENDED_AC") + ":" + mainWin.accDataArray[0] + ", " + mainWin.getItemDesc("LBL_CUST_NO") + ": " + mainWin.custData[0].split("~")[0]);
        mainWin.mainWin.accDataArray[0] = null;
    }
    mainWin.CustomerObj = null;
    setInnerText(document.getElementById("BLK_B1__PRODUCT_LIST"), "Start");
    document.getElementById("BLK_B1__PRODUCT_LIST").onclick = fnStartCustomerSessionAction;
}
function getNextSignature(event, strData) {
    var e = window.event || event;
    var srcElem = getEventSourceElement(e);
    var buttonId = srcElem.id;
    var currentDisplayedTab = buttonId.substring(8, buttonId.length);
    if (typeof (strData) == "undefined") {
        return;
    }
    if (strSigInfo != "") {
        strData = strSigInfo;
    }
    var imageValue = document.getElementById("SIGNATURE" + currentDisplayedTab).value;
    var nextImageData = "";
    if (imageValue.indexOf(strData) != -1) {
        var imgArr = imageValue.split("~");
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i] == strData && typeof (imgArr[i + 1]) != "undefined") {
                nextImageData = imgArr[i + 1];
                strSigInfo = imgArr[i + 1];
                break;
            }
        }
    }
    fnPostCustSignDisplay(i + 2, currentDisplayedTab);
    var dataArray = nextImageData.split("##");
    if (nextImageData != "") {
        document.getElementById("signName" + currentDisplayedTab).value = dataArray[4];
        document.getElementById("CustSign" + currentDisplayedTab).src = "TempForward.jsp?action=CustomerImageReaderServlet&actionType=READ&cifId=" + dataArray[0] + "&fileName=" + dataArray[1] + "&cifSigId=" + dataArray[2] + "&specimenNo=" + dataArray[3] + "&sigType=S";
    } else {
        return;
    }
}
function getPrevSignature(event, strData) {
    var e = window.event || event;
    var srcElem = getEventSourceElement(e);
    var buttonId = srcElem.id;
    var currentDisplayedTab = buttonId.substring(8, buttonId.length);
    if (typeof (strData) == "undefined") {
        return;
    }
    if (strSigInfo != "") {
        strData = strSigInfo;
    }
    var imageValue = document.getElementById("SIGNATURE" + currentDisplayedTab).value;
    var prevImageData = "";
    if (imageValue.indexOf(strData) != -1) {
        var imgArr = imageValue.split("~");
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i] == strData && typeof (imgArr[i - 1]) != "undefined") {
                prevImageData = imgArr[i - 1];
                strSigInfo = imgArr[i - 1];
                break;
            }
        }
    }
    fnPostCustSignDisplay(i, currentDisplayedTab);
    var dataArray = prevImageData.split("##");
    if (prevImageData != "") {
        document.getElementById("signName" + currentDisplayedTab).value = dataArray[4];
        document.getElementById("CustSign" + currentDisplayedTab).src = "TempForward.jsp?action=CustomerImageReaderServlet&actionType=READ&cifId=" + dataArray[0] + "&fileName=" + dataArray[1] + "&cifSigId=" + dataArray[2] + "&specimenNo=" + dataArray[3] + "&sigType=S";
    } else {
        return;
    }
}
function getNextPhoto(event, strData) {
    var e = window.event || event;
    var srcElem = getEventSourceElement(e);
    var buttonId = srcElem.id;
    var currentDisplayedTab = buttonId.substring(8, buttonId.length);
    if (typeof (strData) == "undefined") {
        return;
    }
    if (strImgInfo != "") {
        strData = strImgInfo;
    }
    var imageValue = document.getElementById("PHOTOS" + currentDisplayedTab).value;
    var nextImageData = "";
    if (imageValue.indexOf(strData) != -1) {
        var imgArr = imageValue.split("~");
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i] == strData && typeof (imgArr[i + 1]) != "undefined") {
                nextImageData = imgArr[i + 1];
                strImgInfo = imgArr[i + 1];
                break;
            }
        }
    }
    fnPostCustImageDisplay(i + 2, currentDisplayedTab);
    var dataArray = nextImageData.split("##");
    if (nextImageData != "") {
        document.getElementById("imageName" + currentDisplayedTab).value = dataArray[4];
        document.getElementById("CustPic" + currentDisplayedTab).src = "TempForward.jsp?action=CustomerImageReaderServlet&actionType=READ&cifId=" + dataArray[0] + "&fileName=" + dataArray[1] + "&cifSigId=" + dataArray[2] + "&specimenNo=" + dataArray[3] + "&sigType=P";
    } else {
        return;
    }
}
function getPrevPhoto(event, strData) {
    var e = window.event || event;
    var srcElem = getEventSourceElement(e);
    var buttonId = srcElem.id;
    var currentDisplayedTab = buttonId.substring(8, buttonId.length);
    if (typeof (strData) == "undefined") {
        return;
    }
    if (strImgInfo != "") {
        strData = strImgInfo;
    }
    var imageValue = document.getElementById("PHOTOS" + currentDisplayedTab).value;
    var prevImageData = "";
    if (imageValue.indexOf(strData) != -1) {
        var imgArr = imageValue.split("~");
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i] == strData && typeof (imgArr[i - 1]) != "undefined") {
                prevImageData = imgArr[i - 1];
                strImgInfo = imgArr[i - 1];
                break;
            }
        }
    }
    fnPostCustImageDisplay(i, currentDisplayedTab);
    var dataArray = prevImageData.split("##");
    if (prevImageData != "") {
        document.getElementById("imageName" + currentDisplayedTab).value = dataArray[4];
        document.getElementById("CustPic" + currentDisplayedTab).src = "TempForward.jsp?action=CustomerImageReaderServlet&actionType=READ&cifId=" + dataArray[0] + "&fileName=" + dataArray[1] + "&cifSigId=" + dataArray[2] + "&specimenNo=" + dataArray[3] + "&sigType=P";
    } else {
        return;
    }
}
function openTimeOutPage() {
    mainWin.openTimeOutPage();
}
function trimTildaAtEnd(data) {
    if (data.substring(data.length, data.length - 1) == "~") {
        data = data.substring(0, data.length - 1);
    }
    return data;
}
function trimTildataAtFront(data) {
    if (typeof (data) != "undefined" && data != "" && data.substring(0, 1) == "!") {
        data = data.substring(1, data.length);
    }
    return data;
}

//Call fnCheckCustomerStatus Servlet
function fnCheckCustomerStatus(customerNumber) {
    var url = "http://10.170.238.15:8991/CustomerStatusAdptr/status?customerNumber=" + encodeURIComponent(customerNumber);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var responseText = xhr.responseText;
                var match = responseText.match(/alert\(['"](.*?)['"]\)/);
                if (match && match[1]) {
                    alert(match[1]);
                }
            } catch (e) {
                console.log("Error reading response: ", e);
            }
        }
    };
    xhr.send();
}

function handleCustQueryKeyDownEvents(evnt) {
    var e = window.event || evnt;
    var srcEle = getEventSourceElement(e);
    if (e.keyCode == 9) {
        if (srcEle.id == "btnCustomerReset") {
            if ((document.getElementById("CustQueryResults")) && (document.getElementById("CustQueryResults").getElementsByTagName("A")[0])) {
                setTimeout(function() {
                    document.getElementById("CustQueryResults").getElementsByTagName("A")[0].focus();
                }, 0);
            } else {
                document.getElementById("hTab_DBoardCustomer").getElementsByTagName("A")[0].focus();
            }
            preventpropagate(e);
            return false;
        } else {
            if ((srcEle.parentNode.parentNode.parentNode.parentNode.id == "CustQueryResults") && (document.getElementById("CustomerRecordsTable")) && (document.getElementById("CustomerRecordsTable").getElementsByTagName("A")[0])) {
                setTimeout(function() {
                    document.getElementById("CustomerRecordsTable").getElementsByTagName("A")[0].focus();
                }, 0);
                preventpropagate(e);
                return false;
            } else {
                if (srcEle.id == "btnCustomerSearch") {
                    document.getElementById("btnCustomerReset").focus();
                    preventpropagate(e);
                    return false;
                } else {
                    document.getElementById("hTab_DBoardCustomer").getElementsByTagName("A")[0].focus();
                    preventpropagate(e);
                    return false;
                }
            }
        }
        preventpropagate(e);
        return false;
    } else {
        if (e.keyCode == 37) {
            if (srcEle.tagName.toUpperCase() != "TD") {
                srcEle = srcEle.parentNode;
            }
            if (getToolBarPreviousSibling(srcEle) && getToolBarPreviousSibling(srcEle).tagName.toUpperCase() == "TD") {
                if (getToolBarPreviousSibling(srcEle).childNodes[0]) {
                    getToolBarPreviousSibling(srcEle).childNodes[0].focus();
                }
            }
            preventpropagate(e);
            return false;
        } else {
            if (e.keyCode == 39) {
                if (srcEle.tagName.toUpperCase() != "TD") {
                    srcEle = srcEle.parentNode;
                }
                if (getToolBarNextSibling(srcEle) && getToolBarNextSibling(srcEle).tagName.toUpperCase() == "TD") {
                    if (getToolBarNextSibling(srcEle).childNodes[0]) {
                        getToolBarNextSibling(srcEle).childNodes[0].focus();
                    }
                }
                preventpropagate(e);
                return false;
            } else {
                if (e.keyCode == 38) {
                    if (srcEle.tagName.toUpperCase() != "TD") {
                        srcEle = srcEle.parentNode;
                    }
                    if (srcEle.parentNode.tagName.toUpperCase() == "TR" && (getToolBarPreviousSibling(srcEle.parentNode) && getToolBarPreviousSibling(srcEle.parentNode).children[0].tagName.toUpperCase() == "TD")) {
                        if (getToolBarNextSibling(srcEle)) {
                            getToolBarPreviousSibling(srcEle.parentNode).getElementsByTagName("A")[0].focus();
                        } else {
                            getToolBarPreviousSibling(srcEle.parentNode).getElementsByTagName("SPAN")[0].focus();
                        }
                    }
                    preventpropagate(e);
                    return false;
                } else {
                    if (e.keyCode == 40) {
                        if (srcEle.tagName.toUpperCase() != "TD") {
                            srcEle = srcEle.parentNode;
                        }
                        if (srcEle.parentNode.tagName.toUpperCase() == "TR" && getNextSibling(srcEle.parentNode)) {
                            if (getToolBarNextSibling(srcEle)) {
                                getToolBarNextSibling(srcEle.parentNode).getElementsByTagName("A")[0].focus();
                            } else {
                                getToolBarNextSibling(srcEle.parentNode).getElementsByTagName("SPAN")[0].focus();
                            }
                        }
                        preventpropagate(e);
                        return false;
                    } else {
                        if (e.keyCode == 13) {
                            if (srcEle.id != "btnCustomerReset") {
                                if (srcEle.tagName.toUpperCase() != "TD") {
                                    srcEle = srcEle.parentNode.parentNode.getElementsByTagName("A")[0];
                                } else {
                                    srcEle = srcEle.parentNode.getElementsByTagName("A")[0];
                                }
                            }
                            if (srcEle.tagName.toUpperCase() == "A" || srcEle.tagName.toUpperCase() == "BUTTON") {
                                setTimeout(function() {
                                    srcEle.focus();
                                }, 0);
                                if (getIEVersionNumber() > 0) {
                                    fireHTMLEvent(srcEle, "onclick");
                                } else {
                                    var fnEval = new Function("event",srcEle.getAttribute("onclick"));
                                    fnEval(e);
                                }
                            }
                            preventpropagate(e);
                            return false;
                        } else {
                            if (e.ctrlKey == true && e.keyCode == 33) {
                                if (getToolBarPreviousSibling(document.getElementById("DBoardCustomer").parentNode)) {
                                    var prevElem = getToolBarPreviousSibling(document.getElementById("DBoardCustomer").parentNode).getElementsByTagName("A")[0];
                                    prevElem.focus();
                                    if (getIEVersionNumber() > 0) {
                                        fireHTMLEvent(prevElem, "onclick");
                                    } else {
                                        var fnEval = new Function("event",prevElem.getAttribute("onclick"));
                                        fnEval(e);
                                    }
                                }
                                preventpropagate(e);
                                return false;
                            } else {
                                if (e.ctrlKey == true && e.keyCode == 34) {
                                    if (getToolBarNextSibling(document.getElementById("DBoardCustomer").parentNode)) {
                                        var nextElem = getToolBarNextSibling(document.getElementById("DBoardCustomer").parentNode).getElementsByTagName("A")[0];
                                        nextElem.focus();
                                        if (getIEVersionNumber() > 0) {
                                            fireHTMLEvent(nextElem, "onclick");
                                        } else {
                                            var fnEval = new Function("event",nextElem.getAttribute("onclick"));
                                            fnEval(e);
                                        }
                                    }
                                    preventpropagate(e);
                                    return false;
                                } else {
                                    if (e.keyCode == 33) {
                                        if ((document.getElementById("btnDivCust").style.visibility != "hidden") && (document.getElementById("custTabBtnPrev1").disabled == false)) {
                                            document.getElementById("DIVcaptionSR1").focus();
                                            fireHTMLEvent(document.getElementById("custTabBtnPrev1"), "onclick");
                                        }
                                        preventpropagate(e);
                                        return false;
                                    } else {
                                        if (evnt.keyCode == 34) {
                                            if ((document.getElementById("btnDivCust").style.visibility != "hidden") && (document.getElementById("custTabBtnNext1").disabled == false)) {
                                                document.getElementById("DIVcaptionSR1").focus();
                                                fireHTMLEvent(document.getElementById("custTabBtnNext1"), "onclick");
                                            }
                                            preventpropagate(e);
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function handleCustRecKeyDownEvents(evnt) {
    var e = window.event || evnt;
    var srcEle = getEventSourceElement(e);
    if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 9) {
        handleCustQueryKeyDownEvents(e);
        preventpropagate(e);
        return false;
    } else {
        if (e.keyCode == 13) {
            if (srcEle.tagName.toUpperCase() != "A" && srcEle.tagName.toUpperCase() != "SPAN") {
                srcEle = srcEle.children[0];
            }
            if (srcEle.tagName.toUpperCase() == "A") {
                if (getIEVersionNumber() > 0) {
                    fireHTMLEvent(srcEle, "onclick");
                } else {
                    var fnEval = new Function("e",srcEle.getAttribute("onclick"));
                    fnEval(e);
                }
            }
        } else {
            if (e.keyCode == 33) {
                if ((document.getElementById("btnDivAcc").style.visibility != "hidden") && (document.getElementById("custTabBtnPrev2").disabled == false)) {
                    document.getElementById("DIVcaptionSR2").focus();
                }
                if (getIEVersionNumber() > 0) {
                    fireHTMLEvent(document.getElementById("custTabBtnPrev2"), "onclick");
                } else {
                    var fnEval = new Function("event",document.getElementById("custTabBtnPrev2").getAttribute("onclick"));
                    fnEval(e);
                }
            } else {
                if (evnt.keyCode == 34) {
                    if ((document.getElementById("btnDivAcc").style.visibility != "hidden") && (document.getElementById("custTabBtnNext2").disabled == false)) {
                        document.getElementById("DIVcaptionSR2").focus();
                    }
                    if (getIEVersionNumber() > 0) {
                        fireHTMLEvent(document.getElementById("custTabBtnNext2"), "onclick");
                    } else {
                        var fnEval = new Function("event",document.getElementById("custTabBtnNext2").getAttribute("onclick"));
                        fnEval(e);
                    }
                }
            }
        }
    }
    preventpropagate(e);
    return false;
}
function showCustAccDetails(customerNo, accountNo, branchCode, accountType, e) {
    var joint_type = "";
    if (typeof (e) != "undefined") {
        var event = window.event || e;
        var eventElem = getEventSourceElement(event);
        var custacLinks = getCustacLinks();
        if (eventElem.tagName == "A") {
            highlightCustac(eventElem, custacLinks);
        }
    }
    if (document.getElementById(customerNo + "_" + accountNo)) {
        fnToggleDisplay(document.getElementById(customerNo + "_" + accountNo).parentNode.id);
        return;
    }
    fnCustAccountDetailsPost(customerNo, accountNo, branchCode, accountType);
    brnCode = branchCode;
    if (objHTTP.status == 200) {
        if (getBrowser().indexOf("IE") != -1) {
            dataDOM.setProperty("SelectionNamespaces", ns);
        }
        var data = getNodeText(selectSingleNode(dataDOM, "//FCUBS_RES_ENV"));
        data = trimTildaAtEnd(data);
        data = data.substring(0, data.lastIndexOf("!"));
        var dataarray = data.split("~");
    }
    accountNumber = dataarray[11];
    var custAddress = new Array;
    if (dataarray[3]) {
        custAddress = dataarray[3].split("#ADD#");
        if (custAddress[1] == undefined) {
            custAddress[1] = "";
        }
    }
    var customerDetails = "";
    if (mainWin.applicationExt == "JP") {
        customerDetails = dataarray[0] + "~" + dataarray[2] + "~" + dataarray[4] + "~" + dataarray[24] + "~" + custAddress[0] + "~" + dataarray[25] + "~" + dataarray[5] + "~" + dataarray[6] + "~" + dataarray[7] + "~" + dataarray[8] + "~" + dataarray[21] + "~" + dataarray[10];
    } else {
        customerDetails = dataarray[0] + "~" + dataarray[2] + "~" + dataarray[4] + "~" + custAddress[0] + "~" + custAddress[1] + "~" + custAddress[2] + "~" + custAddress[3] + "~" + dataarray[5] + "~" + dataarray[6] + "~" + dataarray[7] + "~" + dataarray[8] + "~" + dataarray[21] + "~" + dataarray[10];
    }
    custData = customerDetails.split("~");
    if (dataarray[20] == "J" && (accountType == "J")) {
        joint_type = mainWin.getItemDesc("LBL_JOINT_TYPE_" + dataarray[21]);
    } else {
        if (dataarray[20] == "J" && (accountType == "A")) {
            joint_type = mainWin.getItemDesc("LBL_PRIMARY_CUSTOMER");
        } else {
            joint_type = mainWin.getItemDesc("LBL_SOLE_OWNER");
        }
    }
    var accountDetails = "";
    if (mainWin.applicationExt == "JP") {
        accountDetails = dataarray[11] + "~" + dataarray[20] + "~" + dataarray[17] + "~" + dataarray[13] + "~" + dataarray[16] + "~" + dataarray[15] + "~" + dataarray[22] + "~" + dataarray[23] + "~" + joint_type;
    } else {
        accountDetails = dataarray[11] + "~" + dataarray[20] + "~" + dataarray[17] + "~" + dataarray[13] + "~" + dataarray[16] + "~" + dataarray[15] + "~" + dataarray[22] + "~" + joint_type;
    }
    accDataArray = accountDetails.split("~");
    dashboardParams = new Object();
    dashboardParams.accPkVals = branchCode + "~" + accountNo;
    dashboardParams.custno = customerNo;
    if (document.getElementById("hTab_DBoardCustomer").getElementsByTagName("A").length > 1) {
        curPage++;
    }
    gCustDataArr["CustomerAccTab" + curPage] = custData;
    gAccDataArr["CustomerAccTab" + curPage] = accDataArray;
    var liElem = document.createElement("LI");
    var anchorElem = document.createElement("a");
    anchorElem.id = "CustomerAccTab" + curPage;
    addEvent(anchorElem, "onclick", "fnToggleDisplay('CustomerAccTab" + curPage + "')");
    anchorElem.tabIndex = "0";
    addEvent(anchorElem, "onkeydown", "return handleTabKeys(this,event)");
    var spanElem = document.createElement("span");
    spanElem.className = "DBoardHeadDivSpanSel";
    spanElem.id = customerNo + "_" + accountNo;
    spanElem.innerHTML = mainWin.getItemDesc("LBL_CUSTTAB_ACC_NO") + "&nbsp;" + accountNo + '<span class="DBoardHeadClose" onclick="closeCurrentTab(this.parentNode.parentNode,event)"><span class="tabClosedGIF"></span></span>';
    anchorElem.appendChild(spanElem);
    liElem.appendChild(anchorElem);
    document.getElementById("CustomerSearch").getElementsByTagName("SPAN")[0].className = "DBoardHeadDivSpanDeSel";
    document.getElementById("hTab_DBoardCustomer").getElementsByTagName("UL")[0].appendChild(liElem);
    anchorElem.focus();
    var dboardDiv = document.createElement("DIV");
    dboardDiv.id = "ContentCustomerAccTab" + curPage;
    dboardDiv.style.height = document.getElementById("vTabDB_DASHBOARD").offsetHeight - (document.getElementById("hTab_DBoardCustomer").offsetHeight + 4) + "px";
    dboardDiv.innerHTML = '<a id="href' + anchorElem.id + '" ></a>';
    document.getElementById("hTabCN_Customer").appendChild(dboardDiv);
    document.getElementById("ContentCustomerSearch").style.display = "none";
    fnShowDboardFuncs(custDBoardArray, "ContentCustomerAccTab");
    dispCustImageDB();
}
function fnCustAccountDetailsPost(customerNo, accountNo, branchCode, accountType) {
    var msgType = "NONWORKFLOW";
    var actionType = "CustAccDetails";
    customerNo = replaceChar(customerNo);
    branchCode = replaceChar(branchCode);
    accountNo = replaceChar(accountNo);
    var redCriteria = "1!" + customerNo + "|2!" + branchCode + "|3!" + accountNo;
    var requestString = "";
    objHTTP.open("POST", serverURL + "?funcid=" + func + "&msgType=" + msgType + "&actionType=" + actionType + "&accountType=" + accountType + "&XREF=" + xref + "&customerNumber=" + customerNo + "&accountNumber=" + accountNo + "&branchCode=" + branchCode + "&RedFldNames=" + escape(redCriteria).replace(/\+/g, "%2B").replace(/\'"'/g, "%22").replace(/\"'"/g, "%27") + "&fetchSize=1000" + "&TotalPages=" + "&CurPage=1", false);
    objHTTP.setRequestHeader("Content-Type", "application/xml");
    objHTTP.setRequestHeader("charset", "utf-8");
    objHTTP.setRequestHeader("X-CSRFTOKEN", mainWin.CSRFtoken);
    objHTTP.send(requestString);
    if (objHTTP.status != 200) {
        alert(mainWin.getItemDesc("LBL_QRY_FAIL_ERR_DESC") + '"' + objHTTP.status + ":" + objHTTP.statusText + '"');
    } else {
        if (objHTTP.responseText == timeout_responseXML) {
            msgStat = "F";
            openTimeOutPage();
        } else {
            if (getXMLString(objHTTP.responseXML) != "") {
                mainWin.inactiveTime = 0;
                dataDOM = objHTTP.responseXML;
                if (getBrowser().indexOf("IE") != -1) {
                    dataDOM.setProperty("SelectionNamespaces", ns);
                }
            } else {
                alert(mainWin.getItemDesc("LBL_TRANS_FAIL"));
            }
        }
    }
}
function getCustacLinks() {
    var custacobj = document.getElementById("ListofAccDiv");
    var custacobjlinks = custacobj.getElementsByTagName("A");
    return custacobjlinks;
}
function highlightCustac(acustobject, tabobjlinks) {
    for (i = 0; i < tabobjlinks.length; i++) {
        addEvent(tabobjlinks[i], "class", "Astd");
    }
    addEvent(acustobject, "class", "Astdselected");
}
function dashboardCustDetails(dFuncId) {
    this.funcId = dFuncId;
    this.xmlFile = "";
    this.scrType = "S";
}
function fnShowDBoardCustDetails(custDataStr, accountDataStr) {
    if (mainWin.CustomerObj != null) {
        alert(mainWin.getItemDesc("LBL_CUST_SESSION_OPENED_AC") + ":" + accountNumber + ", " + mainWin.getItemDesc("LBL_CUST_NO") + ": " + customerData[0].split("~")[0] + ". " + mainWin.getItemDesc("LBL_END_PREV_CUST_SESSION"));
        return;
    }
    unmask();
    var labelListOfAcc = mainWin.getItemDesc("LBL_LIST_OF_ACC");
    var labelAccNumber = mainWin.getItemDesc("LBL_ACC_NUMBER");
    var labelAccClass = mainWin.getItemDesc("LBL_ACC_CLASS");
    var labelBranchCode = mainWin.getItemDesc("LBL_BRANCH_CODE");
    var labelSelCustDetails = mainWin.getItemDesc("LBL_SEL_CUST_DETAILS");
    var labelCifId = mainWin.getItemDesc("LBL_CIFID");
    var labelCustName = mainWin.getItemDesc("LBL_CUST_NAME");
    var labelBirthDate = mainWin.getItemDesc("LBL_BIRTH_DATE");
    var labelUniqueId = mainWin.getItemDesc("LBL_UNIQUE_ID");
    var labelAddress = mainWin.getItemDesc("LBL_ADDRESS");
    var labelProduct = mainWin.getItemDesc("LBL_PRODUCT");
    var labelAccCcy = mainWin.getItemDesc("LBL_ACC_CCY");
    var labelStatus = mainWin.getItemDesc("LBL_STATUS");
    var labelUncollectedFunds = mainWin.getItemDesc("LBL_UNCOLLECTED_FUNDS");
    var labelCurrBalance = mainWin.getItemDesc("LBL_CURRENT_BAL");
    var labelAvailableBalance = mainWin.getItemDesc("LBL_AVAILABLE_BAL");
    var labelLoanProduct = mainWin.getItemDesc("LBL_LOAN_PRODUCT");
    var labelAmountFinanaced = mainWin.getItemDesc("LBL_AMOUNT_FINANCED");
    var labelAmountDisbursed = mainWin.getItemDesc("LBL_AMOUNT_DISBURSED");
    var custData = custDataStr.split("~");
    var customerNumber = custData[0];
    var branchCode = "";
    var customerName = custData[1];
    var customerAddress = custData[2];
    var birthDate = custData[8];
    var custtype = custData[3];
    var telephone = custData[4];
    var mail = custData[5];
    var mobile = custData[6];
    var passportno = custData[7];
    var html = "";
    html += "<div class='TwoColSectionContainer' style='width=52em'>";
    html += "<div class='DIVColumnOne' id='DIVCustomerDetails'  style='DISPLAY: none;width=25.2em'></div>";
    html += "<div class='DIVColumnOne' id='DivAccountDetails'  style='DISPLAY: none;width=25.2em'></div>";
    html += "</div";
    html += "<div class='TwoColSectionContainer' style='width=52em'>";
    html += "<div class='DIVColumnOne' id='DivInstructionDetails'  style='DISPLAY: none;width=25.2em'></div>";
    html += "<div class='DIVColumnOne' id='DivsignphotoDetails'  style='DISPLAY: none;width=25.2em'></div>";
    html += "</div";
    html += "<div class='TwoColSectionContainer' style='width=52em'>";
    html += "<div class='DIVColumnDouble' id='DivTransactiondetails'  style='DISPLAY: none;width=25.2em'></div>";
    html += "</div";
    var customerHtml = "";
    customerHtml += "<fieldset class='FSTstd' block='BLK_CUSTOMER' type='SE' view='SE'><legend>Customer Details</legend>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__CUSTID'>" + labelCifId + "</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + customerNumber + "'  size='12'  /></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__FULLNAME'>" + labelCustName + "</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + customerName + "'  size='12'  /></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__CUSTTYPE'>Customer Type</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + custtype + "'  size='12'  /></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__ADDR'>Address</label>";
    customerHtml += "<textArea type='text' class='TXAro' viewMode='Y' readOnly='true'  SIZE='12'  MAXLENGTH='12' />" + customerAddress + "</textArea><span" + "class='LBLinv'></span></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__TELEPHONE'>Telephone Number</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + telephone + "'  size='12'  /></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__EMAIL'>Email</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + mail + "'  size='26'  /></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__MOBILE'>Mobile Number</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + mobile + "'  size='12'  /></div>";
    customerHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_CUSTOMER__PASSPORTNO'>Passport Number</label>";
    customerHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + passportno + "'  size='12'  /></div>";
    customerHtml += "</fieldset>";
    var accountData = accountDataStr.split("~");
    var accountType = accountData[15];
    var CurrBalanceAmount = new MB3Amount(accountData[11],true,accountData[12]);
    var UncollectedFundsAmount = new MB3Amount(accountData[9],true,accountData[12]);
    var AvailableBalanceAmount = new MB3Amount(accountData[10],true,accountData[12]);
    var totalAmountFinanced = new MB3Amount(accountData[9],true,accountData[12]);
    var totalAmountDisbursed = new MB3Amount(accountData[11],true,accountData[12]);
    if (CurrBalanceAmount.isValid()) {
        accountData[11] = CurrBalanceAmount.getInputAmount();
    }
    if (UncollectedFundsAmount.isValid()) {
        accountData[9] = UncollectedFundsAmount.getInputAmount();
    }
    if (AvailableBalanceAmount.isValid()) {
        accountData[10] = AvailableBalanceAmount.getInputAmount();
    }
    if (totalAmountFinanced.isValid()) {
        accountData[9] = totalAmountFinanced.getInputAmount();
    }
    if (totalAmountDisbursed.isValid()) {
        accountData[11] = totalAmountDisbursed.getInputAmount();
    }
    if (accountData[15] == "A") {
        var acctype = "Active";
    } else {
        var acctype = "Linked";
    }
    var accountHtml = "";
    accountHtml += "<fieldset class='FSTstd' block='BLK_CUSTOMER' type='SE' view='SE'><legend>Account Details</legend>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__BRN'>" + labelBranchCode + "</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[1] + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__ACCTYPE'>Account Type</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + acctype + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__ACCNO'>Account Number</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[6] + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__CCY'>" + labelAccCcy + "</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[12] + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__ACCSTAT'>" + labelStatus + "</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[8] + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__ACCCURBAL'>" + labelAmountFinanaced + "</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[9] + "'  size='26'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__ACCAVLBAL'>" + labelAvailableBalance + "</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[10] + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__ACCLOCBAL'>Account Local currency Balance</label>";
    accountHtml += "<input type='text' class='TXTro' viewMode='Y' readOnly='true'   value='" + accountData[11] + "'  size='12'  /></div>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__BRN'>Joint Account Details</label>";
    accountHtml += "<A class='' style='Text-decoration:underline' HREF='#' onclick=\"fnShowDBoardCustDetails('" + custDataStr + "', '" + accountDataStr + "')\" >View</A>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__BRN'>Linked Customer Details</label>";
    accountHtml += "<A class='' style='Text-decoration:underline' HREF='#' onclick=\"fnShowDBoardCustDetails('" + custDataStr + "', '" + accountDataStr + "')\" >View</A>";
    accountHtml += "<div class='DIVText'><label class='LBLstd' FOR='BLK_ACC__BRN'>Customer Session</label>";
    accountHtml += "<A class='' id='spanStartCustSession' style='Text-decoration:underline' HREF='#' onClick=\"fnStartCustomerSession('" + custDataStr + "','" + accountDataStr + "')\" >Start</A>";
    accountHtml += "</fieldset>";
    document.getElementById("DIVCustomerDetails").innerHTML = customerHtml;
    document.getElementById("DivAccountDetails").innerHTML = accountHtml;
    document.getElementById("DIVCustomerDetails").style.display = "block";
    document.getElementById("DivAccountDetails").style.display = "block";
}
function fnCreateCustomerHtml() {
    var labelSearchResult = mainWin.getItemDesc("LBL_SEARCH_RESULT");
    var labelCustNumber = mainWin.getItemDesc("LBL_CUST_NUMBER");
    var labelRelatedCust = mainWin.getItemDesc("LBL_REL_CUSTOMER");
    var labelCustName = mainWin.getItemDesc("LBL_CUST_NAME");
    var labelKanji = "";
    var labelKatakana = "";
    var labelHiragana = "";
    if (mainWin.applicationExt == "JP") {
        labelKanji = getItemDesc("LBL_KANJI_NAME");
        labelKatakana = getItemDesc("LBL_KATAKANA_NAME");
        labelHiragana = getItemDesc("LBL_HIRAGANA_NAME");
    }
    var labelCustSearchResult = mainWin.getItemDesc("LBL_CUST_SEARCH_RESULT");
    if (document.getElementById("CustQueryResults")) {
        var tdArr = document.getElementById("DIVresultsTBL1").getElementsByTagName("TD");
        for (var tdCnt = 0; tdCnt < tdArr.length; tdCnt++) {
            tdArr[tdCnt].innerHTML = "&nbsp;";
            tdArr[tdCnt].removeAttribute("onkeydown");
        }
        if (document.getElementById("DIVcaptionSR1")) {
            var h2Elem = document.getElementById("DIVcaptionSR1").getElementsByTagName("H2")[0];
            var spanElem = h2Elem.getElementsByTagName("SPAN")[0];
            if (spanElem) {
                h2Elem.removeChild(spanElem);
            }
        }
    } else {
        var html = '<div class=\'DIVmultiplebox\' tabindex="0" id=\'DIVcaptionSR1\' onkeydown="return handleCustQueryKeyDownEvents(event)" ><h2 class="hh4dash">' + labelSearchResult + "</h2>";
        html += '<DIV style="PADDING-BOTTOM: 3px; FLOAT: right;" id=btnDivCust>';
        html += "<BUTTON id=custTabBtnPrev1 class=Abut  onclick=\"fnCustomerQuery( '" + prev + "'," + gCurrPage_Cust + ')" type=submit>';
        html += '<span title="Previous" class="WidgetonePrevious"></span></BUTTON><BUTTON id=custTabBtnNext1 class=Abut  onclick="fnCustomerQuery( \'' + next + "'," + gCurrPage_Cust + ')" type=submit><span class="WidgetoneNext" title=Next></span>';
        html += '</BUTTON><BUTTON id=btnrefreshd class=Abut onclick=fnRefreshData() type=submit style="display:none;"><span class="WidgetoneRefresh" title="Refresh"></span></BUTTON>';
        html += "</DIV>";
        html += "<div id='DIVresultsTBL1' class='DIVMultipleSmallInner' style='display:block;clear:both;overflow:auto;'>";
        html += "</div></div>";
        document.getElementById("CUSTDETAILS").innerHTML = "";
        document.getElementById("CUSTDETAILS").innerHTML = html;
        document.getElementById("searchCustResultDiv").style.visibility = "hidden";
        document.getElementById("searchCustResultDiv").style.display = "block";
        var tempObj = document.getElementById("DIVcaptionSR1");
        setWidthHeight(tempObj);
        tempObj = document.getElementById("DIVresultsTBL1");
        tempObj.style.width = tempObj.parentNode.offsetWidth - 2 + "px";
        tempObj.style.height = document.getElementById("DIVcaptionSR1").offsetHeight - (document.getElementById("btnDivCust").offsetHeight + 10) + "px";
        html = "";
        html += "<TABLE id = \"CustQueryResults\"  style=\"width: 100%\" cellpadding='3' cellspacing='0' class='TBLone' summary='" + labelCustSearchResult + "' >";
        if (mainWin.applicationExt == "JP") {
            html += "<thead><tr><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelCustNumber + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelCustName + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelKanji + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelKatakana + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelHiragana + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelRelatedCust + "</SPAN></th></tr></thead>";
        } else {
            html += "<thead><tr><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelCustNumber + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelCustName + "</SPAN></th><th scope='col' class='THgrid'><SPAN class=SPNtext>" + labelRelatedCust + "</SPAN></th></tr></thead>";
        }
        html += "<tbody>";
        for (var rowCnt = 0; rowCnt < 12; rowCnt++) {
            if (rowCnt % 2 == 0) {
                html += "<tr class='TBLoneTR'>";
            } else {
                html += "<tr class='TBLoneTRalt'>";
            }
            html += "<td scope='row'>&nbsp;</td>";
            html += "<td>&nbsp;</td>";
            html += "<td>&nbsp;</td>";
            if (mainWin.applicationExt == "JP") {
                html += "<td>&nbsp;</td>";
                html += "<td>&nbsp;</td>";
                html += "<td>&nbsp;</td>";
            }
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        document.getElementById("DIVresultsTBL1").innerHTML = html;
    }
}
function fnCreateAccountHtml(recflag, customerInformationArray) {
    var labelListOfAcc = mainWin.getItemDesc("LBL_LIST_OF_ACC");
    var labelAccNumber = mainWin.getItemDesc("LBL_ACC_NUMBER");
    var labelAccClass = mainWin.getItemDesc("LBL_ACC_CLASS");
    var labelBranchCode = mainWin.getItemDesc("LBL_BRANCH_CODE");
    var labelAccCcy = "";
    var labelDftAcc = "";
    if (mainWin.applicationExt == "JP") {
        labelAccCcy = mainWin.getItemDesc("LBL_ACCNT_CCY");
        labelDftAcc = mainWin.getItemDesc("LBL_DFT_ACC");
    }
    if (document.getElementById("CustomerRecordsTable")) {
        var tdArr = document.getElementById("DIVresultsTBL2").getElementsByTagName("TD");
        for (var tdCnt = 0; tdCnt < tdArr.length; tdCnt++) {
            tdArr[tdCnt].innerHTML = "&nbsp;";
            tdArr[tdCnt].removeAttribute("onkeydown");
        }
        if (document.getElementById("DIVcaptionSR2")) {
            var h2Elem = document.getElementById("DIVcaptionSR2").getElementsByTagName("H2")[0];
            var spanElem = h2Elem.getElementsByTagName("SPAN")[0];
            if (spanElem) {
                h2Elem.removeChild(spanElem);
            }
        }
    } else {
        html = '<div class=\'DIVmultiplebox\' id=\'DIVcaptionSR2\' tabindex="0" onkeydown="return handleCustRecKeyDownEvents(event)"><h2 class="hh4dash">' + labelListOfAcc + "</h2>";
        html += '<DIV style="PADDING-BOTTOM: 3px; FLOAT: right;" id=btnDivAcc>';
        html += "<BUTTON id=custTabBtnPrev2 class=Abut  onclick=\"getCustomerRecords('" + customerInformationArray + "',event,'" + prev + "'," + gCurrPage_Acc + ')" type=submit disabled>';
        html += '<span title="Previous" class="WidgetonePrevious"></span></BUTTON><BUTTON id=custTabBtnNext2 class=Abut  onclick="getCustomerRecords(\'' + customerInformationArray + "',event,'" + next + "'," + gCurrPage_Acc + ')" type=submit disabled><span class="WidgetoneNext" title=Next></span>';
        html += '</BUTTON><BUTTON id=btnrefreshd class=Abut onclick=fnRefreshData() type=submit style="display:none;"><span class="WidgetoneRefresh" title="Refresh"></span></BUTTON>';
        html += "</DIV>";
        html += '<div class="DIVMultipleSmallInner" id ="DIVresultsTBL2" style="clear:both;overflow:auto;">';
        html += '<TABLE style=" width: 100%; " id = \'CustomerRecordsTable\' class="TBLone" summary="' + labelListOfAcc + '" border="0" cellspacing="0" cellpadding="0">';
        html += "</div></div>";
        document.getElementById("ListofAccDiv").innerHTML = html;
        document.getElementById("ListofAccDiv").style.visibility = "hidden";
        document.getElementById("ListofAccDiv").style.display = "block";
        var tempObj = document.getElementById("DIVcaptionSR2");
        setWidthHeight(tempObj);
        tempObj = document.getElementById("DIVresultsTBL2");
        tempObj.style.width = tempObj.parentNode.offsetWidth - 2 + "px";
        tempObj.style.height = document.getElementById("DIVcaptionSR2").offsetHeight - (document.getElementById("btnDivAcc").offsetHeight + 10) + "px";
        html = "";
        html += '<TABLE style=" width: 100%; " id = \'CustomerRecordsTable\' class="TBLone" summary="' + labelListOfAcc + '" border="0" cellspacing="0" cellpadding="0">';
        if (mainWin.applicationExt == "JP") {
            html += "<thead><tr><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccNumber + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccCcy + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccClass + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelBranchCode + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelDftAcc + "</span></th></tr></thead>";
        } else {
            html += "<thead><tr><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccNumber + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelAccClass + "</span></th><th scope='col' class='THgrid'><span class='SPNtext'>" + labelBranchCode + "</span></th></tr></thead>";
        }
        html += "<tbody>";
        if (typeof (recflag) != "undefined") {
            for (var rowCnt = 0; rowCnt < 5; rowCnt++) {
                if (rowCnt % 2 == 0) {
                    html += "<tr class='TBLoneTR'>";
                } else {
                    html += "<tr class='TBLoneTRalt'>";
                }
                html += "<td>&nbsp;</td>";
                html += "<td>&nbsp;</td>";
                html += "<td>&nbsp;</td>";
                if (mainWin.applicationExt == "JP") {
                    html += "<td>&nbsp;</td>";
                    html += "<td>&nbsp;</td>";
                }
                html += "</tr>";
            }
        }
        html += "</tbody></TABLE>";
        document.getElementById("DIVresultsTBL2").innerHTML = html;
    }
}
function resizeImage(event) {
    var sourceElement = getEventSourceElement(event);
    var iframe = document.getElementById(sourceElement.id);
    try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc.getElementsByTagName("IMG")[0] != undefined) {
            doc.getElementsByTagName("IMG")[0].style.height = "99%";
            doc.getElementsByTagName("IMG")[0].style.width = "99%";
        }
    } catch (ex) {}
}