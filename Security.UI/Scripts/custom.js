(function (angular) {
    'use strict';

    angular.module('components', []);
})(window.angular);
//
//
// A "Floating Label" directive using the placeholder attribute
// Based on https://github.com/jverdi/JVFloatLabeledTextField and https://github.com/maman/JVFloat.js
//
// By @klaascuvelier (http://www.klaascuvelier.be)
//
//
(function (angular) {
    'use strict';

    /**
     * generate an NgModel key for the input box using it's attributes (id/name)
     * @param {angular.element} inputBox
     * @return {string}
     */
    function generateNgModelKey(inputBox) {
        var inputId = inputBox.attr('id') || '',
            inputName = inputBox.attr('name') || '';

        return 'input_' + (inputId ? inputId : inputName);
    }

    function floatingLabelCompileFunction($element, $attrs) {
        var templateAttributes = [],
            template, attr;

        // if there is no placeholder, there is no use for this directive
        if (!$attrs.placeholder) {
            return;
        }

        // copy existing attributes from
        for (attr in $attrs) {
            if ($attrs.hasOwnProperty(attr) && attr.substr(0, 1) !== '$' && attr !== 'floatingLabel') {
                templateAttributes.push($attrs.$attr[attr] + '="' + $attrs[attr] + '"');
            }
        }

        // if there wasn't a ngModel binded to input, generate a key for the ngModel and add it
        if (!$attrs.ngModel) {
            templateAttributes.push('ng-model="' + generateNgModelKey($element) + '"');
        }

        // html template for the directive
        template = '<div class="floating-label">' +
            '<label ng-class="{ \'active\': showLabel }">' + $attrs.placeholder + '</label>' +
            '<input ' + templateAttributes.join(' ') + ' />' +
            '</div>';

        $element.replaceWith(angular.element(template));

        return {
            post: floatingLabelPostCompileFunction
        };
    }

    // Add DI
    floatingLabelCompileFunction.$inject = ['$element', '$attrs'];

    /**
     * Post compile method
     * @param $scope
     * @param $element
     */
    function floatingLabelPostCompileFunction($scope, $element) {
        var inputBox = $element.find('input'),
            ngModelKey = inputBox.attr('ng-model');

        $scope.$watch(ngModelKey, function (newValue) {
            // if the field is not empty, show the label, otherwise hide it
            $scope.showLabel = newValue && newValue.length > 0;
        });
    }

    // Add DI
    floatingLabelPostCompileFunction.$inject = ['$scope', '$element'];

    /**
     * Return the definition for this directive
     * @returns {Object}
     */
    function floatingLabelDefinition() {
        return {
            restrict: 'A',
            scope: true,
            compile: floatingLabelCompileFunction
        };
    }

    // Create
    angular
        .module('components')
        .directive('floatingLabel', floatingLabelDefinition);
})(window.angular);

/*tableshorter*/
!function (e) { "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && "object" == typeof module.exports ? module.exports = e(require("jquery")) : e(jQuery) }(function (e) { return function (A) { "use strict"; var L = A.tablesorter = { version: "2.31.3", parsers: [], widgets: [], defaults: { theme: "default", widthFixed: !1, showProcessing: !1, headerTemplate: "{content}", onRenderTemplate: null, onRenderHeader: null, cancelSelection: !0, tabIndex: !0, dateFormat: "mmddyyyy", sortMultiSortKey: "shiftKey", sortResetKey: "ctrlKey", usNumberFormat: !0, delayInit: !1, serverSideSorting: !1, resort: !0, headers: {}, ignoreCase: !0, sortForce: null, sortList: [], sortAppend: null, sortStable: !1, sortInitialOrder: "asc", sortLocaleCompare: !1, sortReset: !1, sortRestart: !1, emptyTo: "bottom", stringTo: "max", duplicateSpan: !0, textExtraction: "basic", textAttribute: "data-text", textSorter: null, numberSorter: null, initWidgets: !0, widgetClass: "widget-{name}", widgets: [], widgetOptions: { zebra: ["even", "odd"] }, initialized: null, tableClass: "", cssAsc: "", cssDesc: "", cssNone: "", cssHeader: "", cssHeaderRow: "", cssProcessing: "", cssChildRow: "tablesorter-childRow", cssInfoBlock: "tablesorter-infoOnly", cssNoSort: "tablesorter-noSort", cssIgnoreRow: "tablesorter-ignoreRow", cssIcon: "tablesorter-icon", cssIconNone: "", cssIconAsc: "", cssIconDesc: "", cssIconDisabled: "", pointerClick: "click", pointerDown: "mousedown", pointerUp: "mouseup", selectorHeaders: "> thead th, > thead td", selectorSort: "th, td", selectorRemove: ".remove-me", debug: !1, headerList: [], empties: {}, strings: {}, parsers: [], globalize: 0, imgAttr: 0 }, css: { table: "tablesorter", cssHasChild: "tablesorter-hasChildRow", childRow: "tablesorter-childRow", colgroup: "tablesorter-colgroup", header: "tablesorter-header", headerRow: "tablesorter-headerRow", headerIn: "tablesorter-header-inner", icon: "tablesorter-icon", processing: "tablesorter-processing", sortAsc: "tablesorter-headerAsc", sortDesc: "tablesorter-headerDesc", sortNone: "tablesorter-headerUnSorted" }, language: { sortAsc: "Ascending sort applied, ", sortDesc: "Descending sort applied, ", sortNone: "No sort applied, ", sortDisabled: "sorting is disabled", nextAsc: "activate to apply an ascending sort", nextDesc: "activate to apply a descending sort", nextNone: "activate to remove the sort" }, regex: { templateContent: /\{content\}/g, templateIcon: /\{icon\}/g, templateName: /\{name\}/i, spaces: /\s+/g, nonWord: /\W/g, formElements: /(input|select|button|textarea)/i, chunk: /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi, chunks: /(^\\0|\\0$)/, hex: /^0x[0-9a-f]+$/i, comma: /,/g, digitNonUS: /[\s|\.]/g, digitNegativeTest: /^\s*\([.\d]+\)/, digitNegativeReplace: /^\s*\(([.\d]+)\)/, digitTest: /^[\-+(]?\d+[)]?$/, digitReplace: /[,.'"\s]/g }, string: { max: 1, min: -1, emptymin: 1, emptymax: -1, zero: 0, none: 0, "null": 0, top: !0, bottom: !1 }, keyCodes: { enter: 13 }, dates: {}, instanceMethods: {}, setup: function (t, r) { if (t && t.tHead && 0 !== t.tBodies.length && !0 !== t.hasInitialized) { var e, o = "", s = A(t), a = A.metadata; t.hasInitialized = !1, t.isProcessing = !0, t.config = r, A.data(t, "tablesorter", r), L.debug(r, "core") && (console[console.group ? "group" : "log"]("Initializing tablesorter v" + L.version), A.data(t, "startoveralltimer", new Date)), r.supportsDataObject = ((e = A.fn.jquery.split("."))[0] = parseInt(e[0], 10), 1 < e[0] || 1 === e[0] && 4 <= parseInt(e[1], 10)), r.emptyTo = r.emptyTo.toLowerCase(), r.stringTo = r.stringTo.toLowerCase(), r.last = { sortList: [], clickedIndex: -1 }, /tablesorter\-/.test(s.attr("class")) || (o = "" !== r.theme ? " tablesorter-" + r.theme : ""), r.namespace ? r.namespace = "." + r.namespace.replace(L.regex.nonWord, "") : r.namespace = ".tablesorter" + Math.random().toString(16).slice(2), r.table = t, r.$table = s.addClass(L.css.table + " " + r.tableClass + o + " " + r.namespace.slice(1)).attr("role", "grid"), r.$headers = s.find(r.selectorHeaders), r.$table.children().children("tr").attr("role", "row"), r.$tbodies = s.children("tbody:not(." + r.cssInfoBlock + ")").attr({ "aria-live": "polite", "aria-relevant": "all" }), r.$table.children("caption").length && ((o = r.$table.children("caption")[0]).id || (o.id = r.namespace.slice(1) + "caption"), r.$table.attr("aria-labelledby", o.id)), r.widgetInit = {}, r.textExtraction = r.$table.attr("data-text-extraction") || r.textExtraction || "basic", L.buildHeaders(r), L.fixColumnWidth(t), L.addWidgetFromClass(t), L.applyWidgetOptions(t), L.setupParsers(r), r.totalRows = 0, r.debug && L.validateOptions(r), r.delayInit || L.buildCache(r), L.bindEvents(t, r.$headers, !0), L.bindMethods(r), r.supportsDataObject && void 0 !== s.data().sortlist ? r.sortList = s.data().sortlist : a && s.metadata() && s.metadata().sortlist && (r.sortList = s.metadata().sortlist), L.applyWidget(t, !0), 0 < r.sortList.length ? (r.last.sortList = r.sortList, L.sortOn(r, r.sortList, {}, !r.initWidgets)) : (L.setHeadersCss(r), r.initWidgets && L.applyWidget(t, !1)), r.showProcessing && s.unbind("sortBegin" + r.namespace + " sortEnd" + r.namespace).bind("sortBegin" + r.namespace + " sortEnd" + r.namespace, function (e) { clearTimeout(r.timerProcessing), L.isProcessing(t), "sortBegin" === e.type && (r.timerProcessing = setTimeout(function () { L.isProcessing(t, !0) }, 500)) }), t.hasInitialized = !0, t.isProcessing = !1, L.debug(r, "core") && (console.log("Overall initialization time:" + L.benchmark(A.data(t, "startoveralltimer"))), L.debug(r, "core") && console.groupEnd && console.groupEnd()), s.triggerHandler("tablesorter-initialized", t), "function" == typeof r.initialized && r.initialized(t) } else L.debug(r, "core") && (t.hasInitialized ? console.warn("Stopping initialization. Tablesorter has already been initialized") : console.error("Stopping initialization! No table, thead or tbody", t)) }, bindMethods: function (r) { var e = r.$table, t = r.namespace, o = "sortReset update updateRows updateAll updateHeaders addRows updateCell updateComplete sorton appendCache updateCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave ".split(" ").join(t + " "); e.unbind(o.replace(L.regex.spaces, " ")).bind("sortReset" + t, function (e, t) { e.stopPropagation(), L.sortReset(this.config, function (e) { e.isApplyingWidgets ? setTimeout(function () { L.applyWidget(e, "", t) }, 100) : L.applyWidget(e, "", t) }) }).bind("updateAll" + t, function (e, t, r) { e.stopPropagation(), L.updateAll(this.config, t, r) }).bind("update" + t + " updateRows" + t, function (e, t, r) { e.stopPropagation(), L.update(this.config, t, r) }).bind("updateHeaders" + t, function (e, t) { e.stopPropagation(), L.updateHeaders(this.config, t) }).bind("updateCell" + t, function (e, t, r, o) { e.stopPropagation(), L.updateCell(this.config, t, r, o) }).bind("addRows" + t, function (e, t, r, o) { e.stopPropagation(), L.addRows(this.config, t, r, o) }).bind("updateComplete" + t, function () { this.isUpdating = !1 }).bind("sorton" + t, function (e, t, r, o) { e.stopPropagation(), L.sortOn(this.config, t, r, o) }).bind("appendCache" + t, function (e, t, r) { e.stopPropagation(), L.appendCache(this.config, r), A.isFunction(t) && t(this) }).bind("updateCache" + t, function (e, t, r) { e.stopPropagation(), L.updateCache(this.config, t, r) }).bind("applyWidgetId" + t, function (e, t) { e.stopPropagation(), L.applyWidgetId(this, t) }).bind("applyWidgets" + t, function (e, t) { e.stopPropagation(), L.applyWidget(this, !1, t) }).bind("refreshWidgets" + t, function (e, t, r) { e.stopPropagation(), L.refreshWidgets(this, t, r) }).bind("removeWidget" + t, function (e, t, r) { e.stopPropagation(), L.removeWidget(this, t, r) }).bind("destroy" + t, function (e, t, r) { e.stopPropagation(), L.destroy(this, t, r) }).bind("resetToLoadState" + t, function (e) { e.stopPropagation(), L.removeWidget(this, !0, !1); var t = A.extend(!0, {}, r.originalSettings); (r = A.extend(!0, {}, L.defaults, t)).originalSettings = t, this.hasInitialized = !1, L.setup(this, r) }) }, bindEvents: function (e, t, r) { var o, i = (e = A(e)[0]).config, s = i.namespace, d = null; !0 !== r && (t.addClass(s.slice(1) + "_extra_headers"), (o = L.getClosest(t, "table")).length && "TABLE" === o[0].nodeName && o[0] !== e && A(o[0]).addClass(s.slice(1) + "_extra_table")), o = (i.pointerDown + " " + i.pointerUp + " " + i.pointerClick + " sort keyup ").replace(L.regex.spaces, " ").split(" ").join(s + " "), t.find(i.selectorSort).add(t.filter(i.selectorSort)).unbind(o).bind(o, function (e, t) { var r, o, s, a = A(e.target), n = " " + e.type + " "; if (!(1 !== (e.which || e.button) && !n.match(" " + i.pointerClick + " | sort | keyup ") || " keyup " === n && e.which !== L.keyCodes.enter || n.match(" " + i.pointerClick + " ") && void 0 !== e.which || n.match(" " + i.pointerUp + " ") && d !== e.target && !0 !== t)) { if (n.match(" " + i.pointerDown + " ")) return d = e.target, void ("1" === (s = a.jquery.split("."))[0] && s[1] < 4 && e.preventDefault()); if (d = null, r = L.getClosest(A(this), "." + L.css.header), L.regex.formElements.test(e.target.nodeName) || a.hasClass(i.cssNoSort) || 0 < a.parents("." + i.cssNoSort).length || r.hasClass("sorter-false") || 0 < a.parents("button").length) return !i.cancelSelection; i.delayInit && L.isEmptyObject(i.cache) && L.buildCache(i), i.last.clickedIndex = r.attr("data-column") || r.index(), (o = i.$headerIndexed[i.last.clickedIndex][0]) && !o.sortDisabled && L.initSort(i, o, e) } }), i.cancelSelection && t.attr("unselectable", "on").bind("selectstart", !1).css({ "user-select": "none", MozUserSelect: "none" }) }, buildHeaders: function (d) { var e, l, t, r; for (d.headerList = [], d.headerContent = [], d.sortVars = [], L.debug(d, "core") && (t = new Date), d.columns = L.computeColumnIndex(d.$table.children("thead, tfoot").children("tr")), l = d.cssIcon ? '<i class="' + (d.cssIcon === L.css.icon ? L.css.icon : d.cssIcon + " " + L.css.icon) + '"></i>' : "", d.$headers = A(A.map(d.$table.find(d.selectorHeaders), function (e, t) { var r, o, s, a, n, i = A(e); if (!L.getClosest(i, "tr").hasClass(d.cssIgnoreRow)) return /(th|td)/i.test(e.nodeName) || (n = L.getClosest(i, "th, td"), i.attr("data-column", n.attr("data-column"))), r = L.getColumnData(d.table, d.headers, t, !0), d.headerContent[t] = i.html(), "" === d.headerTemplate || i.find("." + L.css.headerIn).length || (a = d.headerTemplate.replace(L.regex.templateContent, i.html()).replace(L.regex.templateIcon, i.find("." + L.css.icon).length ? "" : l), d.onRenderTemplate && (o = d.onRenderTemplate.apply(i, [t, a])) && "string" == typeof o && (a = o), i.html('<div class="' + L.css.headerIn + '">' + a + "</div>")), d.onRenderHeader && d.onRenderHeader.apply(i, [t, d, d.$table]), s = parseInt(i.attr("data-column"), 10), e.column = s, n = L.getOrder(L.getData(i, r, "sortInitialOrder") || d.sortInitialOrder), d.sortVars[s] = { count: -1, order: n ? d.sortReset ? [1, 0, 2] : [1, 0] : d.sortReset ? [0, 1, 2] : [0, 1], lockedOrder: !1, sortedBy: "" }, void 0 !== (n = L.getData(i, r, "lockedOrder") || !1) && !1 !== n && (d.sortVars[s].lockedOrder = !0, d.sortVars[s].order = L.getOrder(n) ? [1, 1] : [0, 0]), d.headerList[t] = e, i.addClass(L.css.header + " " + d.cssHeader), L.getClosest(i, "tr").addClass(L.css.headerRow + " " + d.cssHeaderRow).attr("role", "row"), d.tabIndex && i.attr("tabindex", 0), e })), d.$headerIndexed = [], r = 0; r < d.columns; r++)L.isEmptyObject(d.sortVars[r]) && (d.sortVars[r] = {}), e = d.$headers.filter('[data-column="' + r + '"]'), d.$headerIndexed[r] = e.length ? e.not(".sorter-false").length ? e.not(".sorter-false").filter(":last") : e.filter(":last") : A(); d.$table.find(d.selectorHeaders).attr({ scope: "col", role: "columnheader" }), L.updateHeader(d), L.debug(d, "core") && (console.log("Built headers:" + L.benchmark(t)), console.log(d.$headers)) }, addInstanceMethods: function (e) { A.extend(L.instanceMethods, e) }, setupParsers: function (e, t) { var r, o, s, a, n, i, d, l, c, g, p, u, f, h, m = e.table, b = 0, y = L.debug(e, "core"), w = {}; if (e.$tbodies = e.$table.children("tbody:not(." + e.cssInfoBlock + ")"), 0 === (h = (f = void 0 === t ? e.$tbodies : t).length)) return y ? console.warn("Warning: *Empty table!* Not building a parser cache") : ""; for (y && (u = new Date, console[console.group ? "group" : "log"]("Detecting parsers for each column")), o = { extractors: [], parsers: [] }; b < h;) { if ((r = f[b].rows).length) for (n = 0, a = e.columns, i = 0; i < a; i++) { if ((d = e.$headerIndexed[n]) && d.length && (l = L.getColumnData(m, e.headers, n), p = L.getParserById(L.getData(d, l, "extractor")), g = L.getParserById(L.getData(d, l, "sorter")), c = "false" === L.getData(d, l, "parser"), e.empties[n] = (L.getData(d, l, "empty") || e.emptyTo || (e.emptyToBottom ? "bottom" : "top")).toLowerCase(), e.strings[n] = (L.getData(d, l, "string") || e.stringTo || "max").toLowerCase(), c && (g = L.getParserById("no-parser")), p = p || !1, g = g || L.detectParserForColumn(e, r, -1, n), y && (w["(" + n + ") " + d.text()] = { parser: g.id, extractor: p ? p.id : "none", string: e.strings[n], empty: e.empties[n] }), o.parsers[n] = g, o.extractors[n] = p, 0 < (s = d[0].colSpan - 1))) for (n += s, a += s; 0 < s + 1;)o.parsers[n - s] = g, o.extractors[n - s] = p, s--; n++ } b += o.parsers.length ? h : 1 } y && (L.isEmptyObject(w) ? console.warn("  No parsers detected!") : console[console.table ? "table" : "log"](w), console.log("Completed detecting parsers" + L.benchmark(u)), console.groupEnd && console.groupEnd()), e.parsers = o.parsers, e.extractors = o.extractors }, addParser: function (e) { var t, r = L.parsers.length, o = !0; for (t = 0; t < r; t++)L.parsers[t].id.toLowerCase() === e.id.toLowerCase() && (o = !1); o && (L.parsers[L.parsers.length] = e) }, getParserById: function (e) { if ("false" == e) return !1; var t, r = L.parsers.length; for (t = 0; t < r; t++)if (L.parsers[t].id.toLowerCase() === e.toString().toLowerCase()) return L.parsers[t]; return !1 }, detectParserForColumn: function (e, t, r, o) { for (var s, a, n, i = L.parsers.length, d = !1, l = "", c = L.debug(e, "core"), g = !0; "" === l && g;)(n = t[++r]) && r < 50 ? n.className.indexOf(L.cssIgnoreRow) < 0 && (d = t[r].cells[o], l = L.getElementText(e, d, o), a = A(d), c && console.log("Checking if value was empty on row " + r + ", column: " + o + ': "' + l + '"')) : g = !1; for (; 0 <= --i;)if ((s = L.parsers[i]) && "text" !== s.id && s.is && s.is(l, e.table, d, a)) return s; return L.getParserById("text") }, getElementText: function (e, t, r) { if (!t) return ""; var o, s = e.textExtraction || "", a = t.jquery ? t : A(t); return "string" == typeof s ? "basic" === s && void 0 !== (o = a.attr(e.textAttribute)) ? A.trim(o) : A.trim(t.textContent || a.text()) : "function" == typeof s ? A.trim(s(a[0], e.table, r)) : "function" == typeof (o = L.getColumnData(e.table, s, r)) ? A.trim(o(a[0], e.table, r)) : A.trim(a[0].textContent || a.text()) }, getParsedText: function (e, t, r, o) { void 0 === o && (o = L.getElementText(e, t, r)); var s = "" + o, a = e.parsers[r], n = e.extractors[r]; return a && (n && "function" == typeof n.format && (o = n.format(o, e.table, t, r)), s = "no-parser" === a.id ? "" : a.format("" + o, e.table, t, r), e.ignoreCase && "string" == typeof s && (s = s.toLowerCase())), s }, buildCache: function (e, t, r) { var o, s, a, n, i, d, l, c, g, p, u, f, h, m, b, y, w, x, v, C, $, I, D = e.table, R = e.parsers, T = L.debug(e, "core"); if (e.$tbodies = e.$table.children("tbody:not(." + e.cssInfoBlock + ")"), l = void 0 === r ? e.$tbodies : r, e.cache = {}, e.totalRows = 0, !R) return T ? console.warn("Warning: *Empty table!* Not building a cache") : ""; for (T && (f = new Date), e.showProcessing && L.isProcessing(D, !0), d = 0; d < l.length; d++) { for (y = [], o = e.cache[d] = { normalized: [] }, h = l[d] && l[d].rows.length || 0, n = 0; n < h; ++n)if (m = { child: [], raw: [] }, g = [], !(c = A(l[d].rows[n])).hasClass(e.selectorRemove.slice(1))) if (c.hasClass(e.cssChildRow) && 0 !== n) for ($ = o.normalized.length - 1, (b = o.normalized[$][e.columns]).$row = b.$row.add(c), c.prev().hasClass(e.cssChildRow) || c.prev().addClass(L.css.cssHasChild), p = c.children("th, td"), $ = b.child.length, b.child[$] = [], x = 0, C = e.columns, i = 0; i < C; i++)(u = p[i]) && (b.child[$][i] = L.getParsedText(e, u, i), 0 < (w = p[i].colSpan - 1) && (x += w, C += w)), x++; else { for (m.$row = c, m.order = n, x = 0, C = e.columns, i = 0; i < C; ++i) { if ((u = c[0].cells[i]) && x < e.columns && (!(v = void 0 !== R[x]) && T && console.warn("No parser found for row: " + n + ", column: " + i + '; cell containing: "' + A(u).text() + '"; does it have a header?'), s = L.getElementText(e, u, x), m.raw[x] = s, a = L.getParsedText(e, u, x, s), g[x] = a, v && "numeric" === (R[x].type || "").toLowerCase() && (y[x] = Math.max(Math.abs(a) || 0, y[x] || 0)), 0 < (w = u.colSpan - 1))) { for (I = 0; I <= w;)a = e.duplicateSpan || 0 === I ? a : "string" != typeof e.textExtraction && L.getElementText(e, u, x + I) || "", m.raw[x + I] = a, g[x + I] = a, I++; x += w, C += w } x++ } g[e.columns] = m, o.normalized[o.normalized.length] = g } o.colMax = y, e.totalRows += o.normalized.length } if (e.showProcessing && L.isProcessing(D), T) { for ($ = Math.min(5, e.cache[0].normalized.length), console[console.group ? "group" : "log"]("Building cache for " + e.totalRows + " rows (showing " + $ + " rows in log) and " + e.columns + " columns" + L.benchmark(f)), s = {}, i = 0; i < e.columns; i++)for (x = 0; x < $; x++)s["row: " + x] || (s["row: " + x] = {}), s["row: " + x][e.$headerIndexed[i].text()] = e.cache[0].normalized[x][i]; console[console.table ? "table" : "log"](s), console.groupEnd && console.groupEnd() } A.isFunction(t) && t(D) }, getColumnText: function (e, t, r, o) { var s, a, n, i, d, l, c, g, p, u, f = "function" == typeof r, h = "all" === t, m = { raw: [], parsed: [], $cell: [] }, b = (e = A(e)[0]).config; if (!L.isEmptyObject(b)) { for (d = b.$tbodies.length, s = 0; s < d; s++)for (l = (n = b.cache[s].normalized).length, a = 0; a < l; a++)i = n[a], o && !i[b.columns].$row.is(o) || (u = !0, g = h ? i.slice(0, b.columns) : i[t], i = i[b.columns], c = h ? i.raw : i.raw[t], p = h ? i.$row.children() : i.$row.children().eq(t), f && (u = r({ tbodyIndex: s, rowIndex: a, parsed: g, raw: c, $row: i.$row, $cell: p })), !1 !== u && (m.parsed[m.parsed.length] = g, m.raw[m.raw.length] = c, m.$cell[m.$cell.length] = p)); return m } L.debug(b, "core") && console.warn("No cache found - aborting getColumnText function!") }, setHeadersCss: function (a) { function e(e, t) { e.removeClass(n).addClass(i[t]).attr("aria-sort", l[t]).find("." + L.css.icon).removeClass(d[2]).addClass(d[t]) } var t, r, o = a.sortList, s = o.length, n = L.css.sortNone + " " + a.cssNone, i = [L.css.sortAsc + " " + a.cssAsc, L.css.sortDesc + " " + a.cssDesc], d = [a.cssIconAsc, a.cssIconDesc, a.cssIconNone], l = ["ascending", "descending"], c = a.$table.find("tfoot tr").children("td, th").add(A(a.namespace + "_extra_headers")).removeClass(i.join(" ")), g = a.$headers.add(A("thead " + a.namespace + "_extra_headers")).removeClass(i.join(" ")).addClass(n).attr("aria-sort", "none").find("." + L.css.icon).removeClass(d.join(" ")).end(); for (g.not(".sorter-false").find("." + L.css.icon).addClass(d[2]), a.cssIconDisabled && g.filter(".sorter-false").find("." + L.css.icon).addClass(a.cssIconDisabled), t = 0; t < s; t++)if (2 !== o[t][1]) { if ((g = (g = a.$headers.filter(function (e) { for (var t = !0, r = a.$headers.eq(e), o = parseInt(r.attr("data-column"), 10), s = o + L.getClosest(r, "th, td")[0].colSpan; o < s; o++)t = !!t && (t || -1 < L.isValueInArray(o, a.sortList)); return t })).not(".sorter-false").filter('[data-column="' + o[t][0] + '"]' + (1 === s ? ":last" : ""))).length) for (r = 0; r < g.length; r++)g[r].sortDisabled || e(g.eq(r), o[t][1]); c.length && e(c.filter('[data-column="' + o[t][0] + '"]'), o[t][1]) } for (s = a.$headers.length, t = 0; t < s; t++)L.setColumnAriaLabel(a, a.$headers.eq(t)) }, getClosest: function (e, t) { return A.fn.closest ? e.closest(t) : e.is(t) ? e : e.parents(t).filter(":first") }, setColumnAriaLabel: function (e, t, r) { if (t.length) { var o = parseInt(t.attr("data-column"), 10), s = e.sortVars[o], a = t.hasClass(L.css.sortAsc) ? "sortAsc" : t.hasClass(L.css.sortDesc) ? "sortDesc" : "sortNone", n = A.trim(t.text()) + ": " + L.language[a]; t.hasClass("sorter-false") || !1 === r ? n += L.language.sortDisabled : (a = (s.count + 1) % s.order.length, r = s.order[a], n += L.language[0 === r ? "nextAsc" : 1 === r ? "nextDesc" : "nextNone"]), t.attr("aria-label", n), s.sortedBy ? t.attr("data-sortedBy", s.sortedBy) : t.removeAttr("data-sortedBy") } }, updateHeader: function (e) { var t, r, o, s, a = e.table, n = e.$headers.length; for (t = 0; t < n; t++)o = e.$headers.eq(t), s = L.getColumnData(a, e.headers, t, !0), r = "false" === L.getData(o, s, "sorter") || "false" === L.getData(o, s, "parser"), L.setColumnSort(e, o, r) }, setColumnSort: function (e, t, r) { var o = e.table.id; t[0].sortDisabled = r, t[r ? "addClass" : "removeClass"]("sorter-false").attr("aria-disabled", "" + r), e.tabIndex && (r ? t.removeAttr("tabindex") : t.attr("tabindex", "0")), o && (r ? t.removeAttr("aria-controls") : t.attr("aria-controls", o)) }, updateHeaderSortCount: function (e, t) { var r, o, s, a, n, i, d, l, c = t || e.sortList, g = c.length; for (e.sortList = [], a = 0; a < g; a++)if (d = c[a], (r = parseInt(d[0], 10)) < e.columns) { switch (e.sortVars[r].order || (l = L.getOrder(e.sortInitialOrder) ? e.sortReset ? [1, 0, 2] : [1, 0] : e.sortReset ? [0, 1, 2] : [0, 1], e.sortVars[r].order = l, e.sortVars[r].count = 0), l = e.sortVars[r].order, o = (o = ("" + d[1]).match(/^(1|d|s|o|n)/)) ? o[0] : "") { case "1": case "d": o = 1; break; case "s": o = n || 0; break; case "o": o = 0 === (i = l[(n || 0) % l.length]) ? 1 : 1 === i ? 0 : 2; break; case "n": o = l[++e.sortVars[r].count % l.length]; break; default: o = 0 }n = 0 === a ? o : n, s = [r, parseInt(o, 10) || 0], e.sortList[e.sortList.length] = s, o = A.inArray(s[1], l), e.sortVars[r].count = 0 <= o ? o : s[1] % l.length } }, updateAll: function (e, t, r) { var o = e.table; o.isUpdating = !0, L.refreshWidgets(o, !0, !0), L.buildHeaders(e), L.bindEvents(o, e.$headers, !0), L.bindMethods(e), L.commonUpdate(e, t, r) }, update: function (e, t, r) { e.table.isUpdating = !0, L.updateHeader(e), L.commonUpdate(e, t, r) }, updateHeaders: function (e, t) { e.table.isUpdating = !0, L.buildHeaders(e), L.bindEvents(e.table, e.$headers, !0), L.resortComplete(e, t) }, updateCell: function (e, t, r, o) { if (A(t).closest("tr").hasClass(e.cssChildRow)) console.warn('Tablesorter Warning! "updateCell" for child row content has been disabled, use "update" instead'); else { if (L.isEmptyObject(e.cache)) return L.updateHeader(e), void L.commonUpdate(e, r, o); e.table.isUpdating = !0, e.$table.find(e.selectorRemove).remove(); var s, a, n, i, d, l, c = e.$tbodies, g = A(t), p = c.index(L.getClosest(g, "tbody")), u = e.cache[p], f = L.getClosest(g, "tr"); if (t = g[0], c.length && 0 <= p) { if (n = c.eq(p).find("tr").not("." + e.cssChildRow).index(f), d = u.normalized[n], (l = f[0].cells.length) !== e.columns) for (s = !1, a = i = 0; a < l; a++)s || f[0].cells[a] === t ? s = !0 : i += f[0].cells[a].colSpan; else i = g.index(); s = L.getElementText(e, t, i), d[e.columns].raw[i] = s, s = L.getParsedText(e, t, i, s), d[i] = s, "numeric" === (e.parsers[i].type || "").toLowerCase() && (u.colMax[i] = Math.max(Math.abs(s) || 0, u.colMax[i] || 0)), !1 !== (s = "undefined" !== r ? r : e.resort) ? L.checkResort(e, s, o) : L.resortComplete(e, o) } else L.debug(e, "core") && console.error("updateCell aborted, tbody missing or not within the indicated table"), e.table.isUpdating = !1 } }, addRows: function (e, t, r, o) { var s, a, n, i, d, l, c, g, p, u, f, h, m, b = "string" == typeof t && 1 === e.$tbodies.length && /<tr/.test(t || ""), y = e.table; if (b) t = A(t), e.$tbodies.append(t); else if (!(t && t instanceof A && L.getClosest(t, "table")[0] === e.table)) return L.debug(e, "core") && console.error("addRows method requires (1) a jQuery selector reference to rows that have already been added to the table, or (2) row HTML string to be added to a table with only one tbody"), !1; if (y.isUpdating = !0, L.isEmptyObject(e.cache)) L.updateHeader(e), L.commonUpdate(e, r, o); else { for (d = t.filter("tr").attr("role", "row").length, n = e.$tbodies.index(t.parents("tbody").filter(":first")), e.parsers && e.parsers.length || L.setupParsers(e), i = 0; i < d; i++) { for (p = 0, c = t[i].cells.length, g = e.cache[n].normalized.length, f = [], u = { child: [], raw: [], $row: t.eq(i), order: g }, l = 0; l < c; l++)h = t[i].cells[l], s = L.getElementText(e, h, p), u.raw[p] = s, a = L.getParsedText(e, h, p, s), f[p] = a, "numeric" === (e.parsers[p].type || "").toLowerCase() && (e.cache[n].colMax[p] = Math.max(Math.abs(a) || 0, e.cache[n].colMax[p] || 0)), 0 < (m = h.colSpan - 1) && (p += m), p++; f[e.columns] = u, e.cache[n].normalized[g] = f } L.checkResort(e, r, o) } }, updateCache: function (e, t, r) { e.parsers && e.parsers.length || L.setupParsers(e, r), L.buildCache(e, t, r) }, appendCache: function (e, t) { var r, o, s, a, n, i, d, l = e.table, c = e.$tbodies, g = [], p = e.cache; if (L.isEmptyObject(p)) return e.appender ? e.appender(l, g) : l.isUpdating ? e.$table.triggerHandler("updateComplete", l) : ""; for (L.debug(e, "core") && (d = new Date), i = 0; i < c.length; i++)if ((s = c.eq(i)).length) { for (a = L.processTbody(l, s, !0), o = (r = p[i].normalized).length, n = 0; n < o; n++)g[g.length] = r[n][e.columns].$row, e.appender && (!e.pager || e.pager.removeRows || e.pager.ajax) || a.append(r[n][e.columns].$row); L.processTbody(l, a, !1) } e.appender && e.appender(l, g), L.debug(e, "core") && console.log("Rebuilt table" + L.benchmark(d)), t || e.appender || L.applyWidget(l), l.isUpdating && e.$table.triggerHandler("updateComplete", l) }, commonUpdate: function (e, t, r) { e.$table.find(e.selectorRemove).remove(), L.setupParsers(e), L.buildCache(e), L.checkResort(e, t, r) }, initSort: function (t, e, r) { if (t.table.isUpdating) return setTimeout(function () { L.initSort(t, e, r) }, 50); var o, s, a, n, i, d, l, c = !r[t.sortMultiSortKey], g = t.table, p = t.$headers.length, u = L.getClosest(A(e), "th, td"), f = parseInt(u.attr("data-column"), 10), h = "mouseup" === r.type ? "user" : r.type, m = t.sortVars[f].order; if (u = u[0], t.$table.triggerHandler("sortStart", g), d = (t.sortVars[f].count + 1) % m.length, t.sortVars[f].count = r[t.sortResetKey] ? 2 : d, t.sortRestart) for (a = 0; a < p; a++)l = t.$headers.eq(a), f !== (d = parseInt(l.attr("data-column"), 10)) && (c || l.hasClass(L.css.sortNone)) && (t.sortVars[d].count = -1); if (c) { if (A.each(t.sortVars, function (e) { t.sortVars[e].sortedBy = "" }), t.sortList = [], t.last.sortList = [], null !== t.sortForce) for (o = t.sortForce, s = 0; s < o.length; s++)o[s][0] !== f && (t.sortList[t.sortList.length] = o[s], t.sortVars[o[s][0]].sortedBy = "sortForce"); if ((n = m[t.sortVars[f].count]) < 2 && (t.sortList[t.sortList.length] = [f, n], t.sortVars[f].sortedBy = h, 1 < u.colSpan)) for (s = 1; s < u.colSpan; s++)t.sortList[t.sortList.length] = [f + s, n], t.sortVars[f + s].count = A.inArray(n, m), t.sortVars[f + s].sortedBy = h } else if (t.sortList = A.extend([], t.last.sortList), 0 <= L.isValueInArray(f, t.sortList)) for (t.sortVars[f].sortedBy = h, s = 0; s < t.sortList.length; s++)(d = t.sortList[s])[0] === f && (d[1] = m[t.sortVars[f].count], 2 === d[1] && (t.sortList.splice(s, 1), t.sortVars[f].count = -1)); else if (n = m[t.sortVars[f].count], t.sortVars[f].sortedBy = h, n < 2 && (t.sortList[t.sortList.length] = [f, n], 1 < u.colSpan)) for (s = 1; s < u.colSpan; s++)t.sortList[t.sortList.length] = [f + s, n], t.sortVars[f + s].count = A.inArray(n, m), t.sortVars[f + s].sortedBy = h; if (t.last.sortList = A.extend([], t.sortList), t.sortList.length && t.sortAppend && (o = A.isArray(t.sortAppend) ? t.sortAppend : t.sortAppend[t.sortList[0][0]], !L.isEmptyObject(o))) for (s = 0; s < o.length; s++)if (o[s][0] !== f && L.isValueInArray(o[s][0], t.sortList) < 0) { if (i = ("" + (n = o[s][1])).match(/^(a|d|s|o|n)/)) switch (d = t.sortList[0][1], i[0]) { case "d": n = 1; break; case "s": n = d; break; case "o": n = 0 === d ? 1 : 0; break; case "n": n = (d + 1) % m.length; break; default: n = 0 }t.sortList[t.sortList.length] = [o[s][0], n], t.sortVars[o[s][0]].sortedBy = "sortAppend" } t.$table.triggerHandler("sortBegin", g), setTimeout(function () { L.setHeadersCss(t), L.multisort(t), L.appendCache(t), t.$table.triggerHandler("sortBeforeEnd", g), t.$table.triggerHandler("sortEnd", g) }, 1) }, multisort: function (l) { var e, t, c, r, g = l.table, p = [], u = 0, f = l.textSorter || "", h = l.sortList, m = h.length, o = l.$tbodies.length; if (!l.serverSideSorting && !L.isEmptyObject(l.cache)) { if (L.debug(l, "core") && (t = new Date), "object" == typeof f) for (c = l.columns; c--;)"function" == typeof (r = L.getColumnData(g, f, c)) && (p[c] = r); for (e = 0; e < o; e++)c = l.cache[e].colMax, l.cache[e].normalized.sort(function (e, t) { var r, o, s, a, n, i, d; for (r = 0; r < m; r++) { if (s = h[r][0], a = h[r][1], u = 0 === a, l.sortStable && e[s] === t[s] && 1 === m) return e[l.columns].order - t[l.columns].order; if (n = (o = /n/i.test(L.getSortType(l.parsers, s))) && l.strings[s] ? (o = "boolean" == typeof L.string[l.strings[s]] ? (u ? 1 : -1) * (L.string[l.strings[s]] ? -1 : 1) : l.strings[s] && L.string[l.strings[s]] || 0, l.numberSorter ? l.numberSorter(e[s], t[s], u, c[s], g) : L["sortNumeric" + (u ? "Asc" : "Desc")](e[s], t[s], o, c[s], s, l)) : (i = u ? e : t, d = u ? t : e, "function" == typeof f ? f(i[s], d[s], u, s, g) : "function" == typeof p[s] ? p[s](i[s], d[s], u, s, g) : L["sortNatural" + (u ? "Asc" : "Desc")](e[s] || "", t[s] || "", s, l))) return n } return e[l.columns].order - t[l.columns].order }); L.debug(l, "core") && console.log("Applying sort " + h.toString() + L.benchmark(t)) } }, resortComplete: function (e, t) { e.table.isUpdating && e.$table.triggerHandler("updateComplete", e.table), A.isFunction(t) && t(e.table) }, checkResort: function (e, t, r) { var o = A.isArray(t) ? t : e.sortList; !1 === (void 0 === t ? e.resort : t) || e.serverSideSorting || e.table.isProcessing ? (L.resortComplete(e, r), L.applyWidget(e.table, !1)) : o.length ? L.sortOn(e, o, function () { L.resortComplete(e, r) }, !0) : L.sortReset(e, function () { L.resortComplete(e, r), L.applyWidget(e.table, !1) }) }, sortOn: function (e, t, r, o) { var s, a = e.table; for (e.$table.triggerHandler("sortStart", a), s = 0; s < e.columns; s++)e.sortVars[s].sortedBy = -1 < L.isValueInArray(s, t) ? "sorton" : ""; L.updateHeaderSortCount(e, t), L.setHeadersCss(e), e.delayInit && L.isEmptyObject(e.cache) && L.buildCache(e), e.$table.triggerHandler("sortBegin", a), L.multisort(e), L.appendCache(e, o), e.$table.triggerHandler("sortBeforeEnd", a), e.$table.triggerHandler("sortEnd", a), L.applyWidget(a), A.isFunction(r) && r(a) }, sortReset: function (e, t) { var r; for (e.sortList = [], r = 0; r < e.columns; r++)e.sortVars[r].count = -1, e.sortVars[r].sortedBy = ""; L.setHeadersCss(e), L.multisort(e), L.appendCache(e), A.isFunction(t) && t(e.table) }, getSortType: function (e, t) { return e && e[t] && e[t].type || "" }, getOrder: function (e) { return /^d/i.test(e) || 1 === e }, sortNatural: function (e, t) { if (e === t) return 0; e = (e || "").toString(), t = (t || "").toString(); var r, o, s, a, n, i, d = L.regex; if (d.hex.test(t)) { if ((r = parseInt(e.match(d.hex), 16)) < (o = parseInt(t.match(d.hex), 16))) return -1; if (o < r) return 1 } for (r = e.replace(d.chunk, "\\0$1\\0").replace(d.chunks, "").split("\\0"), o = t.replace(d.chunk, "\\0$1\\0").replace(d.chunks, "").split("\\0"), i = Math.max(r.length, o.length), n = 0; n < i; n++) { if (s = isNaN(r[n]) ? r[n] || 0 : parseFloat(r[n]) || 0, a = isNaN(o[n]) ? o[n] || 0 : parseFloat(o[n]) || 0, isNaN(s) !== isNaN(a)) return isNaN(s) ? 1 : -1; if (typeof s != typeof a && (s += "", a += ""), s < a) return -1; if (a < s) return 1 } return 0 }, sortNaturalAsc: function (e, t, r, o) { if (e === t) return 0; var s = L.string[o.empties[r] || o.emptyTo]; return "" === e && 0 !== s ? "boolean" == typeof s ? s ? -1 : 1 : -s || -1 : "" === t && 0 !== s ? "boolean" == typeof s ? s ? 1 : -1 : s || 1 : L.sortNatural(e, t) }, sortNaturalDesc: function (e, t, r, o) { if (e === t) return 0; var s = L.string[o.empties[r] || o.emptyTo]; return "" === e && 0 !== s ? "boolean" == typeof s ? s ? -1 : 1 : s || 1 : "" === t && 0 !== s ? "boolean" == typeof s ? s ? 1 : -1 : -s || -1 : L.sortNatural(t, e) }, sortText: function (e, t) { return t < e ? 1 : e < t ? -1 : 0 }, getTextValue: function (e, t, r) { if (r) { var o, s = e ? e.length : 0, a = r + t; for (o = 0; o < s; o++)a += e.charCodeAt(o); return t * a } return 0 }, sortNumericAsc: function (e, t, r, o, s, a) { if (e === t) return 0; var n = L.string[a.empties[s] || a.emptyTo]; return "" === e && 0 !== n ? "boolean" == typeof n ? n ? -1 : 1 : -n || -1 : "" === t && 0 !== n ? "boolean" == typeof n ? n ? 1 : -1 : n || 1 : (isNaN(e) && (e = L.getTextValue(e, r, o)), isNaN(t) && (t = L.getTextValue(t, r, o)), e - t) }, sortNumericDesc: function (e, t, r, o, s, a) { if (e === t) return 0; var n = L.string[a.empties[s] || a.emptyTo]; return "" === e && 0 !== n ? "boolean" == typeof n ? n ? -1 : 1 : n || 1 : "" === t && 0 !== n ? "boolean" == typeof n ? n ? 1 : -1 : -n || -1 : (isNaN(e) && (e = L.getTextValue(e, r, o)), isNaN(t) && (t = L.getTextValue(t, r, o)), t - e) }, sortNumeric: function (e, t) { return e - t }, addWidget: function (e) { e.id && !L.isEmptyObject(L.getWidgetById(e.id)) && console.warn('"' + e.id + '" widget was loaded more than once!'), L.widgets[L.widgets.length] = e }, hasWidget: function (e, t) { return (e = A(e)).length && e[0].config && e[0].config.widgetInit[t] || !1 }, getWidgetById: function (e) { var t, r, o = L.widgets.length; for (t = 0; t < o; t++)if ((r = L.widgets[t]) && r.id && r.id.toLowerCase() === e.toLowerCase()) return r }, applyWidgetOptions: function (e) { var t, r, o, s = e.config, a = s.widgets.length; if (a) for (t = 0; t < a; t++)(r = L.getWidgetById(s.widgets[t])) && r.options && (o = A.extend(!0, {}, r.options), s.widgetOptions = A.extend(!0, o, s.widgetOptions), A.extend(!0, L.defaults.widgetOptions, r.options)) }, addWidgetFromClass: function (e) { var t, r, o = e.config, s = "^" + o.widgetClass.replace(L.regex.templateName, "(\\S+)+") + "$", a = new RegExp(s, "g"), n = (e.className || "").split(L.regex.spaces); if (n.length) for (t = n.length, r = 0; r < t; r++)n[r].match(a) && (o.widgets[o.widgets.length] = n[r].replace(a, "$1")) }, applyWidgetId: function (e, t, r) { var o, s, a, n = (e = A(e)[0]).config, i = n.widgetOptions, d = L.debug(n, "core"), l = L.getWidgetById(t); l && (a = l.id, o = !1, A.inArray(a, n.widgets) < 0 && (n.widgets[n.widgets.length] = a), d && (s = new Date), !r && n.widgetInit[a] || (n.widgetInit[a] = !0, e.hasInitialized && L.applyWidgetOptions(e), "function" == typeof l.init && (o = !0, d && console[console.group ? "group" : "log"]("Initializing " + a + " widget"), l.init(e, l, n, i))), r || "function" != typeof l.format || (o = !0, d && console[console.group ? "group" : "log"]("Updating " + a + " widget"), l.format(e, n, i, !1)), d && o && (console.log("Completed " + (r ? "initializing " : "applying ") + a + " widget" + L.benchmark(s)), console.groupEnd && console.groupEnd())) }, applyWidget: function (e, t, r) { var o, s, a, n, i, d = (e = A(e)[0]).config, l = L.debug(d, "core"), c = []; if (!1 === t || !e.hasInitialized || !e.isApplyingWidgets && !e.isUpdating) { if (l && (i = new Date), L.addWidgetFromClass(e), clearTimeout(d.timerReady), d.widgets.length) { for (e.isApplyingWidgets = !0, d.widgets = A.grep(d.widgets, function (e, t) { return A.inArray(e, d.widgets) === t }), s = (a = d.widgets || []).length, o = 0; o < s; o++)(n = L.getWidgetById(a[o])) && n.id ? (n.priority || (n.priority = 10), c[o] = n) : l && console.warn('"' + a[o] + '" was enabled, but the widget code has not been loaded!'); for (c.sort(function (e, t) { return e.priority < t.priority ? -1 : e.priority === t.priority ? 0 : 1 }), s = c.length, l && console[console.group ? "group" : "log"]("Start " + (t ? "initializing" : "applying") + " widgets"), o = 0; o < s; o++)(n = c[o]) && n.id && L.applyWidgetId(e, n.id, t); l && console.groupEnd && console.groupEnd() } d.timerReady = setTimeout(function () { e.isApplyingWidgets = !1, A.data(e, "lastWidgetApplication", new Date), d.$table.triggerHandler("tablesorter-ready"), t || "function" != typeof r || r(e), l && (n = d.widgets.length, console.log("Completed " + (!0 === t ? "initializing " : "applying ") + n + " widget" + (1 !== n ? "s" : "") + L.benchmark(i))) }, 10) } }, removeWidget: function (e, t, r) { var o, s, a, n, i = (e = A(e)[0]).config; if (!0 === t) for (t = [], n = L.widgets.length, a = 0; a < n; a++)(s = L.widgets[a]) && s.id && (t[t.length] = s.id); else t = (A.isArray(t) ? t.join(",") : t || "").toLowerCase().split(/[\s,]+/); for (n = t.length, o = 0; o < n; o++)s = L.getWidgetById(t[o]), 0 <= (a = A.inArray(t[o], i.widgets)) && !0 !== r && i.widgets.splice(a, 1), s && s.remove && (L.debug(i, "core") && console.log((r ? "Refreshing" : "Removing") + ' "' + t[o] + '" widget'), s.remove(e, i, i.widgetOptions, r), i.widgetInit[t[o]] = !1); i.$table.triggerHandler("widgetRemoveEnd", e) }, refreshWidgets: function (e, t, r) { function o(e) { A(e).triggerHandler("refreshComplete") } var s, a, n = (e = A(e)[0]).config.widgets, i = L.widgets, d = i.length, l = []; for (s = 0; s < d; s++)(a = i[s]) && a.id && (t || A.inArray(a.id, n) < 0) && (l[l.length] = a.id); L.removeWidget(e, l.join(","), !0), !0 !== r ? (L.applyWidget(e, t || !1, o), t && L.applyWidget(e, !1, o)) : o(e) }, benchmark: function (e) { return " (" + ((new Date).getTime() - e.getTime()) + " ms)" }, log: function () { console.log(arguments) }, debug: function (e, t) { return e && (!0 === e.debug || "string" == typeof e.debug && -1 < e.debug.indexOf(t)) }, isEmptyObject: function (e) { for (var t in e) return !1; return !0 }, isValueInArray: function (e, t) { var r, o = t && t.length || 0; for (r = 0; r < o; r++)if (t[r][0] === e) return r; return -1 }, formatFloat: function (e, t) { return "string" != typeof e || "" === e ? e : (e = (t && t.config ? !1 !== t.config.usNumberFormat : void 0 === t || t) ? e.replace(L.regex.comma, "") : e.replace(L.regex.digitNonUS, "").replace(L.regex.comma, "."), L.regex.digitNegativeTest.test(e) && (e = e.replace(L.regex.digitNegativeReplace, "-$1")), r = parseFloat(e), isNaN(r) ? A.trim(e) : r); var r }, isDigit: function (e) { return isNaN(e) ? L.regex.digitTest.test(e.toString().replace(L.regex.digitReplace, "")) : "" !== e }, computeColumnIndex: function (e, t) { var r, o, s, a, n, i, d, l, c, g, p = t && t.columns || 0, u = [], f = new Array(p); for (r = 0; r < e.length; r++)for (i = e[r].cells, o = 0; o < i.length; o++) { for (d = r, l = (n = i[o]).rowSpan || 1, c = n.colSpan || 1, void 0 === u[d] && (u[d] = []), s = 0; s < u[d].length + 1; s++)if (void 0 === u[d][s]) { g = s; break } for (p && n.cellIndex === g || (n.setAttribute ? n.setAttribute("data-column", g) : A(n).attr("data-column", g)), s = d; s < d + l; s++)for (void 0 === u[s] && (u[s] = []), f = u[s], a = g; a < g + c; a++)f[a] = "x" } return L.checkColumnCount(e, u, f.length), f.length }, checkColumnCount: function (e, t, r) { var o, s, a = !0, n = []; for (o = 0; o < t.length; o++)if (t[o] && (s = t[o].length, t[o].length !== r)) { a = !1; break } a || (e.each(function (e, t) { var r = t.parentElement.nodeName; n.indexOf(r) < 0 && n.push(r) }), console.error("Invalid or incorrect number of columns in the " + n.join(" or ") + "; expected " + r + ", but found " + s + " columns")) }, fixColumnWidth: function (e) { var t, r, o, s, a, n = (e = A(e)[0]).config, i = n.$table.children("colgroup"); if (i.length && i.hasClass(L.css.colgroup) && i.remove(), n.widthFixed && 0 === n.$table.children("colgroup").length) { for (i = A('<colgroup class="' + L.css.colgroup + '">'), t = n.$table.width(), s = (o = n.$tbodies.find("tr:first").children(":visible")).length, a = 0; a < s; a++)r = parseInt(o.eq(a).width() / t * 1e3, 10) / 10 + "%", i.append(A("<col>").css("width", r)); n.$table.prepend(i) } }, getData: function (e, t, r) { var o, s, a = "", n = A(e); return n.length ? (o = !!A.metadata && n.metadata(), s = " " + (n.attr("class") || ""), void 0 !== n.data(r) || void 0 !== n.data(r.toLowerCase()) ? a += n.data(r) || n.data(r.toLowerCase()) : o && void 0 !== o[r] ? a += o[r] : t && void 0 !== t[r] ? a += t[r] : " " !== s && s.match(" " + r + "-") && (a = s.match(new RegExp("\\s" + r + "-([\\w-]+)"))[1] || ""), A.trim(a)) : "" }, getColumnData: function (e, t, r, o, s) { if ("object" != typeof t || null === t) return t; var a, n = (e = A(e)[0]).config, i = s || n.$headers, d = n.$headerIndexed && n.$headerIndexed[r] || i.find('[data-column="' + r + '"]:last'); if (void 0 !== t[r]) return o ? t[r] : t[i.index(d)]; for (a in t) if ("string" == typeof a && d.filter(a).add(d.find(a)).length) return t[a] }, isProcessing: function (e, t, r) { var o = (e = A(e))[0].config, s = r || e.find("." + L.css.header); t ? (void 0 !== r && 0 < o.sortList.length && (s = s.filter(function () { return !this.sortDisabled && 0 <= L.isValueInArray(parseFloat(A(this).attr("data-column")), o.sortList) })), e.add(s).addClass(L.css.processing + " " + o.cssProcessing)) : e.add(s).removeClass(L.css.processing + " " + o.cssProcessing) }, processTbody: function (e, t, r) { if (e = A(e)[0], r) return e.isProcessing = !0, t.before('<colgroup class="tablesorter-savemyplace"/>'), A.fn.detach ? t.detach() : t.remove(); var o = A(e).find("colgroup.tablesorter-savemyplace"); t.insertAfter(o), o.remove(), e.isProcessing = !1 }, clearTableBody: function (e) { A(e)[0].config.$tbodies.children().detach() }, characterEquivalents: { a: "áàâãäąå", A: "ÁÀÂÃÄĄÅ", c: "çćč", C: "ÇĆČ", e: "éèêëěę", E: "ÉÈÊËĚĘ", i: "íìİîïı", I: "ÍÌİÎÏ", o: "óòôõöō", O: "ÓÒÔÕÖŌ", ss: "ß", SS: "ẞ", u: "úùûüů", U: "ÚÙÛÜŮ" }, replaceAccents: function (e) { var t, r = "[", o = L.characterEquivalents; if (!L.characterRegex) { for (t in L.characterRegexArray = {}, o) "string" == typeof t && (r += o[t], L.characterRegexArray[t] = new RegExp("[" + o[t] + "]", "g")); L.characterRegex = new RegExp(r + "]") } if (L.characterRegex.test(e)) for (t in o) "string" == typeof t && (e = e.replace(L.characterRegexArray[t], t)); return e }, validateOptions: function (e) { var t, r, o, s, a = "headers sortForce sortList sortAppend widgets".split(" "), n = e.originalSettings; if (n) { for (t in L.debug(e, "core") && (s = new Date), n) if ("undefined" === (o = typeof L.defaults[t])) console.warn('Tablesorter Warning! "table.config.' + t + '" option not recognized'); else if ("object" === o) for (r in n[t]) o = L.defaults[t] && typeof L.defaults[t][r], A.inArray(t, a) < 0 && "undefined" === o && console.warn('Tablesorter Warning! "table.config.' + t + "." + r + '" option not recognized'); L.debug(e, "core") && console.log("validate options time:" + L.benchmark(s)) } }, restoreHeaders: function (e) { var t, r, o = A(e)[0].config, s = o.$table.find(o.selectorHeaders), a = s.length; for (t = 0; t < a; t++)(r = s.eq(t)).find("." + L.css.headerIn).length && r.html(o.headerContent[t]) }, destroy: function (e, t, r) { if ((e = A(e)[0]).hasInitialized) { L.removeWidget(e, !0, !1); var o, s = A(e), a = e.config, n = s.find("thead:first"), i = n.find("tr." + L.css.headerRow).removeClass(L.css.headerRow + " " + a.cssHeaderRow), d = s.find("tfoot:first > tr").children("th, td"); !1 === t && 0 <= A.inArray("uitheme", a.widgets) && (s.triggerHandler("applyWidgetId", ["uitheme"]), s.triggerHandler("applyWidgetId", ["zebra"])), n.find("tr").not(i).remove(), o = "sortReset update updateRows updateAll updateHeaders updateCell addRows updateComplete sorton appendCache updateCache applyWidgetId applyWidgets refreshWidgets removeWidget destroy mouseup mouseleave " + "keypress sortBegin sortEnd resetToLoadState ".split(" ").join(a.namespace + " "), s.removeData("tablesorter").unbind(o.replace(L.regex.spaces, " ")), a.$headers.add(d).removeClass([L.css.header, a.cssHeader, a.cssAsc, a.cssDesc, L.css.sortAsc, L.css.sortDesc, L.css.sortNone].join(" ")).removeAttr("data-column").removeAttr("aria-label").attr("aria-disabled", "true"), i.find(a.selectorSort).unbind("mousedown mouseup keypress ".split(" ").join(a.namespace + " ").replace(L.regex.spaces, " ")), L.restoreHeaders(e), s.toggleClass(L.css.table + " " + a.tableClass + " tablesorter-" + a.theme, !1 === t), s.removeClass(a.namespace.slice(1)), e.hasInitialized = !1, delete e.config.cache, "function" == typeof r && r(e), L.debug(a, "core") && console.log("tablesorter has been removed") } } }; A.fn.tablesorter = function (t) { return this.each(function () { var e = A.extend(!0, {}, L.defaults, t, L.instanceMethods); e.originalSettings = t, !this.hasInitialized && L.buildTable && "TABLE" !== this.nodeName ? L.buildTable(this, e) : L.setup(this, e) }) }, window.console && window.console.log || (L.logs = [], console = {}, console.log = console.warn = console.error = console.table = function () { var e = 1 < arguments.length ? arguments : arguments[0]; L.logs[L.logs.length] = { date: Date.now(), log: e } }), L.addParser({ id: "no-parser", is: function () { return !1 }, format: function () { return "" }, type: "text" }), L.addParser({ id: "text", is: function () { return !0 }, format: function (e, t) { var r = t.config; return e && (e = A.trim(r.ignoreCase ? e.toLocaleLowerCase() : e), e = r.sortLocaleCompare ? L.replaceAccents(e) : e), e }, type: "text" }), L.regex.nondigit = /[^\w,. \-()]/g, L.addParser({ id: "digit", is: function (e) { return L.isDigit(e) }, format: function (e, t) { var r = L.formatFloat((e || "").replace(L.regex.nondigit, ""), t); return e && "number" == typeof r ? r : e ? A.trim(e && t.config.ignoreCase ? e.toLocaleLowerCase() : e) : e }, type: "numeric" }), L.regex.currencyReplace = /[+\-,. ]/g, L.regex.currencyTest = /^\(?\d+[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]|[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]\d+\)?$/, L.addParser({ id: "currency", is: function (e) { return e = (e || "").replace(L.regex.currencyReplace, ""), L.regex.currencyTest.test(e) }, format: function (e, t) { var r = L.formatFloat((e || "").replace(L.regex.nondigit, ""), t); return e && "number" == typeof r ? r : e ? A.trim(e && t.config.ignoreCase ? e.toLocaleLowerCase() : e) : e }, type: "numeric" }), L.regex.urlProtocolTest = /^(https?|ftp|file):\/\//, L.regex.urlProtocolReplace = /(https?|ftp|file):\/\/(www\.)?/, L.addParser({ id: "url", is: function (e) { return L.regex.urlProtocolTest.test(e) }, format: function (e) { return e ? A.trim(e.replace(L.regex.urlProtocolReplace, "")) : e }, type: "text" }), L.regex.dash = /-/g, L.regex.isoDate = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/, L.addParser({ id: "isoDate", is: function (e) { return L.regex.isoDate.test(e) }, format: function (e) { var t = e ? new Date(e.replace(L.regex.dash, "/")) : e; return t instanceof Date && isFinite(t) ? t.getTime() : e }, type: "numeric" }), L.regex.percent = /%/g, L.regex.percentTest = /(\d\s*?%|%\s*?\d)/, L.addParser({ id: "percent", is: function (e) { return L.regex.percentTest.test(e) && e.length < 15 }, format: function (e, t) { return e ? L.formatFloat(e.replace(L.regex.percent, ""), t) : e }, type: "numeric" }), L.addParser({ id: "image", is: function (e, t, r, o) { return 0 < o.find("img").length }, format: function (e, t, r) { return A(r).find("img").attr(t.config.imgAttr || "alt") || e }, parsed: !0, type: "text" }), L.regex.dateReplace = /(\S)([AP]M)$/i, L.regex.usLongDateTest1 = /^[A-Z]{3,10}\.?\s+\d{1,2},?\s+(\d{4})(\s+\d{1,2}:\d{2}(:\d{2})?(\s+[AP]M)?)?$/i, L.regex.usLongDateTest2 = /^\d{1,2}\s+[A-Z]{3,10}\s+\d{4}/i, L.addParser({ id: "usLongDate", is: function (e) { return L.regex.usLongDateTest1.test(e) || L.regex.usLongDateTest2.test(e) }, format: function (e) { var t = e ? new Date(e.replace(L.regex.dateReplace, "$1 $2")) : e; return t instanceof Date && isFinite(t) ? t.getTime() : e }, type: "numeric" }), L.regex.shortDateTest = /(^\d{1,2}[\/\s]\d{1,2}[\/\s]\d{4})|(^\d{4}[\/\s]\d{1,2}[\/\s]\d{1,2})/, L.regex.shortDateReplace = /[\-.,]/g, L.regex.shortDateXXY = /(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/, L.regex.shortDateYMD = /(\d{4})[\/\s](\d{1,2})[\/\s](\d{1,2})/, L.convertFormat = function (e, t) { e = (e || "").replace(L.regex.spaces, " ").replace(L.regex.shortDateReplace, "/"), "mmddyyyy" === t ? e = e.replace(L.regex.shortDateXXY, "$3/$1/$2") : "ddmmyyyy" === t ? e = e.replace(L.regex.shortDateXXY, "$3/$2/$1") : "yyyymmdd" === t && (e = e.replace(L.regex.shortDateYMD, "$1/$2/$3")); var r = new Date(e); return r instanceof Date && isFinite(r) ? r.getTime() : "" }, L.addParser({ id: "shortDate", is: function (e) { return e = (e || "").replace(L.regex.spaces, " ").replace(L.regex.shortDateReplace, "/"), L.regex.shortDateTest.test(e) }, format: function (e, t, r, o) { if (e) { var s = t.config, a = s.$headerIndexed[o], n = a.length && a.data("dateFormat") || L.getData(a, L.getColumnData(t, s.headers, o), "dateFormat") || s.dateFormat; return a.length && a.data("dateFormat", n), L.convertFormat(e, n) || e } return e }, type: "numeric" }), L.regex.timeTest = /^(0?[1-9]|1[0-2]):([0-5]\d)(\s[AP]M)$|^((?:[01]\d|[2][0-4]):[0-5]\d)$/i, L.regex.timeMatch = /(0?[1-9]|1[0-2]):([0-5]\d)(\s[AP]M)|((?:[01]\d|[2][0-4]):[0-5]\d)/i, L.addParser({ id: "time", is: function (e) { return L.regex.timeTest.test(e) }, format: function (e) { var t = (e || "").match(L.regex.timeMatch), r = new Date(e), o = e && (null !== t ? t[0] : "00:00 AM"), s = o ? new Date("2000/01/01 " + o.replace(L.regex.dateReplace, "$1 $2")) : o; return s instanceof Date && isFinite(s) ? (r instanceof Date && isFinite(r) ? r.getTime() : 0) ? parseFloat(s.getTime() + "." + r.getTime()) : s.getTime() : e }, type: "numeric" }), L.addParser({ id: "metadata", is: function () { return !1 }, format: function (e, t, r) { var o = t.config, s = o.parserMetadataName ? o.parserMetadataName : "sortValue"; return A(r).metadata()[s] }, type: "numeric" }), L.addWidget({ id: "zebra", priority: 90, format: function (e, t, r) { var o, s, a, n, i, d, l, c = new RegExp(t.cssChildRow, "i"), g = t.$tbodies.add(A(t.namespace + "_extra_table").children("tbody:not(." + t.cssInfoBlock + ")")); for (i = 0; i < g.length; i++)for (a = 0, l = (o = g.eq(i).children("tr:visible").not(t.selectorRemove)).length, d = 0; d < l; d++)s = o.eq(d), c.test(s[0].className) || a++, n = a % 2 == 0, s.removeClass(r.zebra[n ? 1 : 0]).addClass(r.zebra[n ? 0 : 1]) }, remove: function (e, t, r, o) { if (!o) { var s, a, n = t.$tbodies, i = (r.zebra || ["even", "odd"]).join(" "); for (s = 0; s < n.length; s++)(a = L.processTbody(e, n.eq(s), !0)).children().removeClass(i), L.processTbody(e, a, !1) } } }) }(e), e.tablesorter });

/*! tablesorter (FORK) - updated 2020-03-03 (v2.31.3)*/
/* Includes widgets ( storage,uitheme,columns,filter,stickyHeaders,resizable,saveSort ) */
(function (factory) { if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else if (typeof module === 'object' && typeof module.exports === 'object') { module.exports = factory(require('jquery')); } else { factory(jQuery); } }(function (jQuery) {
    /*! Widget: storage - updated 2018-03-18 (v2.30.0) */
    /*global JSON:false */
    ; (function ($, window, document) {
        'use strict';

        var ts = $.tablesorter || {};

        // update defaults for validator; these values must be falsy!
        $.extend(true, ts.defaults, {
            fixedUrl: '',
            widgetOptions: {
                storage_fixedUrl: '',
                storage_group: '',
                storage_page: '',
                storage_storageType: '',
                storage_tableId: '',
                storage_useSessionStorage: ''
            }
        });

        // *** Store data in local storage, with a cookie fallback ***
        /* IE7 needs JSON library for JSON.stringify - (http://caniuse.com/#search=json)
           if you need it, then include https://github.com/douglascrockford/JSON-js
    
           $.parseJSON is not available is jQuery versions older than 1.4.1, using older
           versions will only allow storing information for one page at a time
    
           // *** Save data (JSON format only) ***
           // val must be valid JSON... use http://jsonlint.com/ to ensure it is valid
           var val = { "mywidget" : "data1" }; // valid JSON uses double quotes
           // $.tablesorter.storage(table, key, val);
           $.tablesorter.storage(table, 'tablesorter-mywidget', val);
    
           // *** Get data: $.tablesorter.storage(table, key); ***
           v = $.tablesorter.storage(table, 'tablesorter-mywidget');
           // val may be empty, so also check for your data
           val = (v && v.hasOwnProperty('mywidget')) ? v.mywidget : '';
           alert(val); // 'data1' if saved, or '' if not
        */
        ts.storage = function (table, key, value, options) {
            table = $(table)[0];
            var cookieIndex, cookies, date,
                hasStorage = false,
                values = {},
                c = table.config,
                wo = c && c.widgetOptions,
                debug = ts.debug(c, 'storage'),
                storageType = (
                    (options && options.storageType) || (wo && wo.storage_storageType)
                ).toString().charAt(0).toLowerCase(),
                // deprecating "useSessionStorage"; any storageType setting overrides it
                session = storageType ? '' :
                    (options && options.useSessionStorage) || (wo && wo.storage_useSessionStorage),
                $table = $(table),
                // id from (1) options ID, (2) table 'data-table-group' attribute, (3) widgetOptions.storage_tableId,
                // (4) table ID, then (5) table index
                id = options && options.id ||
                    $table.attr(options && options.group || wo && wo.storage_group || 'data-table-group') ||
                    wo && wo.storage_tableId || table.id || $('.tablesorter').index($table),
                // url from (1) options url, (2) table 'data-table-page' attribute, (3) widgetOptions.storage_fixedUrl,
                // (4) table.config.fixedUrl (deprecated), then (5) window location path
                url = options && options.url ||
                    $table.attr(options && options.page || wo && wo.storage_page || 'data-table-page') ||
                    wo && wo.storage_fixedUrl || c && c.fixedUrl || window.location.pathname;

            // skip if using cookies
            if (storageType !== 'c') {
                storageType = (storageType === 's' || session) ? 'sessionStorage' : 'localStorage';
                // https://gist.github.com/paulirish/5558557
                if (storageType in window) {
                    try {
                        window[storageType].setItem('_tmptest', 'temp');
                        hasStorage = true;
                        window[storageType].removeItem('_tmptest');
                    } catch (error) {
                        console.warn(storageType + ' is not supported in this browser');
                    }
                }
            }
            if (debug) {
                console.log('Storage >> Using', hasStorage ? storageType : 'cookies');
            }
            // *** get value ***
            if ($.parseJSON) {
                if (hasStorage) {
                    values = $.parseJSON(window[storageType][key] || 'null') || {};
                } else {
                    // old browser, using cookies
                    cookies = document.cookie.split(/[;\s|=]/);
                    // add one to get from the key to the value
                    cookieIndex = $.inArray(key, cookies) + 1;
                    values = (cookieIndex !== 0) ? $.parseJSON(cookies[cookieIndex] || 'null') || {} : {};
                }
            }
            // allow value to be an empty string too
            if (typeof value !== 'undefined' && window.JSON && JSON.hasOwnProperty('stringify')) {
                // add unique identifiers = url pathname > table ID/index on page > data
                if (!values[url]) {
                    values[url] = {};
                }
                values[url][id] = value;
                // *** set value ***
                if (hasStorage) {
                    window[storageType][key] = JSON.stringify(values);
                } else {
                    date = new Date();
                    date.setTime(date.getTime() + (31536e+6)); // 365 days
                    document.cookie = key + '=' + (JSON.stringify(values)).replace(/\"/g, '\"') + '; expires=' + date.toGMTString() + '; path=/';
                }
            } else {
                return values && values[url] ? values[url][id] : '';
            }
        };

    })(jQuery, window, document);

    /*! Widget: uitheme - updated 2018-03-18 (v2.30.0) */
    ; (function ($) {
        'use strict';
        var ts = $.tablesorter || {};

        ts.themes = {
            'bootstrap': {
                table: 'table table-bordered table-striped',
                caption: 'caption',
                // header class names
                header: 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
                sortNone: '',
                sortAsc: '',
                sortDesc: '',
                active: '', // applied when column is sorted
                hover: '', // custom css required - a defined bootstrap style may not override other classes
                // icon class names
                icons: '', // add 'bootstrap-icon-white' to make them white; this icon class is added to the <i> in the header
                iconSortNone: 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
                iconSortAsc: 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
                iconSortDesc: 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
                filterRow: '', // filter row class
                footerRow: '',
                footerCells: '',
                even: '', // even row zebra striping
                odd: ''  // odd row zebra striping
            },
            'jui': {
                table: 'ui-widget ui-widget-content ui-corner-all', // table classes
                caption: 'ui-widget-content',
                // header class names
                header: 'ui-widget-header ui-corner-all ui-state-default', // header classes
                sortNone: '',
                sortAsc: '',
                sortDesc: '',
                active: 'ui-state-active', // applied when column is sorted
                hover: 'ui-state-hover',  // hover class
                // icon class names
                icons: 'ui-icon', // icon class added to the <i> in the header
                iconSortNone: 'ui-icon-carat-2-n-s ui-icon-caret-2-n-s', // class name added to icon when column is not sorted
                iconSortAsc: 'ui-icon-carat-1-n ui-icon-caret-1-n', // class name added to icon when column has ascending sort
                iconSortDesc: 'ui-icon-carat-1-s ui-icon-caret-1-s', // class name added to icon when column has descending sort
                filterRow: '',
                footerRow: '',
                footerCells: '',
                even: 'ui-widget-content', // even row zebra striping
                odd: 'ui-state-default'   // odd row zebra striping
            }
        };

        $.extend(ts.css, {
            wrapper: 'tablesorter-wrapper' // ui theme & resizable
        });

        ts.addWidget({
            id: 'uitheme',
            priority: 10,
            format: function (table, c, wo) {
                var i, tmp, hdr, icon, time, $header, $icon, $tfoot, $h, oldtheme, oldremove, oldIconRmv, hasOldTheme,
                    themesAll = ts.themes,
                    $table = c.$table.add($(c.namespace + '_extra_table')),
                    $headers = c.$headers.add($(c.namespace + '_extra_headers')),
                    theme = c.theme || 'jui',
                    themes = themesAll[theme] || {},
                    remove = $.trim([themes.sortNone, themes.sortDesc, themes.sortAsc, themes.active].join(' ')),
                    iconRmv = $.trim([themes.iconSortNone, themes.iconSortDesc, themes.iconSortAsc].join(' ')),
                    debug = ts.debug(c, 'uitheme');
                if (debug) { time = new Date(); }
                // initialization code - run once
                if (!$table.hasClass('tablesorter-' + theme) || c.theme !== c.appliedTheme || !wo.uitheme_applied) {
                    wo.uitheme_applied = true;
                    oldtheme = themesAll[c.appliedTheme] || {};
                    hasOldTheme = !$.isEmptyObject(oldtheme);
                    oldremove = hasOldTheme ? [oldtheme.sortNone, oldtheme.sortDesc, oldtheme.sortAsc, oldtheme.active].join(' ') : '';
                    oldIconRmv = hasOldTheme ? [oldtheme.iconSortNone, oldtheme.iconSortDesc, oldtheme.iconSortAsc].join(' ') : '';
                    if (hasOldTheme) {
                        wo.zebra[0] = $.trim(' ' + wo.zebra[0].replace(' ' + oldtheme.even, ''));
                        wo.zebra[1] = $.trim(' ' + wo.zebra[1].replace(' ' + oldtheme.odd, ''));
                        c.$tbodies.children().removeClass([oldtheme.even, oldtheme.odd].join(' '));
                    }
                    // update zebra stripes
                    if (themes.even) { wo.zebra[0] += ' ' + themes.even; }
                    if (themes.odd) { wo.zebra[1] += ' ' + themes.odd; }
                    // add caption style
                    $table.children('caption')
                        .removeClass(oldtheme.caption || '')
                        .addClass(themes.caption);
                    // add table/footer class names
                    $tfoot = $table
                        // remove other selected themes
                        .removeClass((c.appliedTheme ? 'tablesorter-' + (c.appliedTheme || '') : '') + ' ' + (oldtheme.table || ''))
                        .addClass('tablesorter-' + theme + ' ' + (themes.table || '')) // add theme widget class name
                        .children('tfoot');
                    c.appliedTheme = c.theme;

                    if ($tfoot.length) {
                        $tfoot
                            // if oldtheme.footerRow or oldtheme.footerCells are undefined, all class names are removed
                            .children('tr').removeClass(oldtheme.footerRow || '').addClass(themes.footerRow)
                            .children('th, td').removeClass(oldtheme.footerCells || '').addClass(themes.footerCells);
                    }
                    // update header classes
                    $headers
                        .removeClass((hasOldTheme ? [oldtheme.header, oldtheme.hover, oldremove].join(' ') : '') || '')
                        .addClass(themes.header)
                        .not('.sorter-false')
                        .unbind('mouseenter.tsuitheme mouseleave.tsuitheme')
                        .bind('mouseenter.tsuitheme mouseleave.tsuitheme', function (event) {
                            // toggleClass with switch added in jQuery 1.3
                            $(this)[event.type === 'mouseenter' ? 'addClass' : 'removeClass'](themes.hover || '');
                        });

                    $headers.each(function () {
                        var $this = $(this);
                        if (!$this.find('.' + ts.css.wrapper).length) {
                            // Firefox needs this inner div to position the icon & resizer correctly
                            $this.wrapInner('<div class="' + ts.css.wrapper + '" style="position:relative;height:100%;width:100%"></div>');
                        }
                    });
                    if (c.cssIcon) {
                        // if c.cssIcon is '', then no <i> is added to the header
                        $headers
                            .find('.' + ts.css.icon)
                            .removeClass(hasOldTheme ? [oldtheme.icons, oldIconRmv].join(' ') : '')
                            .addClass(themes.icons || '');
                    }
                    // filter widget initializes after uitheme
                    if (ts.hasWidget(c.table, 'filter')) {
                        tmp = function () {
                            $table.children('thead').children('.' + ts.css.filterRow)
                                .removeClass(hasOldTheme ? oldtheme.filterRow || '' : '')
                                .addClass(themes.filterRow || '');
                        };
                        if (wo.filter_initialized) {
                            tmp();
                        } else {
                            $table.one('filterInit', function () {
                                tmp();
                            });
                        }
                    }
                }
                for (i = 0; i < c.columns; i++) {
                    $header = c.$headers
                        .add($(c.namespace + '_extra_headers'))
                        .not('.sorter-false')
                        .filter('[data-column="' + i + '"]');
                    $icon = (ts.css.icon) ? $header.find('.' + ts.css.icon) : $();
                    $h = $headers.not('.sorter-false').filter('[data-column="' + i + '"]:last');
                    if ($h.length) {
                        $header.removeClass(remove);
                        $icon.removeClass(iconRmv);
                        if ($h[0].sortDisabled) {
                            // no sort arrows for disabled columns!
                            $icon.removeClass(themes.icons || '');
                        } else {
                            hdr = themes.sortNone;
                            icon = themes.iconSortNone;
                            if ($h.hasClass(ts.css.sortAsc)) {
                                hdr = [themes.sortAsc, themes.active].join(' ');
                                icon = themes.iconSortAsc;
                            } else if ($h.hasClass(ts.css.sortDesc)) {
                                hdr = [themes.sortDesc, themes.active].join(' ');
                                icon = themes.iconSortDesc;
                            }
                            $header.addClass(hdr);
                            $icon.addClass(icon || '');
                        }
                    }
                }
                if (debug) {
                    console.log('uitheme >> Applied ' + theme + ' theme' + ts.benchmark(time));
                }
            },
            remove: function (table, c, wo, refreshing) {
                if (!wo.uitheme_applied) { return; }
                var $table = c.$table,
                    theme = c.appliedTheme || 'jui',
                    themes = ts.themes[theme] || ts.themes.jui,
                    $headers = $table.children('thead').children(),
                    remove = themes.sortNone + ' ' + themes.sortDesc + ' ' + themes.sortAsc,
                    iconRmv = themes.iconSortNone + ' ' + themes.iconSortDesc + ' ' + themes.iconSortAsc;
                $table.removeClass('tablesorter-' + theme + ' ' + themes.table);
                wo.uitheme_applied = false;
                if (refreshing) { return; }
                $table.find(ts.css.header).removeClass(themes.header);
                $headers
                    .unbind('mouseenter.tsuitheme mouseleave.tsuitheme') // remove hover
                    .removeClass(themes.hover + ' ' + remove + ' ' + themes.active)
                    .filter('.' + ts.css.filterRow)
                    .removeClass(themes.filterRow);
                $headers.find('.' + ts.css.icon).removeClass(themes.icons + ' ' + iconRmv);
            }
        });

    })(jQuery);

    /*! Widget: columns - updated 5/24/2017 (v2.28.11) */
    ; (function ($) {
        'use strict';
        var ts = $.tablesorter || {};

        ts.addWidget({
            id: 'columns',
            priority: 65,
            options: {
                columns: ['primary', 'secondary', 'tertiary']
            },
            format: function (table, c, wo) {
                var $tbody, tbodyIndex, $rows, rows, $row, $cells, remove, indx,
                    $table = c.$table,
                    $tbodies = c.$tbodies,
                    sortList = c.sortList,
                    len = sortList.length,
                    // removed c.widgetColumns support
                    css = wo && wo.columns || ['primary', 'secondary', 'tertiary'],
                    last = css.length - 1;
                remove = css.join(' ');
                // check if there is a sort (on initialization there may not be one)
                for (tbodyIndex = 0; tbodyIndex < $tbodies.length; tbodyIndex++) {
                    $tbody = ts.processTbody(table, $tbodies.eq(tbodyIndex), true); // detach tbody
                    $rows = $tbody.children('tr');
                    // loop through the visible rows
                    $rows.each(function () {
                        $row = $(this);
                        if (this.style.display !== 'none') {
                            // remove all columns class names
                            $cells = $row.children().removeClass(remove);
                            // add appropriate column class names
                            if (sortList && sortList[0]) {
                                // primary sort column class
                                $cells.eq(sortList[0][0]).addClass(css[0]);
                                if (len > 1) {
                                    for (indx = 1; indx < len; indx++) {
                                        // secondary, tertiary, etc sort column classes
                                        $cells.eq(sortList[indx][0]).addClass(css[indx] || css[last]);
                                    }
                                }
                            }
                        }
                    });
                    ts.processTbody(table, $tbody, false);
                }
                // add classes to thead and tfoot
                rows = wo.columns_thead !== false ? ['thead tr'] : [];
                if (wo.columns_tfoot !== false) {
                    rows.push('tfoot tr');
                }
                if (rows.length) {
                    $rows = $table.find(rows.join(',')).children().removeClass(remove);
                    if (len) {
                        for (indx = 0; indx < len; indx++) {
                            // add primary. secondary, tertiary, etc sort column classes
                            $rows.filter('[data-column="' + sortList[indx][0] + '"]').addClass(css[indx] || css[last]);
                        }
                    }
                }
            },
            remove: function (table, c, wo) {
                var tbodyIndex, $tbody,
                    $tbodies = c.$tbodies,
                    remove = (wo.columns || ['primary', 'secondary', 'tertiary']).join(' ');
                c.$headers.removeClass(remove);
                c.$table.children('tfoot').children('tr').children('th, td').removeClass(remove);
                for (tbodyIndex = 0; tbodyIndex < $tbodies.length; tbodyIndex++) {
                    $tbody = ts.processTbody(table, $tbodies.eq(tbodyIndex), true); // remove tbody
                    $tbody.children('tr').each(function () {
                        $(this).children().removeClass(remove);
                    });
                    ts.processTbody(table, $tbody, false); // restore tbody
                }
            }
        });

    })(jQuery);

    /*! Widget: filter - updated 2018-03-18 (v2.30.0) *//*
     * Requires tablesorter v2.8+ and jQuery 1.7+
     * by Rob Garrison
     */
    ; (function ($) {
        'use strict';
        var tsf, tsfRegex,
            ts = $.tablesorter || {},
            tscss = ts.css,
            tskeyCodes = ts.keyCodes;

        $.extend(tscss, {
            filterRow: 'tablesorter-filter-row',
            filter: 'tablesorter-filter',
            filterDisabled: 'disabled',
            filterRowHide: 'hideme'
        });

        $.extend(tskeyCodes, {
            backSpace: 8,
            escape: 27,
            space: 32,
            left: 37,
            down: 40
        });

        ts.addWidget({
            id: 'filter',
            priority: 50,
            options: {
                filter_cellFilter: '',    // css class name added to the filter cell ( string or array )
                filter_childRows: false, // if true, filter includes child row content in the search
                filter_childByColumn: false, // ( filter_childRows must be true ) if true = search child rows by column; false = search all child row text grouped
                filter_childWithSibs: true,  // if true, include matching child row siblings
                filter_columnAnyMatch: true,  // if true, allows using '#:{query}' in AnyMatch searches ( column:query )
                filter_columnFilters: true,  // if true, a filter will be added to the top of each table column
                filter_cssFilter: '',    // css class name added to the filter row & each input in the row ( tablesorter-filter is ALWAYS added )
                filter_defaultAttrib: 'data-value', // data attribute in the header cell that contains the default filter value
                filter_defaultFilter: {},    // add a default column filter type '~{query}' to make fuzzy searches default; '{q1} AND {q2}' to make all searches use a logical AND.
                filter_excludeFilter: {},    // filters to exclude, per column
                filter_external: '',    // jQuery selector string ( or jQuery object ) of external filters
                filter_filteredRow: 'filtered', // class added to filtered rows; define in css with "display:none" to hide the filtered-out rows
                filter_filterLabel: 'Filter "{{label}}" column by...', // Aria-label added to filter input/select; see #1495
                filter_formatter: null,  // add custom filter elements to the filter row
                filter_functions: null,  // add custom filter functions using this option
                filter_hideEmpty: true,  // hide filter row when table is empty
                filter_hideFilters: false, // collapse filter row when mouse leaves the area
                filter_ignoreCase: true,  // if true, make all searches case-insensitive
                filter_liveSearch: true,  // if true, search column content while the user types ( with a delay )
                filter_matchType: { 'input': 'exact', 'select': 'exact' }, // global query settings ('exact' or 'match'); overridden by "filter-match" or "filter-exact" class
                filter_onlyAvail: 'filter-onlyAvail', // a header with a select dropdown & this class name will only show available ( visible ) options within the drop down
                filter_placeholder: { search: '', select: '' }, // default placeholder text ( overridden by any header 'data-placeholder' setting )
                filter_reset: null,  // jQuery selector string of an element used to reset the filters
                filter_resetOnEsc: true,  // Reset filter input when the user presses escape - normalized across browsers
                filter_saveFilters: false, // Use the $.tablesorter.storage utility to save the most recent filters
                filter_searchDelay: 300,   // typing delay in milliseconds before starting a search
                filter_searchFiltered: true,  // allow searching through already filtered rows in special circumstances; will speed up searching in large tables if true
                filter_selectSource: null,  // include a function to return an array of values to be added to the column filter select
                filter_selectSourceSeparator: '|', // filter_selectSource array text left of the separator is added to the option value, right into the option text
                filter_serversideFiltering: false, // if true, must perform server-side filtering b/c client-side filtering is disabled, but the ui and events will still be used.
                filter_startsWith: false, // if true, filter start from the beginning of the cell contents
                filter_useParsedData: false  // filter all data using parsed content
            },
            format: function (table, c, wo) {
                if (!c.$table.hasClass('hasFilters')) {
                    tsf.init(table, c, wo);
                }
            },
            remove: function (table, c, wo, refreshing) {
                var tbodyIndex, $tbody,
                    $table = c.$table,
                    $tbodies = c.$tbodies,
                    events = (
                        'addRows updateCell update updateRows updateComplete appendCache filterReset ' +
                        'filterAndSortReset filterFomatterUpdate filterEnd search stickyHeadersInit '
                    ).split(' ').join(c.namespace + 'filter ');
                $table
                    .removeClass('hasFilters')
                    // add filter namespace to all BUT search
                    .unbind(events.replace(ts.regex.spaces, ' '))
                    // remove the filter row even if refreshing, because the column might have been moved
                    .find('.' + tscss.filterRow).remove();
                wo.filter_initialized = false;
                if (refreshing) { return; }
                for (tbodyIndex = 0; tbodyIndex < $tbodies.length; tbodyIndex++) {
                    $tbody = ts.processTbody(table, $tbodies.eq(tbodyIndex), true); // remove tbody
                    $tbody.children().removeClass(wo.filter_filteredRow).show();
                    ts.processTbody(table, $tbody, false); // restore tbody
                }
                if (wo.filter_reset) {
                    $(document).undelegate(wo.filter_reset, 'click' + c.namespace + 'filter');
                }
            }
        });

        tsf = ts.filter = {

            // regex used in filter 'check' functions - not for general use and not documented
            regex: {
                regex: /^\/((?:\\\/|[^\/])+)\/([migyu]{0,5})?$/, // regex to test for regex
                child: /tablesorter-childRow/, // child row class name; this gets updated in the script
                filtered: /filtered/, // filtered (hidden) row class name; updated in the script
                type: /undefined|number/, // check type
                exact: /(^[\"\'=]+)|([\"\'=]+$)/g, // exact match (allow '==')
                operators: /[<>=]/g, // replace operators
                query: '(q|query)', // replace filter queries
                wild01: /\?/g, // wild card match 0 or 1
                wild0More: /\*/g, // wild care match 0 or more
                quote: /\"/g,
                isNeg1: /(>=?\s*-\d)/,
                isNeg2: /(<=?\s*\d)/
            },
            // function( c, data ) { }
            // c = table.config
            // data.$row = jQuery object of the row currently being processed
            // data.$cells = jQuery object of all cells within the current row
            // data.filters = array of filters for all columns ( some may be undefined )
            // data.filter = filter for the current column
            // data.iFilter = same as data.filter, except lowercase ( if wo.filter_ignoreCase is true )
            // data.exact = table cell text ( or parsed data if column parser enabled; may be a number & not a string )
            // data.iExact = same as data.exact, except lowercase ( if wo.filter_ignoreCase is true; may be a number & not a string )
            // data.cache = table cell text from cache, so it has been parsed ( & in all lower case if c.ignoreCase is true )
            // data.cacheArray = An array of parsed content from each table cell in the row being processed
            // data.index = column index; table = table element ( DOM )
            // data.parsed = array ( by column ) of boolean values ( from filter_useParsedData or 'filter-parsed' class )
            types: {
                or: function (c, data, vars) {
                    // look for "|", but not if it is inside of a regular expression
                    if ((tsfRegex.orTest.test(data.iFilter) || tsfRegex.orSplit.test(data.filter)) &&
                        // this test for regex has potential to slow down the overall search
                        !tsfRegex.regex.test(data.filter)) {
                        var indx, filterMatched, query, regex,
                            // duplicate data but split filter
                            data2 = $.extend({}, data),
                            filter = data.filter.split(tsfRegex.orSplit),
                            iFilter = data.iFilter.split(tsfRegex.orSplit),
                            len = filter.length;
                        for (indx = 0; indx < len; indx++) {
                            data2.nestedFilters = true;
                            data2.filter = '' + (tsf.parseFilter(c, filter[indx], data) || '');
                            data2.iFilter = '' + (tsf.parseFilter(c, iFilter[indx], data) || '');
                            query = '(' + (tsf.parseFilter(c, data2.filter, data) || '') + ')';
                            try {
                                // use try/catch, because query may not be a valid regex if "|" is contained within a partial regex search,
                                // e.g "/(Alex|Aar" -> Uncaught SyntaxError: Invalid regular expression: /(/(Alex)/: Unterminated group
                                regex = new RegExp(data.isMatch ? query : '^' + query + '$', c.widgetOptions.filter_ignoreCase ? 'i' : '');
                                // filterMatched = data2.filter === '' && indx > 0 ? true
                                // look for an exact match with the 'or' unless the 'filter-match' class is found
                                filterMatched = regex.test(data2.exact) || tsf.processTypes(c, data2, vars);
                                if (filterMatched) {
                                    return filterMatched;
                                }
                            } catch (error) {
                                return null;
                            }
                        }
                        // may be null from processing types
                        return filterMatched || false;
                    }
                    return null;
                },
                // Look for an AND or && operator ( logical and )
                and: function (c, data, vars) {
                    if (tsfRegex.andTest.test(data.filter)) {
                        var indx, filterMatched, result, query, regex,
                            // duplicate data but split filter
                            data2 = $.extend({}, data),
                            filter = data.filter.split(tsfRegex.andSplit),
                            iFilter = data.iFilter.split(tsfRegex.andSplit),
                            len = filter.length;
                        for (indx = 0; indx < len; indx++) {
                            data2.nestedFilters = true;
                            data2.filter = '' + (tsf.parseFilter(c, filter[indx], data) || '');
                            data2.iFilter = '' + (tsf.parseFilter(c, iFilter[indx], data) || '');
                            query = ('(' + (tsf.parseFilter(c, data2.filter, data) || '') + ')')
                                // replace wild cards since /(a*)/i will match anything
                                .replace(tsfRegex.wild01, '\\S{1}').replace(tsfRegex.wild0More, '\\S*');
                            try {
                                // use try/catch just in case RegExp is invalid
                                regex = new RegExp(data.isMatch ? query : '^' + query + '$', c.widgetOptions.filter_ignoreCase ? 'i' : '');
                                // look for an exact match with the 'and' unless the 'filter-match' class is found
                                result = (regex.test(data2.exact) || tsf.processTypes(c, data2, vars));
                                if (indx === 0) {
                                    filterMatched = result;
                                } else {
                                    filterMatched = filterMatched && result;
                                }
                            } catch (error) {
                                return null;
                            }
                        }
                        // may be null from processing types
                        return filterMatched || false;
                    }
                    return null;
                },
                // Look for regex
                regex: function (c, data) {
                    if (tsfRegex.regex.test(data.filter)) {
                        var matches,
                            // cache regex per column for optimal speed
                            regex = data.filter_regexCache[data.index] || tsfRegex.regex.exec(data.filter),
                            isRegex = regex instanceof RegExp;
                        try {
                            if (!isRegex) {
                                // force case insensitive search if ignoreCase option set?
                                // if ( c.ignoreCase && !regex[2] ) { regex[2] = 'i'; }
                                data.filter_regexCache[data.index] = regex = new RegExp(regex[1], regex[2]);
                            }
                            matches = regex.test(data.exact);
                        } catch (error) {
                            matches = false;
                        }
                        return matches;
                    }
                    return null;
                },
                // Look for operators >, >=, < or <=
                operators: function (c, data) {
                    // ignore empty strings... because '' < 10 is true
                    if (tsfRegex.operTest.test(data.iFilter) && data.iExact !== '') {
                        var cachedValue, result, txt,
                            table = c.table,
                            parsed = data.parsed[data.index],
                            query = ts.formatFloat(data.iFilter.replace(tsfRegex.operators, ''), table),
                            parser = c.parsers[data.index] || {},
                            savedSearch = query;
                        // parse filter value in case we're comparing numbers ( dates )
                        if (parsed || parser.type === 'numeric') {
                            txt = $.trim('' + data.iFilter.replace(tsfRegex.operators, ''));
                            result = tsf.parseFilter(c, txt, data, true);
                            query = (typeof result === 'number' && result !== '' && !isNaN(result)) ? result : query;
                        }
                        // iExact may be numeric - see issue #149;
                        // check if cached is defined, because sometimes j goes out of range? ( numeric columns )
                        if ((parsed || parser.type === 'numeric') && !isNaN(query) &&
                            typeof data.cache !== 'undefined') {
                            cachedValue = data.cache;
                        } else {
                            txt = isNaN(data.iExact) ? data.iExact.replace(ts.regex.nondigit, '') : data.iExact;
                            cachedValue = ts.formatFloat(txt, table);
                        }
                        if (tsfRegex.gtTest.test(data.iFilter)) {
                            result = tsfRegex.gteTest.test(data.iFilter) ? cachedValue >= query : cachedValue > query;
                        } else if (tsfRegex.ltTest.test(data.iFilter)) {
                            result = tsfRegex.lteTest.test(data.iFilter) ? cachedValue <= query : cachedValue < query;
                        }
                        // keep showing all rows if nothing follows the operator
                        if (!result && savedSearch === '') {
                            result = true;
                        }
                        return result;
                    }
                    return null;
                },
                // Look for a not match
                notMatch: function (c, data) {
                    if (tsfRegex.notTest.test(data.iFilter)) {
                        var indx,
                            txt = data.iFilter.replace('!', ''),
                            filter = tsf.parseFilter(c, txt, data) || '';
                        if (tsfRegex.exact.test(filter)) {
                            // look for exact not matches - see #628
                            filter = filter.replace(tsfRegex.exact, '');
                            return filter === '' ? true : $.trim(filter) !== data.iExact;
                        } else {
                            indx = data.iExact.search($.trim(filter));
                            return filter === '' ? true :
                                // return true if not found
                                data.anyMatch ? indx < 0 :
                                    // return false if found
                                    !(c.widgetOptions.filter_startsWith ? indx === 0 : indx >= 0);
                        }
                    }
                    return null;
                },
                // Look for quotes or equals to get an exact match; ignore type since iExact could be numeric
                exact: function (c, data) {
                    /*jshint eqeqeq:false */
                    if (tsfRegex.exact.test(data.iFilter)) {
                        var txt = data.iFilter.replace(tsfRegex.exact, ''),
                            filter = tsf.parseFilter(c, txt, data) || '';
                        // eslint-disable-next-line eqeqeq
                        return data.anyMatch ? $.inArray(filter, data.rowArray) >= 0 : filter == data.iExact;
                    }
                    return null;
                },
                // Look for a range ( using ' to ' or ' - ' ) - see issue #166; thanks matzhu!
                range: function (c, data) {
                    if (tsfRegex.toTest.test(data.iFilter)) {
                        var result, tmp, range1, range2,
                            table = c.table,
                            index = data.index,
                            parsed = data.parsed[index],
                            // make sure the dash is for a range and not indicating a negative number
                            query = data.iFilter.split(tsfRegex.toSplit);

                        tmp = query[0].replace(ts.regex.nondigit, '') || '';
                        range1 = ts.formatFloat(tsf.parseFilter(c, tmp, data), table);
                        tmp = query[1].replace(ts.regex.nondigit, '') || '';
                        range2 = ts.formatFloat(tsf.parseFilter(c, tmp, data), table);
                        // parse filter value in case we're comparing numbers ( dates )
                        if (parsed || c.parsers[index].type === 'numeric') {
                            result = c.parsers[index].format('' + query[0], table, c.$headers.eq(index), index);
                            range1 = (result !== '' && !isNaN(result)) ? result : range1;
                            result = c.parsers[index].format('' + query[1], table, c.$headers.eq(index), index);
                            range2 = (result !== '' && !isNaN(result)) ? result : range2;
                        }
                        if ((parsed || c.parsers[index].type === 'numeric') && !isNaN(range1) && !isNaN(range2)) {
                            result = data.cache;
                        } else {
                            tmp = isNaN(data.iExact) ? data.iExact.replace(ts.regex.nondigit, '') : data.iExact;
                            result = ts.formatFloat(tmp, table);
                        }
                        if (range1 > range2) {
                            tmp = range1; range1 = range2; range2 = tmp; // swap
                        }
                        return (result >= range1 && result <= range2) || (range1 === '' || range2 === '');
                    }
                    return null;
                },
                // Look for wild card: ? = single, * = multiple, or | = logical OR
                wild: function (c, data) {
                    if (tsfRegex.wildOrTest.test(data.iFilter)) {
                        var query = '' + (tsf.parseFilter(c, data.iFilter, data) || '');
                        // look for an exact match with the 'or' unless the 'filter-match' class is found
                        if (!tsfRegex.wildTest.test(query) && data.nestedFilters) {
                            query = data.isMatch ? query : '^(' + query + ')$';
                        }
                        // parsing the filter may not work properly when using wildcards =/
                        try {
                            return new RegExp(
                                query.replace(tsfRegex.wild01, '\\S{1}').replace(tsfRegex.wild0More, '\\S*'),
                                c.widgetOptions.filter_ignoreCase ? 'i' : ''
                            )
                                .test(data.exact);
                        } catch (error) {
                            return null;
                        }
                    }
                    return null;
                },
                // fuzzy text search; modified from https://github.com/mattyork/fuzzy ( MIT license )
                fuzzy: function (c, data) {
                    if (tsfRegex.fuzzyTest.test(data.iFilter)) {
                        var indx,
                            patternIndx = 0,
                            len = data.iExact.length,
                            txt = data.iFilter.slice(1),
                            pattern = tsf.parseFilter(c, txt, data) || '';
                        for (indx = 0; indx < len; indx++) {
                            if (data.iExact[indx] === pattern[patternIndx]) {
                                patternIndx += 1;
                            }
                        }
                        return patternIndx === pattern.length;
                    }
                    return null;
                }
            },
            init: function (table) {
                // filter language options
                ts.language = $.extend(true, {}, {
                    to: 'to',
                    or: 'or',
                    and: 'and'
                }, ts.language);

                var options, string, txt, $header, column, val, fxn, noSelect,
                    c = table.config,
                    wo = c.widgetOptions,
                    processStr = function (prefix, str, suffix) {
                        str = str.trim();
                        // don't include prefix/suffix if str is empty
                        return str === '' ? '' : (prefix || '') + str + (suffix || '');
                    };
                c.$table.addClass('hasFilters');
                c.lastSearch = [];

                // define timers so using clearTimeout won't cause an undefined error
                wo.filter_searchTimer = null;
                wo.filter_initTimer = null;
                wo.filter_formatterCount = 0;
                wo.filter_formatterInit = [];
                wo.filter_anyColumnSelector = '[data-column="all"],[data-column="any"]';
                wo.filter_multipleColumnSelector = '[data-column*="-"],[data-column*=","]';

                val = '\\{' + tsfRegex.query + '\\}';
                $.extend(tsfRegex, {
                    child: new RegExp(c.cssChildRow),
                    filtered: new RegExp(wo.filter_filteredRow),
                    alreadyFiltered: new RegExp('(\\s+(-' + processStr('|', ts.language.or) + processStr('|', ts.language.to) + ')\\s+)', 'i'),
                    toTest: new RegExp('\\s+(-' + processStr('|', ts.language.to) + ')\\s+', 'i'),
                    toSplit: new RegExp('(?:\\s+(?:-' + processStr('|', ts.language.to) + ')\\s+)', 'gi'),
                    andTest: new RegExp('\\s+(' + processStr('', ts.language.and, '|') + '&&)\\s+', 'i'),
                    andSplit: new RegExp('(?:\\s+(?:' + processStr('', ts.language.and, '|') + '&&)\\s+)', 'gi'),
                    orTest: new RegExp('(\\|' + processStr('|\\s+', ts.language.or, '\\s+') + ')', 'i'),
                    orSplit: new RegExp('(?:\\|' + processStr('|\\s+(?:', ts.language.or, ')\\s+') + ')', 'gi'),
                    iQuery: new RegExp(val, 'i'),
                    igQuery: new RegExp(val, 'ig'),
                    operTest: /^[<>]=?/,
                    gtTest: />/,
                    gteTest: />=/,
                    ltTest: /</,
                    lteTest: /<=/,
                    notTest: /^\!/,
                    wildOrTest: /[\?\*\|]/,
                    wildTest: /\?\*/,
                    fuzzyTest: /^~/,
                    exactTest: /[=\"\|!]/
                });

                // don't build filter row if columnFilters is false or all columns are set to 'filter-false'
                // see issue #156
                val = c.$headers.filter('.filter-false, .parser-false').length;
                if (wo.filter_columnFilters !== false && val !== c.$headers.length) {
                    // build filter row
                    tsf.buildRow(table, c, wo);
                }

                txt = 'addRows updateCell update updateRows updateComplete appendCache filterReset ' +
                    'filterAndSortReset filterResetSaved filterEnd search '.split(' ').join(c.namespace + 'filter ');
                c.$table.bind(txt, function (event, filter) {
                    val = wo.filter_hideEmpty &&
                        $.isEmptyObject(c.cache) &&
                        !(c.delayInit && event.type === 'appendCache');
                    // hide filter row using the 'filtered' class name
                    c.$table.find('.' + tscss.filterRow).toggleClass(wo.filter_filteredRow, val); // fixes #450
                    if (!/(search|filter)/.test(event.type)) {
                        event.stopPropagation();
                        tsf.buildDefault(table, true);
                    }
                    // Add filterAndSortReset - see #1361
                    if (event.type === 'filterReset' || event.type === 'filterAndSortReset') {
                        c.$table.find('.' + tscss.filter).add(wo.filter_$externalFilters).val('');
                        if (event.type === 'filterAndSortReset') {
                            ts.sortReset(this.config, function () {
                                tsf.searching(table, []);
                            });
                        } else {
                            tsf.searching(table, []);
                        }
                    } else if (event.type === 'filterResetSaved') {
                        ts.storage(table, 'tablesorter-filters', '');
                    } else if (event.type === 'filterEnd') {
                        tsf.buildDefault(table, true);
                    } else {
                        // send false argument to force a new search; otherwise if the filter hasn't changed,
                        // it will return
                        filter = event.type === 'search' ? filter :
                            event.type === 'updateComplete' ? c.$table.data('lastSearch') : '';
                        if (/(update|add)/.test(event.type) && event.type !== 'updateComplete') {
                            // force a new search since content has changed
                            c.lastCombinedFilter = null;
                            c.lastSearch = [];
                            // update filterFormatters after update (& small delay) - Fixes #1237
                            setTimeout(function () {
                                c.$table.triggerHandler('filterFomatterUpdate');
                            }, 100);
                        }
                        // pass true ( skipFirst ) to prevent the tablesorter.setFilters function from skipping the first
                        // input ensures all inputs are updated when a search is triggered on the table
                        // $( 'table' ).trigger( 'search', [...] );
                        tsf.searching(table, filter, true);
                    }
                    return false;
                });

                // reset button/link
                if (wo.filter_reset) {
                    if (wo.filter_reset instanceof $) {
                        // reset contains a jQuery object, bind to it
                        wo.filter_reset.click(function () {
                            c.$table.triggerHandler('filterReset');
                        });
                    } else if ($(wo.filter_reset).length) {
                        // reset is a jQuery selector, use event delegation
                        $(document)
                            .undelegate(wo.filter_reset, 'click' + c.namespace + 'filter')
                            .delegate(wo.filter_reset, 'click' + c.namespace + 'filter', function () {
                                // trigger a reset event, so other functions ( filter_formatter ) know when to reset
                                c.$table.triggerHandler('filterReset');
                            });
                    }
                }
                if (wo.filter_functions) {
                    for (column = 0; column < c.columns; column++) {
                        fxn = ts.getColumnData(table, wo.filter_functions, column);
                        if (fxn) {
                            // remove 'filter-select' from header otherwise the options added here are replaced with
                            // all options
                            $header = c.$headerIndexed[column].removeClass('filter-select');
                            // don't build select if 'filter-false' or 'parser-false' set
                            noSelect = !($header.hasClass('filter-false') || $header.hasClass('parser-false'));
                            options = '';
                            if (fxn === true && noSelect) {
                                tsf.buildSelect(table, column);
                            } else if (typeof fxn === 'object' && noSelect) {
                                // add custom drop down list
                                for (string in fxn) {
                                    if (typeof string === 'string') {
                                        options += options === '' ?
                                            '<option value="">' +
                                            ($header.data('placeholder') ||
                                                $header.attr('data-placeholder') ||
                                                wo.filter_placeholder.select ||
                                                ''
                                            ) +
                                            '</option>' : '';
                                        val = string;
                                        txt = string;
                                        if (string.indexOf(wo.filter_selectSourceSeparator) >= 0) {
                                            val = string.split(wo.filter_selectSourceSeparator);
                                            txt = val[1];
                                            val = val[0];
                                        }
                                        options += '<option ' +
                                            (txt === val ? '' : 'data-function-name="' + string + '" ') +
                                            'value="' + val + '">' + txt + '</option>';
                                    }
                                }
                                c.$table
                                    .find('thead')
                                    .find('select.' + tscss.filter + '[data-column="' + column + '"]')
                                    .append(options);
                                txt = wo.filter_selectSource;
                                fxn = typeof txt === 'function' ? true : ts.getColumnData(table, txt, column);
                                if (fxn) {
                                    // updating so the extra options are appended
                                    tsf.buildSelect(c.table, column, '', true, $header.hasClass(wo.filter_onlyAvail));
                                }
                            }
                        }
                    }
                }
                // not really updating, but if the column has both the 'filter-select' class &
                // filter_functions set to true, it would append the same options twice.
                tsf.buildDefault(table, true);

                tsf.bindSearch(table, c.$table.find('.' + tscss.filter), true);
                if (wo.filter_external) {
                    tsf.bindSearch(table, wo.filter_external);
                }

                if (wo.filter_hideFilters) {
                    tsf.hideFilters(c);
                }

                // show processing icon
                if (c.showProcessing) {
                    txt = 'filterStart filterEnd '.split(' ').join(c.namespace + 'filter-sp ');
                    c.$table
                        .unbind(txt.replace(ts.regex.spaces, ' '))
                        .bind(txt, function (event, columns) {
                            // only add processing to certain columns to all columns
                            $header = (columns) ?
                                c.$table
                                    .find('.' + tscss.header)
                                    .filter('[data-column]')
                                    .filter(function () {
                                        return columns[$(this).data('column')] !== '';
                                    }) : '';
                            ts.isProcessing(table, event.type === 'filterStart', columns ? $header : '');
                        });
                }

                // set filtered rows count ( intially unfiltered )
                c.filteredRows = c.totalRows;

                // add default values
                txt = 'tablesorter-initialized pagerBeforeInitialized '.split(' ').join(c.namespace + 'filter ');
                c.$table
                    .unbind(txt.replace(ts.regex.spaces, ' '))
                    .bind(txt, function () {
                        tsf.completeInit(this);
                    });
                // if filter widget is added after pager has initialized; then set filter init flag
                if (c.pager && c.pager.initialized && !wo.filter_initialized) {
                    c.$table.triggerHandler('filterFomatterUpdate');
                    setTimeout(function () {
                        tsf.filterInitComplete(c);
                    }, 100);
                } else if (!wo.filter_initialized) {
                    tsf.completeInit(table);
                }
            },
            completeInit: function (table) {
                // redefine 'c' & 'wo' so they update properly inside this callback
                var c = table.config,
                    wo = c.widgetOptions,
                    filters = tsf.setDefaults(table, c, wo) || [];
                if (filters.length) {
                    // prevent delayInit from triggering a cache build if filters are empty
                    if (!(c.delayInit && filters.join('') === '')) {
                        ts.setFilters(table, filters, true);
                    }
                }
                c.$table.triggerHandler('filterFomatterUpdate');
                // trigger init after setTimeout to prevent multiple filterStart/End/Init triggers
                setTimeout(function () {
                    if (!wo.filter_initialized) {
                        tsf.filterInitComplete(c);
                    }
                }, 100);
            },

            // $cell parameter, but not the config, is passed to the filter_formatters,
            // so we have to work with it instead
            formatterUpdated: function ($cell, column) {
                // prevent error if $cell is undefined - see #1056
                var $table = $cell && $cell.closest('table');
                var config = $table.length && $table[0].config,
                    wo = config && config.widgetOptions;
                if (wo && !wo.filter_initialized) {
                    // add updates by column since this function
                    // may be called numerous times before initialization
                    wo.filter_formatterInit[column] = 1;
                }
            },
            filterInitComplete: function (c) {
                var indx, len,
                    wo = c.widgetOptions,
                    count = 0,
                    completed = function () {
                        wo.filter_initialized = true;
                        // update lastSearch - it gets cleared often
                        c.lastSearch = c.$table.data('lastSearch');
                        c.$table.triggerHandler('filterInit', c);
                        tsf.findRows(c.table, c.lastSearch || []);
                        if (ts.debug(c, 'filter')) {
                            console.log('Filter >> Widget initialized');
                        }
                    };
                if ($.isEmptyObject(wo.filter_formatter)) {
                    completed();
                } else {
                    len = wo.filter_formatterInit.length;
                    for (indx = 0; indx < len; indx++) {
                        if (wo.filter_formatterInit[indx] === 1) {
                            count++;
                        }
                    }
                    clearTimeout(wo.filter_initTimer);
                    if (!wo.filter_initialized && count === wo.filter_formatterCount) {
                        // filter widget initialized
                        completed();
                    } else if (!wo.filter_initialized) {
                        // fall back in case a filter_formatter doesn't call
                        // $.tablesorter.filter.formatterUpdated( $cell, column ), and the count is off
                        wo.filter_initTimer = setTimeout(function () {
                            completed();
                        }, 500);
                    }
                }
            },
            // encode or decode filters for storage; see #1026
            processFilters: function (filters, encode) {
                var indx,
                    // fixes #1237; previously returning an encoded "filters" value
                    result = [],
                    mode = encode ? encodeURIComponent : decodeURIComponent,
                    len = filters.length;
                for (indx = 0; indx < len; indx++) {
                    if (filters[indx]) {
                        result[indx] = mode(filters[indx]);
                    }
                }
                return result;
            },
            setDefaults: function (table, c, wo) {
                var isArray, saved, indx, col, $filters,
                    // get current ( default ) filters
                    filters = ts.getFilters(table) || [];
                if (wo.filter_saveFilters && ts.storage) {
                    saved = ts.storage(table, 'tablesorter-filters') || [];
                    isArray = $.isArray(saved);
                    // make sure we're not just getting an empty array
                    if (!(isArray && saved.join('') === '' || !isArray)) {
                        filters = tsf.processFilters(saved);
                    }
                }
                // if no filters saved, then check default settings
                if (filters.join('') === '') {
                    // allow adding default setting to external filters
                    $filters = c.$headers.add(wo.filter_$externalFilters)
                        .filter('[' + wo.filter_defaultAttrib + ']');
                    for (indx = 0; indx <= c.columns; indx++) {
                        // include data-column='all' external filters
                        col = indx === c.columns ? 'all' : indx;
                        filters[indx] = $filters
                            .filter('[data-column="' + col + '"]')
                            .attr(wo.filter_defaultAttrib) || filters[indx] || '';
                    }
                }
                c.$table.data('lastSearch', filters);
                return filters;
            },
            parseFilter: function (c, filter, data, parsed) {
                return parsed || data.parsed[data.index] ?
                    c.parsers[data.index].format(filter, c.table, [], data.index) :
                    filter;
            },
            buildRow: function (table, c, wo) {
                var $filter, col, column, $header, makeSelect, disabled, name, ffxn, tmp,
                    // c.columns defined in computeThIndexes()
                    cellFilter = wo.filter_cellFilter,
                    columns = c.columns,
                    arry = $.isArray(cellFilter),
                    buildFilter = '<tr role="search" class="' + tscss.filterRow + ' ' + c.cssIgnoreRow + '">';
                for (column = 0; column < columns; column++) {
                    if (c.$headerIndexed[column].length) {
                        // account for entire column set with colspan. See #1047
                        tmp = c.$headerIndexed[column] && c.$headerIndexed[column][0].colSpan || 0;
                        if (tmp > 1) {
                            buildFilter += '<td data-column="' + column + '-' + (column + tmp - 1) + '" colspan="' + tmp + '"';
                        } else {
                            buildFilter += '<td data-column="' + column + '"';
                        }
                        if (arry) {
                            buildFilter += (cellFilter[column] ? ' class="' + cellFilter[column] + '"' : '');
                        } else {
                            buildFilter += (cellFilter !== '' ? ' class="' + cellFilter + '"' : '');
                        }
                        buildFilter += '></td>';
                    }
                }
                c.$filters = $(buildFilter += '</tr>')
                    .appendTo(c.$table.children('thead').eq(0))
                    .children('td');
                // build each filter input
                for (column = 0; column < columns; column++) {
                    disabled = false;
                    // assuming last cell of a column is the main column
                    $header = c.$headerIndexed[column];
                    if ($header && $header.length) {
                        // $filter = c.$filters.filter( '[data-column="' + column + '"]' );
                        $filter = tsf.getColumnElm(c, c.$filters, column);
                        ffxn = ts.getColumnData(table, wo.filter_functions, column);
                        makeSelect = (wo.filter_functions && ffxn && typeof ffxn !== 'function') ||
                            $header.hasClass('filter-select');
                        // get data from jQuery data, metadata, headers option or header class name
                        col = ts.getColumnData(table, c.headers, column);
                        disabled = ts.getData($header[0], col, 'filter') === 'false' ||
                            ts.getData($header[0], col, 'parser') === 'false';

                        if (makeSelect) {
                            buildFilter = $('<select>').appendTo($filter);
                        } else {
                            ffxn = ts.getColumnData(table, wo.filter_formatter, column);
                            if (ffxn) {
                                wo.filter_formatterCount++;
                                buildFilter = ffxn($filter, column);
                                // no element returned, so lets go find it
                                if (buildFilter && buildFilter.length === 0) {
                                    buildFilter = $filter.children('input');
                                }
                                // element not in DOM, so lets attach it
                                if (buildFilter && (buildFilter.parent().length === 0 ||
                                    (buildFilter.parent().length && buildFilter.parent()[0] !== $filter[0]))) {
                                    $filter.append(buildFilter);
                                }
                            } else {
                                buildFilter = $('<input type="search">').appendTo($filter);
                            }
                            if (buildFilter) {
                                tmp = $header.data('placeholder') ||
                                    $header.attr('data-placeholder') ||
                                    wo.filter_placeholder.search || '';
                                buildFilter.attr('placeholder', tmp);
                            }
                        }
                        if (buildFilter) {
                            // add filter class name
                            name = ($.isArray(wo.filter_cssFilter) ?
                                (typeof wo.filter_cssFilter[column] !== 'undefined' ? wo.filter_cssFilter[column] || '' : '') :
                                wo.filter_cssFilter) || '';
                            // copy data-column from table cell (it will include colspan)
                            buildFilter.addClass(tscss.filter + ' ' + name);
                            name = wo.filter_filterLabel;
                            tmp = name.match(/{{([^}]+?)}}/g);
                            if (!tmp) {
                                tmp = ['{{label}}'];
                            }
                            $.each(tmp, function (indx, attr) {
                                var regex = new RegExp(attr, 'g'),
                                    data = $header.attr('data-' + attr.replace(/{{|}}/g, '')),
                                    text = typeof data === 'undefined' ? $header.text() : data;
                                name = name.replace(regex, $.trim(text));
                            });
                            buildFilter.attr({
                                'data-column': $filter.attr('data-column'),
                                'aria-label': name
                            });
                            if (disabled) {
                                buildFilter.attr('placeholder', '').addClass(tscss.filterDisabled)[0].disabled = true;
                            }
                        }
                    }
                }
            },
            bindSearch: function (table, $el, internal) {
                table = $(table)[0];
                $el = $($el); // allow passing a selector string
                if (!$el.length) { return; }
                var tmp,
                    c = table.config,
                    wo = c.widgetOptions,
                    namespace = c.namespace + 'filter',
                    $ext = wo.filter_$externalFilters;
                if (internal !== true) {
                    // save anyMatch element
                    tmp = wo.filter_anyColumnSelector + ',' + wo.filter_multipleColumnSelector;
                    wo.filter_$anyMatch = $el.filter(tmp);
                    if ($ext && $ext.length) {
                        wo.filter_$externalFilters = wo.filter_$externalFilters.add($el);
                    } else {
                        wo.filter_$externalFilters = $el;
                    }
                    // update values ( external filters added after table initialization )
                    ts.setFilters(table, c.$table.data('lastSearch') || [], internal === false);
                }
                // unbind events
                tmp = ('keypress keyup keydown search change input '.split(' ').join(namespace + ' '));
                $el
                    // use data attribute instead of jQuery data since the head is cloned without including
                    // the data/binding
                    .attr('data-lastSearchTime', new Date().getTime())
                    .unbind(tmp.replace(ts.regex.spaces, ' '))
                    .bind('keydown' + namespace, function (event) {
                        if (event.which === tskeyCodes.escape && !table.config.widgetOptions.filter_resetOnEsc) {
                            // prevent keypress event
                            return false;
                        }
                    })
                    .bind('keyup' + namespace, function (event) {
                        wo = table.config.widgetOptions; // make sure "wo" isn't cached
                        var column = parseInt($(this).attr('data-column'), 10),
                            liveSearch = typeof wo.filter_liveSearch === 'boolean' ? wo.filter_liveSearch :
                                ts.getColumnData(table, wo.filter_liveSearch, column);
                        if (typeof liveSearch === 'undefined') {
                            liveSearch = wo.filter_liveSearch.fallback || false;
                        }
                        $(this).attr('data-lastSearchTime', new Date().getTime());
                        // emulate what webkit does.... escape clears the filter
                        if (event.which === tskeyCodes.escape) {
                            // make sure to restore the last value on escape
                            this.value = wo.filter_resetOnEsc ? '' : c.lastSearch[column];
                            // don't return if the search value is empty ( all rows need to be revealed )
                        } else if (this.value !== '' && (
                            // liveSearch can contain a min value length; ignore arrow and meta keys, but allow backspace
                            (typeof liveSearch === 'number' && this.value.length < liveSearch) ||
                            // let return & backspace continue on, but ignore arrows & non-valid characters
                            (event.which !== tskeyCodes.enter && event.which !== tskeyCodes.backSpace &&
                                (event.which < tskeyCodes.space || (event.which >= tskeyCodes.left && event.which <= tskeyCodes.down))))) {
                            return;
                            // live search
                        } else if (liveSearch === false) {
                            if (this.value !== '' && event.which !== tskeyCodes.enter) {
                                return;
                            }
                        }
                        // change event = no delay; last true flag tells getFilters to skip newest timed input
                        tsf.searching(table, true, true, column);
                    })
                    // include change for select - fixes #473
                    .bind('search change keypress input blur '.split(' ').join(namespace + ' '), function (event) {
                        // don't get cached data, in case data-column changes dynamically
                        var column = parseInt($(this).attr('data-column'), 10),
                            eventType = event.type,
                            liveSearch = typeof wo.filter_liveSearch === 'boolean' ?
                                wo.filter_liveSearch :
                                ts.getColumnData(table, wo.filter_liveSearch, column);
                        if (table.config.widgetOptions.filter_initialized &&
                            // immediate search if user presses enter
                            (event.which === tskeyCodes.enter ||
                                // immediate search if a "search" or "blur" is triggered on the input
                                (eventType === 'search' || eventType === 'blur') ||
                                // change & input events must be ignored if liveSearch !== true
                                (eventType === 'change' || eventType === 'input') &&
                                // prevent search if liveSearch is a number
                                (liveSearch === true || liveSearch !== true && event.target.nodeName !== 'INPUT') &&
                                // don't allow 'change' or 'input' event to process if the input value
                                // is the same - fixes #685
                                this.value !== c.lastSearch[column]
                            )
                        ) {
                            event.preventDefault();
                            // init search with no delay
                            $(this).attr('data-lastSearchTime', new Date().getTime());
                            tsf.searching(table, eventType !== 'keypress' || event.which === tskeyCodes.enter, true, column);
                        }
                    });
            },
            searching: function (table, filter, skipFirst, column) {
                var liveSearch,
                    wo = table.config.widgetOptions;
                if (typeof column === 'undefined') {
                    // no delay
                    liveSearch = false;
                } else {
                    liveSearch = typeof wo.filter_liveSearch === 'boolean' ?
                        wo.filter_liveSearch :
                        // get column setting, or set to fallback value, or default to false
                        ts.getColumnData(table, wo.filter_liveSearch, column);
                    if (typeof liveSearch === 'undefined') {
                        liveSearch = wo.filter_liveSearch.fallback || false;
                    }
                }
                clearTimeout(wo.filter_searchTimer);
                if (typeof filter === 'undefined' || filter === true) {
                    // delay filtering
                    wo.filter_searchTimer = setTimeout(function () {
                        tsf.checkFilters(table, filter, skipFirst);
                    }, liveSearch ? wo.filter_searchDelay : 10);
                } else {
                    // skip delay
                    tsf.checkFilters(table, filter, skipFirst);
                }
            },
            equalFilters: function (c, filter1, filter2) {
                var indx,
                    f1 = [],
                    f2 = [],
                    len = c.columns + 1; // add one to include anyMatch filter
                filter1 = $.isArray(filter1) ? filter1 : [];
                filter2 = $.isArray(filter2) ? filter2 : [];
                for (indx = 0; indx < len; indx++) {
                    f1[indx] = filter1[indx] || '';
                    f2[indx] = filter2[indx] || '';
                }
                return f1.join(',') === f2.join(',');
            },
            checkFilters: function (table, filter, skipFirst) {
                var c = table.config,
                    wo = c.widgetOptions,
                    filterArray = $.isArray(filter),
                    filters = (filterArray) ? filter : ts.getFilters(table, true),
                    currentFilters = filters || []; // current filter values
                // prevent errors if delay init is set
                if ($.isEmptyObject(c.cache)) {
                    // update cache if delayInit set & pager has initialized ( after user initiates a search )
                    if (c.delayInit && (!c.pager || c.pager && c.pager.initialized)) {
                        ts.updateCache(c, function () {
                            tsf.checkFilters(table, false, skipFirst);
                        });
                    }
                    return;
                }
                // add filter array back into inputs
                if (filterArray) {
                    ts.setFilters(table, filters, false, skipFirst !== true);
                    if (!wo.filter_initialized) {
                        c.lastSearch = [];
                        c.lastCombinedFilter = '';
                    }
                }
                if (wo.filter_hideFilters) {
                    // show/hide filter row as needed
                    c.$table
                        .find('.' + tscss.filterRow)
                        .triggerHandler(tsf.hideFiltersCheck(c) ? 'mouseleave' : 'mouseenter');
                }
                // return if the last search is the same; but filter === false when updating the search
                // see example-widget-filter.html filter toggle buttons
                if (tsf.equalFilters(c, c.lastSearch, currentFilters)) {
                    if (filter !== false) {
                        return;
                    } else {
                        // force filter refresh
                        c.lastCombinedFilter = '';
                        c.lastSearch = [];
                    }
                }
                // define filter inside it is false
                filters = filters || [];
                // convert filters to strings - see #1070
                filters = Array.prototype.map ?
                    filters.map(String) :
                    // for IE8 & older browsers - maybe not the best method
                    filters.join('\ufffd').split('\ufffd');

                if (wo.filter_initialized) {
                    c.$table.triggerHandler('filterStart', [filters]);
                }
                if (c.showProcessing) {
                    // give it time for the processing icon to kick in
                    setTimeout(function () {
                        tsf.findRows(table, filters, currentFilters);
                        return false;
                    }, 30);
                } else {
                    tsf.findRows(table, filters, currentFilters);
                    return false;
                }
            },
            hideFiltersCheck: function (c) {
                if (typeof c.widgetOptions.filter_hideFilters === 'function') {
                    var val = c.widgetOptions.filter_hideFilters(c);
                    if (typeof val === 'boolean') {
                        return val;
                    }
                }
                return ts.getFilters(c.$table).join('') === '';
            },
            hideFilters: function (c, $table) {
                var timer;
                ($table || c.$table)
                    .find('.' + tscss.filterRow)
                    .addClass(tscss.filterRowHide)
                    .bind('mouseenter mouseleave', function (e) {
                        // save event object - http://bugs.jquery.com/ticket/12140
                        var event = e,
                            $row = $(this);
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            if (/enter|over/.test(event.type)) {
                                $row.removeClass(tscss.filterRowHide);
                            } else {
                                // don't hide if input has focus
                                // $( ':focus' ) needs jQuery 1.6+
                                if ($(document.activeElement).closest('tr')[0] !== $row[0]) {
                                    // don't hide row if any filter has a value
                                    $row.toggleClass(tscss.filterRowHide, tsf.hideFiltersCheck(c));
                                }
                            }
                        }, 200);
                    })
                    .find('input, select').bind('focus blur', function (e) {
                        var event = e,
                            $row = $(this).closest('tr');
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            clearTimeout(timer);
                            // don't hide row if any filter has a value
                            $row.toggleClass(tscss.filterRowHide, tsf.hideFiltersCheck(c) && event.type !== 'focus');
                        }, 200);
                    });
            },
            defaultFilter: function (filter, mask) {
                if (filter === '') { return filter; }
                var regex = tsfRegex.iQuery,
                    maskLen = mask.match(tsfRegex.igQuery).length,
                    query = maskLen > 1 ? $.trim(filter).split(/\s/) : [$.trim(filter)],
                    len = query.length - 1,
                    indx = 0,
                    val = mask;
                if (len < 1 && maskLen > 1) {
                    // only one 'word' in query but mask has >1 slots
                    query[1] = query[0];
                }
                // replace all {query} with query words...
                // if query = 'Bob', then convert mask from '!{query}' to '!Bob'
                // if query = 'Bob Joe Frank', then convert mask '{q} OR {q}' to 'Bob OR Joe OR Frank'
                while (regex.test(val)) {
                    val = val.replace(regex, query[indx++] || '');
                    if (regex.test(val) && indx < len && (query[indx] || '') !== '') {
                        val = mask.replace(regex, val);
                    }
                }
                return val;
            },
            getLatestSearch: function ($input) {
                if ($input) {
                    return $input.sort(function (a, b) {
                        return $(b).attr('data-lastSearchTime') - $(a).attr('data-lastSearchTime');
                    });
                }
                return $input || $();
            },
            findRange: function (c, val, ignoreRanges) {
                // look for multiple columns '1-3,4-6,8' in data-column
                var temp, ranges, range, start, end, singles, i, indx, len,
                    columns = [];
                if (/^[0-9]+$/.test(val)) {
                    // always return an array
                    return [parseInt(val, 10)];
                }
                // process column range
                if (!ignoreRanges && /-/.test(val)) {
                    ranges = val.match(/(\d+)\s*-\s*(\d+)/g);
                    len = ranges ? ranges.length : 0;
                    for (indx = 0; indx < len; indx++) {
                        range = ranges[indx].split(/\s*-\s*/);
                        start = parseInt(range[0], 10) || 0;
                        end = parseInt(range[1], 10) || (c.columns - 1);
                        if (start > end) {
                            temp = start; start = end; end = temp; // swap
                        }
                        if (end >= c.columns) {
                            end = c.columns - 1;
                        }
                        for (; start <= end; start++) {
                            columns[columns.length] = start;
                        }
                        // remove processed range from val
                        val = val.replace(ranges[indx], '');
                    }
                }
                // process single columns
                if (!ignoreRanges && /,/.test(val)) {
                    singles = val.split(/\s*,\s*/);
                    len = singles.length;
                    for (i = 0; i < len; i++) {
                        if (singles[i] !== '') {
                            indx = parseInt(singles[i], 10);
                            if (indx < c.columns) {
                                columns[columns.length] = indx;
                            }
                        }
                    }
                }
                // return all columns
                if (!columns.length) {
                    for (indx = 0; indx < c.columns; indx++) {
                        columns[columns.length] = indx;
                    }
                }
                return columns;
            },
            getColumnElm: function (c, $elements, column) {
                // data-column may contain multiple columns '1-3,5-6,8'
                // replaces: c.$filters.filter( '[data-column="' + column + '"]' );
                return $elements.filter(function () {
                    var cols = tsf.findRange(c, $(this).attr('data-column'));
                    return $.inArray(column, cols) > -1;
                });
            },
            multipleColumns: function (c, $input) {
                // look for multiple columns '1-3,4-6,8' in data-column
                var wo = c.widgetOptions,
                    // only target 'all' column inputs on initialization
                    // & don't target 'all' column inputs if they don't exist
                    targets = wo.filter_initialized || !$input.filter(wo.filter_anyColumnSelector).length,
                    val = $.trim(tsf.getLatestSearch($input).attr('data-column') || '');
                return tsf.findRange(c, val, !targets);
            },
            processTypes: function (c, data, vars) {
                var ffxn,
                    filterMatched = null,
                    matches = null;
                for (ffxn in tsf.types) {
                    if ($.inArray(ffxn, vars.excludeMatch) < 0 && matches === null) {
                        matches = tsf.types[ffxn](c, data, vars);
                        if (matches !== null) {
                            data.matchedOn = ffxn;
                            filterMatched = matches;
                        }
                    }
                }
                return filterMatched;
            },
            matchType: function (c, columnIndex) {
                var isMatch,
                    wo = c.widgetOptions,
                    $el = c.$headerIndexed[columnIndex];
                // filter-exact > filter-match > filter_matchType for type
                if ($el.hasClass('filter-exact')) {
                    isMatch = false;
                } else if ($el.hasClass('filter-match')) {
                    isMatch = true;
                } else {
                    // filter-select is not applied when filter_functions are used, so look for a select
                    if (wo.filter_columnFilters) {
                        $el = c.$filters
                            .find('.' + tscss.filter)
                            .add(wo.filter_$externalFilters)
                            .filter('[data-column="' + columnIndex + '"]');
                    } else if (wo.filter_$externalFilters) {
                        $el = wo.filter_$externalFilters.filter('[data-column="' + columnIndex + '"]');
                    }
                    isMatch = $el.length ?
                        c.widgetOptions.filter_matchType[($el[0].nodeName || '').toLowerCase()] === 'match' :
                        // default to exact, if no inputs found
                        false;
                }
                return isMatch;
            },
            processRow: function (c, data, vars) {
                var result, filterMatched,
                    fxn, ffxn, txt,
                    wo = c.widgetOptions,
                    showRow = true,
                    hasAnyMatchInput = wo.filter_$anyMatch && wo.filter_$anyMatch.length,

                    // if wo.filter_$anyMatch data-column attribute is changed dynamically
                    // we don't want to do an "anyMatch" search on one column using data
                    // for the entire row - see #998
                    columnIndex = wo.filter_$anyMatch && wo.filter_$anyMatch.length ?
                        // look for multiple columns '1-3,4-6,8'
                        tsf.multipleColumns(c, wo.filter_$anyMatch) :
                        [];
                data.$cells = data.$row.children();
                data.matchedOn = null;
                if (data.anyMatchFlag && columnIndex.length > 1 || (data.anyMatchFilter && !hasAnyMatchInput)) {
                    data.anyMatch = true;
                    data.isMatch = true;
                    data.rowArray = data.$cells.map(function (i) {
                        if ($.inArray(i, columnIndex) > -1 || (data.anyMatchFilter && !hasAnyMatchInput)) {
                            if (data.parsed[i]) {
                                txt = data.cacheArray[i];
                            } else {
                                txt = data.rawArray[i];
                                txt = $.trim(wo.filter_ignoreCase ? txt.toLowerCase() : txt);
                                if (c.sortLocaleCompare) {
                                    txt = ts.replaceAccents(txt);
                                }
                            }
                            return txt;
                        }
                    }).get();
                    data.filter = data.anyMatchFilter;
                    data.iFilter = data.iAnyMatchFilter;
                    data.exact = data.rowArray.join(' ');
                    data.iExact = wo.filter_ignoreCase ? data.exact.toLowerCase() : data.exact;
                    data.cache = data.cacheArray.slice(0, -1).join(' ');
                    vars.excludeMatch = vars.noAnyMatch;
                    filterMatched = tsf.processTypes(c, data, vars);
                    if (filterMatched !== null) {
                        showRow = filterMatched;
                    } else {
                        if (wo.filter_startsWith) {
                            showRow = false;
                            // data.rowArray may not contain all columns
                            columnIndex = Math.min(c.columns, data.rowArray.length);
                            while (!showRow && columnIndex > 0) {
                                columnIndex--;
                                showRow = showRow || data.rowArray[columnIndex].indexOf(data.iFilter) === 0;
                            }
                        } else {
                            showRow = (data.iExact + data.childRowText).indexOf(data.iFilter) >= 0;
                        }
                    }
                    data.anyMatch = false;
                    // no other filters to process
                    if (data.filters.join('') === data.filter) {
                        return showRow;
                    }
                }

                for (columnIndex = 0; columnIndex < c.columns; columnIndex++) {
                    data.filter = data.filters[columnIndex];
                    data.index = columnIndex;

                    // filter types to exclude, per column
                    vars.excludeMatch = vars.excludeFilter[columnIndex];

                    // ignore if filter is empty or disabled
                    if (data.filter) {
                        data.cache = data.cacheArray[columnIndex];
                        result = data.parsed[columnIndex] ? data.cache : data.rawArray[columnIndex] || '';
                        data.exact = c.sortLocaleCompare ? ts.replaceAccents(result) : result; // issue #405
                        data.iExact = !tsfRegex.type.test(typeof data.exact) && wo.filter_ignoreCase ?
                            data.exact.toLowerCase() : data.exact;
                        data.isMatch = tsf.matchType(c, columnIndex);

                        result = showRow; // if showRow is true, show that row

                        // in case select filter option has a different value vs text 'a - z|A through Z'
                        ffxn = wo.filter_columnFilters ?
                            c.$filters.add(wo.filter_$externalFilters)
                                .filter('[data-column="' + columnIndex + '"]')
                                .find('select option:selected')
                                .attr('data-function-name') || '' : '';
                        // replace accents - see #357
                        if (c.sortLocaleCompare) {
                            data.filter = ts.replaceAccents(data.filter);
                        }

                        // replace column specific default filters - see #1088
                        if (wo.filter_defaultFilter && tsfRegex.iQuery.test(vars.defaultColFilter[columnIndex])) {
                            data.filter = tsf.defaultFilter(data.filter, vars.defaultColFilter[columnIndex]);
                        }

                        // data.iFilter = case insensitive ( if wo.filter_ignoreCase is true ),
                        // data.filter = case sensitive
                        data.iFilter = wo.filter_ignoreCase ? (data.filter || '').toLowerCase() : data.filter;
                        fxn = vars.functions[columnIndex];
                        filterMatched = null;
                        if (fxn) {
                            if (typeof fxn === 'function') {
                                // filter callback( exact cell content, parser normalized content,
                                // filter input value, column index, jQuery row object )
                                filterMatched = fxn(data.exact, data.cache, data.filter, columnIndex, data.$row, c, data);
                            } else if (typeof fxn[ffxn || data.filter] === 'function') {
                                // selector option function
                                txt = ffxn || data.filter;
                                filterMatched =
                                    fxn[txt](data.exact, data.cache, data.filter, columnIndex, data.$row, c, data);
                            }
                        }
                        if (filterMatched === null) {
                            // cycle through the different filters
                            // filters return a boolean or null if nothing matches
                            filterMatched = tsf.processTypes(c, data, vars);
                            // select with exact match; ignore "and" or "or" within the text; fixes #1486
                            txt = fxn === true && (data.matchedOn === 'and' || data.matchedOn === 'or');
                            if (filterMatched !== null && !txt) {
                                result = filterMatched;
                                // Look for match, and add child row data for matching
                            } else {
                                // check fxn (filter-select in header) after filter types are checked
                                // without this, the filter + jQuery UI selectmenu demo was breaking
                                if (fxn === true) {
                                    // default selector uses exact match unless 'filter-match' class is found
                                    result = data.isMatch ?
                                        // data.iExact may be a number
                                        ('' + data.iExact).search(data.iFilter) >= 0 :
                                        data.filter === data.exact;
                                } else {
                                    txt = (data.iExact + data.childRowText).indexOf(tsf.parseFilter(c, data.iFilter, data));
                                    result = ((!wo.filter_startsWith && txt >= 0) || (wo.filter_startsWith && txt === 0));
                                }
                            }
                        } else {
                            result = filterMatched;
                        }
                        showRow = (result) ? showRow : false;
                    }
                }
                return showRow;
            },
            findRows: function (table, filters, currentFilters) {
                if (
                    tsf.equalFilters(table.config, table.config.lastSearch, currentFilters) ||
                    !table.config.widgetOptions.filter_initialized
                ) {
                    return;
                }
                var len, norm_rows, rowData, $rows, $row, rowIndex, tbodyIndex, $tbody, columnIndex,
                    isChild, childRow, lastSearch, showRow, showParent, time, val, indx,
                    notFiltered, searchFiltered, query, injected, res, id, txt,
                    storedFilters = $.extend([], filters),
                    c = table.config,
                    wo = c.widgetOptions,
                    debug = ts.debug(c, 'filter'),
                    // data object passed to filters; anyMatch is a flag for the filters
                    data = {
                        anyMatch: false,
                        filters: filters,
                        // regex filter type cache
                        filter_regexCache: []
                    },
                    vars = {
                        // anyMatch really screws up with these types of filters
                        noAnyMatch: ['range', 'operators'],
                        // cache filter variables that use ts.getColumnData in the main loop
                        functions: [],
                        excludeFilter: [],
                        defaultColFilter: [],
                        defaultAnyFilter: ts.getColumnData(table, wo.filter_defaultFilter, c.columns, true) || ''
                    };
                // parse columns after formatter, in case the class is added at that point
                data.parsed = [];
                for (columnIndex = 0; columnIndex < c.columns; columnIndex++) {
                    data.parsed[columnIndex] = wo.filter_useParsedData ||
                        // parser has a "parsed" parameter
                        (c.parsers && c.parsers[columnIndex] && c.parsers[columnIndex].parsed ||
                            // getData may not return 'parsed' if other 'filter-' class names exist
                            // ( e.g. <th class="filter-select filter-parsed"> )
                            ts.getData && ts.getData(c.$headerIndexed[columnIndex],
                                ts.getColumnData(table, c.headers, columnIndex), 'filter') === 'parsed' ||
                            c.$headerIndexed[columnIndex].hasClass('filter-parsed'));

                    vars.functions[columnIndex] =
                        ts.getColumnData(table, wo.filter_functions, columnIndex) ||
                        c.$headerIndexed[columnIndex].hasClass('filter-select');
                    vars.defaultColFilter[columnIndex] =
                        ts.getColumnData(table, wo.filter_defaultFilter, columnIndex) || '';
                    vars.excludeFilter[columnIndex] =
                        (ts.getColumnData(table, wo.filter_excludeFilter, columnIndex, true) || '').split(/\s+/);
                }

                if (debug) {
                    console.log('Filter >> Starting filter widget search', filters);
                    time = new Date();
                }
                // filtered rows count
                c.filteredRows = 0;
                c.totalRows = 0;
                currentFilters = (storedFilters || []);

                for (tbodyIndex = 0; tbodyIndex < c.$tbodies.length; tbodyIndex++) {
                    $tbody = ts.processTbody(table, c.$tbodies.eq(tbodyIndex), true);
                    // skip child rows & widget added ( removable ) rows - fixes #448 thanks to @hempel!
                    // $rows = $tbody.children( 'tr' ).not( c.selectorRemove );
                    columnIndex = c.columns;
                    // convert stored rows into a jQuery object
                    norm_rows = c.cache[tbodyIndex].normalized;
                    $rows = $($.map(norm_rows, function (el) {
                        return el[columnIndex].$row.get();
                    }));

                    if (currentFilters.join('') === '' || wo.filter_serversideFiltering) {
                        $rows
                            .removeClass(wo.filter_filteredRow)
                            .not('.' + c.cssChildRow)
                            .css('display', '');
                    } else {
                        // filter out child rows
                        $rows = $rows.not('.' + c.cssChildRow);
                        len = $rows.length;

                        if ((wo.filter_$anyMatch && wo.filter_$anyMatch.length) ||
                            typeof filters[c.columns] !== 'undefined') {
                            data.anyMatchFlag = true;
                            data.anyMatchFilter = '' + (
                                filters[c.columns] ||
                                wo.filter_$anyMatch && tsf.getLatestSearch(wo.filter_$anyMatch).val() ||
                                ''
                            );
                            if (wo.filter_columnAnyMatch) {
                                // specific columns search
                                query = data.anyMatchFilter.split(tsfRegex.andSplit);
                                injected = false;
                                for (indx = 0; indx < query.length; indx++) {
                                    res = query[indx].split(':');
                                    if (res.length > 1) {
                                        // make the column a one-based index ( non-developers start counting from one :P )
                                        if (isNaN(res[0])) {
                                            $.each(c.headerContent, function (i, txt) {
                                                // multiple matches are possible
                                                if (txt.toLowerCase().indexOf(res[0]) > -1) {
                                                    id = i;
                                                    filters[id] = res[1];
                                                }
                                            });
                                        } else {
                                            id = parseInt(res[0], 10) - 1;
                                        }
                                        if (id >= 0 && id < c.columns) { // if id is an integer
                                            filters[id] = res[1];
                                            query.splice(indx, 1);
                                            indx--;
                                            injected = true;
                                        }
                                    }
                                }
                                if (injected) {
                                    data.anyMatchFilter = query.join(' && ');
                                }
                            }
                        }

                        // optimize searching only through already filtered rows - see #313
                        searchFiltered = wo.filter_searchFiltered;
                        lastSearch = c.lastSearch || c.$table.data('lastSearch') || [];
                        if (searchFiltered) {
                            // cycle through all filters; include last ( columnIndex + 1 = match any column ). Fixes #669
                            for (indx = 0; indx < columnIndex + 1; indx++) {
                                val = filters[indx] || '';
                                // break out of loop if we've already determined not to search filtered rows
                                if (!searchFiltered) { indx = columnIndex; }
                                // search already filtered rows if...
                                searchFiltered = searchFiltered && lastSearch.length &&
                                    // there are no changes from beginning of filter
                                    val.indexOf(lastSearch[indx] || '') === 0 &&
                                    // if there is NOT a logical 'or', or range ( 'to' or '-' ) in the string
                                    !tsfRegex.alreadyFiltered.test(val) &&
                                    // if we are not doing exact matches, using '|' ( logical or ) or not '!'
                                    !tsfRegex.exactTest.test(val) &&
                                    // don't search only filtered if the value is negative
                                    // ( '> -10' => '> -100' will ignore hidden rows )
                                    !(tsfRegex.isNeg1.test(val) || tsfRegex.isNeg2.test(val)) &&
                                    // if filtering using a select without a 'filter-match' class ( exact match ) - fixes #593
                                    !(val !== '' && c.$filters && c.$filters.filter('[data-column="' + indx + '"]').find('select').length &&
                                        !tsf.matchType(c, indx));
                            }
                        }
                        notFiltered = $rows.not('.' + wo.filter_filteredRow).length;
                        // can't search when all rows are hidden - this happens when looking for exact matches
                        if (searchFiltered && notFiltered === 0) { searchFiltered = false; }
                        if (debug) {
                            console.log('Filter >> Searching through ' +
                                (searchFiltered && notFiltered < len ? notFiltered : 'all') + ' rows');
                        }
                        if (data.anyMatchFlag) {
                            if (c.sortLocaleCompare) {
                                // replace accents
                                data.anyMatchFilter = ts.replaceAccents(data.anyMatchFilter);
                            }
                            if (wo.filter_defaultFilter && tsfRegex.iQuery.test(vars.defaultAnyFilter)) {
                                data.anyMatchFilter = tsf.defaultFilter(data.anyMatchFilter, vars.defaultAnyFilter);
                                // clear search filtered flag because default filters are not saved to the last search
                                searchFiltered = false;
                            }
                            // make iAnyMatchFilter lowercase unless both filter widget & core ignoreCase options are true
                            // when c.ignoreCase is true, the cache contains all lower case data
                            data.iAnyMatchFilter = !(wo.filter_ignoreCase && c.ignoreCase) ?
                                data.anyMatchFilter :
                                data.anyMatchFilter.toLowerCase();
                        }

                        // loop through the rows
                        for (rowIndex = 0; rowIndex < len; rowIndex++) {

                            txt = $rows[rowIndex].className;
                            // the first row can never be a child row
                            isChild = rowIndex && tsfRegex.child.test(txt);
                            // skip child rows & already filtered rows
                            if (isChild || (searchFiltered && tsfRegex.filtered.test(txt))) {
                                continue;
                            }

                            data.$row = $rows.eq(rowIndex);
                            data.rowIndex = rowIndex;
                            data.cacheArray = norm_rows[rowIndex];
                            rowData = data.cacheArray[c.columns];
                            data.rawArray = rowData.raw;
                            data.childRowText = '';

                            if (!wo.filter_childByColumn) {
                                txt = '';
                                // child row cached text
                                childRow = rowData.child;
                                // so, if 'table.config.widgetOptions.filter_childRows' is true and there is
                                // a match anywhere in the child row, then it will make the row visible
                                // checked here so the option can be changed dynamically
                                for (indx = 0; indx < childRow.length; indx++) {
                                    txt += ' ' + childRow[indx].join(' ') || '';
                                }
                                data.childRowText = wo.filter_childRows ?
                                    (wo.filter_ignoreCase ? txt.toLowerCase() : txt) :
                                    '';
                            }

                            showRow = false;
                            showParent = tsf.processRow(c, data, vars);
                            $row = rowData.$row;

                            // don't pass reference to val
                            val = showParent ? true : false;
                            childRow = rowData.$row.filter(':gt(0)');
                            if (wo.filter_childRows && childRow.length) {
                                if (wo.filter_childByColumn) {
                                    if (!wo.filter_childWithSibs) {
                                        // hide all child rows
                                        childRow.addClass(wo.filter_filteredRow);
                                        // if only showing resulting child row, only include parent
                                        $row = $row.eq(0);
                                    }
                                    // cycle through each child row
                                    for (indx = 0; indx < childRow.length; indx++) {
                                        data.$row = childRow.eq(indx);
                                        data.cacheArray = rowData.child[indx];
                                        data.rawArray = data.cacheArray;
                                        val = tsf.processRow(c, data, vars);
                                        // use OR comparison on child rows
                                        showRow = showRow || val;
                                        if (!wo.filter_childWithSibs && val) {
                                            childRow.eq(indx).removeClass(wo.filter_filteredRow);
                                        }
                                    }
                                }
                                // keep parent row match even if no child matches... see #1020
                                showRow = showRow || showParent;
                            } else {
                                showRow = val;
                            }
                            $row
                                .toggleClass(wo.filter_filteredRow, !showRow)[0]
                                .display = showRow ? '' : 'none';
                        }
                    }
                    c.filteredRows += $rows.not('.' + wo.filter_filteredRow).length;
                    c.totalRows += $rows.length;
                    ts.processTbody(table, $tbody, false);
                }
                // lastCombinedFilter is no longer used internally
                c.lastCombinedFilter = storedFilters.join(''); // save last search
                // don't save 'filters' directly since it may have altered ( AnyMatch column searches )
                c.lastSearch = storedFilters;
                c.$table.data('lastSearch', storedFilters);
                if (wo.filter_saveFilters && ts.storage) {
                    ts.storage(table, 'tablesorter-filters', tsf.processFilters(storedFilters, true));
                }
                if (debug) {
                    console.log('Filter >> Completed search' + ts.benchmark(time));
                }
                if (wo.filter_initialized) {
                    c.$table.triggerHandler('filterBeforeEnd', c);
                    c.$table.triggerHandler('filterEnd', c);
                }
                setTimeout(function () {
                    ts.applyWidget(c.table); // make sure zebra widget is applied
                }, 0);
            },
            getOptionSource: function (table, column, onlyAvail) {
                table = $(table)[0];
                var c = table.config,
                    wo = c.widgetOptions,
                    arry = false,
                    source = wo.filter_selectSource,
                    last = c.$table.data('lastSearch') || [],
                    fxn = typeof source === 'function' ? true : ts.getColumnData(table, source, column);

                if (onlyAvail && last[column] !== '') {
                    onlyAvail = false;
                }

                // filter select source option
                if (fxn === true) {
                    // OVERALL source
                    arry = source(table, column, onlyAvail);
                } else if (fxn instanceof $ || ($.type(fxn) === 'string' && fxn.indexOf('</option>') >= 0)) {
                    // selectSource is a jQuery object or string of options
                    return fxn;
                } else if ($.isArray(fxn)) {
                    arry = fxn;
                } else if ($.type(source) === 'object' && fxn) {
                    // custom select source function for a SPECIFIC COLUMN
                    arry = fxn(table, column, onlyAvail);
                    // abort - updating the selects from an external method
                    if (arry === null) {
                        return null;
                    }
                }
                if (arry === false) {
                    // fall back to original method
                    arry = tsf.getOptions(table, column, onlyAvail);
                }

                return tsf.processOptions(table, column, arry);

            },
            processOptions: function (table, column, arry) {
                if (!$.isArray(arry)) {
                    return false;
                }
                table = $(table)[0];
                var cts, txt, indx, len, parsedTxt, str,
                    c = table.config,
                    validColumn = typeof column !== 'undefined' && column !== null && column >= 0 && column < c.columns,
                    direction = validColumn ? c.$headerIndexed[column].hasClass('filter-select-sort-desc') : false,
                    parsed = [];
                // get unique elements and sort the list
                // if $.tablesorter.sortText exists ( not in the original tablesorter ),
                // then natural sort the list otherwise use a basic sort
                arry = $.grep(arry, function (value, indx) {
                    if (value.text) {
                        return true;
                    }
                    return $.inArray(value, arry) === indx;
                });
                if (validColumn && c.$headerIndexed[column].hasClass('filter-select-nosort')) {
                    // unsorted select options
                    return arry;
                } else {
                    len = arry.length;
                    // parse select option values
                    for (indx = 0; indx < len; indx++) {
                        txt = arry[indx];
                        // check for object
                        str = txt.text ? txt.text : txt;
                        // sortNatural breaks if you don't pass it strings
                        parsedTxt = (validColumn && c.parsers && c.parsers.length &&
                            c.parsers[column].format(str, table, [], column) || str).toString();
                        parsedTxt = c.widgetOptions.filter_ignoreCase ? parsedTxt.toLowerCase() : parsedTxt;
                        // parse array data using set column parser; this DOES NOT pass the original
                        // table cell to the parser format function
                        if (txt.text) {
                            txt.parsed = parsedTxt;
                            parsed[parsed.length] = txt;
                        } else {
                            parsed[parsed.length] = {
                                text: txt,
                                // check parser length - fixes #934
                                parsed: parsedTxt
                            };
                        }
                    }
                    // sort parsed select options
                    cts = c.textSorter || '';
                    parsed.sort(function (a, b) {
                        var x = direction ? b.parsed : a.parsed,
                            y = direction ? a.parsed : b.parsed;
                        if (validColumn && typeof cts === 'function') {
                            // custom OVERALL text sorter
                            return cts(x, y, true, column, table);
                        } else if (validColumn && typeof cts === 'object' && cts.hasOwnProperty(column)) {
                            // custom text sorter for a SPECIFIC COLUMN
                            return cts[column](x, y, true, column, table);
                        } else if (ts.sortNatural) {
                            // fall back to natural sort
                            return ts.sortNatural(x, y);
                        }
                        // using an older version! do a basic sort
                        return true;
                    });
                    // rebuild arry from sorted parsed data
                    arry = [];
                    len = parsed.length;
                    for (indx = 0; indx < len; indx++) {
                        arry[arry.length] = parsed[indx];
                    }
                    return arry;
                }
            },
            getOptions: function (table, column, onlyAvail) {
                table = $(table)[0];
                var rowIndex, tbodyIndex, len, row, cache, indx, child, childLen,
                    c = table.config,
                    wo = c.widgetOptions,
                    arry = [];
                for (tbodyIndex = 0; tbodyIndex < c.$tbodies.length; tbodyIndex++) {
                    cache = c.cache[tbodyIndex];
                    len = c.cache[tbodyIndex].normalized.length;
                    // loop through the rows
                    for (rowIndex = 0; rowIndex < len; rowIndex++) {
                        // get cached row from cache.row ( old ) or row data object
                        // ( new; last item in normalized array )
                        row = cache.row ?
                            cache.row[rowIndex] :
                            cache.normalized[rowIndex][c.columns].$row[0];
                        // check if has class filtered
                        if (onlyAvail && row.className.match(wo.filter_filteredRow)) {
                            continue;
                        }
                        // get non-normalized cell content
                        if (wo.filter_useParsedData ||
                            c.parsers[column].parsed ||
                            c.$headerIndexed[column].hasClass('filter-parsed')) {
                            arry[arry.length] = '' + cache.normalized[rowIndex][column];
                            // child row parsed data
                            if (wo.filter_childRows && wo.filter_childByColumn) {
                                childLen = cache.normalized[rowIndex][c.columns].$row.length - 1;
                                for (indx = 0; indx < childLen; indx++) {
                                    arry[arry.length] = '' + cache.normalized[rowIndex][c.columns].child[indx][column];
                                }
                            }
                        } else {
                            // get raw cached data instead of content directly from the cells
                            arry[arry.length] = cache.normalized[rowIndex][c.columns].raw[column];
                            // child row unparsed data
                            if (wo.filter_childRows && wo.filter_childByColumn) {
                                childLen = cache.normalized[rowIndex][c.columns].$row.length;
                                for (indx = 1; indx < childLen; indx++) {
                                    child = cache.normalized[rowIndex][c.columns].$row.eq(indx).children().eq(column);
                                    arry[arry.length] = '' + ts.getElementText(c, child, column);
                                }
                            }
                        }
                    }
                }
                return arry;
            },
            buildSelect: function (table, column, arry, updating, onlyAvail) {
                table = $(table)[0];
                column = parseInt(column, 10);
                if (!table.config.cache || $.isEmptyObject(table.config.cache)) {
                    return;
                }

                var indx, val, txt, t, $filters, $filter, option,
                    c = table.config,
                    wo = c.widgetOptions,
                    node = c.$headerIndexed[column],
                    // t.data( 'placeholder' ) won't work in jQuery older than 1.4.3
                    options = '<option value="">' +
                        (node.data('placeholder') ||
                            node.attr('data-placeholder') ||
                            wo.filter_placeholder.select || ''
                        ) + '</option>',
                    // Get curent filter value
                    currentValue = c.$table
                        .find('thead')
                        .find('select.' + tscss.filter + '[data-column="' + column + '"]')
                        .val();

                // nothing included in arry ( external source ), so get the options from
                // filter_selectSource or column data
                if (typeof arry === 'undefined' || arry === '') {
                    arry = tsf.getOptionSource(table, column, onlyAvail);
                    // abort, selects are updated by an external method
                    if (arry === null) {
                        return;
                    }
                }

                if ($.isArray(arry)) {
                    // build option list
                    for (indx = 0; indx < arry.length; indx++) {
                        option = arry[indx];
                        if (option.text) {
                            // OBJECT!! add data-function-name in case the value is set in filter_functions
                            option['data-function-name'] = typeof option.value === 'undefined' ? option.text : option.value;

                            // support jQuery < v1.8, otherwise the below code could be shortened to
                            // options += $( '<option>', option )[ 0 ].outerHTML;
                            options += '<option';
                            for (val in option) {
                                if (option.hasOwnProperty(val) && val !== 'text') {
                                    options += ' ' + val + '="' + option[val].replace(tsfRegex.quote, '&quot;') + '"';
                                }
                            }
                            if (!option.value) {
                                options += ' value="' + option.text.replace(tsfRegex.quote, '&quot;') + '"';
                            }
                            options += '>' + option.text.replace(tsfRegex.quote, '&quot;') + '</option>';
                            // above code is needed in jQuery < v1.8

                            // make sure we don't turn an object into a string (objects without a "text" property)
                        } else if ('' + option !== '[object Object]') {
                            txt = option = ('' + option).replace(tsfRegex.quote, '&quot;');
                            val = txt;
                            // allow including a symbol in the selectSource array
                            // 'a-z|A through Z' so that 'a-z' becomes the option value
                            // and 'A through Z' becomes the option text
                            if (txt.indexOf(wo.filter_selectSourceSeparator) >= 0) {
                                t = txt.split(wo.filter_selectSourceSeparator);
                                val = t[0];
                                txt = t[1];
                            }
                            // replace quotes - fixes #242 & ignore empty strings
                            // see http://stackoverflow.com/q/14990971/145346
                            options += option !== '' ?
                                '<option ' +
                                (val === txt ? '' : 'data-function-name="' + option + '" ') +
                                'value="' + val + '">' + txt +
                                '</option>' : '';
                        }
                    }
                    // clear arry so it doesn't get appended twice
                    arry = [];
                }

                // update all selects in the same column ( clone thead in sticky headers &
                // any external selects ) - fixes 473
                $filters = (c.$filters ? c.$filters : c.$table.children('thead'))
                    .find('.' + tscss.filter);
                if (wo.filter_$externalFilters) {
                    $filters = $filters && $filters.length ?
                        $filters.add(wo.filter_$externalFilters) :
                        wo.filter_$externalFilters;
                }
                $filter = $filters.filter('select[data-column="' + column + '"]');

                // make sure there is a select there!
                if ($filter.length) {
                    $filter[updating ? 'html' : 'append'](options);
                    if (!$.isArray(arry)) {
                        // append options if arry is provided externally as a string or jQuery object
                        // options ( default value ) was already added
                        $filter.append(arry).val(currentValue);
                    }
                    $filter.val(currentValue);
                }
            },
            buildDefault: function (table, updating) {
                var columnIndex, $header, noSelect,
                    c = table.config,
                    wo = c.widgetOptions,
                    columns = c.columns;
                // build default select dropdown
                for (columnIndex = 0; columnIndex < columns; columnIndex++) {
                    $header = c.$headerIndexed[columnIndex];
                    noSelect = !($header.hasClass('filter-false') || $header.hasClass('parser-false'));
                    // look for the filter-select class; build/update it if found
                    if (($header.hasClass('filter-select') ||
                        ts.getColumnData(table, wo.filter_functions, columnIndex) === true) && noSelect) {
                        tsf.buildSelect(table, columnIndex, '', updating, $header.hasClass(wo.filter_onlyAvail));
                    }
                }
            }
        };

        // filter regex variable
        tsfRegex = tsf.regex;

        ts.getFilters = function (table, getRaw, setFilters, skipFirst) {
            var i, $filters, $column, cols,
                filters = [],
                c = table ? $(table)[0].config : '',
                wo = c ? c.widgetOptions : '';
            if ((getRaw !== true && wo && !wo.filter_columnFilters) ||
                // setFilters called, but last search is exactly the same as the current
                // fixes issue #733 & #903 where calling update causes the input values to reset
                ($.isArray(setFilters) && tsf.equalFilters(c, setFilters, c.lastSearch))
            ) {
                return $(table).data('lastSearch') || [];
            }
            if (c) {
                if (c.$filters) {
                    $filters = c.$filters.find('.' + tscss.filter);
                }
                if (wo.filter_$externalFilters) {
                    $filters = $filters && $filters.length ?
                        $filters.add(wo.filter_$externalFilters) :
                        wo.filter_$externalFilters;
                }
                if ($filters && $filters.length) {
                    filters = setFilters || [];
                    for (i = 0; i < c.columns + 1; i++) {
                        cols = (i === c.columns ?
                            // 'all' columns can now include a range or set of columms ( data-column='0-2,4,6-7' )
                            wo.filter_anyColumnSelector + ',' + wo.filter_multipleColumnSelector :
                            '[data-column="' + i + '"]');
                        $column = $filters.filter(cols);
                        if ($column.length) {
                            // move the latest search to the first slot in the array
                            $column = tsf.getLatestSearch($column);
                            if ($.isArray(setFilters)) {
                                // skip first ( latest input ) to maintain cursor position while typing
                                if (skipFirst && $column.length > 1) {
                                    $column = $column.slice(1);
                                }
                                if (i === c.columns) {
                                    // prevent data-column='all' from filling data-column='0,1' ( etc )
                                    cols = $column.filter(wo.filter_anyColumnSelector);
                                    $column = cols.length ? cols : $column;
                                }
                                $column
                                    .val(setFilters[i])
                                    // must include a namespace here; but not c.namespace + 'filter'?
                                    .trigger('change' + c.namespace);
                            } else {
                                filters[i] = $column.val() || '';
                                // don't change the first... it will move the cursor
                                if (i === c.columns) {
                                    // don't update range columns from 'all' setting
                                    $column
                                        .slice(1)
                                        .filter('[data-column*="' + $column.attr('data-column') + '"]')
                                        .val(filters[i]);
                                } else {
                                    $column
                                        .slice(1)
                                        .val(filters[i]);
                                }
                            }
                            // save any match input dynamically
                            if (i === c.columns && $column.length) {
                                wo.filter_$anyMatch = $column;
                            }
                        }
                    }
                }
            }
            return filters;
        };

        ts.setFilters = function (table, filter, apply, skipFirst) {
            var c = table ? $(table)[0].config : '',
                valid = ts.getFilters(table, true, filter, skipFirst);
            // default apply to "true"
            if (typeof apply === 'undefined') {
                apply = true;
            }
            if (c && apply) {
                // ensure new set filters are applied, even if the search is the same
                c.lastCombinedFilter = null;
                c.lastSearch = [];
                tsf.searching(c.table, filter, skipFirst);
                c.$table.triggerHandler('filterFomatterUpdate');
            }
            return valid.length !== 0;
        };

    })(jQuery);

    /*! Widget: stickyHeaders - updated 9/27/2017 (v2.29.0) *//*
     * Requires tablesorter v2.8+ and jQuery 1.4.3+
     * by Rob Garrison
     */
    ; (function ($, window) {
        'use strict';
        var ts = $.tablesorter || {};

        $.extend(ts.css, {
            sticky: 'tablesorter-stickyHeader', // stickyHeader
            stickyVis: 'tablesorter-sticky-visible',
            stickyHide: 'tablesorter-sticky-hidden',
            stickyWrap: 'tablesorter-sticky-wrapper'
        });

        // Add a resize event to table headers
        ts.addHeaderResizeEvent = function (table, disable, settings) {
            table = $(table)[0]; // make sure we're using a dom element
            if (!table.config) { return; }
            var defaults = {
                timer: 250
            },
                options = $.extend({}, defaults, settings),
                c = table.config,
                wo = c.widgetOptions,
                checkSizes = function (triggerEvent) {
                    var index, headers, $header, sizes, width, height,
                        len = c.$headers.length;
                    wo.resize_flag = true;
                    headers = [];
                    for (index = 0; index < len; index++) {
                        $header = c.$headers.eq(index);
                        sizes = $header.data('savedSizes') || [0, 0]; // fixes #394
                        width = $header[0].offsetWidth;
                        height = $header[0].offsetHeight;
                        if (width !== sizes[0] || height !== sizes[1]) {
                            $header.data('savedSizes', [width, height]);
                            headers.push($header[0]);
                        }
                    }
                    if (headers.length && triggerEvent !== false) {
                        c.$table.triggerHandler('resize', [headers]);
                    }
                    wo.resize_flag = false;
                };
            clearInterval(wo.resize_timer);
            if (disable) {
                wo.resize_flag = false;
                return false;
            }
            checkSizes(false);
            wo.resize_timer = setInterval(function () {
                if (wo.resize_flag) { return; }
                checkSizes();
            }, options.timer);
        };

        function getStickyOffset(c, wo) {
            var $el = isNaN(wo.stickyHeaders_offset) ? $(wo.stickyHeaders_offset) : [];
            return $el.length ?
                $el.height() || 0 :
                parseInt(wo.stickyHeaders_offset, 10) || 0;
        }

        // Sticky headers based on this awesome article:
        // http://css-tricks.com/13465-persistent-headers/
        // and https://github.com/jmosbech/StickyTableHeaders by Jonas Mosbech
        // **************************
        ts.addWidget({
            id: 'stickyHeaders',
            priority: 54, // sticky widget must be initialized after the filter & before pager widget!
            options: {
                stickyHeaders: '',       // extra class name added to the sticky header row
                stickyHeaders_appendTo: null, // jQuery selector or object to phycially attach the sticky headers
                stickyHeaders_attachTo: null, // jQuery selector or object to attach scroll listener to (overridden by xScroll & yScroll settings)
                stickyHeaders_xScroll: null, // jQuery selector or object to monitor horizontal scroll position (defaults: xScroll > attachTo > window)
                stickyHeaders_yScroll: null, // jQuery selector or object to monitor vertical scroll position (defaults: yScroll > attachTo > window)
                stickyHeaders_offset: 0, // number or jquery selector targeting the position:fixed element
                stickyHeaders_filteredToTop: true, // scroll table top into view after filtering
                stickyHeaders_cloneId: '-sticky', // added to table ID, if it exists
                stickyHeaders_addResizeEvent: true, // trigger 'resize' event on headers
                stickyHeaders_includeCaption: true, // if false and a caption exist, it won't be included in the sticky header
                stickyHeaders_zIndex: 2 // The zIndex of the stickyHeaders, allows the user to adjust this to their needs
            },
            format: function (table, c, wo) {
                // filter widget doesn't initialize on an empty table. Fixes #449
                if (c.$table.hasClass('hasStickyHeaders') || ($.inArray('filter', c.widgets) >= 0 && !c.$table.hasClass('hasFilters'))) {
                    return;
                }
                var index, len, $t,
                    $table = c.$table,
                    // add position: relative to attach element, hopefully it won't cause trouble.
                    $attach = $(wo.stickyHeaders_attachTo || wo.stickyHeaders_appendTo),
                    namespace = c.namespace + 'stickyheaders ',
                    // element to watch for the scroll event
                    $yScroll = $(wo.stickyHeaders_yScroll || wo.stickyHeaders_attachTo || window),
                    $xScroll = $(wo.stickyHeaders_xScroll || wo.stickyHeaders_attachTo || window),
                    $thead = $table.children('thead:first'),
                    $header = $thead.children('tr').not('.sticky-false').children(),
                    $tfoot = $table.children('tfoot'),
                    stickyOffset = getStickyOffset(c, wo),
                    // is this table nested? If so, find parent sticky header wrapper (div, not table)
                    $nestedSticky = $table.parent().closest('.' + ts.css.table).hasClass('hasStickyHeaders') ?
                        $table.parent().closest('table.tablesorter')[0].config.widgetOptions.$sticky.parent() : [],
                    nestedStickyTop = $nestedSticky.length ? $nestedSticky.height() : 0,
                    // clone table, then wrap to make sticky header
                    $stickyTable = wo.$sticky = $table.clone()
                        .addClass('containsStickyHeaders ' + ts.css.sticky + ' ' + wo.stickyHeaders + ' ' + c.namespace.slice(1) + '_extra_table')
                        .wrap('<div class="' + ts.css.stickyWrap + '">'),
                    $stickyWrap = $stickyTable.parent()
                        .addClass(ts.css.stickyHide)
                        .css({
                            position: $attach.length ? 'absolute' : 'fixed',
                            padding: parseInt($stickyTable.parent().parent().css('padding-left'), 10),
                            top: stickyOffset + nestedStickyTop,
                            left: 0,
                            visibility: 'hidden',
                            zIndex: wo.stickyHeaders_zIndex || 2
                        }),
                    $stickyThead = $stickyTable.children('thead:first'),
                    $stickyCells,
                    laststate = '',
                    setWidth = function ($orig, $clone) {
                        var index, width, border, $cell, $this,
                            $cells = $orig.filter(':visible'),
                            len = $cells.length;
                        for (index = 0; index < len; index++) {
                            $cell = $clone.filter(':visible').eq(index);
                            $this = $cells.eq(index);
                            // code from https://github.com/jmosbech/StickyTableHeaders
                            if ($this.css('box-sizing') === 'border-box') {
                                width = $this.outerWidth();
                            } else {
                                if ($cell.css('border-collapse') === 'collapse') {
                                    if (window.getComputedStyle) {
                                        width = parseFloat(window.getComputedStyle($this[0], null).width);
                                    } else {
                                        // ie8 only
                                        border = parseFloat($this.css('border-width'));
                                        width = $this.outerWidth() - parseFloat($this.css('padding-left')) - parseFloat($this.css('padding-right')) - border;
                                    }
                                } else {
                                    width = $this.width();
                                }
                            }
                            $cell.css({
                                'width': width,
                                'min-width': width,
                                'max-width': width
                            });
                        }
                    },
                    getLeftPosition = function (yWindow) {
                        if (yWindow === false && $nestedSticky.length) {
                            return $table.position().left;
                        }
                        return $attach.length ?
                            parseInt($attach.css('padding-left'), 10) || 0 :
                            $table.offset().left - parseInt($table.css('margin-left'), 10) - $(window).scrollLeft();
                    },
                    resizeHeader = function () {
                        $stickyWrap.css({
                            left: getLeftPosition(),
                            width: $table.outerWidth()
                        });
                        setWidth($table, $stickyTable);
                        setWidth($header, $stickyCells);
                    },
                    scrollSticky = function (resizing) {
                        if (!$table.is(':visible')) { return; } // fixes #278
                        // Detect nested tables - fixes #724
                        nestedStickyTop = $nestedSticky.length ? $nestedSticky.offset().top - $yScroll.scrollTop() + $nestedSticky.height() : 0;
                        var tmp,
                            offset = $table.offset(),
                            stickyOffset = getStickyOffset(c, wo),
                            yWindow = $.isWindow($yScroll[0]), // $.isWindow needs jQuery 1.4.3
                            yScroll = yWindow ?
                                $yScroll.scrollTop() :
                                // use parent sticky position if nested AND inside of a scrollable element - see #1512
                                $nestedSticky.length ? parseInt($nestedSticky[0].style.top, 10) : $yScroll.offset().top,
                            attachTop = $attach.length ? yScroll : $yScroll.scrollTop(),
                            captionHeight = wo.stickyHeaders_includeCaption ? 0 : $table.children('caption').height() || 0,
                            scrollTop = attachTop + stickyOffset + nestedStickyTop - captionHeight,
                            tableHeight = $table.height() - ($stickyWrap.height() + ($tfoot.height() || 0)) - captionHeight,
                            isVisible = (scrollTop > offset.top) && (scrollTop < offset.top + tableHeight) ? 'visible' : 'hidden',
                            state = isVisible === 'visible' ? ts.css.stickyVis : ts.css.stickyHide,
                            needsUpdating = !$stickyWrap.hasClass(state),
                            cssSettings = { visibility: isVisible };
                        if ($attach.length) {
                            // attached sticky headers always need updating
                            needsUpdating = true;
                            cssSettings.top = yWindow ? scrollTop - $attach.offset().top : $attach.scrollTop();
                        }
                        // adjust when scrolling horizontally - fixes issue #143
                        tmp = getLeftPosition(yWindow);
                        if (tmp !== parseInt($stickyWrap.css('left'), 10)) {
                            needsUpdating = true;
                            cssSettings.left = tmp;
                        }
                        cssSettings.top = (cssSettings.top || 0) +
                            // If nested AND inside of a scrollable element, only add parent sticky height
                            (!yWindow && $nestedSticky.length ? $nestedSticky.height() : stickyOffset + nestedStickyTop);
                        if (needsUpdating) {
                            $stickyWrap
                                .removeClass(ts.css.stickyVis + ' ' + ts.css.stickyHide)
                                .addClass(state)
                                .css(cssSettings);
                        }
                        if (isVisible !== laststate || resizing) {
                            // make sure the column widths match
                            resizeHeader();
                            laststate = isVisible;
                        }
                    };
                // only add a position relative if a position isn't already defined
                if ($attach.length && !$attach.css('position')) {
                    $attach.css('position', 'relative');
                }
                // fix clone ID, if it exists - fixes #271
                if ($stickyTable.attr('id')) { $stickyTable[0].id += wo.stickyHeaders_cloneId; }
                // clear out cloned table, except for sticky header
                // include caption & filter row (fixes #126 & #249) - don't remove cells to get correct cell indexing
                $stickyTable.find('> thead:gt(0), tr.sticky-false').hide();
                $stickyTable.find('> tbody, > tfoot').remove();
                $stickyTable.find('caption').toggle(wo.stickyHeaders_includeCaption);
                // issue #172 - find td/th in sticky header
                $stickyCells = $stickyThead.children().children();
                $stickyTable.css({ height: 0, width: 0, margin: 0 });
                // remove resizable block
                $stickyCells.find('.' + ts.css.resizer).remove();
                // update sticky header class names to match real header after sorting
                $table
                    .addClass('hasStickyHeaders')
                    .bind('pagerComplete' + namespace, function () {
                        resizeHeader();
                    });

                ts.bindEvents(table, $stickyThead.children().children('.' + ts.css.header));

                if (wo.stickyHeaders_appendTo) {
                    $(wo.stickyHeaders_appendTo).append($stickyWrap);
                } else {
                    // add stickyheaders AFTER the table. If the table is selected by ID, the original one (first) will be returned.
                    $table.after($stickyWrap);
                }

                // onRenderHeader is defined, we need to do something about it (fixes #641)
                if (c.onRenderHeader) {
                    $t = $stickyThead.children('tr').children();
                    len = $t.length;
                    for (index = 0; index < len; index++) {
                        // send second parameter
                        c.onRenderHeader.apply($t.eq(index), [index, c, $stickyTable]);
                    }
                }
                // make it sticky!
                $xScroll.add($yScroll)
                    .unbind(('scroll resize '.split(' ').join(namespace)).replace(/\s+/g, ' '))
                    .bind('scroll resize '.split(' ').join(namespace), function (event) {
                        scrollSticky(event.type === 'resize');
                    });
                c.$table
                    .unbind('stickyHeadersUpdate' + namespace)
                    .bind('stickyHeadersUpdate' + namespace, function () {
                        scrollSticky(true);
                    });

                if (wo.stickyHeaders_addResizeEvent) {
                    ts.addHeaderResizeEvent(table);
                }

                // look for filter widget
                if ($table.hasClass('hasFilters') && wo.filter_columnFilters) {
                    // scroll table into view after filtering, if sticky header is active - #482
                    $table.bind('filterEnd' + namespace, function () {
                        // $(':focus') needs jQuery 1.6+
                        var $td = $(document.activeElement).closest('td'),
                            column = $td.parent().children().index($td);
                        // only scroll if sticky header is active
                        if ($stickyWrap.hasClass(ts.css.stickyVis) && wo.stickyHeaders_filteredToTop) {
                            // scroll to original table (not sticky clone)
                            window.scrollTo(0, $table.position().top);
                            // give same input/select focus; check if c.$filters exists; fixes #594
                            if (column >= 0 && c.$filters) {
                                c.$filters.eq(column).find('a, select, input').filter(':visible').focus();
                            }
                        }
                    });
                    ts.filter.bindSearch($table, $stickyCells.find('.' + ts.css.filter));
                    // support hideFilters
                    if (wo.filter_hideFilters) {
                        ts.filter.hideFilters(c, $stickyTable);
                    }
                }

                // resize table (Firefox)
                if (wo.stickyHeaders_addResizeEvent) {
                    $table.bind('resize' + c.namespace + 'stickyheaders', function () {
                        resizeHeader();
                    });
                }

                // make sure sticky is visible if page is partially scrolled
                scrollSticky(true);
                $table.triggerHandler('stickyHeadersInit');

            },
            remove: function (table, c, wo) {
                var namespace = c.namespace + 'stickyheaders ';
                c.$table
                    .removeClass('hasStickyHeaders')
                    .unbind(('pagerComplete resize filterEnd stickyHeadersUpdate '.split(' ').join(namespace)).replace(/\s+/g, ' '))
                    .next('.' + ts.css.stickyWrap).remove();
                if (wo.$sticky && wo.$sticky.length) { wo.$sticky.remove(); } // remove cloned table
                $(window)
                    .add(wo.stickyHeaders_xScroll)
                    .add(wo.stickyHeaders_yScroll)
                    .add(wo.stickyHeaders_attachTo)
                    .unbind(('scroll resize '.split(' ').join(namespace)).replace(/\s+/g, ' '));
                ts.addHeaderResizeEvent(table, true);
            }
        });

    })(jQuery, window);

    /*! Widget: resizable - updated 2018-03-26 (v2.30.2) */
    /*jshint browser:true, jquery:true, unused:false */
    ; (function ($, window) {
        'use strict';
        var ts = $.tablesorter || {};

        $.extend(ts.css, {
            resizableContainer: 'tablesorter-resizable-container',
            resizableHandle: 'tablesorter-resizable-handle',
            resizableNoSelect: 'tablesorter-disableSelection',
            resizableStorage: 'tablesorter-resizable'
        });

        // Add extra scroller css
        $(function () {
            var s = '<style>' +
                'body.' + ts.css.resizableNoSelect + ' { -ms-user-select: none; -moz-user-select: -moz-none;' +
                '-khtml-user-select: none; -webkit-user-select: none; user-select: none; }' +
                '.' + ts.css.resizableContainer + ' { position: relative; height: 1px; }' +
                // make handle z-index > than stickyHeader z-index, so the handle stays above sticky header
                '.' + ts.css.resizableHandle + ' { position: absolute; display: inline-block; width: 8px;' +
                'top: 1px; cursor: ew-resize; z-index: 3; user-select: none; -moz-user-select: none; }' +
                '</style>';
            $('head').append(s);
        });

        ts.resizable = {
            init: function (c, wo) {
                if (c.$table.hasClass('hasResizable')) { return; }
                c.$table.addClass('hasResizable');

                var noResize, $header, column, storedSizes, tmp,
                    $table = c.$table,
                    $parent = $table.parent(),
                    marginTop = parseInt($table.css('margin-top'), 10),

                    // internal variables
                    vars = wo.resizable_vars = {
                        useStorage: ts.storage && wo.resizable !== false,
                        $wrap: $parent,
                        mouseXPosition: 0,
                        $target: null,
                        $next: null,
                        overflow: $parent.css('overflow') === 'auto' ||
                            $parent.css('overflow') === 'scroll' ||
                            $parent.css('overflow-x') === 'auto' ||
                            $parent.css('overflow-x') === 'scroll',
                        storedSizes: []
                    };

                // set default widths
                ts.resizableReset(c.table, true);

                // now get measurements!
                vars.tableWidth = $table.width();
                // attempt to autodetect
                vars.fullWidth = Math.abs($parent.width() - vars.tableWidth) < 20;

                /*
                // Hacky method to determine if table width is set to 'auto'
                // http://stackoverflow.com/a/20892048/145346
                if ( !vars.fullWidth ) {
                    tmp = $table.width();
                    $header = $table.wrap('<span>').parent(); // temp variable
                    storedSizes = parseInt( $table.css( 'margin-left' ), 10 ) || 0;
                    $table.css( 'margin-left', storedSizes + 50 );
                    vars.tableWidth = $header.width() > tmp ? 'auto' : tmp;
                    $table.css( 'margin-left', storedSizes ? storedSizes : '' );
                    $header = null;
                    $table.unwrap('<span>');
                }
                */

                if (vars.useStorage && vars.overflow) {
                    // save table width
                    ts.storage(c.table, 'tablesorter-table-original-css-width', vars.tableWidth);
                    tmp = ts.storage(c.table, 'tablesorter-table-resized-width') || 'auto';
                    ts.resizable.setWidth($table, tmp, true);
                }
                wo.resizable_vars.storedSizes = storedSizes = (vars.useStorage ?
                    ts.storage(c.table, ts.css.resizableStorage) :
                    []) || [];
                ts.resizable.setWidths(c, wo, storedSizes);
                ts.resizable.updateStoredSizes(c, wo);

                wo.$resizable_container = $('<div class="' + ts.css.resizableContainer + '">')
                    .css({ top: marginTop })
                    .insertBefore($table);
                // add container
                for (column = 0; column < c.columns; column++) {
                    $header = c.$headerIndexed[column];
                    tmp = ts.getColumnData(c.table, c.headers, column);
                    noResize = ts.getData($header, tmp, 'resizable') === 'false';
                    if (!noResize) {
                        $('<div class="' + ts.css.resizableHandle + '">')
                            .appendTo(wo.$resizable_container)
                            .attr({
                                'data-column': column,
                                'unselectable': 'on'
                            })
                            .data('header', $header)
                            .bind('selectstart', false);
                    }
                }
                ts.resizable.bindings(c, wo);
            },

            updateStoredSizes: function (c, wo) {
                var column, $header,
                    len = c.columns,
                    vars = wo.resizable_vars;
                vars.storedSizes = [];
                for (column = 0; column < len; column++) {
                    $header = c.$headerIndexed[column];
                    vars.storedSizes[column] = $header.is(':visible') ? $header.width() : 0;
                }
            },

            setWidth: function ($el, width, overflow) {
                // overflow tables need min & max width set as well
                $el.css({
                    'width': width,
                    'min-width': overflow ? width : '',
                    'max-width': overflow ? width : ''
                });
            },

            setWidths: function (c, wo, storedSizes) {
                var column, $temp,
                    vars = wo.resizable_vars,
                    $extra = $(c.namespace + '_extra_headers'),
                    $col = c.$table.children('colgroup').children('col');
                storedSizes = storedSizes || vars.storedSizes || [];
                // process only if table ID or url match
                if (storedSizes.length) {
                    for (column = 0; column < c.columns; column++) {
                        // set saved resizable widths
                        ts.resizable.setWidth(c.$headerIndexed[column], storedSizes[column], vars.overflow);
                        if ($extra.length) {
                            // stickyHeaders needs to modify min & max width as well
                            $temp = $extra.eq(column).add($col.eq(column));
                            ts.resizable.setWidth($temp, storedSizes[column], vars.overflow);
                        }
                    }
                    $temp = $(c.namespace + '_extra_table');
                    if ($temp.length && !ts.hasWidget(c.table, 'scroller')) {
                        ts.resizable.setWidth($temp, c.$table.outerWidth(), vars.overflow);
                    }
                }
            },

            setHandlePosition: function (c, wo) {
                var startPosition,
                    tableHeight = c.$table.height(),
                    $handles = wo.$resizable_container.children(),
                    handleCenter = Math.floor($handles.width() / 2);

                if (ts.hasWidget(c.table, 'scroller')) {
                    tableHeight = 0;
                    c.$table.closest('.' + ts.css.scrollerWrap).children().each(function () {
                        var $this = $(this);
                        // center table has a max-height set
                        tableHeight += $this.filter('[style*="height"]').length ? $this.height() : $this.children('table').height();
                    });
                }

                if (!wo.resizable_includeFooter && c.$table.children('tfoot').length) {
                    tableHeight -= c.$table.children('tfoot').height();
                }
                // subtract out table left position from resizable handles. Fixes #864
                // jQuery v3.3.0+ appears to include the start position with the $header.position().left; see #1544
                startPosition = parseFloat($.fn.jquery) >= 3.3 ? 0 : c.$table.position().left;
                $handles.each(function () {
                    var $this = $(this),
                        column = parseInt($this.attr('data-column'), 10),
                        columns = c.columns - 1,
                        $header = $this.data('header');
                    if (!$header) { return; } // see #859
                    if (
                        !$header.is(':visible') ||
                        (!wo.resizable_addLastColumn && ts.resizable.checkVisibleColumns(c, column))
                    ) {
                        $this.hide();
                    } else if (column < columns || column === columns && wo.resizable_addLastColumn) {
                        $this.css({
                            display: 'inline-block',
                            height: tableHeight,
                            left: $header.position().left - startPosition + $header.outerWidth() - handleCenter
                        });
                    }
                });
            },

            // Fixes #1485
            checkVisibleColumns: function (c, column) {
                var i,
                    len = 0;
                for (i = column + 1; i < c.columns; i++) {
                    len += c.$headerIndexed[i].is(':visible') ? 1 : 0;
                }
                return len === 0;
            },

            // prevent text selection while dragging resize bar
            toggleTextSelection: function (c, wo, toggle) {
                var namespace = c.namespace + 'tsresize';
                wo.resizable_vars.disabled = toggle;
                $('body').toggleClass(ts.css.resizableNoSelect, toggle);
                if (toggle) {
                    $('body')
                        .attr('unselectable', 'on')
                        .bind('selectstart' + namespace, false);
                } else {
                    $('body')
                        .removeAttr('unselectable')
                        .unbind('selectstart' + namespace);
                }
            },

            bindings: function (c, wo) {
                var namespace = c.namespace + 'tsresize';
                wo.$resizable_container.children().bind('mousedown', function (event) {
                    // save header cell and mouse position
                    var column,
                        vars = wo.resizable_vars,
                        $extras = $(c.namespace + '_extra_headers'),
                        $header = $(event.target).data('header');

                    column = parseInt($header.attr('data-column'), 10);
                    vars.$target = $header = $header.add($extras.filter('[data-column="' + column + '"]'));
                    vars.target = column;

                    // if table is not as wide as it's parent, then resize the table
                    vars.$next = event.shiftKey || wo.resizable_targetLast ?
                        $header.parent().children().not('.resizable-false').filter(':last') :
                        $header.nextAll(':not(.resizable-false)').eq(0);

                    column = parseInt(vars.$next.attr('data-column'), 10);
                    vars.$next = vars.$next.add($extras.filter('[data-column="' + column + '"]'));
                    vars.next = column;

                    vars.mouseXPosition = event.pageX;
                    ts.resizable.updateStoredSizes(c, wo);
                    ts.resizable.toggleTextSelection(c, wo, true);
                });

                $(document)
                    .bind('mousemove' + namespace, function (event) {
                        var vars = wo.resizable_vars;
                        // ignore mousemove if no mousedown
                        if (!vars.disabled || vars.mouseXPosition === 0 || !vars.$target) { return; }
                        if (wo.resizable_throttle) {
                            clearTimeout(vars.timer);
                            vars.timer = setTimeout(function () {
                                ts.resizable.mouseMove(c, wo, event);
                            }, isNaN(wo.resizable_throttle) ? 5 : wo.resizable_throttle);
                        } else {
                            ts.resizable.mouseMove(c, wo, event);
                        }
                    })
                    .bind('mouseup' + namespace, function () {
                        if (!wo.resizable_vars.disabled) { return; }
                        ts.resizable.toggleTextSelection(c, wo, false);
                        ts.resizable.stopResize(c, wo);
                        ts.resizable.setHandlePosition(c, wo);
                    });

                // resizeEnd event triggered by scroller widget
                $(window).bind('resize' + namespace + ' resizeEnd' + namespace, function () {
                    ts.resizable.setHandlePosition(c, wo);
                });

                // right click to reset columns to default widths
                c.$table
                    .bind('columnUpdate pagerComplete resizableUpdate '.split(' ').join(namespace + ' '), function () {
                        ts.resizable.setHandlePosition(c, wo);
                    })
                    .bind('resizableReset' + namespace, function () {
                        ts.resizableReset(c.table);
                    })
                    .find('thead:first')
                    .add($(c.namespace + '_extra_table').find('thead:first'))
                    .bind('contextmenu' + namespace, function () {
                        // $.isEmptyObject() needs jQuery 1.4+; allow right click if already reset
                        var allowClick = wo.resizable_vars.storedSizes.length === 0;
                        ts.resizableReset(c.table);
                        ts.resizable.setHandlePosition(c, wo);
                        wo.resizable_vars.storedSizes = [];
                        return allowClick;
                    });

            },

            mouseMove: function (c, wo, event) {
                if (wo.resizable_vars.mouseXPosition === 0 || !wo.resizable_vars.$target) { return; }
                // resize columns
                var column,
                    total = 0,
                    vars = wo.resizable_vars,
                    $next = vars.$next,
                    tar = vars.storedSizes[vars.target],
                    leftEdge = event.pageX - vars.mouseXPosition;
                if (vars.overflow) {
                    if (tar + leftEdge > 0) {
                        vars.storedSizes[vars.target] += leftEdge;
                        ts.resizable.setWidth(vars.$target, vars.storedSizes[vars.target], true);
                        // update the entire table width
                        for (column = 0; column < c.columns; column++) {
                            total += vars.storedSizes[column];
                        }
                        ts.resizable.setWidth(c.$table.add($(c.namespace + '_extra_table')), total);
                    }
                    if (!$next.length) {
                        // if expanding right-most column, scroll the wrapper
                        vars.$wrap[0].scrollLeft = c.$table.width();
                    }
                } else if (vars.fullWidth) {
                    vars.storedSizes[vars.target] += leftEdge;
                    vars.storedSizes[vars.next] -= leftEdge;
                    ts.resizable.setWidths(c, wo);
                } else {
                    vars.storedSizes[vars.target] += leftEdge;
                    ts.resizable.setWidths(c, wo);
                }
                vars.mouseXPosition = event.pageX;
                // dynamically update sticky header widths
                c.$table.triggerHandler('stickyHeadersUpdate');
            },

            stopResize: function (c, wo) {
                var vars = wo.resizable_vars;
                ts.resizable.updateStoredSizes(c, wo);
                if (vars.useStorage) {
                    // save all column widths
                    ts.storage(c.table, ts.css.resizableStorage, vars.storedSizes);
                    ts.storage(c.table, 'tablesorter-table-resized-width', c.$table.width());
                }
                vars.mouseXPosition = 0;
                vars.$target = vars.$next = null;
                // will update stickyHeaders, just in case, see #912
                c.$table.triggerHandler('stickyHeadersUpdate');
                c.$table.triggerHandler('resizableComplete');
            }
        };

        // this widget saves the column widths if
        // $.tablesorter.storage function is included
        // **************************
        ts.addWidget({
            id: 'resizable',
            priority: 40,
            options: {
                resizable: true, // save column widths to storage
                resizable_addLastColumn: false,
                resizable_includeFooter: true,
                resizable_widths: [],
                resizable_throttle: false, // set to true (5ms) or any number 0-10 range
                resizable_targetLast: false
            },
            init: function (table, thisWidget, c, wo) {
                ts.resizable.init(c, wo);
            },
            format: function (table, c, wo) {
                ts.resizable.setHandlePosition(c, wo);
            },
            remove: function (table, c, wo, refreshing) {
                if (wo.$resizable_container) {
                    var namespace = c.namespace + 'tsresize';
                    c.$table.add($(c.namespace + '_extra_table'))
                        .removeClass('hasResizable')
                        .children('thead')
                        .unbind('contextmenu' + namespace);

                    wo.$resizable_container.remove();
                    ts.resizable.toggleTextSelection(c, wo, false);
                    ts.resizableReset(table, refreshing);
                    $(document).unbind('mousemove' + namespace + ' mouseup' + namespace);
                }
            }
        });

        ts.resizableReset = function (table, refreshing) {
            $(table).each(function () {
                var index, $t,
                    c = this.config,
                    wo = c && c.widgetOptions,
                    vars = wo.resizable_vars;
                if (table && c && c.$headerIndexed.length) {
                    // restore the initial table width
                    if (vars.overflow && vars.tableWidth) {
                        ts.resizable.setWidth(c.$table, vars.tableWidth, true);
                        if (vars.useStorage) {
                            ts.storage(table, 'tablesorter-table-resized-width', vars.tableWidth);
                        }
                    }
                    for (index = 0; index < c.columns; index++) {
                        $t = c.$headerIndexed[index];
                        if (wo.resizable_widths && wo.resizable_widths[index]) {
                            ts.resizable.setWidth($t, wo.resizable_widths[index], vars.overflow);
                        } else if (!$t.hasClass('resizable-false')) {
                            // don't clear the width of any column that is not resizable
                            ts.resizable.setWidth($t, '', vars.overflow);
                        }
                    }

                    // reset stickyHeader widths
                    c.$table.triggerHandler('stickyHeadersUpdate');
                    if (ts.storage && !refreshing) {
                        ts.storage(this, ts.css.resizableStorage, []);
                    }
                }
            });
        };

    })(jQuery, window);

    /*! Widget: saveSort - updated 2018-03-19 (v2.30.1) *//*
    * Requires tablesorter v2.16+
    * by Rob Garrison
    */
    ; (function ($) {
        'use strict';
        var ts = $.tablesorter || {};

        function getStoredSortList(c) {
            var stored = ts.storage(c.table, 'tablesorter-savesort');
            return (stored && stored.hasOwnProperty('sortList') && $.isArray(stored.sortList)) ? stored.sortList : [];
        }

        function sortListChanged(c, sortList) {
            return (sortList || getStoredSortList(c)).join(',') !== c.sortList.join(',');
        }

        // this widget saves the last sort only if the
        // saveSort widget option is true AND the
        // $.tablesorter.storage function is included
        // **************************
        ts.addWidget({
            id: 'saveSort',
            priority: 20,
            options: {
                saveSort: true
            },
            init: function (table, thisWidget, c, wo) {
                // run widget format before all other widgets are applied to the table
                thisWidget.format(table, c, wo, true);
            },
            format: function (table, c, wo, init) {
                var time,
                    $table = c.$table,
                    saveSort = wo.saveSort !== false, // make saveSort active/inactive; default to true
                    sortList = { 'sortList': c.sortList },
                    debug = ts.debug(c, 'saveSort');
                if (debug) {
                    time = new Date();
                }
                if ($table.hasClass('hasSaveSort')) {
                    if (saveSort && table.hasInitialized && ts.storage && sortListChanged(c)) {
                        ts.storage(table, 'tablesorter-savesort', sortList);
                        if (debug) {
                            console.log('saveSort >> Saving last sort: ' + c.sortList + ts.benchmark(time));
                        }
                    }
                } else {
                    // set table sort on initial run of the widget
                    $table.addClass('hasSaveSort');
                    sortList = '';
                    // get data
                    if (ts.storage) {
                        sortList = getStoredSortList(c);
                        if (debug) {
                            console.log('saveSort >> Last sort loaded: "' + sortList + '"' + ts.benchmark(time));
                        }
                        $table.bind('saveSortReset', function (event) {
                            event.stopPropagation();
                            ts.storage(table, 'tablesorter-savesort', '');
                        });
                    }
                    // init is true when widget init is run, this will run this widget before all other widgets have initialized
                    // this method allows using this widget in the original tablesorter plugin; but then it will run all widgets twice.
                    if (init && sortList && sortList.length > 0) {
                        c.sortList = sortList;
                    } else if (table.hasInitialized && sortList && sortList.length > 0) {
                        // update sort change
                        if (sortListChanged(c, sortList)) {
                            ts.sortOn(c, sortList);
                        }
                    }
                }
            },
            remove: function (table, c) {
                c.$table.removeClass('hasSaveSort');
                // clear storage
                if (ts.storage) { ts.storage(table, 'tablesorter-savesort', ''); }
            }
        });

    })(jQuery);
    return jQuery.tablesorter;
}));


//Data table shorting
/*
	A simple, lightweight jQuery plugin for creating sortable tables.
	https://github.com/kylefox/jquery-tablesort
	Version 0.0.11
*/

//(function ($) {
//    $.tablesort = function ($table, settings) {
//        var self = this;
//        this.$table = $table;
//        this.$thead = this.$table.find('thead');
//        this.settings = $.extend({}, $.tablesort.defaults, settings);
//        this.$sortCells = this.$thead.length > 0 ? this.$thead.find('th:not(.no-sort)') : this.$table.find('th:not(.no-sort)');
//        this.$sortCells.on('click.tablesort', function () {
//            self.sort($(this));
//        });
//        this.index = null;
//        this.$th = null;
//        this.direction = null;
//    };

//    $.tablesort.prototype = {
//        sort: function (th, direction) {
//            var start = new Date(),
//                self = this,
//                table = this.$table,
//                rowsContainer = table.find('tbody').length > 0 ? table.find('tbody') : table,
//                rows = rowsContainer.find('tr').has('td, th'),
//                cells = rows.find(':nth-child(' + (th.index() + 1) + ')').filter('td, th'),
//                sortBy = th.data().sortBy,
//                sortedMap = [];

//            var unsortedValues = cells.map(function (idx, cell) {
//                if (sortBy)
//                    return (typeof sortBy === 'function') ? sortBy($(th), $(cell), self) : sortBy;
//                return ($(this).data().sortValue != null ? $(this).data().sortValue : $(this).text());
//            });
//            if (unsortedValues.length === 0) return;

//            //click on a different column
//            if (this.index !== th.index()) {
//                this.direction = 'asc';
//                this.index = th.index();
//            }
//            else if (direction !== 'asc' && direction !== 'desc')
//                this.direction = this.direction === 'asc' ? 'desc' : 'asc';
//            else
//                this.direction = direction;

//            direction = this.direction == 'asc' ? 1 : -1;

//            self.$table.trigger('tablesort:start', [self]);
//            self.log("Sorting by " + this.index + ' ' + this.direction);

//            // Try to force a browser redraw
//            self.$table.css("display");
//            // Run sorting asynchronously on a timeout to force browser redraw after
//            // `tablesort:start` callback. Also avoids locking up the browser too much.
//            setTimeout(function () {
//                self.$sortCells.removeClass(self.settings.asc + ' ' + self.settings.desc);
//                for (var i = 0, length = unsortedValues.length; i < length; i++) {
//                    sortedMap.push({
//                        index: i,
//                        cell: cells[i],
//                        row: rows[i],
//                        value: unsortedValues[i]
//                    });
//                }

//                sortedMap.sort(function (a, b) {
//                    return self.settings.compare(a.value, b.value) * direction;
//                });

//                $.each(sortedMap, function (i, entry) {
//                    rowsContainer.append(entry.row);
//                });

//                th.addClass(self.settings[self.direction]);

//                self.log('Sort finished in ' + ((new Date()).getTime() - start.getTime()) + 'ms');
//                self.$table.trigger('tablesort:complete', [self]);
//                //Try to force a browser redraw
//                self.$table.css("display");
//            }, unsortedValues.length > 2000 ? 200 : 10);
//        },

//        log: function (msg) {
//            if (($.tablesort.DEBUG || this.settings.debug) && console && console.log) {
//                console.log('[tablesort] ' + msg);
//            }
//        },

//        destroy: function () {
//            this.$sortCells.off('click.tablesort');
//            this.$table.data('tablesort', null);
//            return null;
//        }
//    };

//    $.tablesort.DEBUG = false;

//    $.tablesort.defaults = {
//        debug: $.tablesort.DEBUG,
//        asc: 'sorted ascending',
//        desc: 'sorted descending',
//        compare: function (a, b) {
//            if (a > b) {
//                return 1;
//            } else if (a < b) {
//                return -1;
//            } else {
//                return 0;
//            }
//        }
//    };

//    $.fn.tablesort = function (settings) {
//        var table, sortable, previous;
//        return this.each(function () {
//            table = $(this);
//            previous = table.data('tablesort');
//            if (previous) {
//                previous.destroy();
//            }
//            table.data('tablesort', new $.tablesort(table, settings));
//        });
//    };
//})(window.Zepto || window.jQuery);

//ColExpand
// colResizable 1.6 - a jQuery plugin by Alvaro Prieto Lauroba http://www.bacubacu.com/colresizable/

//!function (t) { var e, i = t(document), r = t("head"), o = null, s = {}, d = 0, n = "id", a = "px", l = "JColResizer", c = "JCLRFlex", f = parseInt, h = Math, p = navigator.userAgent.indexOf("Trident/4.0") > 0; try { e = sessionStorage } catch (g) { } r.append("<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer > tbody > tr > td, .JColResizer > tbody > tr > th{overflow:hidden;padding-left:0!important; padding-right:0!important;}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: e-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;} .JCLRgrip.JCLRdisabledGrip .JColResizer{cursor:default; display:none;}</style>"); var u = function (e, i) { var o = t(e); if (o.opt = i, o.mode = i.resizeMode, o.dc = o.opt.disabledColumns, o.opt.disable) return w(o); var a = o.id = o.attr(n) || l + d++; o.p = o.opt.postbackSafe, !o.is("table") || s[a] && !o.opt.partialRefresh || ("e-resize" !== o.opt.hoverCursor && r.append("<style type='text/css'>.JCLRgrip .JColResizer:hover{cursor:" + o.opt.hoverCursor + "!important}</style>"), o.addClass(l).attr(n, a).before('<div class="JCLRgrips"/>'), o.g = [], o.c = [], o.w = o.width(), o.gc = o.prev(), o.f = o.opt.fixed, i.marginLeft && o.gc.css("marginLeft", i.marginLeft), i.marginRight && o.gc.css("marginRight", i.marginRight), o.cs = f(p ? e.cellSpacing || e.currentStyle.borderSpacing : o.css("border-spacing")) || 2, o.b = f(p ? e.border || e.currentStyle.borderLeftWidth : o.css("border-left-width")) || 1, s[a] = o, v(o)) }, w = function (t) { var e = t.attr(n), t = s[e]; t && t.is("table") && (t.removeClass(l + " " + c).gc.remove(), delete s[e]) }, v = function (i) { var r = i.find(">thead>tr:first>th,>thead>tr:first>td"); r.length || (r = i.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td")), r = r.filter(":visible"), i.cg = i.find("col"), i.ln = r.length, i.p && e && e[i.id] && m(i, r), r.each(function (e) { var r = t(this), o = -1 != i.dc.indexOf(e), s = t(i.gc.append('<div class="JCLRgrip"></div>')[0].lastChild); s.append(o ? "" : i.opt.gripInnerHtml).append('<div class="' + l + '"></div>'), e == i.ln - 1 && (s.addClass("JCLRLastGrip"), i.f && s.html("")), s.bind("touchstart mousedown", J), o ? s.addClass("JCLRdisabledGrip") : s.removeClass("JCLRdisabledGrip").bind("touchstart mousedown", J), s.t = i, s.i = e, s.c = r, r.w = r.width(), i.g.push(s), i.c.push(r), r.width(r.w).removeAttr("width"), s.data(l, { i: e, t: i.attr(n), last: e == i.ln - 1 }) }), i.cg.removeAttr("width"), i.find("td, th").not(r).not("table th, table td").each(function () { t(this).removeAttr("width") }), i.f || i.removeAttr("width").addClass(c), C(i) }, m = function (t, i) { var r, o, s = 0, d = 0, n = []; if (i) { if (t.cg.removeAttr("width"), t.opt.flush) return void (e[t.id] = ""); for (r = e[t.id].split(";"), o = r[t.ln + 1], !t.f && o && (t.width(o *= 1), t.opt.overflow && (t.css("min-width", o + a), t.w = o)); d < t.ln; d++)n.push(100 * r[d] / r[t.ln] + "%"), i.eq(d).css("width", n[d]); for (d = 0; d < t.ln; d++)t.cg.eq(d).css("width", n[d]) } else { for (e[t.id] = ""; d < t.c.length; d++)r = t.c[d].width(), e[t.id] += r + ";", s += r; e[t.id] += s, t.f || (e[t.id] += ";" + t.width()) } }, C = function (t) { t.gc.width(t.w); for (var e = 0; e < t.ln; e++) { var i = t.c[e]; t.g[e].css({ left: i.offset().left - t.offset().left + i.outerWidth(!1) + t.cs / 2 + a, height: t.opt.headerOnly ? t.c[0].outerHeight(!1) : t.outerHeight(!1) }) } }, b = function (t, e, i) { var r = o.x - o.l, s = t.c[e], d = t.c[e + 1], n = s.w + r, l = d.w - r; s.width(n + a), t.cg.eq(e).width(n + a), t.f ? (d.width(l + a), t.cg.eq(e + 1).width(l + a)) : t.opt.overflow && t.css("min-width", t.w + r), i && (s.w = n, d.w = t.f ? l : d.w) }, R = function (e) { var i = t.map(e.c, function (t) { return t.width() }); e.width(e.w = e.width()).removeClass(c), t.each(e.c, function (t, e) { e.width(i[t]).w = i[t] }), e.addClass(c) }, x = function (t) { if (o) { var e = o.t, i = t.originalEvent.touches, r = i ? i[0].pageX : t.pageX, s = r - o.ox + o.l, d = e.opt.minWidth, n = o.i, l = 1.5 * e.cs + d + e.b, c = n == e.ln - 1, f = n ? e.g[n - 1].position().left + e.cs + d : l, p = e.f ? n == e.ln - 1 ? e.w - l : e.g[n + 1].position().left - e.cs - d : 1 / 0; if (s = h.max(f, h.min(p, s)), o.x = s, o.css("left", s + a), c) { var g = e.c[o.i]; o.w = g.w + s - o.l } if (e.opt.liveDrag) { c ? (g.width(o.w), !e.f && e.opt.overflow ? e.css("min-width", e.w + s - o.l) : e.w = e.width()) : b(e, n), C(e); var u = e.opt.onDrag; u && (t.currentTarget = e[0], u(t)) } return !1 } }, y = function (r) { if (i.unbind("touchend." + l + " mouseup." + l).unbind("touchmove." + l + " mousemove." + l), t("head :last-child").remove(), o) { if (o.removeClass(o.t.opt.draggingClass), o.x - o.l != 0) { var s = o.t, d = s.opt.onResize, n = o.i, a = n == s.ln - 1, c = s.g[n].c; a ? (c.width(o.w), c.w = o.w) : b(s, n, !0), s.f || R(s), C(s), d && (r.currentTarget = s[0], d(r)), s.p && e && m(s) } o = null } }, J = function (e) { var d = t(this).data(l), n = s[d.t], a = n.g[d.i], c = e.originalEvent.touches; if (a.ox = c ? c[0].pageX : e.pageX, a.l = a.position().left, a.x = a.l, i.bind("touchmove." + l + " mousemove." + l, x).bind("touchend." + l + " mouseup." + l, y), r.append("<style type='text/css'>*{cursor:" + n.opt.dragCursor + "!important}</style>"), a.addClass(n.opt.draggingClass), o = a, n.c[d.i].l) for (var f, h = 0; h < n.ln; h++)f = n.c[h], f.l = !1, f.w = f.width(); return !1 }, L = function () { for (var t in s) if (s.hasOwnProperty(t)) { t = s[t]; var i, r = 0; if (t.removeClass(l), t.f) { for (t.w = t.width(), i = 0; i < t.ln; i++)r += t.c[i].w; for (i = 0; i < t.ln; i++)t.c[i].css("width", h.round(1e3 * t.c[i].w / r) / 10 + "%").l = !0 } else R(t), "flex" == t.mode && t.p && e && m(t); C(t.addClass(l)) } }; t(window).bind("resize." + l, L), t.fn.extend({ colResizable: function (e) { var i = { resizeMode: "fit", draggingClass: "JCLRgripDrag", gripInnerHtml: "", liveDrag: !1, minWidth: 15, headerOnly: !1, hoverCursor: "e-resize", dragCursor: "e-resize", postbackSafe: !1, flush: !1, marginLeft: null, marginRight: null, disable: !1, partialRefresh: !1, disabledColumns: [], onDrag: null, onResize: null }, e = t.extend(i, e); switch (e.fixed = !0, e.overflow = !1, e.resizeMode) { case "flex": e.fixed = !1; break; case "overflow": e.fixed = !1, e.overflow = !0 }return this.each(function () { u(this, e) }) } }) }(jQuery);

//Merged v
/*! jQuery UI - v1.10.2 - 2013-03-14
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.effect.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.position.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function (t, e) { function i(e, i) { var n, o, a, r = e.nodeName.toLowerCase(); return "area" === r ? (n = e.parentNode, o = n.name, e.href && o && "map" === n.nodeName.toLowerCase() ? (a = t("img[usemap=#" + o + "]")[0], !!a && s(a)) : !1) : (/input|select|textarea|button|object/.test(r) ? !e.disabled : "a" === r ? e.href || i : i) && s(e) } function s(e) { return t.expr.filters.visible(e) && !t(e).parents().addBack().filter(function () { return "hidden" === t.css(this, "visibility") }).length } var n = 0, o = /^ui-id-\d+$/; t.ui = t.ui || {}, t.extend(t.ui, { version: "1.10.2", keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 } }), t.fn.extend({ focus: function (e) { return function (i, s) { return "number" == typeof i ? this.each(function () { var e = this; setTimeout(function () { t(e).focus(), s && s.call(e) }, i) }) : e.apply(this, arguments) } }(t.fn.focus), scrollParent: function () { var e; return e = t.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () { return /(relative|absolute|fixed)/.test(t.css(this, "position")) && /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x")) }).eq(0) : this.parents().filter(function () { return /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x")) }).eq(0), /fixed/.test(this.css("position")) || !e.length ? t(document) : e }, zIndex: function (i) { if (i !== e) return this.css("zIndex", i); if (this.length) for (var s, n, o = t(this[0]); o.length && o[0] !== document;) { if (s = o.css("position"), ("absolute" === s || "relative" === s || "fixed" === s) && (n = parseInt(o.css("zIndex"), 10), !isNaN(n) && 0 !== n)) return n; o = o.parent() } return 0 }, uniqueId: function () { return this.each(function () { this.id || (this.id = "ui-id-" + ++n) }) }, removeUniqueId: function () { return this.each(function () { o.test(this.id) && t(this).removeAttr("id") }) } }), t.extend(t.expr[":"], { data: t.expr.createPseudo ? t.expr.createPseudo(function (e) { return function (i) { return !!t.data(i, e) } }) : function (e, i, s) { return !!t.data(e, s[3]) }, focusable: function (e) { return i(e, !isNaN(t.attr(e, "tabindex"))) }, tabbable: function (e) { var s = t.attr(e, "tabindex"), n = isNaN(s); return (n || s >= 0) && i(e, !n) } }), t("<a>").outerWidth(1).jquery || t.each(["Width", "Height"], function (i, s) { function n(e, i, s, n) { return t.each(o, function () { i -= parseFloat(t.css(e, "padding" + this)) || 0, s && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), n && (i -= parseFloat(t.css(e, "margin" + this)) || 0) }), i } var o = "Width" === s ? ["Left", "Right"] : ["Top", "Bottom"], a = s.toLowerCase(), r = { innerWidth: t.fn.innerWidth, innerHeight: t.fn.innerHeight, outerWidth: t.fn.outerWidth, outerHeight: t.fn.outerHeight }; t.fn["inner" + s] = function (i) { return i === e ? r["inner" + s].call(this) : this.each(function () { t(this).css(a, n(this, i) + "px") }) }, t.fn["outer" + s] = function (e, i) { return "number" != typeof e ? r["outer" + s].call(this, e) : this.each(function () { t(this).css(a, n(this, e, !0, i) + "px") }) } }), t.fn.addBack || (t.fn.addBack = function (t) { return this.add(null == t ? this.prevObject : this.prevObject.filter(t)) }), t("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (t.fn.removeData = function (e) { return function (i) { return arguments.length ? e.call(this, t.camelCase(i)) : e.call(this) } }(t.fn.removeData)), t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), t.support.selectstart = "onselectstart" in document.createElement("div"), t.fn.extend({ disableSelection: function () { return this.bind((t.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (t) { t.preventDefault() }) }, enableSelection: function () { return this.unbind(".ui-disableSelection") } }), t.extend(t.ui, { plugin: { add: function (e, i, s) { var n, o = t.ui[e].prototype; for (n in s) o.plugins[n] = o.plugins[n] || [], o.plugins[n].push([i, s[n]]) }, call: function (t, e, i) { var s, n = t.plugins[e]; if (n && t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType) for (s = 0; n.length > s; s++)t.options[n[s][0]] && n[s][1].apply(t.element, i) } }, hasScroll: function (e, i) { if ("hidden" === t(e).css("overflow")) return !1; var s = i && "left" === i ? "scrollLeft" : "scrollTop", n = !1; return e[s] > 0 ? !0 : (e[s] = 1, n = e[s] > 0, e[s] = 0, n) } }) })(jQuery), function (t, e) { var i = 0, s = Array.prototype.slice, n = t.cleanData; t.cleanData = function (e) { for (var i, s = 0; null != (i = e[s]); s++)try { t(i).triggerHandler("remove") } catch (o) { } n(e) }, t.widget = function (i, s, n) { var o, a, r, h, l = {}, c = i.split(".")[0]; i = i.split(".")[1], o = c + "-" + i, n || (n = s, s = t.Widget), t.expr[":"][o.toLowerCase()] = function (e) { return !!t.data(e, o) }, t[c] = t[c] || {}, a = t[c][i], r = t[c][i] = function (t, i) { return this._createWidget ? (arguments.length && this._createWidget(t, i), e) : new r(t, i) }, t.extend(r, a, { version: n.version, _proto: t.extend({}, n), _childConstructors: [] }), h = new s, h.options = t.widget.extend({}, h.options), t.each(n, function (i, n) { return t.isFunction(n) ? (l[i] = function () { var t = function () { return s.prototype[i].apply(this, arguments) }, e = function (t) { return s.prototype[i].apply(this, t) }; return function () { var i, s = this._super, o = this._superApply; return this._super = t, this._superApply = e, i = n.apply(this, arguments), this._super = s, this._superApply = o, i } }(), e) : (l[i] = n, e) }), r.prototype = t.widget.extend(h, { widgetEventPrefix: a ? h.widgetEventPrefix : i }, l, { constructor: r, namespace: c, widgetName: i, widgetFullName: o }), a ? (t.each(a._childConstructors, function (e, i) { var s = i.prototype; t.widget(s.namespace + "." + s.widgetName, r, i._proto) }), delete a._childConstructors) : s._childConstructors.push(r), t.widget.bridge(i, r) }, t.widget.extend = function (i) { for (var n, o, a = s.call(arguments, 1), r = 0, h = a.length; h > r; r++)for (n in a[r]) o = a[r][n], a[r].hasOwnProperty(n) && o !== e && (i[n] = t.isPlainObject(o) ? t.isPlainObject(i[n]) ? t.widget.extend({}, i[n], o) : t.widget.extend({}, o) : o); return i }, t.widget.bridge = function (i, n) { var o = n.prototype.widgetFullName || i; t.fn[i] = function (a) { var r = "string" == typeof a, h = s.call(arguments, 1), l = this; return a = !r && h.length ? t.widget.extend.apply(null, [a].concat(h)) : a, r ? this.each(function () { var s, n = t.data(this, o); return n ? t.isFunction(n[a]) && "_" !== a.charAt(0) ? (s = n[a].apply(n, h), s !== n && s !== e ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : e) : t.error("no such method '" + a + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + a + "'") }) : this.each(function () { var e = t.data(this, o); e ? e.option(a || {})._init() : t.data(this, o, new n(a, this)) }), l } }, t.Widget = function () { }, t.Widget._childConstructors = [], t.Widget.prototype = { widgetName: "widget", widgetEventPrefix: "", defaultElement: "<div>", options: { disabled: !1, create: null }, _createWidget: function (e, s) { s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = i++ , this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, { remove: function (t) { t.target === s && this.destroy() } }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init() }, _getCreateOptions: t.noop, _getCreateEventData: t.noop, _create: t.noop, _init: t.noop, destroy: function () { this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus") }, _destroy: t.noop, widget: function () { return this.element }, option: function (i, s) { var n, o, a, r = i; if (0 === arguments.length) return t.widget.extend({}, this.options); if ("string" == typeof i) if (r = {}, n = i.split("."), i = n.shift(), n.length) { for (o = r[i] = t.widget.extend({}, this.options[i]), a = 0; n.length - 1 > a; a++)o[n[a]] = o[n[a]] || {}, o = o[n[a]]; if (i = n.pop(), s === e) return o[i] === e ? null : o[i]; o[i] = s } else { if (s === e) return this.options[i] === e ? null : this.options[i]; r[i] = s } return this._setOptions(r), this }, _setOptions: function (t) { var e; for (e in t) this._setOption(e, t[e]); return this }, _setOption: function (t, e) { return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this }, enable: function () { return this._setOption("disabled", !1) }, disable: function () { return this._setOption("disabled", !0) }, _on: function (i, s, n) { var o, a = this; "boolean" != typeof i && (n = s, s = i, i = !1), n ? (s = o = t(s), this.bindings = this.bindings.add(s)) : (n = s, s = this.element, o = this.widget()), t.each(n, function (n, r) { function h() { return i || a.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? a[r] : r).apply(a, arguments) : e } "string" != typeof r && (h.guid = r.guid = r.guid || h.guid || t.guid++); var l = n.match(/^(\w+)\s*(.*)$/), c = l[1] + a.eventNamespace, u = l[2]; u ? o.delegate(u, c, h) : s.bind(c, h) }) }, _off: function (t, e) { e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e) }, _delay: function (t, e) { function i() { return ("string" == typeof t ? s[t] : t).apply(s, arguments) } var s = this; return setTimeout(i, e || 0) }, _hoverable: function (e) { this.hoverable = this.hoverable.add(e), this._on(e, { mouseenter: function (e) { t(e.currentTarget).addClass("ui-state-hover") }, mouseleave: function (e) { t(e.currentTarget).removeClass("ui-state-hover") } }) }, _focusable: function (e) { this.focusable = this.focusable.add(e), this._on(e, { focusin: function (e) { t(e.currentTarget).addClass("ui-state-focus") }, focusout: function (e) { t(e.currentTarget).removeClass("ui-state-focus") } }) }, _trigger: function (e, i, s) { var n, o, a = this.options[e]; if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent) for (n in o) n in i || (i[n] = o[n]); return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented()) } }, t.each({ show: "fadeIn", hide: "fadeOut" }, function (e, i) { t.Widget.prototype["_" + e] = function (s, n, o) { "string" == typeof n && (n = { effect: n }); var a, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e; n = n || {}, "number" == typeof n && (n = { duration: n }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) { t(this)[e](), o && o.call(s[0]), i() }) } }) }(jQuery), function (t) { var e = !1; t(document).mouseup(function () { e = !1 }), t.widget("ui.mouse", { version: "1.10.2", options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 }, _mouseInit: function () { var e = this; this.element.bind("mousedown." + this.widgetName, function (t) { return e._mouseDown(t) }).bind("click." + this.widgetName, function (i) { return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined }), this.started = !1 }, _mouseDestroy: function () { this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate) }, _mouseDown: function (i) { if (!e) { this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i; var s = this, n = 1 === i.which, o = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1; return n && !o && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () { s.mouseDelayMet = !0 }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) { return s._mouseMove(t) }, this._mouseUpDelegate = function (t) { return s._mouseUp(t) }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0)) : !0 } }, _mouseMove: function (e) { return t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted) }, _mouseUp: function (e) { return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1 }, _mouseDistanceMet: function (t) { return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance }, _mouseDelayMet: function () { return this.mouseDelayMet }, _mouseStart: function () { }, _mouseDrag: function () { }, _mouseStop: function () { }, _mouseCapture: function () { return !0 } }) }(jQuery), function (t) { t.widget("ui.draggable", t.ui.mouse, { version: "1.10.2", widgetEventPrefix: "drag", options: { addClasses: !0, appendTo: "parent", axis: !1, connectToSortable: !1, containment: !1, cursor: "auto", cursorAt: !1, grid: !1, handle: !1, helper: "original", iframeFix: !1, opacity: !1, refreshPositions: !1, revert: !1, revertDuration: 500, scope: "default", scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, snap: !1, snapMode: "both", snapTolerance: 20, stack: !1, zIndex: !1, drag: null, start: null, stop: null }, _create: function () { "original" !== this.options.helper || /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit() }, _destroy: function () { this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy() }, _mouseCapture: function (e) { var i = this.options; return this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), this.handle ? (t(i.iframeFix === !0 ? "iframe" : i.iframeFix).each(function () { t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({ width: this.offsetWidth + "px", height: this.offsetHeight + "px", position: "absolute", opacity: "0.001", zIndex: 1e3 }).css(t(this).offset()).appendTo("body") }), !0) : !1) }, _mouseStart: function (e) { var i = this.options; return this.helper = this._createHelper(e), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = { top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left }, t.extend(this.offset, { click: { left: e.pageX - this.offset.left, top: e.pageY - this.offset.top }, parent: this._getParentOffset(), relative: this._getRelativeOffset() }), this.originalPosition = this.position = this._generatePosition(e), this.originalPageX = e.pageX, this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), i.containment && this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0) }, _mouseDrag: function (e, i) { if (this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), !i) { var s = this._uiHash(); if (this._trigger("drag", e, s) === !1) return this._mouseUp({}), !1; this.position = s.position } return this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1 }, _mouseStop: function (e) { var i, s = this, n = !1, o = !1; for (t.ui.ddmanager && !this.options.dropBehaviour && (o = t.ui.ddmanager.drop(this, e)), this.dropped && (o = this.dropped, this.dropped = !1), i = this.element[0]; i && (i = i.parentNode);)i === document && (n = !0); return n || "original" !== this.options.helper ? ("invalid" === this.options.revert && !o || "valid" === this.options.revert && o || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, o) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () { s._trigger("stop", e) !== !1 && s._clear() }) : this._trigger("stop", e) !== !1 && this._clear(), !1) : !1 }, _mouseUp: function (e) { return t("div.ui-draggable-iframeFix").each(function () { this.parentNode.removeChild(this) }), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), t.ui.mouse.prototype._mouseUp.call(this, e) }, cancel: function () { return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this }, _getHandle: function (e) { return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0 }, _createHelper: function (e) { var i = this.options, s = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element; return s.parents("body").length || s.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), s[0] === this.element[0] || /(fixed|absolute)/.test(s.css("position")) || s.css("position", "absolute"), s }, _adjustOffsetFromHelper: function (e) { "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = { left: +e[0], top: +e[1] || 0 }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top) }, _getParentOffset: function () { this.offsetParent = this.helper.offsetParent(); var e = this.offsetParent.offset(); return "absolute" === this.cssPosition && this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = { top: 0, left: 0 }), { top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0) } }, _getRelativeOffset: function () { if ("relative" === this.cssPosition) { var t = this.element.position(); return { top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft() } } return { top: 0, left: 0 } }, _cacheMargins: function () { this.margins = { left: parseInt(this.element.css("marginLeft"), 10) || 0, top: parseInt(this.element.css("marginTop"), 10) || 0, right: parseInt(this.element.css("marginRight"), 10) || 0, bottom: parseInt(this.element.css("marginBottom"), 10) || 0 } }, _cacheHelperProportions: function () { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() } }, _setContainment: function () { var e, i, s, n = this.options; if ("parent" === n.containment && (n.containment = this.helper[0].parentNode), ("document" === n.containment || "window" === n.containment) && (this.containment = ["document" === n.containment ? 0 : t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, "document" === n.containment ? 0 : t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, ("document" === n.containment ? 0 : t(window).scrollLeft()) + t("document" === n.containment ? document : window).width() - this.helperProportions.width - this.margins.left, ("document" === n.containment ? 0 : t(window).scrollTop()) + (t("document" === n.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), /^(document|window|parent)$/.test(n.containment) || n.containment.constructor === Array) n.containment.constructor === Array && (this.containment = n.containment); else { if (i = t(n.containment), s = i[0], !s) return; e = "hidden" !== t(s).css("overflow"), this.containment = [(parseInt(t(s).css("borderLeftWidth"), 10) || 0) + (parseInt(t(s).css("paddingLeft"), 10) || 0), (parseInt(t(s).css("borderTopWidth"), 10) || 0) + (parseInt(t(s).css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(t(s).css("borderRightWidth"), 10) || 0) - (parseInt(t(s).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(t(s).css("borderBottomWidth"), 10) || 0) - (parseInt(t(s).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = i } }, _convertPositionTo: function (e, i) { i || (i = this.position); var s = "absolute" === e ? 1 : -1, n = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, o = /(html|body)/i.test(n[0].tagName); return { top: i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : o ? 0 : n.scrollTop()) * s, left: i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : o ? 0 : n.scrollLeft()) * s } }, _generatePosition: function (e) { var i, s, n, o, a = this.options, r = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, h = /(html|body)/i.test(r[0].tagName), l = e.pageX, c = e.pageY; return this.originalPosition && (this.containment && (this.relative_container ? (s = this.relative_container.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, e.pageX - this.offset.click.left < i[0] && (l = i[0] + this.offset.click.left), e.pageY - this.offset.click.top < i[1] && (c = i[1] + this.offset.click.top), e.pageX - this.offset.click.left > i[2] && (l = i[2] + this.offset.click.left), e.pageY - this.offset.click.top > i[3] && (c = i[3] + this.offset.click.top)), a.grid && (n = a.grid[1] ? this.originalPageY + Math.round((c - this.originalPageY) / a.grid[1]) * a.grid[1] : this.originalPageY, c = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - a.grid[1] : n + a.grid[1] : n, o = a.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / a.grid[0]) * a.grid[0] : this.originalPageX, l = i ? o - this.offset.click.left >= i[0] || o - this.offset.click.left > i[2] ? o : o - this.offset.click.left >= i[0] ? o - a.grid[0] : o + a.grid[0] : o)), { top: c - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : h ? 0 : r.scrollTop()), left: l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : h ? 0 : r.scrollLeft()) } }, _clear: function () { this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1 }, _trigger: function (e, i, s) { return s = s || this._uiHash(), t.ui.plugin.call(this, e, [i, s]), "drag" === e && (this.positionAbs = this._convertPositionTo("absolute")), t.Widget.prototype._trigger.call(this, e, i, s) }, plugins: {}, _uiHash: function () { return { helper: this.helper, position: this.position, originalPosition: this.originalPosition, offset: this.positionAbs } } }), t.ui.plugin.add("draggable", "connectToSortable", { start: function (e, i) { var s = t(this).data("ui-draggable"), n = s.options, o = t.extend({}, i, { item: s.element }); s.sortables = [], t(n.connectToSortable).each(function () { var i = t.data(this, "ui-sortable"); i && !i.options.disabled && (s.sortables.push({ instance: i, shouldRevert: i.options.revert }), i.refreshPositions(), i._trigger("activate", e, o)) }) }, stop: function (e, i) { var s = t(this).data("ui-draggable"), n = t.extend({}, i, { item: s.element }); t.each(s.sortables, function () { this.instance.isOver ? (this.instance.isOver = 0, s.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = this.shouldRevert), this.instance._mouseStop(e), this.instance.options.helper = this.instance.options._helper, "original" === s.options.helper && this.instance.currentItem.css({ top: "auto", left: "auto" })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", e, n)) }) }, drag: function (e, i) { var s = t(this).data("ui-draggable"), n = this; t.each(s.sortables, function () { var o = !1, a = this; this.instance.positionAbs = s.positionAbs, this.instance.helperProportions = s.helperProportions, this.instance.offset.click = s.offset.click, this.instance._intersectsWith(this.instance.containerCache) && (o = !0, t.each(s.sortables, function () { return this.instance.positionAbs = s.positionAbs, this.instance.helperProportions = s.helperProportions, this.instance.offset.click = s.offset.click, this !== a && this.instance._intersectsWith(this.instance.containerCache) && t.contains(a.instance.element[0], this.instance.element[0]) && (o = !1), o })), o ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function () { return i.helper[0] }, e.target = this.instance.currentItem[0], this.instance._mouseCapture(e, !0), this.instance._mouseStart(e, !0, !0), this.instance.offset.click.top = s.offset.click.top, this.instance.offset.click.left = s.offset.click.left, this.instance.offset.parent.left -= s.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= s.offset.parent.top - this.instance.offset.parent.top, s._trigger("toSortable", e), s.dropped = this.instance.element, s.currentItem = s.element, this.instance.fromOutside = s), this.instance.currentItem && this.instance._mouseDrag(e)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", e, this.instance._uiHash(this.instance)), this.instance._mouseStop(e, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), s._trigger("fromSortable", e), s.dropped = !1) }) } }), t.ui.plugin.add("draggable", "cursor", { start: function () { var e = t("body"), i = t(this).data("ui-draggable").options; e.css("cursor") && (i._cursor = e.css("cursor")), e.css("cursor", i.cursor) }, stop: function () { var e = t(this).data("ui-draggable").options; e._cursor && t("body").css("cursor", e._cursor) } }), t.ui.plugin.add("draggable", "opacity", { start: function (e, i) { var s = t(i.helper), n = t(this).data("ui-draggable").options; s.css("opacity") && (n._opacity = s.css("opacity")), s.css("opacity", n.opacity) }, stop: function (e, i) { var s = t(this).data("ui-draggable").options; s._opacity && t(i.helper).css("opacity", s._opacity) } }), t.ui.plugin.add("draggable", "scroll", { start: function () { var e = t(this).data("ui-draggable"); e.scrollParent[0] !== document && "HTML" !== e.scrollParent[0].tagName && (e.overflowOffset = e.scrollParent.offset()) }, drag: function (e) { var i = t(this).data("ui-draggable"), s = i.options, n = !1; i.scrollParent[0] !== document && "HTML" !== i.scrollParent[0].tagName ? (s.axis && "x" === s.axis || (i.overflowOffset.top + i.scrollParent[0].offsetHeight - e.pageY < s.scrollSensitivity ? i.scrollParent[0].scrollTop = n = i.scrollParent[0].scrollTop + s.scrollSpeed : e.pageY - i.overflowOffset.top < s.scrollSensitivity && (i.scrollParent[0].scrollTop = n = i.scrollParent[0].scrollTop - s.scrollSpeed)), s.axis && "y" === s.axis || (i.overflowOffset.left + i.scrollParent[0].offsetWidth - e.pageX < s.scrollSensitivity ? i.scrollParent[0].scrollLeft = n = i.scrollParent[0].scrollLeft + s.scrollSpeed : e.pageX - i.overflowOffset.left < s.scrollSensitivity && (i.scrollParent[0].scrollLeft = n = i.scrollParent[0].scrollLeft - s.scrollSpeed))) : (s.axis && "x" === s.axis || (e.pageY - t(document).scrollTop() < s.scrollSensitivity ? n = t(document).scrollTop(t(document).scrollTop() - s.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < s.scrollSensitivity && (n = t(document).scrollTop(t(document).scrollTop() + s.scrollSpeed))), s.axis && "y" === s.axis || (e.pageX - t(document).scrollLeft() < s.scrollSensitivity ? n = t(document).scrollLeft(t(document).scrollLeft() - s.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < s.scrollSensitivity && (n = t(document).scrollLeft(t(document).scrollLeft() + s.scrollSpeed)))), n !== !1 && t.ui.ddmanager && !s.dropBehaviour && t.ui.ddmanager.prepareOffsets(i, e) } }), t.ui.plugin.add("draggable", "snap", { start: function () { var e = t(this).data("ui-draggable"), i = e.options; e.snapElements = [], t(i.snap.constructor !== String ? i.snap.items || ":data(ui-draggable)" : i.snap).each(function () { var i = t(this), s = i.offset(); this !== e.element[0] && e.snapElements.push({ item: this, width: i.outerWidth(), height: i.outerHeight(), top: s.top, left: s.left }) }) }, drag: function (e, i) { var s, n, o, a, r, h, l, c, u, d, p = t(this).data("ui-draggable"), f = p.options, g = f.snapTolerance, m = i.offset.left, v = m + p.helperProportions.width, _ = i.offset.top, b = _ + p.helperProportions.height; for (u = p.snapElements.length - 1; u >= 0; u--)r = p.snapElements[u].left, h = r + p.snapElements[u].width, l = p.snapElements[u].top, c = l + p.snapElements[u].height, m > r - g && h + g > m && _ > l - g && c + g > _ || m > r - g && h + g > m && b > l - g && c + g > b || v > r - g && h + g > v && _ > l - g && c + g > _ || v > r - g && h + g > v && b > l - g && c + g > b ? ("inner" !== f.snapMode && (s = g >= Math.abs(l - b), n = g >= Math.abs(c - _), o = g >= Math.abs(r - v), a = g >= Math.abs(h - m), s && (i.position.top = p._convertPositionTo("relative", { top: l - p.helperProportions.height, left: 0 }).top - p.margins.top), n && (i.position.top = p._convertPositionTo("relative", { top: c, left: 0 }).top - p.margins.top), o && (i.position.left = p._convertPositionTo("relative", { top: 0, left: r - p.helperProportions.width }).left - p.margins.left), a && (i.position.left = p._convertPositionTo("relative", { top: 0, left: h }).left - p.margins.left)), d = s || n || o || a, "outer" !== f.snapMode && (s = g >= Math.abs(l - _), n = g >= Math.abs(c - b), o = g >= Math.abs(r - m), a = g >= Math.abs(h - v), s && (i.position.top = p._convertPositionTo("relative", { top: l, left: 0 }).top - p.margins.top), n && (i.position.top = p._convertPositionTo("relative", { top: c - p.helperProportions.height, left: 0 }).top - p.margins.top), o && (i.position.left = p._convertPositionTo("relative", { top: 0, left: r }).left - p.margins.left), a && (i.position.left = p._convertPositionTo("relative", { top: 0, left: h - p.helperProportions.width }).left - p.margins.left)), !p.snapElements[u].snapping && (s || n || o || a || d) && p.options.snap.snap && p.options.snap.snap.call(p.element, e, t.extend(p._uiHash(), { snapItem: p.snapElements[u].item })), p.snapElements[u].snapping = s || n || o || a || d) : (p.snapElements[u].snapping && p.options.snap.release && p.options.snap.release.call(p.element, e, t.extend(p._uiHash(), { snapItem: p.snapElements[u].item })), p.snapElements[u].snapping = !1) } }), t.ui.plugin.add("draggable", "stack", { start: function () { var e, i = this.data("ui-draggable").options, s = t.makeArray(t(i.stack)).sort(function (e, i) { return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0) }); s.length && (e = parseInt(t(s[0]).css("zIndex"), 10) || 0, t(s).each(function (i) { t(this).css("zIndex", e + i) }), this.css("zIndex", e + s.length)) } }), t.ui.plugin.add("draggable", "zIndex", { start: function (e, i) { var s = t(i.helper), n = t(this).data("ui-draggable").options; s.css("zIndex") && (n._zIndex = s.css("zIndex")), s.css("zIndex", n.zIndex) }, stop: function (e, i) { var s = t(this).data("ui-draggable").options; s._zIndex && t(i.helper).css("zIndex", s._zIndex) } }) }(jQuery), function (t) {
    function e(t, e, i) { return t > e && e + i > t } t.widget("ui.droppable", {
        version: "1.10.2", widgetEventPrefix: "drop", options: { accept: "*", activeClass: !1, addClasses: !0, greedy: !1, hoverClass: !1, scope: "default", tolerance: "intersect", activate: null, deactivate: null, drop: null, out: null, over: null }, _create: function () {
            var e = this.options, i = e.accept; this.isover = !1, this.isout = !0, this.accept = t.isFunction(i) ? i : function (t) { return t.is(i) }, this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight }, t.ui.ddmanager.droppables[e.scope] = t.ui.ddmanager.droppables[e.scope] || [], t.ui.ddmanager.droppables[e.scope].push(this), e.addClasses && this.element.addClass("ui-droppable")
        }, _destroy: function () { for (var e = 0, i = t.ui.ddmanager.droppables[this.options.scope]; i.length > e; e++)i[e] === this && i.splice(e, 1); this.element.removeClass("ui-droppable ui-droppable-disabled") }, _setOption: function (e, i) { "accept" === e && (this.accept = t.isFunction(i) ? i : function (t) { return t.is(i) }), t.Widget.prototype._setOption.apply(this, arguments) }, _activate: function (e) { var i = t.ui.ddmanager.current; this.options.activeClass && this.element.addClass(this.options.activeClass), i && this._trigger("activate", e, this.ui(i)) }, _deactivate: function (e) { var i = t.ui.ddmanager.current; this.options.activeClass && this.element.removeClass(this.options.activeClass), i && this._trigger("deactivate", e, this.ui(i)) }, _over: function (e) { var i = t.ui.ddmanager.current; i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", e, this.ui(i))) }, _out: function (e) { var i = t.ui.ddmanager.current; i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", e, this.ui(i))) }, _drop: function (e, i) { var s = i || t.ui.ddmanager.current, n = !1; return s && (s.currentItem || s.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () { var e = t.data(this, "ui-droppable"); return e.options.greedy && !e.options.disabled && e.options.scope === s.options.scope && e.accept.call(e.element[0], s.currentItem || s.element) && t.ui.intersect(s, t.extend(e, { offset: e.element.offset() }), e.options.tolerance) ? (n = !0, !1) : undefined }), n ? !1 : this.accept.call(this.element[0], s.currentItem || s.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", e, this.ui(s)), this.element) : !1) : !1 }, ui: function (t) { return { draggable: t.currentItem || t.element, helper: t.helper, position: t.position, offset: t.positionAbs } }
    }), t.ui.intersect = function (t, i, s) { if (!i.offset) return !1; var n, o, a = (t.positionAbs || t.position.absolute).left, r = a + t.helperProportions.width, h = (t.positionAbs || t.position.absolute).top, l = h + t.helperProportions.height, c = i.offset.left, u = c + i.proportions.width, d = i.offset.top, p = d + i.proportions.height; switch (s) { case "fit": return a >= c && u >= r && h >= d && p >= l; case "intersect": return a + t.helperProportions.width / 2 > c && u > r - t.helperProportions.width / 2 && h + t.helperProportions.height / 2 > d && p > l - t.helperProportions.height / 2; case "pointer": return n = (t.positionAbs || t.position.absolute).left + (t.clickOffset || t.offset.click).left, o = (t.positionAbs || t.position.absolute).top + (t.clickOffset || t.offset.click).top, e(o, d, i.proportions.height) && e(n, c, i.proportions.width); case "touch": return (h >= d && p >= h || l >= d && p >= l || d > h && l > p) && (a >= c && u >= a || r >= c && u >= r || c > a && r > u); default: return !1 } }, t.ui.ddmanager = { current: null, droppables: { "default": [] }, prepareOffsets: function (e, i) { var s, n, o = t.ui.ddmanager.droppables[e.options.scope] || [], a = i ? i.type : null, r = (e.currentItem || e.element).find(":data(ui-droppable)").addBack(); t: for (s = 0; o.length > s; s++)if (!(o[s].options.disabled || e && !o[s].accept.call(o[s].element[0], e.currentItem || e.element))) { for (n = 0; r.length > n; n++)if (r[n] === o[s].element[0]) { o[s].proportions.height = 0; continue t } o[s].visible = "none" !== o[s].element.css("display"), o[s].visible && ("mousedown" === a && o[s]._activate.call(o[s], i), o[s].offset = o[s].element.offset(), o[s].proportions = { width: o[s].element[0].offsetWidth, height: o[s].element[0].offsetHeight }) } }, drop: function (e, i) { var s = !1; return t.each((t.ui.ddmanager.droppables[e.options.scope] || []).slice(), function () { this.options && (!this.options.disabled && this.visible && t.ui.intersect(e, this, this.options.tolerance) && (s = this._drop.call(this, i) || s), !this.options.disabled && this.visible && this.accept.call(this.element[0], e.currentItem || e.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, i))) }), s }, dragStart: function (e, i) { e.element.parentsUntil("body").bind("scroll.droppable", function () { e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i) }) }, drag: function (e, i) { e.options.refreshPositions && t.ui.ddmanager.prepareOffsets(e, i), t.each(t.ui.ddmanager.droppables[e.options.scope] || [], function () { if (!this.options.disabled && !this.greedyChild && this.visible) { var s, n, o, a = t.ui.intersect(e, this, this.options.tolerance), r = !a && this.isover ? "isout" : a && !this.isover ? "isover" : null; r && (this.options.greedy && (n = this.options.scope, o = this.element.parents(":data(ui-droppable)").filter(function () { return t.data(this, "ui-droppable").options.scope === n }), o.length && (s = t.data(o[0], "ui-droppable"), s.greedyChild = "isover" === r)), s && "isover" === r && (s.isover = !1, s.isout = !0, s._out.call(s, i)), this[r] = !0, this["isout" === r ? "isover" : "isout"] = !1, this["isover" === r ? "_over" : "_out"].call(this, i), s && "isout" === r && (s.isout = !1, s.isover = !0, s._over.call(s, i))) } }) }, dragStop: function (e, i) { e.element.parentsUntil("body").unbind("scroll.droppable"), e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i) } }
}(jQuery), function (t) { function e(t) { return parseInt(t, 10) || 0 } function i(t) { return !isNaN(parseInt(t, 10)) } t.widget("ui.resizable", t.ui.mouse, { version: "1.10.2", widgetEventPrefix: "resize", options: { alsoResize: !1, animate: !1, animateDuration: "slow", animateEasing: "swing", aspectRatio: !1, autoHide: !1, containment: !1, ghost: !1, grid: !1, handles: "e,s,se", helper: !1, maxHeight: null, maxWidth: null, minHeight: 10, minWidth: 10, zIndex: 90, resize: null, start: null, stop: null }, _create: function () { var e, i, s, n, o, a = this, r = this.options; if (this.element.addClass("ui-resizable"), t.extend(this, { _aspectRatio: !!r.aspectRatio, aspectRatio: r.aspectRatio, originalElement: this.element, _proportionallyResizeElements: [], _helper: r.helper || r.ghost || r.animate ? r.helper || "ui-resizable-helper" : null }), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({ position: this.element.css("position"), width: this.element.outerWidth(), height: this.element.outerHeight(), top: this.element.css("top"), left: this.element.css("left") })), this.element = this.element.parent().data("ui-resizable", this.element.data("ui-resizable")), this.elementIsWrapper = !0, this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") }), this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0 }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" })), this.originalElement.css({ margin: this.originalElement.css("margin") }), this._proportionallyResize()), this.handles = r.handles || (t(".ui-resizable-handle", this.element).length ? { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw" } : "e,s,se"), this.handles.constructor === String) for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), e = this.handles.split(","), this.handles = {}, i = 0; e.length > i; i++)s = t.trim(e[i]), o = "ui-resizable-" + s, n = t("<div class='ui-resizable-handle " + o + "'></div>"), n.css({ zIndex: r.zIndex }), "se" === s && n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[s] = ".ui-resizable-" + s, this.element.append(n); this._renderAxis = function (e) { var i, s, n, o; e = e || this.element; for (i in this.handles) this.handles[i].constructor === String && (this.handles[i] = t(this.handles[i], this.element).show()), this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i) && (s = t(this.handles[i], this.element), o = /sw|ne|nw|se|n|s/.test(i) ? s.outerHeight() : s.outerWidth(), n = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join(""), e.css(n, o), this._proportionallyResize()), t(this.handles[i]).length }, this._renderAxis(this.element), this._handles = t(".ui-resizable-handle", this.element).disableSelection(), this._handles.mouseover(function () { a.resizing || (this.className && (n = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), a.axis = n && n[1] ? n[1] : "se") }), r.autoHide && (this._handles.hide(), t(this.element).addClass("ui-resizable-autohide").mouseenter(function () { r.disabled || (t(this).removeClass("ui-resizable-autohide"), a._handles.show()) }).mouseleave(function () { r.disabled || a.resizing || (t(this).addClass("ui-resizable-autohide"), a._handles.hide()) })), this._mouseInit() }, _destroy: function () { this._mouseDestroy(); var e, i = function (e) { t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove() }; return this.elementIsWrapper && (i(this.element), e = this.element, this.originalElement.css({ position: e.css("position"), width: e.outerWidth(), height: e.outerHeight(), top: e.css("top"), left: e.css("left") }).insertAfter(e), e.remove()), this.originalElement.css("resize", this.originalResizeStyle), i(this.originalElement), this }, _mouseCapture: function (e) { var i, s, n = !1; for (i in this.handles) s = t(this.handles[i])[0], (s === e.target || t.contains(s, e.target)) && (n = !0); return !this.options.disabled && n }, _mouseStart: function (i) { var s, n, o, a = this.options, r = this.element.position(), h = this.element; return this.resizing = !0, /absolute/.test(h.css("position")) ? h.css({ position: "absolute", top: h.css("top"), left: h.css("left") }) : h.is(".ui-draggable") && h.css({ position: "absolute", top: r.top, left: r.left }), this._renderProxy(), s = e(this.helper.css("left")), n = e(this.helper.css("top")), a.containment && (s += t(a.containment).scrollLeft() || 0, n += t(a.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = { left: s, top: n }, this.size = this._helper ? { width: h.outerWidth(), height: h.outerHeight() } : { width: h.width(), height: h.height() }, this.originalSize = this._helper ? { width: h.outerWidth(), height: h.outerHeight() } : { width: h.width(), height: h.height() }, this.originalPosition = { left: s, top: n }, this.sizeDiff = { width: h.outerWidth() - h.width(), height: h.outerHeight() - h.height() }, this.originalMousePosition = { left: i.pageX, top: i.pageY }, this.aspectRatio = "number" == typeof a.aspectRatio ? a.aspectRatio : this.originalSize.width / this.originalSize.height || 1, o = t(".ui-resizable-" + this.axis).css("cursor"), t("body").css("cursor", "auto" === o ? this.axis + "-resize" : o), h.addClass("ui-resizable-resizing"), this._propagate("start", i), !0 }, _mouseDrag: function (e) { var i, s = this.helper, n = {}, o = this.originalMousePosition, a = this.axis, r = this.position.top, h = this.position.left, l = this.size.width, c = this.size.height, u = e.pageX - o.left || 0, d = e.pageY - o.top || 0, p = this._change[a]; return p ? (i = p.apply(this, [e, u, d]), this._updateVirtualBoundaries(e.shiftKey), (this._aspectRatio || e.shiftKey) && (i = this._updateRatio(i, e)), i = this._respectSize(i, e), this._updateCache(i), this._propagate("resize", e), this.position.top !== r && (n.top = this.position.top + "px"), this.position.left !== h && (n.left = this.position.left + "px"), this.size.width !== l && (n.width = this.size.width + "px"), this.size.height !== c && (n.height = this.size.height + "px"), s.css(n), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), t.isEmptyObject(n) || this._trigger("resize", e, this.ui()), !1) : !1 }, _mouseStop: function (e) { this.resizing = !1; var i, s, n, o, a, r, h, l = this.options, c = this; return this._helper && (i = this._proportionallyResizeElements, s = i.length && /textarea/i.test(i[0].nodeName), n = s && t.ui.hasScroll(i[0], "left") ? 0 : c.sizeDiff.height, o = s ? 0 : c.sizeDiff.width, a = { width: c.helper.width() - o, height: c.helper.height() - n }, r = parseInt(c.element.css("left"), 10) + (c.position.left - c.originalPosition.left) || null, h = parseInt(c.element.css("top"), 10) + (c.position.top - c.originalPosition.top) || null, l.animate || this.element.css(t.extend(a, { top: h, left: r })), c.helper.height(c.size.height), c.helper.width(c.size.width), this._helper && !l.animate && this._proportionallyResize()), t("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", e), this._helper && this.helper.remove(), !1 }, _updateVirtualBoundaries: function (t) { var e, s, n, o, a, r = this.options; a = { minWidth: i(r.minWidth) ? r.minWidth : 0, maxWidth: i(r.maxWidth) ? r.maxWidth : 1 / 0, minHeight: i(r.minHeight) ? r.minHeight : 0, maxHeight: i(r.maxHeight) ? r.maxHeight : 1 / 0 }, (this._aspectRatio || t) && (e = a.minHeight * this.aspectRatio, n = a.minWidth / this.aspectRatio, s = a.maxHeight * this.aspectRatio, o = a.maxWidth / this.aspectRatio, e > a.minWidth && (a.minWidth = e), n > a.minHeight && (a.minHeight = n), a.maxWidth > s && (a.maxWidth = s), a.maxHeight > o && (a.maxHeight = o)), this._vBoundaries = a }, _updateCache: function (t) { this.offset = this.helper.offset(), i(t.left) && (this.position.left = t.left), i(t.top) && (this.position.top = t.top), i(t.height) && (this.size.height = t.height), i(t.width) && (this.size.width = t.width) }, _updateRatio: function (t) { var e = this.position, s = this.size, n = this.axis; return i(t.height) ? t.width = t.height * this.aspectRatio : i(t.width) && (t.height = t.width / this.aspectRatio), "sw" === n && (t.left = e.left + (s.width - t.width), t.top = null), "nw" === n && (t.top = e.top + (s.height - t.height), t.left = e.left + (s.width - t.width)), t }, _respectSize: function (t) { var e = this._vBoundaries, s = this.axis, n = i(t.width) && e.maxWidth && e.maxWidth < t.width, o = i(t.height) && e.maxHeight && e.maxHeight < t.height, a = i(t.width) && e.minWidth && e.minWidth > t.width, r = i(t.height) && e.minHeight && e.minHeight > t.height, h = this.originalPosition.left + this.originalSize.width, l = this.position.top + this.size.height, c = /sw|nw|w/.test(s), u = /nw|ne|n/.test(s); return a && (t.width = e.minWidth), r && (t.height = e.minHeight), n && (t.width = e.maxWidth), o && (t.height = e.maxHeight), a && c && (t.left = h - e.minWidth), n && c && (t.left = h - e.maxWidth), r && u && (t.top = l - e.minHeight), o && u && (t.top = l - e.maxHeight), t.width || t.height || t.left || !t.top ? t.width || t.height || t.top || !t.left || (t.left = null) : t.top = null, t }, _proportionallyResize: function () { if (this._proportionallyResizeElements.length) { var t, e, i, s, n, o = this.helper || this.element; for (t = 0; this._proportionallyResizeElements.length > t; t++) { if (n = this._proportionallyResizeElements[t], !this.borderDif) for (this.borderDif = [], i = [n.css("borderTopWidth"), n.css("borderRightWidth"), n.css("borderBottomWidth"), n.css("borderLeftWidth")], s = [n.css("paddingTop"), n.css("paddingRight"), n.css("paddingBottom"), n.css("paddingLeft")], e = 0; i.length > e; e++)this.borderDif[e] = (parseInt(i[e], 10) || 0) + (parseInt(s[e], 10) || 0); n.css({ height: o.height() - this.borderDif[0] - this.borderDif[2] || 0, width: o.width() - this.borderDif[1] - this.borderDif[3] || 0 }) } } }, _renderProxy: function () { var e = this.element, i = this.options; this.elementOffset = e.offset(), this._helper ? (this.helper = this.helper || t("<div style='overflow:hidden;'></div>"), this.helper.addClass(this._helper).css({ width: this.element.outerWidth() - 1, height: this.element.outerHeight() - 1, position: "absolute", left: this.elementOffset.left + "px", top: this.elementOffset.top + "px", zIndex: ++i.zIndex }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element }, _change: { e: function (t, e) { return { width: this.originalSize.width + e } }, w: function (t, e) { var i = this.originalSize, s = this.originalPosition; return { left: s.left + e, width: i.width - e } }, n: function (t, e, i) { var s = this.originalSize, n = this.originalPosition; return { top: n.top + i, height: s.height - i } }, s: function (t, e, i) { return { height: this.originalSize.height + i } }, se: function (e, i, s) { return t.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [e, i, s])) }, sw: function (e, i, s) { return t.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [e, i, s])) }, ne: function (e, i, s) { return t.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [e, i, s])) }, nw: function (e, i, s) { return t.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [e, i, s])) } }, _propagate: function (e, i) { t.ui.plugin.call(this, e, [i, this.ui()]), "resize" !== e && this._trigger(e, i, this.ui()) }, plugins: {}, ui: function () { return { originalElement: this.originalElement, element: this.element, helper: this.helper, position: this.position, size: this.size, originalSize: this.originalSize, originalPosition: this.originalPosition } } }), t.ui.plugin.add("resizable", "animate", { stop: function (e) { var i = t(this).data("ui-resizable"), s = i.options, n = i._proportionallyResizeElements, o = n.length && /textarea/i.test(n[0].nodeName), a = o && t.ui.hasScroll(n[0], "left") ? 0 : i.sizeDiff.height, r = o ? 0 : i.sizeDiff.width, h = { width: i.size.width - r, height: i.size.height - a }, l = parseInt(i.element.css("left"), 10) + (i.position.left - i.originalPosition.left) || null, c = parseInt(i.element.css("top"), 10) + (i.position.top - i.originalPosition.top) || null; i.element.animate(t.extend(h, c && l ? { top: c, left: l } : {}), { duration: s.animateDuration, easing: s.animateEasing, step: function () { var s = { width: parseInt(i.element.css("width"), 10), height: parseInt(i.element.css("height"), 10), top: parseInt(i.element.css("top"), 10), left: parseInt(i.element.css("left"), 10) }; n && n.length && t(n[0]).css({ width: s.width, height: s.height }), i._updateCache(s), i._propagate("resize", e) } }) } }), t.ui.plugin.add("resizable", "containment", { start: function () { var i, s, n, o, a, r, h, l = t(this).data("ui-resizable"), c = l.options, u = l.element, d = c.containment, p = d instanceof t ? d.get(0) : /parent/.test(d) ? u.parent().get(0) : d; p && (l.containerElement = t(p), /document/.test(d) || d === document ? (l.containerOffset = { left: 0, top: 0 }, l.containerPosition = { left: 0, top: 0 }, l.parentData = { element: t(document), left: 0, top: 0, width: t(document).width(), height: t(document).height() || document.body.parentNode.scrollHeight }) : (i = t(p), s = [], t(["Top", "Right", "Left", "Bottom"]).each(function (t, n) { s[t] = e(i.css("padding" + n)) }), l.containerOffset = i.offset(), l.containerPosition = i.position(), l.containerSize = { height: i.innerHeight() - s[3], width: i.innerWidth() - s[1] }, n = l.containerOffset, o = l.containerSize.height, a = l.containerSize.width, r = t.ui.hasScroll(p, "left") ? p.scrollWidth : a, h = t.ui.hasScroll(p) ? p.scrollHeight : o, l.parentData = { element: p, left: n.left, top: n.top, width: r, height: h })) }, resize: function (e) { var i, s, n, o, a = t(this).data("ui-resizable"), r = a.options, h = a.containerOffset, l = a.position, c = a._aspectRatio || e.shiftKey, u = { top: 0, left: 0 }, d = a.containerElement; d[0] !== document && /static/.test(d.css("position")) && (u = h), l.left < (a._helper ? h.left : 0) && (a.size.width = a.size.width + (a._helper ? a.position.left - h.left : a.position.left - u.left), c && (a.size.height = a.size.width / a.aspectRatio), a.position.left = r.helper ? h.left : 0), l.top < (a._helper ? h.top : 0) && (a.size.height = a.size.height + (a._helper ? a.position.top - h.top : a.position.top), c && (a.size.width = a.size.height * a.aspectRatio), a.position.top = a._helper ? h.top : 0), a.offset.left = a.parentData.left + a.position.left, a.offset.top = a.parentData.top + a.position.top, i = Math.abs((a._helper ? a.offset.left - u.left : a.offset.left - u.left) + a.sizeDiff.width), s = Math.abs((a._helper ? a.offset.top - u.top : a.offset.top - h.top) + a.sizeDiff.height), n = a.containerElement.get(0) === a.element.parent().get(0), o = /relative|absolute/.test(a.containerElement.css("position")), n && o && (i -= a.parentData.left), i + a.size.width >= a.parentData.width && (a.size.width = a.parentData.width - i, c && (a.size.height = a.size.width / a.aspectRatio)), s + a.size.height >= a.parentData.height && (a.size.height = a.parentData.height - s, c && (a.size.width = a.size.height * a.aspectRatio)) }, stop: function () { var e = t(this).data("ui-resizable"), i = e.options, s = e.containerOffset, n = e.containerPosition, o = e.containerElement, a = t(e.helper), r = a.offset(), h = a.outerWidth() - e.sizeDiff.width, l = a.outerHeight() - e.sizeDiff.height; e._helper && !i.animate && /relative/.test(o.css("position")) && t(this).css({ left: r.left - n.left - s.left, width: h, height: l }), e._helper && !i.animate && /static/.test(o.css("position")) && t(this).css({ left: r.left - n.left - s.left, width: h, height: l }) } }), t.ui.plugin.add("resizable", "alsoResize", { start: function () { var e = t(this).data("ui-resizable"), i = e.options, s = function (e) { t(e).each(function () { var e = t(this); e.data("ui-resizable-alsoresize", { width: parseInt(e.width(), 10), height: parseInt(e.height(), 10), left: parseInt(e.css("left"), 10), top: parseInt(e.css("top"), 10) }) }) }; "object" != typeof i.alsoResize || i.alsoResize.parentNode ? s(i.alsoResize) : i.alsoResize.length ? (i.alsoResize = i.alsoResize[0], s(i.alsoResize)) : t.each(i.alsoResize, function (t) { s(t) }) }, resize: function (e, i) { var s = t(this).data("ui-resizable"), n = s.options, o = s.originalSize, a = s.originalPosition, r = { height: s.size.height - o.height || 0, width: s.size.width - o.width || 0, top: s.position.top - a.top || 0, left: s.position.left - a.left || 0 }, h = function (e, s) { t(e).each(function () { var e = t(this), n = t(this).data("ui-resizable-alsoresize"), o = {}, a = s && s.length ? s : e.parents(i.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"]; t.each(a, function (t, e) { var i = (n[e] || 0) + (r[e] || 0); i && i >= 0 && (o[e] = i || null) }), e.css(o) }) }; "object" != typeof n.alsoResize || n.alsoResize.nodeType ? h(n.alsoResize) : t.each(n.alsoResize, function (t, e) { h(t, e) }) }, stop: function () { t(this).removeData("resizable-alsoresize") } }), t.ui.plugin.add("resizable", "ghost", { start: function () { var e = t(this).data("ui-resizable"), i = e.options, s = e.size; e.ghost = e.originalElement.clone(), e.ghost.css({ opacity: .25, display: "block", position: "relative", height: s.height, width: s.width, margin: 0, left: 0, top: 0 }).addClass("ui-resizable-ghost").addClass("string" == typeof i.ghost ? i.ghost : ""), e.ghost.appendTo(e.helper) }, resize: function () { var e = t(this).data("ui-resizable"); e.ghost && e.ghost.css({ position: "relative", height: e.size.height, width: e.size.width }) }, stop: function () { var e = t(this).data("ui-resizable"); e.ghost && e.helper && e.helper.get(0).removeChild(e.ghost.get(0)) } }), t.ui.plugin.add("resizable", "grid", { resize: function () { var e = t(this).data("ui-resizable"), i = e.options, s = e.size, n = e.originalSize, o = e.originalPosition, a = e.axis, r = "number" == typeof i.grid ? [i.grid, i.grid] : i.grid, h = r[0] || 1, l = r[1] || 1, c = Math.round((s.width - n.width) / h) * h, u = Math.round((s.height - n.height) / l) * l, d = n.width + c, p = n.height + u, f = i.maxWidth && d > i.maxWidth, g = i.maxHeight && p > i.maxHeight, m = i.minWidth && i.minWidth > d, v = i.minHeight && i.minHeight > p; i.grid = r, m && (d += h), v && (p += l), f && (d -= h), g && (p -= l), /^(se|s|e)$/.test(a) ? (e.size.width = d, e.size.height = p) : /^(ne)$/.test(a) ? (e.size.width = d, e.size.height = p, e.position.top = o.top - u) : /^(sw)$/.test(a) ? (e.size.width = d, e.size.height = p, e.position.left = o.left - c) : (e.size.width = d, e.size.height = p, e.position.top = o.top - u, e.position.left = o.left - c) } }) }(jQuery), function (t) { t.widget("ui.selectable", t.ui.mouse, { version: "1.10.2", options: { appendTo: "body", autoRefresh: !0, distance: 0, filter: "*", tolerance: "touch", selected: null, selecting: null, start: null, stop: null, unselected: null, unselecting: null }, _create: function () { var e, i = this; this.element.addClass("ui-selectable"), this.dragged = !1, this.refresh = function () { e = t(i.options.filter, i.element[0]), e.addClass("ui-selectee"), e.each(function () { var e = t(this), i = e.offset(); t.data(this, "selectable-item", { element: this, $element: e, left: i.left, top: i.top, right: i.left + e.outerWidth(), bottom: i.top + e.outerHeight(), startselected: !1, selected: e.hasClass("ui-selected"), selecting: e.hasClass("ui-selecting"), unselecting: e.hasClass("ui-unselecting") }) }) }, this.refresh(), this.selectees = e.addClass("ui-selectee"), this._mouseInit(), this.helper = t("<div class='ui-selectable-helper'></div>") }, _destroy: function () { this.selectees.removeClass("ui-selectee").removeData("selectable-item"), this.element.removeClass("ui-selectable ui-selectable-disabled"), this._mouseDestroy() }, _mouseStart: function (e) { var i = this, s = this.options; this.opos = [e.pageX, e.pageY], this.options.disabled || (this.selectees = t(s.filter, this.element[0]), this._trigger("start", e), t(s.appendTo).append(this.helper), this.helper.css({ left: e.pageX, top: e.pageY, width: 0, height: 0 }), s.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function () { var s = t.data(this, "selectable-item"); s.startselected = !0, e.metaKey || e.ctrlKey || (s.$element.removeClass("ui-selected"), s.selected = !1, s.$element.addClass("ui-unselecting"), s.unselecting = !0, i._trigger("unselecting", e, { unselecting: s.element })) }), t(e.target).parents().addBack().each(function () { var s, n = t.data(this, "selectable-item"); return n ? (s = !e.metaKey && !e.ctrlKey || !n.$element.hasClass("ui-selected"), n.$element.removeClass(s ? "ui-unselecting" : "ui-selected").addClass(s ? "ui-selecting" : "ui-unselecting"), n.unselecting = !s, n.selecting = s, n.selected = s, s ? i._trigger("selecting", e, { selecting: n.element }) : i._trigger("unselecting", e, { unselecting: n.element }), !1) : undefined })) }, _mouseDrag: function (e) { if (this.dragged = !0, !this.options.disabled) { var i, s = this, n = this.options, o = this.opos[0], a = this.opos[1], r = e.pageX, h = e.pageY; return o > r && (i = r, r = o, o = i), a > h && (i = h, h = a, a = i), this.helper.css({ left: o, top: a, width: r - o, height: h - a }), this.selectees.each(function () { var i = t.data(this, "selectable-item"), l = !1; i && i.element !== s.element[0] && ("touch" === n.tolerance ? l = !(i.left > r || o > i.right || i.top > h || a > i.bottom) : "fit" === n.tolerance && (l = i.left > o && r > i.right && i.top > a && h > i.bottom), l ? (i.selected && (i.$element.removeClass("ui-selected"), i.selected = !1), i.unselecting && (i.$element.removeClass("ui-unselecting"), i.unselecting = !1), i.selecting || (i.$element.addClass("ui-selecting"), i.selecting = !0, s._trigger("selecting", e, { selecting: i.element }))) : (i.selecting && ((e.metaKey || e.ctrlKey) && i.startselected ? (i.$element.removeClass("ui-selecting"), i.selecting = !1, i.$element.addClass("ui-selected"), i.selected = !0) : (i.$element.removeClass("ui-selecting"), i.selecting = !1, i.startselected && (i.$element.addClass("ui-unselecting"), i.unselecting = !0), s._trigger("unselecting", e, { unselecting: i.element }))), i.selected && (e.metaKey || e.ctrlKey || i.startselected || (i.$element.removeClass("ui-selected"), i.selected = !1, i.$element.addClass("ui-unselecting"), i.unselecting = !0, s._trigger("unselecting", e, { unselecting: i.element }))))) }), !1 } }, _mouseStop: function (e) { var i = this; return this.dragged = !1, t(".ui-unselecting", this.element[0]).each(function () { var s = t.data(this, "selectable-item"); s.$element.removeClass("ui-unselecting"), s.unselecting = !1, s.startselected = !1, i._trigger("unselected", e, { unselected: s.element }) }), t(".ui-selecting", this.element[0]).each(function () { var s = t.data(this, "selectable-item"); s.$element.removeClass("ui-selecting").addClass("ui-selected"), s.selecting = !1, s.selected = !0, s.startselected = !0, i._trigger("selected", e, { selected: s.element }) }), this._trigger("stop", e), this.helper.remove(), !1 } }) }(jQuery), function (t) {
    function e(t, e, i) { return t > e && e + i > t } function i(t) { return /left|right/.test(t.css("float")) || /inline|table-cell/.test(t.css("display")) } t.widget("ui.sortable", t.ui.mouse, {
        version: "1.10.2", widgetEventPrefix: "sort", ready: !1, options: { appendTo: "parent", axis: !1, connectWith: !1, containment: !1, cursor: "auto", cursorAt: !1, dropOnEmpty: !0, forcePlaceholderSize: !1, forceHelperSize: !1, grid: !1, handle: !1, helper: "original", items: "> *", opacity: !1, placeholder: !1, revert: !1, scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, scope: "default", tolerance: "intersect", zIndex: 1e3, activate: null, beforeStop: null, change: null, deactivate: null, out: null, over: null, receive: null, remove: null, sort: null, start: null, stop: null, update: null }, _create: function () { var t = this.options; this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? "x" === t.axis || i(this.items[0].item) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0 }, _destroy: function () { this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy(); for (var t = this.items.length - 1; t >= 0; t--)this.items[t].item.removeData(this.widgetName + "-item"); return this }, _setOption: function (e, i) { "disabled" === e ? (this.options[e] = i, this.widget().toggleClass("ui-sortable-disabled", !!i)) : t.Widget.prototype._setOption.apply(this, arguments) }, _mouseCapture: function (e, i) { var s = null, n = !1, o = this; return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(e), t(e.target).parents().each(function () { return t.data(this, o.widgetName + "-item") === o ? (s = t(this), !1) : undefined }), t.data(e.target, o.widgetName + "-item") === o && (s = t(e.target)), s ? !this.options.handle || i || (t(this.options.handle, s).find("*").addBack().each(function () { this === e.target && (n = !0) }), n) ? (this.currentItem = s, this._removeCurrentsFromItems(), !0) : !1 : !1) }, _mouseStart: function (e, i, s) { var n, o, a = this.options; if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(e), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = { top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left }, t.extend(this.offset, { click: { left: e.pageX - this.offset.left, top: e.pageY - this.offset.top }, parent: this._getParentOffset(), relative: this._getRelativeOffset() }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(e), this.originalPageX = e.pageX, this.originalPageY = e.pageY, a.cursorAt && this._adjustOffsetFromHelper(a.cursorAt), this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), a.containment && this._setContainment(), a.cursor && "auto" !== a.cursor && (o = this.document.find("body"), this.storedCursor = o.css("cursor"), o.css("cursor", a.cursor), this.storedStylesheet = t("<style>*{ cursor: " + a.cursor + " !important; }</style>").appendTo(o)), a.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", a.opacity)), a.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", a.zIndex)), this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", e, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !s) for (n = this.containers.length - 1; n >= 0; n--)this.containers[n]._trigger("activate", e, this._uiHash(this)); return t.ui.ddmanager && (t.ui.ddmanager.current = this), t.ui.ddmanager && !a.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(e), !0 }, _mouseDrag: function (e) {
            var i, s, n, o, a = this.options, r = !1; for (this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== document && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - e.pageY < a.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + a.scrollSpeed : e.pageY - this.overflowOffset.top < a.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - a.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - e.pageX < a.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + a.scrollSpeed : e.pageX - this.overflowOffset.left < a.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - a.scrollSpeed)) : (e.pageY - t(document).scrollTop() < a.scrollSensitivity ? r = t(document).scrollTop(t(document).scrollTop() - a.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < a.scrollSensitivity && (r = t(document).scrollTop(t(document).scrollTop() + a.scrollSpeed)), e.pageX - t(document).scrollLeft() < a.scrollSensitivity ? r = t(document).scrollLeft(t(document).scrollLeft() - a.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < a.scrollSensitivity && (r = t(document).scrollLeft(t(document).scrollLeft() + a.scrollSpeed))), r !== !1 && t.ui.ddmanager && !a.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), i = this.items.length - 1; i >= 0; i--)if (s = this.items[i], n = s.item[0], o = this._intersectsWithPointer(s), o && s.instance === this.currentContainer && n !== this.currentItem[0] && this.placeholder[1 === o ? "next" : "prev"]()[0] !== n && !t.contains(this.placeholder[0], n) && ("semi-dynamic" === this.options.type ? !t.contains(this.element[0], n) : !0)) {
                if (this.direction = 1 === o ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(s)) break;
                this._rearrange(e, s), this._trigger("change", e, this._uiHash()); break
            } return this._contactContainers(e), t.ui.ddmanager && t.ui.ddmanager.drag(this, e), this._trigger("sort", e, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
        }, _mouseStop: function (e, i) { if (e) { if (t.ui.ddmanager && !this.options.dropBehaviour && t.ui.ddmanager.drop(this, e), this.options.revert) { var s = this, n = this.placeholder.offset(), o = this.options.axis, a = {}; o && "x" !== o || (a.left = n.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft)), o && "y" !== o || (a.top = n.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)), this.reverting = !0, t(this.helper).animate(a, parseInt(this.options.revert, 10) || 500, function () { s._clear(e) }) } else this._clear(e, i); return !1 } }, cancel: function () { if (this.dragging) { this._mouseUp({ target: null }), "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show(); for (var e = this.containers.length - 1; e >= 0; e--)this.containers[e]._trigger("deactivate", null, this._uiHash(this)), this.containers[e].containerCache.over && (this.containers[e]._trigger("out", null, this._uiHash(this)), this.containers[e].containerCache.over = 0) } return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), t.extend(this, { helper: null, dragging: !1, reverting: !1, _noFinalSort: null }), this.domPosition.prev ? t(this.domPosition.prev).after(this.currentItem) : t(this.domPosition.parent).prepend(this.currentItem)), this }, serialize: function (e) { var i = this._getItemsAsjQuery(e && e.connected), s = []; return e = e || {}, t(i).each(function () { var i = (t(e.item || this).attr(e.attribute || "id") || "").match(e.expression || /(.+)[\-=_](.+)/); i && s.push((e.key || i[1] + "[]") + "=" + (e.key && e.expression ? i[1] : i[2])) }), !s.length && e.key && s.push(e.key + "="), s.join("&") }, toArray: function (e) { var i = this._getItemsAsjQuery(e && e.connected), s = []; return e = e || {}, i.each(function () { s.push(t(e.item || this).attr(e.attribute || "id") || "") }), s }, _intersectsWith: function (t) { var e = this.positionAbs.left, i = e + this.helperProportions.width, s = this.positionAbs.top, n = s + this.helperProportions.height, o = t.left, a = o + t.width, r = t.top, h = r + t.height, l = this.offset.click.top, c = this.offset.click.left, u = s + l > r && h > s + l && e + c > o && a > e + c; return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > t[this.floating ? "width" : "height"] ? u : e + this.helperProportions.width / 2 > o && a > i - this.helperProportions.width / 2 && s + this.helperProportions.height / 2 > r && h > n - this.helperProportions.height / 2 }, _intersectsWithPointer: function (t) { var i = "x" === this.options.axis || e(this.positionAbs.top + this.offset.click.top, t.top, t.height), s = "y" === this.options.axis || e(this.positionAbs.left + this.offset.click.left, t.left, t.width), n = i && s, o = this._getDragVerticalDirection(), a = this._getDragHorizontalDirection(); return n ? this.floating ? a && "right" === a || "down" === o ? 2 : 1 : o && ("down" === o ? 2 : 1) : !1 }, _intersectsWithSides: function (t) { var i = e(this.positionAbs.top + this.offset.click.top, t.top + t.height / 2, t.height), s = e(this.positionAbs.left + this.offset.click.left, t.left + t.width / 2, t.width), n = this._getDragVerticalDirection(), o = this._getDragHorizontalDirection(); return this.floating && o ? "right" === o && s || "left" === o && !s : n && ("down" === n && i || "up" === n && !i) }, _getDragVerticalDirection: function () { var t = this.positionAbs.top - this.lastPositionAbs.top; return 0 !== t && (t > 0 ? "down" : "up") }, _getDragHorizontalDirection: function () { var t = this.positionAbs.left - this.lastPositionAbs.left; return 0 !== t && (t > 0 ? "right" : "left") }, refresh: function (t) { return this._refreshItems(t), this.refreshPositions(), this }, _connectWith: function () { var t = this.options; return t.connectWith.constructor === String ? [t.connectWith] : t.connectWith }, _getItemsAsjQuery: function (e) { var i, s, n, o, a = [], r = [], h = this._connectWith(); if (h && e) for (i = h.length - 1; i >= 0; i--)for (n = t(h[i]), s = n.length - 1; s >= 0; s--)o = t.data(n[s], this.widgetFullName), o && o !== this && !o.options.disabled && r.push([t.isFunction(o.options.items) ? o.options.items.call(o.element) : t(o.options.items, o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), o]); for (r.push([t.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : t(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), i = r.length - 1; i >= 0; i--)r[i][0].each(function () { a.push(this) }); return t(a) }, _removeCurrentsFromItems: function () { var e = this.currentItem.find(":data(" + this.widgetName + "-item)"); this.items = t.grep(this.items, function (t) { for (var i = 0; e.length > i; i++)if (e[i] === t.item[0]) return !1; return !0 }) }, _refreshItems: function (e) { this.items = [], this.containers = [this]; var i, s, n, o, a, r, h, l, c = this.items, u = [[t.isFunction(this.options.items) ? this.options.items.call(this.element[0], e, { item: this.currentItem }) : t(this.options.items, this.element), this]], d = this._connectWith(); if (d && this.ready) for (i = d.length - 1; i >= 0; i--)for (n = t(d[i]), s = n.length - 1; s >= 0; s--)o = t.data(n[s], this.widgetFullName), o && o !== this && !o.options.disabled && (u.push([t.isFunction(o.options.items) ? o.options.items.call(o.element[0], e, { item: this.currentItem }) : t(o.options.items, o.element), o]), this.containers.push(o)); for (i = u.length - 1; i >= 0; i--)for (a = u[i][1], r = u[i][0], s = 0, l = r.length; l > s; s++)h = t(r[s]), h.data(this.widgetName + "-item", a), c.push({ item: h, instance: a, width: 0, height: 0, left: 0, top: 0 }) }, refreshPositions: function (e) { this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset()); var i, s, n, o; for (i = this.items.length - 1; i >= 0; i--)s = this.items[i], s.instance !== this.currentContainer && this.currentContainer && s.item[0] !== this.currentItem[0] || (n = this.options.toleranceElement ? t(this.options.toleranceElement, s.item) : s.item, e || (s.width = n.outerWidth(), s.height = n.outerHeight()), o = n.offset(), s.left = o.left, s.top = o.top); if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this); else for (i = this.containers.length - 1; i >= 0; i--)o = this.containers[i].element.offset(), this.containers[i].containerCache.left = o.left, this.containers[i].containerCache.top = o.top, this.containers[i].containerCache.width = this.containers[i].element.outerWidth(), this.containers[i].containerCache.height = this.containers[i].element.outerHeight(); return this }, _createPlaceholder: function (e) { e = e || this; var i, s = e.options; s.placeholder && s.placeholder.constructor !== String || (i = s.placeholder, s.placeholder = { element: function () { var s = e.currentItem[0].nodeName.toLowerCase(), n = t(e.document[0].createElement(s)).addClass(i || e.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper"); return "tr" === s ? n.append("<td colspan='99'>&#160;</td>") : "img" === s && n.attr("src", e.currentItem.attr("src")), i || n.css("visibility", "hidden"), n }, update: function (t, n) { (!i || s.forcePlaceholderSize) && (n.height() || n.height(e.currentItem.innerHeight() - parseInt(e.currentItem.css("paddingTop") || 0, 10) - parseInt(e.currentItem.css("paddingBottom") || 0, 10)), n.width() || n.width(e.currentItem.innerWidth() - parseInt(e.currentItem.css("paddingLeft") || 0, 10) - parseInt(e.currentItem.css("paddingRight") || 0, 10))) } }), e.placeholder = t(s.placeholder.element.call(e.element, e.currentItem)), e.currentItem.after(e.placeholder), s.placeholder.update(e, e.placeholder) }, _contactContainers: function (s) { var n, o, a, r, h, l, c, u, d, p, f = null, g = null; for (n = this.containers.length - 1; n >= 0; n--)if (!t.contains(this.currentItem[0], this.containers[n].element[0])) if (this._intersectsWith(this.containers[n].containerCache)) { if (f && t.contains(this.containers[n].element[0], f.element[0])) continue; f = this.containers[n], g = n } else this.containers[n].containerCache.over && (this.containers[n]._trigger("out", s, this._uiHash(this)), this.containers[n].containerCache.over = 0); if (f) if (1 === this.containers.length) this.containers[g].containerCache.over || (this.containers[g]._trigger("over", s, this._uiHash(this)), this.containers[g].containerCache.over = 1); else { for (a = 1e4, r = null, p = f.floating || i(this.currentItem), h = p ? "left" : "top", l = p ? "width" : "height", c = this.positionAbs[h] + this.offset.click[h], o = this.items.length - 1; o >= 0; o--)t.contains(this.containers[g].element[0], this.items[o].item[0]) && this.items[o].item[0] !== this.currentItem[0] && (!p || e(this.positionAbs.top + this.offset.click.top, this.items[o].top, this.items[o].height)) && (u = this.items[o].item.offset()[h], d = !1, Math.abs(u - c) > Math.abs(u + this.items[o][l] - c) && (d = !0, u += this.items[o][l]), a > Math.abs(u - c) && (a = Math.abs(u - c), r = this.items[o], this.direction = d ? "up" : "down")); if (!r && !this.options.dropOnEmpty) return; if (this.currentContainer === this.containers[g]) return; r ? this._rearrange(s, r, null, !0) : this._rearrange(s, null, this.containers[g].element, !0), this._trigger("change", s, this._uiHash()), this.containers[g]._trigger("change", s, this._uiHash(this)), this.currentContainer = this.containers[g], this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[g]._trigger("over", s, this._uiHash(this)), this.containers[g].containerCache.over = 1 } }, _createHelper: function (e) { var i = this.options, s = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e, this.currentItem])) : "clone" === i.helper ? this.currentItem.clone() : this.currentItem; return s.parents("body").length || t("parent" !== i.appendTo ? i.appendTo : this.currentItem[0].parentNode)[0].appendChild(s[0]), s[0] === this.currentItem[0] && (this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") }), (!s[0].style.width || i.forceHelperSize) && s.width(this.currentItem.width()), (!s[0].style.height || i.forceHelperSize) && s.height(this.currentItem.height()), s }, _adjustOffsetFromHelper: function (e) { "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = { left: +e[0], top: +e[1] || 0 }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top) }, _getParentOffset: function () { this.offsetParent = this.helper.offsetParent(); var e = this.offsetParent.offset(); return "absolute" === this.cssPosition && this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = { top: 0, left: 0 }), { top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0) } }, _getRelativeOffset: function () { if ("relative" === this.cssPosition) { var t = this.currentItem.position(); return { top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft() } } return { top: 0, left: 0 } }, _cacheMargins: function () { this.margins = { left: parseInt(this.currentItem.css("marginLeft"), 10) || 0, top: parseInt(this.currentItem.css("marginTop"), 10) || 0 } }, _cacheHelperProportions: function () { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() } }, _setContainment: function () { var e, i, s, n = this.options; "parent" === n.containment && (n.containment = this.helper[0].parentNode), ("document" === n.containment || "window" === n.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, t("document" === n.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (t("document" === n.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), /^(document|window|parent)$/.test(n.containment) || (e = t(n.containment)[0], i = t(n.containment).offset(), s = "hidden" !== t(e).css("overflow"), this.containment = [i.left + (parseInt(t(e).css("borderLeftWidth"), 10) || 0) + (parseInt(t(e).css("paddingLeft"), 10) || 0) - this.margins.left, i.top + (parseInt(t(e).css("borderTopWidth"), 10) || 0) + (parseInt(t(e).css("paddingTop"), 10) || 0) - this.margins.top, i.left + (s ? Math.max(e.scrollWidth, e.offsetWidth) : e.offsetWidth) - (parseInt(t(e).css("borderLeftWidth"), 10) || 0) - (parseInt(t(e).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, i.top + (s ? Math.max(e.scrollHeight, e.offsetHeight) : e.offsetHeight) - (parseInt(t(e).css("borderTopWidth"), 10) || 0) - (parseInt(t(e).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]) }, _convertPositionTo: function (e, i) { i || (i = this.position); var s = "absolute" === e ? 1 : -1, n = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, o = /(html|body)/i.test(n[0].tagName); return { top: i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : o ? 0 : n.scrollTop()) * s, left: i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : o ? 0 : n.scrollLeft()) * s } }, _generatePosition: function (e) { var i, s, n = this.options, o = e.pageX, a = e.pageY, r = "absolute" !== this.cssPosition || this.scrollParent[0] !== document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, h = /(html|body)/i.test(r[0].tagName); return "relative" !== this.cssPosition || this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (e.pageX - this.offset.click.left < this.containment[0] && (o = this.containment[0] + this.offset.click.left), e.pageY - this.offset.click.top < this.containment[1] && (a = this.containment[1] + this.offset.click.top), e.pageX - this.offset.click.left > this.containment[2] && (o = this.containment[2] + this.offset.click.left), e.pageY - this.offset.click.top > this.containment[3] && (a = this.containment[3] + this.offset.click.top)), n.grid && (i = this.originalPageY + Math.round((a - this.originalPageY) / n.grid[1]) * n.grid[1], a = this.containment ? i - this.offset.click.top >= this.containment[1] && i - this.offset.click.top <= this.containment[3] ? i : i - this.offset.click.top >= this.containment[1] ? i - n.grid[1] : i + n.grid[1] : i, s = this.originalPageX + Math.round((o - this.originalPageX) / n.grid[0]) * n.grid[0], o = this.containment ? s - this.offset.click.left >= this.containment[0] && s - this.offset.click.left <= this.containment[2] ? s : s - this.offset.click.left >= this.containment[0] ? s - n.grid[0] : s + n.grid[0] : s)), { top: a - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : h ? 0 : r.scrollTop()), left: o - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : h ? 0 : r.scrollLeft()) } }, _rearrange: function (t, e, i, s) { i ? i[0].appendChild(this.placeholder[0]) : e.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? e.item[0] : e.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1; var n = this.counter; this._delay(function () { n === this.counter && this.refreshPositions(!s) }) }, _clear: function (t, e) { this.reverting = !1; var i, s = []; if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) { for (i in this._storedCSS) ("auto" === this._storedCSS[i] || "static" === this._storedCSS[i]) && (this._storedCSS[i] = ""); this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") } else this.currentItem.show(); for (this.fromOutside && !e && s.push(function (t) { this._trigger("receive", t, this._uiHash(this.fromOutside)) }), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || e || s.push(function (t) { this._trigger("update", t, this._uiHash()) }), this !== this.currentContainer && (e || (s.push(function (t) { this._trigger("remove", t, this._uiHash()) }), s.push(function (t) { return function (e) { t._trigger("receive", e, this._uiHash(this)) } }.call(this, this.currentContainer)), s.push(function (t) { return function (e) { t._trigger("update", e, this._uiHash(this)) } }.call(this, this.currentContainer)))), i = this.containers.length - 1; i >= 0; i--)e || s.push(function (t) { return function (e) { t._trigger("deactivate", e, this._uiHash(this)) } }.call(this, this.containers[i])), this.containers[i].containerCache.over && (s.push(function (t) { return function (e) { t._trigger("out", e, this._uiHash(this)) } }.call(this, this.containers[i])), this.containers[i].containerCache.over = 0); if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, this.cancelHelperRemoval) { if (!e) { for (this._trigger("beforeStop", t, this._uiHash()), i = 0; s.length > i; i++)s[i].call(this, t); this._trigger("stop", t, this._uiHash()) } return this.fromOutside = !1, !1 } if (e || this._trigger("beforeStop", t, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null, !e) { for (i = 0; s.length > i; i++)s[i].call(this, t); this._trigger("stop", t, this._uiHash()) } return this.fromOutside = !1, !0 }, _trigger: function () { t.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel() }, _uiHash: function (e) { var i = e || this; return { helper: i.helper, placeholder: i.placeholder || t([]), position: i.position, originalPosition: i.originalPosition, offset: i.positionAbs, item: i.currentItem, sender: e ? e.element : null } }
    })
}(jQuery), function (t, e) { var i = "ui-effects-"; t.effects = { effect: {} }, function (t, e) { function i(t, e, i) { var s = u[e.type] || {}; return null == t ? i || !e.def ? null : e.def : (t = s.floor ? ~~t : parseFloat(t), isNaN(t) ? e.def : s.mod ? (t + s.mod) % s.mod : 0 > t ? 0 : t > s.max ? s.max : t) } function s(i) { var s = l(), n = s._rgba = []; return i = i.toLowerCase(), f(h, function (t, o) { var a, r = o.re.exec(i), h = r && o.parse(r), l = o.space || "rgba"; return h ? (a = s[l](h), s[c[l].cache] = a[c[l].cache], n = s._rgba = a._rgba, !1) : e }), n.length ? ("0,0,0,0" === n.join() && t.extend(n, o.transparent), s) : o[i] } function n(t, e, i) { return i = (i + 1) % 1, 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + 6 * (e - t) * (2 / 3 - i) : t } var o, a = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor", r = /^([\-+])=\s*(\d+\.?\d*)/, h = [{ re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, parse: function (t) { return [t[1], t[2], t[3], t[4]] } }, { re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, parse: function (t) { return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]] } }, { re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (t) { return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] } }, { re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (t) { return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)] } }, { re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/, space: "hsla", parse: function (t) { return [t[1], t[2] / 100, t[3] / 100, t[4]] } }], l = t.Color = function (e, i, s, n) { return new t.Color.fn.parse(e, i, s, n) }, c = { rgba: { props: { red: { idx: 0, type: "byte" }, green: { idx: 1, type: "byte" }, blue: { idx: 2, type: "byte" } } }, hsla: { props: { hue: { idx: 0, type: "degrees" }, saturation: { idx: 1, type: "percent" }, lightness: { idx: 2, type: "percent" } } } }, u = { "byte": { floor: !0, max: 255 }, percent: { max: 1 }, degrees: { mod: 360, floor: !0 } }, d = l.support = {}, p = t("<p>")[0], f = t.each; p.style.cssText = "background-color:rgba(1,1,1,.5)", d.rgba = p.style.backgroundColor.indexOf("rgba") > -1, f(c, function (t, e) { e.cache = "_" + t, e.props.alpha = { idx: 3, type: "percent", def: 1 } }), l.fn = t.extend(l.prototype, { parse: function (n, a, r, h) { if (n === e) return this._rgba = [null, null, null, null], this; (n.jquery || n.nodeType) && (n = t(n).css(a), a = e); var u = this, d = t.type(n), p = this._rgba = []; return a !== e && (n = [n, a, r, h], d = "array"), "string" === d ? this.parse(s(n) || o._default) : "array" === d ? (f(c.rgba.props, function (t, e) { p[e.idx] = i(n[e.idx], e) }), this) : "object" === d ? (n instanceof l ? f(c, function (t, e) { n[e.cache] && (u[e.cache] = n[e.cache].slice()) }) : f(c, function (e, s) { var o = s.cache; f(s.props, function (t, e) { if (!u[o] && s.to) { if ("alpha" === t || null == n[t]) return; u[o] = s.to(u._rgba) } u[o][e.idx] = i(n[t], e, !0) }), u[o] && 0 > t.inArray(null, u[o].slice(0, 3)) && (u[o][3] = 1, s.from && (u._rgba = s.from(u[o]))) }), this) : e }, is: function (t) { var i = l(t), s = !0, n = this; return f(c, function (t, o) { var a, r = i[o.cache]; return r && (a = n[o.cache] || o.to && o.to(n._rgba) || [], f(o.props, function (t, i) { return null != r[i.idx] ? s = r[i.idx] === a[i.idx] : e })), s }), s }, _space: function () { var t = [], e = this; return f(c, function (i, s) { e[s.cache] && t.push(i) }), t.pop() }, transition: function (t, e) { var s = l(t), n = s._space(), o = c[n], a = 0 === this.alpha() ? l("transparent") : this, r = a[o.cache] || o.to(a._rgba), h = r.slice(); return s = s[o.cache], f(o.props, function (t, n) { var o = n.idx, a = r[o], l = s[o], c = u[n.type] || {}; null !== l && (null === a ? h[o] = l : (c.mod && (l - a > c.mod / 2 ? a += c.mod : a - l > c.mod / 2 && (a -= c.mod)), h[o] = i((l - a) * e + a, n))) }), this[n](h) }, blend: function (e) { if (1 === this._rgba[3]) return this; var i = this._rgba.slice(), s = i.pop(), n = l(e)._rgba; return l(t.map(i, function (t, e) { return (1 - s) * n[e] + s * t })) }, toRgbaString: function () { var e = "rgba(", i = t.map(this._rgba, function (t, e) { return null == t ? e > 2 ? 1 : 0 : t }); return 1 === i[3] && (i.pop(), e = "rgb("), e + i.join() + ")" }, toHslaString: function () { var e = "hsla(", i = t.map(this.hsla(), function (t, e) { return null == t && (t = e > 2 ? 1 : 0), e && 3 > e && (t = Math.round(100 * t) + "%"), t }); return 1 === i[3] && (i.pop(), e = "hsl("), e + i.join() + ")" }, toHexString: function (e) { var i = this._rgba.slice(), s = i.pop(); return e && i.push(~~(255 * s)), "#" + t.map(i, function (t) { return t = (t || 0).toString(16), 1 === t.length ? "0" + t : t }).join("") }, toString: function () { return 0 === this._rgba[3] ? "transparent" : this.toRgbaString() } }), l.fn.parse.prototype = l.fn, c.hsla.to = function (t) { if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]]; var e, i, s = t[0] / 255, n = t[1] / 255, o = t[2] / 255, a = t[3], r = Math.max(s, n, o), h = Math.min(s, n, o), l = r - h, c = r + h, u = .5 * c; return e = h === r ? 0 : s === r ? 60 * (n - o) / l + 360 : n === r ? 60 * (o - s) / l + 120 : 60 * (s - n) / l + 240, i = 0 === l ? 0 : .5 >= u ? l / c : l / (2 - c), [Math.round(e) % 360, i, u, null == a ? 1 : a] }, c.hsla.from = function (t) { if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]]; var e = t[0] / 360, i = t[1], s = t[2], o = t[3], a = .5 >= s ? s * (1 + i) : s + i - s * i, r = 2 * s - a; return [Math.round(255 * n(r, a, e + 1 / 3)), Math.round(255 * n(r, a, e)), Math.round(255 * n(r, a, e - 1 / 3)), o] }, f(c, function (s, n) { var o = n.props, a = n.cache, h = n.to, c = n.from; l.fn[s] = function (s) { if (h && !this[a] && (this[a] = h(this._rgba)), s === e) return this[a].slice(); var n, r = t.type(s), u = "array" === r || "object" === r ? s : arguments, d = this[a].slice(); return f(o, function (t, e) { var s = u["object" === r ? t : e.idx]; null == s && (s = d[e.idx]), d[e.idx] = i(s, e) }), c ? (n = l(c(d)), n[a] = d, n) : l(d) }, f(o, function (e, i) { l.fn[e] || (l.fn[e] = function (n) { var o, a = t.type(n), h = "alpha" === e ? this._hsla ? "hsla" : "rgba" : s, l = this[h](), c = l[i.idx]; return "undefined" === a ? c : ("function" === a && (n = n.call(this, c), a = t.type(n)), null == n && i.empty ? this : ("string" === a && (o = r.exec(n), o && (n = c + parseFloat(o[2]) * ("+" === o[1] ? 1 : -1))), l[i.idx] = n, this[h](l))) }) }) }), l.hook = function (e) { var i = e.split(" "); f(i, function (e, i) { t.cssHooks[i] = { set: function (e, n) { var o, a, r = ""; if ("transparent" !== n && ("string" !== t.type(n) || (o = s(n)))) { if (n = l(o || n), !d.rgba && 1 !== n._rgba[3]) { for (a = "backgroundColor" === i ? e.parentNode : e; ("" === r || "transparent" === r) && a && a.style;)try { r = t.css(a, "backgroundColor"), a = a.parentNode } catch (h) { } n = n.blend(r && "transparent" !== r ? r : "_default") } n = n.toRgbaString() } try { e.style[i] = n } catch (h) { } } }, t.fx.step[i] = function (e) { e.colorInit || (e.start = l(e.elem, i), e.end = l(e.end), e.colorInit = !0), t.cssHooks[i].set(e.elem, e.start.transition(e.end, e.pos)) } }) }, l.hook(a), t.cssHooks.borderColor = { expand: function (t) { var e = {}; return f(["Top", "Right", "Bottom", "Left"], function (i, s) { e["border" + s + "Color"] = t }), e } }, o = t.Color.names = { aqua: "#00ffff", black: "#000000", blue: "#0000ff", fuchsia: "#ff00ff", gray: "#808080", green: "#008000", lime: "#00ff00", maroon: "#800000", navy: "#000080", olive: "#808000", purple: "#800080", red: "#ff0000", silver: "#c0c0c0", teal: "#008080", white: "#ffffff", yellow: "#ffff00", transparent: [null, null, null, 0], _default: "#ffffff" } }(jQuery), function () { function i(e) { var i, s, n = e.ownerDocument.defaultView ? e.ownerDocument.defaultView.getComputedStyle(e, null) : e.currentStyle, o = {}; if (n && n.length && n[0] && n[n[0]]) for (s = n.length; s--;)i = n[s], "string" == typeof n[i] && (o[t.camelCase(i)] = n[i]); else for (i in n) "string" == typeof n[i] && (o[i] = n[i]); return o } function s(e, i) { var s, n, a = {}; for (s in i) n = i[s], e[s] !== n && (o[s] || (t.fx.step[s] || !isNaN(parseFloat(n))) && (a[s] = n)); return a } var n = ["add", "remove", "toggle"], o = { border: 1, borderBottom: 1, borderColor: 1, borderLeft: 1, borderRight: 1, borderTop: 1, borderWidth: 1, margin: 1, padding: 1 }; t.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (e, i) { t.fx.step[i] = function (t) { ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (jQuery.style(t.elem, i, t.end), t.setAttr = !0) } }), t.fn.addBack || (t.fn.addBack = function (t) { return this.add(null == t ? this.prevObject : this.prevObject.filter(t)) }), t.effects.animateClass = function (e, o, a, r) { var h = t.speed(o, a, r); return this.queue(function () { var o, a = t(this), r = a.attr("class") || "", l = h.children ? a.find("*").addBack() : a; l = l.map(function () { var e = t(this); return { el: e, start: i(this) } }), o = function () { t.each(n, function (t, i) { e[i] && a[i + "Class"](e[i]) }) }, o(), l = l.map(function () { return this.end = i(this.el[0]), this.diff = s(this.start, this.end), this }), a.attr("class", r), l = l.map(function () { var e = this, i = t.Deferred(), s = t.extend({}, h, { queue: !1, complete: function () { i.resolve(e) } }); return this.el.animate(this.diff, s), i.promise() }), t.when.apply(t, l.get()).done(function () { o(), t.each(arguments, function () { var e = this.el; t.each(this.diff, function (t) { e.css(t, "") }) }), h.complete.call(a[0]) }) }) }, t.fn.extend({ addClass: function (e) { return function (i, s, n, o) { return s ? t.effects.animateClass.call(this, { add: i }, s, n, o) : e.apply(this, arguments) } }(t.fn.addClass), removeClass: function (e) { return function (i, s, n, o) { return arguments.length > 1 ? t.effects.animateClass.call(this, { remove: i }, s, n, o) : e.apply(this, arguments) } }(t.fn.removeClass), toggleClass: function (i) { return function (s, n, o, a, r) { return "boolean" == typeof n || n === e ? o ? t.effects.animateClass.call(this, n ? { add: s } : { remove: s }, o, a, r) : i.apply(this, arguments) : t.effects.animateClass.call(this, { toggle: s }, n, o, a) } }(t.fn.toggleClass), switchClass: function (e, i, s, n, o) { return t.effects.animateClass.call(this, { add: i, remove: e }, s, n, o) } }) }(), function () { function s(e, i, s, n) { return t.isPlainObject(e) && (i = e, e = e.effect), e = { effect: e }, null == i && (i = {}), t.isFunction(i) && (n = i, s = null, i = {}), ("number" == typeof i || t.fx.speeds[i]) && (n = s, s = i, i = {}), t.isFunction(s) && (n = s, s = null), i && t.extend(e, i), s = s || i.duration, e.duration = t.fx.off ? 0 : "number" == typeof s ? s : s in t.fx.speeds ? t.fx.speeds[s] : t.fx.speeds._default, e.complete = n || i.complete, e } function n(e) { return !e || "number" == typeof e || t.fx.speeds[e] ? !0 : "string" != typeof e || t.effects.effect[e] ? t.isFunction(e) ? !0 : "object" != typeof e || e.effect ? !1 : !0 : !0 } t.extend(t.effects, { version: "1.10.2", save: function (t, e) { for (var s = 0; e.length > s; s++)null !== e[s] && t.data(i + e[s], t[0].style[e[s]]) }, restore: function (t, s) { var n, o; for (o = 0; s.length > o; o++)null !== s[o] && (n = t.data(i + s[o]), n === e && (n = ""), t.css(s[o], n)) }, setMode: function (t, e) { return "toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e }, getBaseline: function (t, e) { var i, s; switch (t[0]) { case "top": i = 0; break; case "middle": i = .5; break; case "bottom": i = 1; break; default: i = t[0] / e.height }switch (t[1]) { case "left": s = 0; break; case "center": s = .5; break; case "right": s = 1; break; default: s = t[1] / e.width }return { x: s, y: i } }, createWrapper: function (e) { if (e.parent().is(".ui-effects-wrapper")) return e.parent(); var i = { width: e.outerWidth(!0), height: e.outerHeight(!0), "float": e.css("float") }, s = t("<div></div>").addClass("ui-effects-wrapper").css({ fontSize: "100%", background: "transparent", border: "none", margin: 0, padding: 0 }), n = { width: e.width(), height: e.height() }, o = document.activeElement; try { o.id } catch (a) { o = document.body } return e.wrap(s), (e[0] === o || t.contains(e[0], o)) && t(o).focus(), s = e.parent(), "static" === e.css("position") ? (s.css({ position: "relative" }), e.css({ position: "relative" })) : (t.extend(i, { position: e.css("position"), zIndex: e.css("z-index") }), t.each(["top", "left", "bottom", "right"], function (t, s) { i[s] = e.css(s), isNaN(parseInt(i[s], 10)) && (i[s] = "auto") }), e.css({ position: "relative", top: 0, left: 0, right: "auto", bottom: "auto" })), e.css(n), s.css(i).show() }, removeWrapper: function (e) { var i = document.activeElement; return e.parent().is(".ui-effects-wrapper") && (e.parent().replaceWith(e), (e[0] === i || t.contains(e[0], i)) && t(i).focus()), e }, setTransition: function (e, i, s, n) { return n = n || {}, t.each(i, function (t, i) { var o = e.cssUnit(i); o[0] > 0 && (n[i] = o[0] * s + o[1]) }), n } }), t.fn.extend({ effect: function () { function e(e) { function s() { t.isFunction(o) && o.call(n[0]), t.isFunction(e) && e() } var n = t(this), o = i.complete, r = i.mode; (n.is(":hidden") ? "hide" === r : "show" === r) ? (n[r](), s()) : a.call(n[0], i, s) } var i = s.apply(this, arguments), n = i.mode, o = i.queue, a = t.effects.effect[i.effect]; return t.fx.off || !a ? n ? this[n](i.duration, i.complete) : this.each(function () { i.complete && i.complete.call(this) }) : o === !1 ? this.each(e) : this.queue(o || "fx", e) }, show: function (t) { return function (e) { if (n(e)) return t.apply(this, arguments); var i = s.apply(this, arguments); return i.mode = "show", this.effect.call(this, i) } }(t.fn.show), hide: function (t) { return function (e) { if (n(e)) return t.apply(this, arguments); var i = s.apply(this, arguments); return i.mode = "hide", this.effect.call(this, i) } }(t.fn.hide), toggle: function (t) { return function (e) { if (n(e) || "boolean" == typeof e) return t.apply(this, arguments); var i = s.apply(this, arguments); return i.mode = "toggle", this.effect.call(this, i) } }(t.fn.toggle), cssUnit: function (e) { var i = this.css(e), s = []; return t.each(["em", "px", "%", "pt"], function (t, e) { i.indexOf(e) > 0 && (s = [parseFloat(i), e]) }), s } }) }(), function () { var e = {}; t.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (t, i) { e[i] = function (e) { return Math.pow(e, t + 2) } }), t.extend(e, { Sine: function (t) { return 1 - Math.cos(t * Math.PI / 2) }, Circ: function (t) { return 1 - Math.sqrt(1 - t * t) }, Elastic: function (t) { return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15) }, Back: function (t) { return t * t * (3 * t - 2) }, Bounce: function (t) { for (var e, i = 4; ((e = Math.pow(2, --i)) - 1) / 11 > t;); return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2) } }), t.each(e, function (e, i) { t.easing["easeIn" + e] = i, t.easing["easeOut" + e] = function (t) { return 1 - i(1 - t) }, t.easing["easeInOut" + e] = function (t) { return .5 > t ? i(2 * t) / 2 : 1 - i(-2 * t + 2) / 2 } }) }() }(jQuery), function (t) {
    var e = 0, i = {}, s = {}; i.height = i.paddingTop = i.paddingBottom = i.borderTopWidth = i.borderBottomWidth = "hide", s.height = s.paddingTop = s.paddingBottom = s.borderTopWidth = s.borderBottomWidth = "show", t.widget("ui.accordion", {
        version: "1.10.2", options: { active: 0, animate: {}, collapsible: !1, event: "click", header: "> li > :first-child,> :not(li):even", heightStyle: "auto", icons: { activeHeader: "ui-icon-triangle-1-s", header: "ui-icon-triangle-1-e" }, activate: null, beforeActivate: null }, _create: function () { var e = this.options; this.prevShow = this.prevHide = t(), this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role", "tablist"), e.collapsible || e.active !== !1 && null != e.active || (e.active = 0), this._processPanels(), 0 > e.active && (e.active += this.headers.length), this._refresh() }, _getCreateEventData: function () { return { header: this.active, panel: this.active.length ? this.active.next() : t(), content: this.active.length ? this.active.next() : t() } }, _createIcons: function () { var e = this.options.icons; e && (t("<span>").addClass("ui-accordion-header-icon ui-icon " + e.header).prependTo(this.headers), this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader), this.headers.addClass("ui-accordion-icons")) }, _destroyIcons: function () {
            this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()
        }, _destroy: function () { var t; this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"), this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function () { /^ui-accordion/.test(this.id) && this.removeAttribute("id") }), this._destroyIcons(), t = this.headers.next().css("display", "").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function () { /^ui-accordion/.test(this.id) && this.removeAttribute("id") }), "content" !== this.options.heightStyle && t.css("height", "") }, _setOption: function (t, e) { return "active" === t ? (this._activate(e), undefined) : ("event" === t && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(e)), this._super(t, e), "collapsible" !== t || e || this.options.active !== !1 || this._activate(0), "icons" === t && (this._destroyIcons(), e && this._createIcons()), "disabled" === t && this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!e), undefined) }, _keydown: function (e) { if (!e.altKey && !e.ctrlKey) { var i = t.ui.keyCode, s = this.headers.length, n = this.headers.index(e.target), o = !1; switch (e.keyCode) { case i.RIGHT: case i.DOWN: o = this.headers[(n + 1) % s]; break; case i.LEFT: case i.UP: o = this.headers[(n - 1 + s) % s]; break; case i.SPACE: case i.ENTER: this._eventHandler(e); break; case i.HOME: o = this.headers[0]; break; case i.END: o = this.headers[s - 1] }o && (t(e.target).attr("tabIndex", -1), t(o).attr("tabIndex", 0), o.focus(), e.preventDefault()) } }, _panelKeyDown: function (e) { e.keyCode === t.ui.keyCode.UP && e.ctrlKey && t(e.currentTarget).prev().focus() }, refresh: function () { var e = this.options; this._processPanels(), (e.active === !1 && e.collapsible === !0 || !this.headers.length) && (e.active = !1, this.active = t()), e.active === !1 ? this._activate(0) : this.active.length && !t.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (e.active = !1, this.active = t()) : this._activate(Math.max(0, e.active - 1)) : e.active = this.headers.index(this.active), this._destroyIcons(), this._refresh() }, _processPanels: function () { this.headers = this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"), this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide() }, _refresh: function () { var i, s = this.options, n = s.heightStyle, o = this.element.parent(), a = this.accordionId = "ui-accordion-" + (this.element.attr("id") || ++e); this.active = this._findActive(s.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"), this.active.next().addClass("ui-accordion-content-active").show(), this.headers.attr("role", "tab").each(function (e) { var i = t(this), s = i.attr("id"), n = i.next(), o = n.attr("id"); s || (s = a + "-header-" + e, i.attr("id", s)), o || (o = a + "-panel-" + e, n.attr("id", o)), i.attr("aria-controls", o), n.attr("aria-labelledby", s) }).next().attr("role", "tabpanel"), this.headers.not(this.active).attr({ "aria-selected": "false", tabIndex: -1 }).next().attr({ "aria-expanded": "false", "aria-hidden": "true" }).hide(), this.active.length ? this.active.attr({ "aria-selected": "true", tabIndex: 0 }).next().attr({ "aria-expanded": "true", "aria-hidden": "false" }) : this.headers.eq(0).attr("tabIndex", 0), this._createIcons(), this._setupEvents(s.event), "fill" === n ? (i = o.height(), this.element.siblings(":visible").each(function () { var e = t(this), s = e.css("position"); "absolute" !== s && "fixed" !== s && (i -= e.outerHeight(!0)) }), this.headers.each(function () { i -= t(this).outerHeight(!0) }), this.headers.next().each(function () { t(this).height(Math.max(0, i - t(this).innerHeight() + t(this).height())) }).css("overflow", "auto")) : "auto" === n && (i = 0, this.headers.next().each(function () { i = Math.max(i, t(this).css("height", "").height()) }).height(i)) }, _activate: function (e) { var i = this._findActive(e)[0]; i !== this.active[0] && (i = i || this.active[0], this._eventHandler({ target: i, currentTarget: i, preventDefault: t.noop })) }, _findActive: function (e) { return "number" == typeof e ? this.headers.eq(e) : t() }, _setupEvents: function (e) { var i = { keydown: "_keydown" }; e && t.each(e.split(" "), function (t, e) { i[e] = "_eventHandler" }), this._off(this.headers.add(this.headers.next())), this._on(this.headers, i), this._on(this.headers.next(), { keydown: "_panelKeyDown" }), this._hoverable(this.headers), this._focusable(this.headers) }, _eventHandler: function (e) { var i = this.options, s = this.active, n = t(e.currentTarget), o = n[0] === s[0], a = o && i.collapsible, r = a ? t() : n.next(), h = s.next(), l = { oldHeader: s, oldPanel: h, newHeader: a ? t() : n, newPanel: r }; e.preventDefault(), o && !i.collapsible || this._trigger("beforeActivate", e, l) === !1 || (i.active = a ? !1 : this.headers.index(n), this.active = o ? t() : n, this._toggle(l), s.removeClass("ui-accordion-header-active ui-state-active"), i.icons && s.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header), o || (n.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"), i.icons && n.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader), n.next().addClass("ui-accordion-content-active"))) }, _toggle: function (e) { var i = e.newPanel, s = this.prevShow.length ? this.prevShow : e.oldPanel; this.prevShow.add(this.prevHide).stop(!0, !0), this.prevShow = i, this.prevHide = s, this.options.animate ? this._animate(i, s, e) : (s.hide(), i.show(), this._toggleComplete(e)), s.attr({ "aria-expanded": "false", "aria-hidden": "true" }), s.prev().attr("aria-selected", "false"), i.length && s.length ? s.prev().attr("tabIndex", -1) : i.length && this.headers.filter(function () { return 0 === t(this).attr("tabIndex") }).attr("tabIndex", -1), i.attr({ "aria-expanded": "true", "aria-hidden": "false" }).prev().attr({ "aria-selected": "true", tabIndex: 0 }) }, _animate: function (t, e, n) { var o, a, r, h = this, l = 0, c = t.length && (!e.length || t.index() < e.index()), u = this.options.animate || {}, d = c && u.down || u, p = function () { h._toggleComplete(n) }; return "number" == typeof d && (r = d), "string" == typeof d && (a = d), a = a || d.easing || u.easing, r = r || d.duration || u.duration, e.length ? t.length ? (o = t.show().outerHeight(), e.animate(i, { duration: r, easing: a, step: function (t, e) { e.now = Math.round(t) } }), t.hide().animate(s, { duration: r, easing: a, complete: p, step: function (t, i) { i.now = Math.round(t), "height" !== i.prop ? l += i.now : "content" !== h.options.heightStyle && (i.now = Math.round(o - e.outerHeight() - l), l = 0) } }), undefined) : e.animate(i, r, a, p) : t.animate(s, r, a, p) }, _toggleComplete: function (t) { var e = t.oldPanel; e.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"), e.length && (e.parent()[0].className = e.parent()[0].className), this._trigger("activate", null, t) }
    })
}(jQuery), function (t) { var e = 0; t.widget("ui.autocomplete", { version: "1.10.2", defaultElement: "<input>", options: { appendTo: null, autoFocus: !1, delay: 300, minLength: 1, position: { my: "left top", at: "left bottom", collision: "none" }, source: null, change: null, close: null, focus: null, open: null, response: null, search: null, select: null }, pending: 0, _create: function () { var e, i, s, n = this.element[0].nodeName.toLowerCase(), o = "textarea" === n, a = "input" === n; this.isMultiLine = o ? !0 : a ? !1 : this.element.prop("isContentEditable"), this.valueMethod = this.element[o || a ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, { keydown: function (n) { if (this.element.prop("readOnly")) return e = !0, s = !0, i = !0, undefined; e = !1, s = !1, i = !1; var o = t.ui.keyCode; switch (n.keyCode) { case o.PAGE_UP: e = !0, this._move("previousPage", n); break; case o.PAGE_DOWN: e = !0, this._move("nextPage", n); break; case o.UP: e = !0, this._keyEvent("previous", n); break; case o.DOWN: e = !0, this._keyEvent("next", n); break; case o.ENTER: case o.NUMPAD_ENTER: this.menu.active && (e = !0, n.preventDefault(), this.menu.select(n)); break; case o.TAB: this.menu.active && this.menu.select(n); break; case o.ESCAPE: this.menu.element.is(":visible") && (this._value(this.term), this.close(n), n.preventDefault()); break; default: i = !0, this._searchTimeout(n) } }, keypress: function (s) { if (e) return e = !1, s.preventDefault(), undefined; if (!i) { var n = t.ui.keyCode; switch (s.keyCode) { case n.PAGE_UP: this._move("previousPage", s); break; case n.PAGE_DOWN: this._move("nextPage", s); break; case n.UP: this._keyEvent("previous", s); break; case n.DOWN: this._keyEvent("next", s) } } }, input: function (t) { return s ? (s = !1, t.preventDefault(), undefined) : (this._searchTimeout(t), undefined) }, focus: function () { this.selectedItem = null, this.previous = this._value() }, blur: function (t) { return this.cancelBlur ? (delete this.cancelBlur, undefined) : (clearTimeout(this.searching), this.close(t), this._change(t), undefined) } }), this._initSource(), this.menu = t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({ input: t(), role: null }).hide().data("ui-menu"), this._on(this.menu.element, { mousedown: function (e) { e.preventDefault(), this.cancelBlur = !0, this._delay(function () { delete this.cancelBlur }); var i = this.menu.element[0]; t(e.target).closest(".ui-menu-item").length || this._delay(function () { var e = this; this.document.one("mousedown", function (s) { s.target === e.element[0] || s.target === i || t.contains(i, s.target) || e.close() }) }) }, menufocus: function (e, i) { if (this.isNewMenu && (this.isNewMenu = !1, e.originalEvent && /^mouse/.test(e.originalEvent.type))) return this.menu.blur(), this.document.one("mousemove", function () { t(e.target).trigger(e.originalEvent) }), undefined; var s = i.item.data("ui-autocomplete-item"); !1 !== this._trigger("focus", e, { item: s }) ? e.originalEvent && /^key/.test(e.originalEvent.type) && this._value(s.value) : this.liveRegion.text(s.value) }, menuselect: function (t, e) { var i = e.item.data("ui-autocomplete-item"), s = this.previous; this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = s, this._delay(function () { this.previous = s, this.selectedItem = i })), !1 !== this._trigger("select", t, { item: i }) && this._value(i.value), this.term = this._value(), this.close(t), this.selectedItem = i } }), this.liveRegion = t("<span>", { role: "status", "aria-live": "polite" }).addClass("ui-helper-hidden-accessible").insertAfter(this.element), this._on(this.window, { beforeunload: function () { this.element.removeAttr("autocomplete") } }) }, _destroy: function () { clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove() }, _setOption: function (t, e) { this._super(t, e), "source" === t && this._initSource(), "appendTo" === t && this.menu.element.appendTo(this._appendTo()), "disabled" === t && e && this.xhr && this.xhr.abort() }, _appendTo: function () { var e = this.options.appendTo; return e && (e = e.jquery || e.nodeType ? t(e) : this.document.find(e).eq(0)), e || (e = this.element.closest(".ui-front")), e.length || (e = this.document[0].body), e }, _initSource: function () { var e, i, s = this; t.isArray(this.options.source) ? (e = this.options.source, this.source = function (i, s) { s(t.ui.autocomplete.filter(e, i.term)) }) : "string" == typeof this.options.source ? (i = this.options.source, this.source = function (e, n) { s.xhr && s.xhr.abort(), s.xhr = t.ajax({ url: i, data: e, dataType: "json", success: function (t) { n(t) }, error: function () { n([]) } }) }) : this.source = this.options.source }, _searchTimeout: function (t) { clearTimeout(this.searching), this.searching = this._delay(function () { this.term !== this._value() && (this.selectedItem = null, this.search(null, t)) }, this.options.delay) }, search: function (t, e) { return t = null != t ? t : this._value(), this.term = this._value(), t.length < this.options.minLength ? this.close(e) : this._trigger("search", e) !== !1 ? this._search(t) : undefined }, _search: function (t) { this.pending++ , this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({ term: t }, this._response()) }, _response: function () { var t = this, i = ++e; return function (s) { i === e && t.__response(s), t.pending-- , t.pending || t.element.removeClass("ui-autocomplete-loading") } }, __response: function (t) { t && (t = this._normalize(t)), this._trigger("response", null, { content: t }), !this.options.disabled && t && t.length && !this.cancelSearch ? (this._suggest(t), this._trigger("open")) : this._close() }, close: function (t) { this.cancelSearch = !0, this._close(t) }, _close: function (t) { this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", t)) }, _change: function (t) { this.previous !== this._value() && this._trigger("change", t, { item: this.selectedItem }) }, _normalize: function (e) { return e.length && e[0].label && e[0].value ? e : t.map(e, function (e) { return "string" == typeof e ? { label: e, value: e } : t.extend({ label: e.label || e.value, value: e.value || e.label }, e) }) }, _suggest: function (e) { var i = this.menu.element.empty(); this._renderMenu(i, e), this.isNewMenu = !0, this.menu.refresh(), i.show(), this._resizeMenu(), i.position(t.extend({ of: this.element }, this.options.position)), this.options.autoFocus && this.menu.next() }, _resizeMenu: function () { var t = this.menu.element; t.outerWidth(Math.max(t.width("").outerWidth() + 1, this.element.outerWidth())) }, _renderMenu: function (e, i) { var s = this; t.each(i, function (t, i) { s._renderItemData(e, i) }) }, _renderItemData: function (t, e) { return this._renderItem(t, e).data("ui-autocomplete-item", e) }, _renderItem: function (e, i) { return t("<li>").append(t("<a>").text(i.label)).appendTo(e) }, _move: function (t, e) { return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(t) || this.menu.isLastItem() && /^next/.test(t) ? (this._value(this.term), this.menu.blur(), undefined) : (this.menu[t](e), undefined) : (this.search(null, e), undefined) }, widget: function () { return this.menu.element }, _value: function () { return this.valueMethod.apply(this.element, arguments) }, _keyEvent: function (t, e) { (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(t, e), e.preventDefault()) } }), t.extend(t.ui.autocomplete, { escapeRegex: function (t) { return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") }, filter: function (e, i) { var s = RegExp(t.ui.autocomplete.escapeRegex(i), "i"); return t.grep(e, function (t) { return s.test(t.label || t.value || t) }) } }), t.widget("ui.autocomplete", t.ui.autocomplete, { options: { messages: { noResults: "No search results.", results: function (t) { return t + (t > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate." } } }, __response: function (t) { var e; this._superApply(arguments), this.options.disabled || this.cancelSearch || (e = t && t.length ? this.options.messages.results(t.length) : this.options.messages.noResults, this.liveRegion.text(e)) } }) }(jQuery), function (t) { var e, i, s, n, o = "ui-button ui-widget ui-state-default ui-corner-all", a = "ui-state-hover ui-state-active ", r = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only", h = function () { var e = t(this).find(":ui-button"); setTimeout(function () { e.button("refresh") }, 1) }, l = function (e) { var i = e.name, s = e.form, n = t([]); return i && (i = i.replace(/'/g, "\\'"), n = s ? t(s).find("[name='" + i + "']") : t("[name='" + i + "']", e.ownerDocument).filter(function () { return !this.form })), n }; t.widget("ui.button", { version: "1.10.2", defaultElement: "<button>", options: { disabled: null, text: !0, label: null, icons: { primary: null, secondary: null } }, _create: function () { this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, h), "boolean" != typeof this.options.disabled ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title"); var a = this, r = this.options, c = "checkbox" === this.type || "radio" === this.type, u = c ? "" : "ui-state-active", d = "ui-state-focus"; null === r.label && (r.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html()), this._hoverable(this.buttonElement), this.buttonElement.addClass(o).attr("role", "button").bind("mouseenter" + this.eventNamespace, function () { r.disabled || this === e && t(this).addClass("ui-state-active") }).bind("mouseleave" + this.eventNamespace, function () { r.disabled || t(this).removeClass(u) }).bind("click" + this.eventNamespace, function (t) { r.disabled && (t.preventDefault(), t.stopImmediatePropagation()) }), this.element.bind("focus" + this.eventNamespace, function () { a.buttonElement.addClass(d) }).bind("blur" + this.eventNamespace, function () { a.buttonElement.removeClass(d) }), c && (this.element.bind("change" + this.eventNamespace, function () { n || a.refresh() }), this.buttonElement.bind("mousedown" + this.eventNamespace, function (t) { r.disabled || (n = !1, i = t.pageX, s = t.pageY) }).bind("mouseup" + this.eventNamespace, function (t) { r.disabled || (i !== t.pageX || s !== t.pageY) && (n = !0) })), "checkbox" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function () { return r.disabled || n ? !1 : undefined }) : "radio" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function () { if (r.disabled || n) return !1; t(this).addClass("ui-state-active"), a.buttonElement.attr("aria-pressed", "true"); var e = a.element[0]; l(e).not(e).map(function () { return t(this).button("widget")[0] }).removeClass("ui-state-active").attr("aria-pressed", "false") }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function () { return r.disabled ? !1 : (t(this).addClass("ui-state-active"), e = this, a.document.one("mouseup", function () { e = null }), undefined) }).bind("mouseup" + this.eventNamespace, function () { return r.disabled ? !1 : (t(this).removeClass("ui-state-active"), undefined) }).bind("keydown" + this.eventNamespace, function (e) { return r.disabled ? !1 : ((e.keyCode === t.ui.keyCode.SPACE || e.keyCode === t.ui.keyCode.ENTER) && t(this).addClass("ui-state-active"), undefined) }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function () { t(this).removeClass("ui-state-active") }), this.buttonElement.is("a") && this.buttonElement.keyup(function (e) { e.keyCode === t.ui.keyCode.SPACE && t(this).click() })), this._setOption("disabled", r.disabled), this._resetButton() }, _determineButtonType: function () { var t, e, i; this.type = this.element.is("[type=checkbox]") ? "checkbox" : this.element.is("[type=radio]") ? "radio" : this.element.is("input") ? "input" : "button", "checkbox" === this.type || "radio" === this.type ? (t = this.element.parents().last(), e = "label[for='" + this.element.attr("id") + "']", this.buttonElement = t.find(e), this.buttonElement.length || (t = t.length ? t.siblings() : this.element.siblings(), this.buttonElement = t.filter(e), this.buttonElement.length || (this.buttonElement = t.find(e))), this.element.addClass("ui-helper-hidden-accessible"), i = this.element.is(":checked"), i && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", i)) : this.buttonElement = this.element }, widget: function () { return this.buttonElement }, _destroy: function () { this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(o + " " + a + " " + r).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title") }, _setOption: function (t, e) { return this._super(t, e), "disabled" === t ? (e ? this.element.prop("disabled", !0) : this.element.prop("disabled", !1), undefined) : (this._resetButton(), undefined) }, refresh: function () { var e = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled"); e !== this.options.disabled && this._setOption("disabled", e), "radio" === this.type ? l(this.element[0]).each(function () { t(this).is(":checked") ? t(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : t(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false") }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false")) }, _resetButton: function () { if ("input" === this.type) return this.options.label && this.element.val(this.options.label), undefined; var e = this.buttonElement.removeClass(r), i = t("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(), s = this.options.icons, n = s.primary && s.secondary, o = []; s.primary || s.secondary ? (this.options.text && o.push("ui-button-text-icon" + (n ? "s" : s.primary ? "-primary" : "-secondary")), s.primary && e.prepend("<span class='ui-button-icon-primary ui-icon " + s.primary + "'></span>"), s.secondary && e.append("<span class='ui-button-icon-secondary ui-icon " + s.secondary + "'></span>"), this.options.text || (o.push(n ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || e.attr("title", t.trim(i)))) : o.push("ui-button-text-only"), e.addClass(o.join(" ")) } }), t.widget("ui.buttonset", { version: "1.10.2", options: { items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)" }, _create: function () { this.element.addClass("ui-buttonset") }, _init: function () { this.refresh() }, _setOption: function (t, e) { "disabled" === t && this.buttons.button("option", t, e), this._super(t, e) }, refresh: function () { var e = "rtl" === this.element.css("direction"); this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function () { return t(this).button("widget")[0] }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(e ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(e ? "ui-corner-left" : "ui-corner-right").end().end() }, _destroy: function () { this.element.removeClass("ui-buttonset"), this.buttons.map(function () { return t(this).button("widget")[0] }).removeClass("ui-corner-left ui-corner-right").end().button("destroy") } }) }(jQuery), function (t, e) {
    function i() { this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = { closeText: "Done", prevText: "Prev", nextText: "Next", currentText: "Today", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], weekHeader: "Wk", dateFormat: "mm/dd/yy", firstDay: 0, isRTL: !1, showMonthAfterYear: !1, yearSuffix: "" }, this._defaults = { showOn: "focus", showAnim: "fadeIn", showOptions: {}, defaultDate: null, appendText: "", buttonText: "...", buttonImage: "", buttonImageOnly: !1, hideIfNoPrevNext: !1, navigationAsDateFormat: !1, gotoCurrent: !1, changeMonth: !1, changeYear: !1, yearRange: "c-10:c+10", showOtherMonths: !1, selectOtherMonths: !1, showWeek: !1, calculateWeek: this.iso8601Week, shortYearCutoff: "+10", minDate: null, maxDate: null, duration: "fast", beforeShowDay: null, beforeShow: null, onSelect: null, onChangeMonthYear: null, onClose: null, numberOfMonths: 1, showCurrentAtPos: 0, stepMonths: 1, stepBigMonths: 12, altField: "", altFormat: "", constrainInput: !0, showButtonPanel: !1, autoSize: !1, disabled: !1 }, t.extend(this._defaults, this.regional[""]), this.dpDiv = s(t("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) } function s(e) { var i = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a"; return e.delegate(i, "mouseout", function () { t(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && t(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && t(this).removeClass("ui-datepicker-next-hover") }).delegate(i, "mouseover", function () { t.datepicker._isDisabledDatepicker(o.inline ? e.parent()[0] : o.input[0]) || (t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), t(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && t(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && t(this).addClass("ui-datepicker-next-hover")) }) } function n(e, i) { t.extend(e, i); for (var s in i) null == i[s] && (e[s] = i[s]); return e } t.extend(t.ui, { datepicker: { version: "1.10.2" } }); var o, a = "datepicker", r = (new Date).getTime(); t.extend(i.prototype, {
        markerClassName: "hasDatepicker", maxRows: 4, _widgetDatepicker: function () { return this.dpDiv }, setDefaults: function (t) { return n(this._defaults, t || {}), this }, _attachDatepicker: function (e, i) { var s, n, o; s = e.nodeName.toLowerCase(), n = "div" === s || "span" === s, e.id || (this.uuid += 1, e.id = "dp" + this.uuid), o = this._newInst(t(e), n), o.settings = t.extend({}, i || {}), "input" === s ? this._connectDatepicker(e, o) : n && this._inlineDatepicker(e, o) }, _newInst: function (e, i) { var n = e[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); return { id: n, input: e, selectedDay: 0, selectedMonth: 0, selectedYear: 0, drawMonth: 0, drawYear: 0, inline: i, dpDiv: i ? s(t("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv } }, _connectDatepicker: function (e, i) { var s = t(e); i.append = t([]), i.trigger = t([]), s.hasClass(this.markerClassName) || (this._attachments(s, i), s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(i), t.data(e, a, i), i.settings.disabled && this._disableDatepicker(e)) }, _attachments: function (e, i) { var s, n, o, a = this._get(i, "appendText"), r = this._get(i, "isRTL"); i.append && i.append.remove(), a && (i.append = t("<span class='" + this._appendClass + "'>" + a + "</span>"), e[r ? "before" : "after"](i.append)), e.unbind("focus", this._showDatepicker), i.trigger && i.trigger.remove(), s = this._get(i, "showOn"), ("focus" === s || "both" === s) && e.focus(this._showDatepicker), ("button" === s || "both" === s) && (n = this._get(i, "buttonText"), o = this._get(i, "buttonImage"), i.trigger = t(this._get(i, "buttonImageOnly") ? t("<img/>").addClass(this._triggerClass).attr({ src: o, alt: n, title: n }) : t("<button type='button'></button>").addClass(this._triggerClass).html(o ? t("<img/>").attr({ src: o, alt: n, title: n }) : n)), e[r ? "before" : "after"](i.trigger), i.trigger.click(function () { return t.datepicker._datepickerShowing && t.datepicker._lastInput === e[0] ? t.datepicker._hideDatepicker() : t.datepicker._datepickerShowing && t.datepicker._lastInput !== e[0] ? (t.datepicker._hideDatepicker(), t.datepicker._showDatepicker(e[0])) : t.datepicker._showDatepicker(e[0]), !1 })) }, _autoSize: function (t) { if (this._get(t, "autoSize") && !t.inline) { var e, i, s, n, o = new Date(2009, 11, 20), a = this._get(t, "dateFormat"); a.match(/[DM]/) && (e = function (t) { for (i = 0, s = 0, n = 0; t.length > n; n++)t[n].length > i && (i = t[n].length, s = n); return s }, o.setMonth(e(this._get(t, a.match(/MM/) ? "monthNames" : "monthNamesShort"))), o.setDate(e(this._get(t, a.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - o.getDay())), t.input.attr("size", this._formatDate(t, o).length) } }, _inlineDatepicker: function (e, i) { var s = t(e); s.hasClass(this.markerClassName) || (s.addClass(this.markerClassName).append(i.dpDiv), t.data(e, a, i), this._setDate(i, this._getDefaultDate(i), !0), this._updateDatepicker(i), this._updateAlternate(i), i.settings.disabled && this._disableDatepicker(e), i.dpDiv.css("display", "block")) }, _dialogDatepicker: function (e, i, s, o, r) { var h, l, c, u, d, p = this._dialogInst; return p || (this.uuid += 1, h = "dp" + this.uuid, this._dialogInput = t("<input type='text' id='" + h + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), t("body").append(this._dialogInput), p = this._dialogInst = this._newInst(this._dialogInput, !1), p.settings = {}, t.data(this._dialogInput[0], a, p)), n(p.settings, o || {}), i = i && i.constructor === Date ? this._formatDate(p, i) : i, this._dialogInput.val(i), this._pos = r ? r.length ? r : [r.pageX, r.pageY] : null, this._pos || (l = document.documentElement.clientWidth, c = document.documentElement.clientHeight, u = document.documentElement.scrollLeft || document.body.scrollLeft, d = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [l / 2 - 100 + u, c / 2 - 150 + d]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), p.settings.onSelect = s, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), t.blockUI && t.blockUI(this.dpDiv), t.data(this._dialogInput[0], a, p), this }, _destroyDatepicker: function (e) { var i, s = t(e), n = t.data(e, a); s.hasClass(this.markerClassName) && (i = e.nodeName.toLowerCase(), t.removeData(e, a), "input" === i ? (n.append.remove(), n.trigger.remove(), s.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === i || "span" === i) && s.removeClass(this.markerClassName).empty()) }, _enableDatepicker: function (e) { var i, s, n = t(e), o = t.data(e, a); n.hasClass(this.markerClassName) && (i = e.nodeName.toLowerCase(), "input" === i ? (e.disabled = !1, o.trigger.filter("button").each(function () { this.disabled = !1 }).end().filter("img").css({ opacity: "1.0", cursor: "" })) : ("div" === i || "span" === i) && (s = n.children("." + this._inlineClass), s.children().removeClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = t.map(this._disabledInputs, function (t) { return t === e ? null : t })) }, _disableDatepicker: function (e) { var i, s, n = t(e), o = t.data(e, a); n.hasClass(this.markerClassName) && (i = e.nodeName.toLowerCase(), "input" === i ? (e.disabled = !0, o.trigger.filter("button").each(function () { this.disabled = !0 }).end().filter("img").css({ opacity: "0.5", cursor: "default" })) : ("div" === i || "span" === i) && (s = n.children("." + this._inlineClass), s.children().addClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = t.map(this._disabledInputs, function (t) { return t === e ? null : t }), this._disabledInputs[this._disabledInputs.length] = e) }, _isDisabledDatepicker: function (t) { if (!t) return !1; for (var e = 0; this._disabledInputs.length > e; e++)if (this._disabledInputs[e] === t) return !0; return !1 }, _getInst: function (e) { try { return t.data(e, a) } catch (i) { throw "Missing instance data for this datepicker" } }, _optionDatepicker: function (i, s, o) { var a, r, h, l, c = this._getInst(i); return 2 === arguments.length && "string" == typeof s ? "defaults" === s ? t.extend({}, t.datepicker._defaults) : c ? "all" === s ? t.extend({}, c.settings) : this._get(c, s) : null : (a = s || {}, "string" == typeof s && (a = {}, a[s] = o), c && (this._curInst === c && this._hideDatepicker(), r = this._getDateDatepicker(i, !0), h = this._getMinMaxDate(c, "min"), l = this._getMinMaxDate(c, "max"), n(c.settings, a), null !== h && a.dateFormat !== e && a.minDate === e && (c.settings.minDate = this._formatDate(c, h)), null !== l && a.dateFormat !== e && a.maxDate === e && (c.settings.maxDate = this._formatDate(c, l)), "disabled" in a && (a.disabled ? this._disableDatepicker(i) : this._enableDatepicker(i)), this._attachments(t(i), c), this._autoSize(c), this._setDate(c, r), this._updateAlternate(c), this._updateDatepicker(c)), e) }, _changeDatepicker: function (t, e, i) { this._optionDatepicker(t, e, i) }, _refreshDatepicker: function (t) { var e = this._getInst(t); e && this._updateDatepicker(e) }, _setDateDatepicker: function (t, e) { var i = this._getInst(t); i && (this._setDate(i, e), this._updateDatepicker(i), this._updateAlternate(i)) }, _getDateDatepicker: function (t, e) { var i = this._getInst(t); return i && !i.inline && this._setDateFromField(i, e), i ? this._getDate(i) : null }, _doKeyDown: function (e) {
            var i, s, n, o = t.datepicker._getInst(e.target), a = !0, r = o.dpDiv.is(".ui-datepicker-rtl"); if (o._keyEvent = !0, t.datepicker._datepickerShowing) switch (e.keyCode) {
                case 9: t.datepicker._hideDatepicker(), a = !1; break; case 13: return n = t("td." + t.datepicker._dayOverClass + ":not(." + t.datepicker._currentClass + ")", o.dpDiv), n[0] && t.datepicker._selectDay(e.target, o.selectedMonth, o.selectedYear, n[0]), i = t.datepicker._get(o, "onSelect"), i ? (s = t.datepicker._formatDate(o), i.apply(o.input ? o.input[0] : null, [s, o])) : t.datepicker._hideDatepicker(), !1; case 27: t.datepicker._hideDatepicker(); break; case 33: t.datepicker._adjustDate(e.target, e.ctrlKey ? -t.datepicker._get(o, "stepBigMonths") : -t.datepicker._get(o, "stepMonths"), "M");
                    break; case 34: t.datepicker._adjustDate(e.target, e.ctrlKey ? +t.datepicker._get(o, "stepBigMonths") : +t.datepicker._get(o, "stepMonths"), "M"); break; case 35: (e.ctrlKey || e.metaKey) && t.datepicker._clearDate(e.target), a = e.ctrlKey || e.metaKey; break; case 36: (e.ctrlKey || e.metaKey) && t.datepicker._gotoToday(e.target), a = e.ctrlKey || e.metaKey; break; case 37: (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, r ? 1 : -1, "D"), a = e.ctrlKey || e.metaKey, e.originalEvent.altKey && t.datepicker._adjustDate(e.target, e.ctrlKey ? -t.datepicker._get(o, "stepBigMonths") : -t.datepicker._get(o, "stepMonths"), "M"); break; case 38: (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, -7, "D"), a = e.ctrlKey || e.metaKey; break; case 39: (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, r ? -1 : 1, "D"), a = e.ctrlKey || e.metaKey, e.originalEvent.altKey && t.datepicker._adjustDate(e.target, e.ctrlKey ? +t.datepicker._get(o, "stepBigMonths") : +t.datepicker._get(o, "stepMonths"), "M"); break; case 40: (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, 7, "D"), a = e.ctrlKey || e.metaKey; break; default: a = !1
            } else 36 === e.keyCode && e.ctrlKey ? t.datepicker._showDatepicker(this) : a = !1; a && (e.preventDefault(), e.stopPropagation())
        }, _doKeyPress: function (i) { var s, n, o = t.datepicker._getInst(i.target); return t.datepicker._get(o, "constrainInput") ? (s = t.datepicker._possibleChars(t.datepicker._get(o, "dateFormat")), n = String.fromCharCode(null == i.charCode ? i.keyCode : i.charCode), i.ctrlKey || i.metaKey || " " > n || !s || s.indexOf(n) > -1) : e }, _doKeyUp: function (e) { var i, s = t.datepicker._getInst(e.target); if (s.input.val() !== s.lastVal) try { i = t.datepicker.parseDate(t.datepicker._get(s, "dateFormat"), s.input ? s.input.val() : null, t.datepicker._getFormatConfig(s)), i && (t.datepicker._setDateFromField(s), t.datepicker._updateAlternate(s), t.datepicker._updateDatepicker(s)) } catch (n) { } return !0 }, _showDatepicker: function (e) { if (e = e.target || e, "input" !== e.nodeName.toLowerCase() && (e = t("input", e.parentNode)[0]), !t.datepicker._isDisabledDatepicker(e) && t.datepicker._lastInput !== e) { var i, s, o, a, r, h, l; i = t.datepicker._getInst(e), t.datepicker._curInst && t.datepicker._curInst !== i && (t.datepicker._curInst.dpDiv.stop(!0, !0), i && t.datepicker._datepickerShowing && t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])), s = t.datepicker._get(i, "beforeShow"), o = s ? s.apply(e, [e, i]) : {}, o !== !1 && (n(i.settings, o), i.lastVal = null, t.datepicker._lastInput = e, t.datepicker._setDateFromField(i), t.datepicker._inDialog && (e.value = ""), t.datepicker._pos || (t.datepicker._pos = t.datepicker._findPos(e), t.datepicker._pos[1] += e.offsetHeight), a = !1, t(e).parents().each(function () { return a |= "fixed" === t(this).css("position"), !a }), r = { left: t.datepicker._pos[0], top: t.datepicker._pos[1] }, t.datepicker._pos = null, i.dpDiv.empty(), i.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" }), t.datepicker._updateDatepicker(i), r = t.datepicker._checkOffset(i, r, a), i.dpDiv.css({ position: t.datepicker._inDialog && t.blockUI ? "static" : a ? "fixed" : "absolute", display: "none", left: r.left + "px", top: r.top + "px" }), i.inline || (h = t.datepicker._get(i, "showAnim"), l = t.datepicker._get(i, "duration"), i.dpDiv.zIndex(t(e).zIndex() + 1), t.datepicker._datepickerShowing = !0, t.effects && t.effects.effect[h] ? i.dpDiv.show(h, t.datepicker._get(i, "showOptions"), l) : i.dpDiv[h || "show"](h ? l : null), i.input.is(":visible") && !i.input.is(":disabled") && i.input.focus(), t.datepicker._curInst = i)) } }, _updateDatepicker: function (e) { this.maxRows = 4, o = e, e.dpDiv.empty().append(this._generateHTML(e)), this._attachHandlers(e), e.dpDiv.find("." + this._dayOverClass + " a").mouseover(); var i, s = this._getNumberOfMonths(e), n = s[1], a = 17; e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), n > 1 && e.dpDiv.addClass("ui-datepicker-multi-" + n).css("width", a * n + "em"), e.dpDiv[(1 !== s[0] || 1 !== s[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), e.dpDiv[(this._get(e, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), e === t.datepicker._curInst && t.datepicker._datepickerShowing && e.input && e.input.is(":visible") && !e.input.is(":disabled") && e.input[0] !== document.activeElement && e.input.focus(), e.yearshtml && (i = e.yearshtml, setTimeout(function () { i === e.yearshtml && e.yearshtml && e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml), i = e.yearshtml = null }, 0)) }, _getBorders: function (t) { var e = function (t) { return { thin: 1, medium: 2, thick: 3 }[t] || t }; return [parseFloat(e(t.css("border-left-width"))), parseFloat(e(t.css("border-top-width")))] }, _checkOffset: function (e, i, s) { var n = e.dpDiv.outerWidth(), o = e.dpDiv.outerHeight(), a = e.input ? e.input.outerWidth() : 0, r = e.input ? e.input.outerHeight() : 0, h = document.documentElement.clientWidth + (s ? 0 : t(document).scrollLeft()), l = document.documentElement.clientHeight + (s ? 0 : t(document).scrollTop()); return i.left -= this._get(e, "isRTL") ? n - a : 0, i.left -= s && i.left === e.input.offset().left ? t(document).scrollLeft() : 0, i.top -= s && i.top === e.input.offset().top + r ? t(document).scrollTop() : 0, i.left -= Math.min(i.left, i.left + n > h && h > n ? Math.abs(i.left + n - h) : 0), i.top -= Math.min(i.top, i.top + o > l && l > o ? Math.abs(o + r) : 0), i }, _findPos: function (e) { for (var i, s = this._getInst(e), n = this._get(s, "isRTL"); e && ("hidden" === e.type || 1 !== e.nodeType || t.expr.filters.hidden(e));)e = e[n ? "previousSibling" : "nextSibling"]; return i = t(e).offset(), [i.left, i.top] }, _hideDatepicker: function (e) { var i, s, n, o, r = this._curInst; !r || e && r !== t.data(e, a) || this._datepickerShowing && (i = this._get(r, "showAnim"), s = this._get(r, "duration"), n = function () { t.datepicker._tidyDialog(r) }, t.effects && (t.effects.effect[i] || t.effects[i]) ? r.dpDiv.hide(i, t.datepicker._get(r, "showOptions"), s, n) : r.dpDiv["slideDown" === i ? "slideUp" : "fadeIn" === i ? "fadeOut" : "hide"](i ? s : null, n), i || n(), this._datepickerShowing = !1, o = this._get(r, "onClose"), o && o.apply(r.input ? r.input[0] : null, [r.input ? r.input.val() : "", r]), this._lastInput = null, this._inDialog && (this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" }), t.blockUI && (t.unblockUI(), t("body").append(this.dpDiv))), this._inDialog = !1) }, _tidyDialog: function (t) { t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar") }, _checkExternalClick: function (e) { if (t.datepicker._curInst) { var i = t(e.target), s = t.datepicker._getInst(i[0]); (i[0].id !== t.datepicker._mainDivId && 0 === i.parents("#" + t.datepicker._mainDivId).length && !i.hasClass(t.datepicker.markerClassName) && !i.closest("." + t.datepicker._triggerClass).length && t.datepicker._datepickerShowing && (!t.datepicker._inDialog || !t.blockUI) || i.hasClass(t.datepicker.markerClassName) && t.datepicker._curInst !== s) && t.datepicker._hideDatepicker() } }, _adjustDate: function (e, i, s) { var n = t(e), o = this._getInst(n[0]); this._isDisabledDatepicker(n[0]) || (this._adjustInstDate(o, i + ("M" === s ? this._get(o, "showCurrentAtPos") : 0), s), this._updateDatepicker(o)) }, _gotoToday: function (e) { var i, s = t(e), n = this._getInst(s[0]); this._get(n, "gotoCurrent") && n.currentDay ? (n.selectedDay = n.currentDay, n.drawMonth = n.selectedMonth = n.currentMonth, n.drawYear = n.selectedYear = n.currentYear) : (i = new Date, n.selectedDay = i.getDate(), n.drawMonth = n.selectedMonth = i.getMonth(), n.drawYear = n.selectedYear = i.getFullYear()), this._notifyChange(n), this._adjustDate(s) }, _selectMonthYear: function (e, i, s) { var n = t(e), o = this._getInst(n[0]); o["selected" + ("M" === s ? "Month" : "Year")] = o["draw" + ("M" === s ? "Month" : "Year")] = parseInt(i.options[i.selectedIndex].value, 10), this._notifyChange(o), this._adjustDate(n) }, _selectDay: function (e, i, s, n) { var o, a = t(e); t(n).hasClass(this._unselectableClass) || this._isDisabledDatepicker(a[0]) || (o = this._getInst(a[0]), o.selectedDay = o.currentDay = t("a", n).html(), o.selectedMonth = o.currentMonth = i, o.selectedYear = o.currentYear = s, this._selectDate(e, this._formatDate(o, o.currentDay, o.currentMonth, o.currentYear))) }, _clearDate: function (e) { var i = t(e); this._selectDate(i, "") }, _selectDate: function (e, i) { var s, n = t(e), o = this._getInst(n[0]); i = null != i ? i : this._formatDate(o), o.input && o.input.val(i), this._updateAlternate(o), s = this._get(o, "onSelect"), s ? s.apply(o.input ? o.input[0] : null, [i, o]) : o.input && o.input.trigger("change"), o.inline ? this._updateDatepicker(o) : (this._hideDatepicker(), this._lastInput = o.input[0], "object" != typeof o.input[0] && o.input.focus(), this._lastInput = null) }, _updateAlternate: function (e) { var i, s, n, o = this._get(e, "altField"); o && (i = this._get(e, "altFormat") || this._get(e, "dateFormat"), s = this._getDate(e), n = this.formatDate(i, s, this._getFormatConfig(e)), t(o).each(function () { t(this).val(n) })) }, noWeekends: function (t) { var e = t.getDay(); return [e > 0 && 6 > e, ""] }, iso8601Week: function (t) { var e, i = new Date(t.getTime()); return i.setDate(i.getDate() + 4 - (i.getDay() || 7)), e = i.getTime(), i.setMonth(0), i.setDate(1), Math.floor(Math.round((e - i) / 864e5) / 7) + 1 }, parseDate: function (i, s, n) { if (null == i || null == s) throw "Invalid arguments"; if (s = "object" == typeof s ? "" + s : s + "", "" === s) return null; var o, a, r, h, l = 0, c = (n ? n.shortYearCutoff : null) || this._defaults.shortYearCutoff, u = "string" != typeof c ? c : (new Date).getFullYear() % 100 + parseInt(c, 10), d = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort, p = (n ? n.dayNames : null) || this._defaults.dayNames, f = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort, g = (n ? n.monthNames : null) || this._defaults.monthNames, m = -1, v = -1, _ = -1, b = -1, y = !1, w = function (t) { var e = i.length > o + 1 && i.charAt(o + 1) === t; return e && o++ , e }, k = function (t) { var e = w(t), i = "@" === t ? 14 : "!" === t ? 20 : "y" === t && e ? 4 : "o" === t ? 3 : 2, n = RegExp("^\\d{1," + i + "}"), o = s.substring(l).match(n); if (!o) throw "Missing number at position " + l; return l += o[0].length, parseInt(o[0], 10) }, x = function (i, n, o) { var a = -1, r = t.map(w(i) ? o : n, function (t, e) { return [[e, t]] }).sort(function (t, e) { return -(t[1].length - e[1].length) }); if (t.each(r, function (t, i) { var n = i[1]; return s.substr(l, n.length).toLowerCase() === n.toLowerCase() ? (a = i[0], l += n.length, !1) : e }), -1 !== a) return a + 1; throw "Unknown name at position " + l }, D = function () { if (s.charAt(l) !== i.charAt(o)) throw "Unexpected literal at position " + l; l++ }; for (o = 0; i.length > o; o++)if (y) "'" !== i.charAt(o) || w("'") ? D() : y = !1; else switch (i.charAt(o)) { case "d": _ = k("d"); break; case "D": x("D", d, p); break; case "o": b = k("o"); break; case "m": v = k("m"); break; case "M": v = x("M", f, g); break; case "y": m = k("y"); break; case "@": h = new Date(k("@")), m = h.getFullYear(), v = h.getMonth() + 1, _ = h.getDate(); break; case "!": h = new Date((k("!") - this._ticksTo1970) / 1e4), m = h.getFullYear(), v = h.getMonth() + 1, _ = h.getDate(); break; case "'": w("'") ? D() : y = !0; break; default: D() }if (s.length > l && (r = s.substr(l), !/^\s+/.test(r))) throw "Extra/unparsed characters found in date: " + r; if (-1 === m ? m = (new Date).getFullYear() : 100 > m && (m += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (u >= m ? 0 : -100)), b > -1) for (v = 1, _ = b; ;) { if (a = this._getDaysInMonth(m, v - 1), a >= _) break; v++ , _ -= a } if (h = this._daylightSavingAdjust(new Date(m, v - 1, _)), h.getFullYear() !== m || h.getMonth() + 1 !== v || h.getDate() !== _) throw "Invalid date"; return h }, ATOM: "yy-mm-dd", COOKIE: "D, dd M yy", ISO_8601: "yy-mm-dd", RFC_822: "D, d M y", RFC_850: "DD, dd-M-y", RFC_1036: "D, d M y", RFC_1123: "D, d M yy", RFC_2822: "D, d M yy", RSS: "D, d M y", TICKS: "!", TIMESTAMP: "@", W3C: "yy-mm-dd", _ticksTo1970: 1e7 * 60 * 60 * 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)), formatDate: function (t, e, i) { if (!e) return ""; var s, n = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort, o = (i ? i.dayNames : null) || this._defaults.dayNames, a = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort, r = (i ? i.monthNames : null) || this._defaults.monthNames, h = function (e) { var i = t.length > s + 1 && t.charAt(s + 1) === e; return i && s++ , i }, l = function (t, e, i) { var s = "" + e; if (h(t)) for (; i > s.length;)s = "0" + s; return s }, c = function (t, e, i, s) { return h(t) ? s[e] : i[e] }, u = "", d = !1; if (e) for (s = 0; t.length > s; s++)if (d) "'" !== t.charAt(s) || h("'") ? u += t.charAt(s) : d = !1; else switch (t.charAt(s)) { case "d": u += l("d", e.getDate(), 2); break; case "D": u += c("D", e.getDay(), n, o); break; case "o": u += l("o", Math.round((new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() - new Date(e.getFullYear(), 0, 0).getTime()) / 864e5), 3); break; case "m": u += l("m", e.getMonth() + 1, 2); break; case "M": u += c("M", e.getMonth(), a, r); break; case "y": u += h("y") ? e.getFullYear() : (10 > e.getYear() % 100 ? "0" : "") + e.getYear() % 100; break; case "@": u += e.getTime(); break; case "!": u += 1e4 * e.getTime() + this._ticksTo1970; break; case "'": h("'") ? u += "'" : d = !0; break; default: u += t.charAt(s) }return u }, _possibleChars: function (t) { var e, i = "", s = !1, n = function (i) { var s = t.length > e + 1 && t.charAt(e + 1) === i; return s && e++ , s }; for (e = 0; t.length > e; e++)if (s) "'" !== t.charAt(e) || n("'") ? i += t.charAt(e) : s = !1; else switch (t.charAt(e)) { case "d": case "m": case "y": case "@": i += "0123456789"; break; case "D": case "M": return null; case "'": n("'") ? i += "'" : s = !0; break; default: i += t.charAt(e) }return i }, _get: function (t, i) { return t.settings[i] !== e ? t.settings[i] : this._defaults[i] }, _setDateFromField: function (t, e) { if (t.input.val() !== t.lastVal) { var i = this._get(t, "dateFormat"), s = t.lastVal = t.input ? t.input.val() : null, n = this._getDefaultDate(t), o = n, a = this._getFormatConfig(t); try { o = this.parseDate(i, s, a) || n } catch (r) { s = e ? "" : s } t.selectedDay = o.getDate(), t.drawMonth = t.selectedMonth = o.getMonth(), t.drawYear = t.selectedYear = o.getFullYear(), t.currentDay = s ? o.getDate() : 0, t.currentMonth = s ? o.getMonth() : 0, t.currentYear = s ? o.getFullYear() : 0, this._adjustInstDate(t) } }, _getDefaultDate: function (t) { return this._restrictMinMax(t, this._determineDate(t, this._get(t, "defaultDate"), new Date)) }, _determineDate: function (e, i, s) { var n = function (t) { var e = new Date; return e.setDate(e.getDate() + t), e }, o = function (i) { try { return t.datepicker.parseDate(t.datepicker._get(e, "dateFormat"), i, t.datepicker._getFormatConfig(e)) } catch (s) { } for (var n = (i.toLowerCase().match(/^c/) ? t.datepicker._getDate(e) : null) || new Date, o = n.getFullYear(), a = n.getMonth(), r = n.getDate(), h = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, l = h.exec(i); l;) { switch (l[2] || "d") { case "d": case "D": r += parseInt(l[1], 10); break; case "w": case "W": r += 7 * parseInt(l[1], 10); break; case "m": case "M": a += parseInt(l[1], 10), r = Math.min(r, t.datepicker._getDaysInMonth(o, a)); break; case "y": case "Y": o += parseInt(l[1], 10), r = Math.min(r, t.datepicker._getDaysInMonth(o, a)) }l = h.exec(i) } return new Date(o, a, r) }, a = null == i || "" === i ? s : "string" == typeof i ? o(i) : "number" == typeof i ? isNaN(i) ? s : n(i) : new Date(i.getTime()); return a = a && "Invalid Date" == "" + a ? s : a, a && (a.setHours(0), a.setMinutes(0), a.setSeconds(0), a.setMilliseconds(0)), this._daylightSavingAdjust(a) }, _daylightSavingAdjust: function (t) { return t ? (t.setHours(t.getHours() > 12 ? t.getHours() + 2 : 0), t) : null }, _setDate: function (t, e, i) { var s = !e, n = t.selectedMonth, o = t.selectedYear, a = this._restrictMinMax(t, this._determineDate(t, e, new Date)); t.selectedDay = t.currentDay = a.getDate(), t.drawMonth = t.selectedMonth = t.currentMonth = a.getMonth(), t.drawYear = t.selectedYear = t.currentYear = a.getFullYear(), n === t.selectedMonth && o === t.selectedYear || i || this._notifyChange(t), this._adjustInstDate(t), t.input && t.input.val(s ? "" : this._formatDate(t)) }, _getDate: function (t) { var e = !t.currentYear || t.input && "" === t.input.val() ? null : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay)); return e }, _attachHandlers: function (e) { var i = this._get(e, "stepMonths"), s = "#" + e.id.replace(/\\\\/g, "\\"); e.dpDiv.find("[data-handler]").map(function () { var e = { prev: function () { window["DP_jQuery_" + r].datepicker._adjustDate(s, -i, "M") }, next: function () { window["DP_jQuery_" + r].datepicker._adjustDate(s, +i, "M") }, hide: function () { window["DP_jQuery_" + r].datepicker._hideDatepicker() }, today: function () { window["DP_jQuery_" + r].datepicker._gotoToday(s) }, selectDay: function () { return window["DP_jQuery_" + r].datepicker._selectDay(s, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1 }, selectMonth: function () { return window["DP_jQuery_" + r].datepicker._selectMonthYear(s, this, "M"), !1 }, selectYear: function () { return window["DP_jQuery_" + r].datepicker._selectMonthYear(s, this, "Y"), !1 } }; t(this).bind(this.getAttribute("data-event"), e[this.getAttribute("data-handler")]) }) }, _generateHTML: function (t) { var e, i, s, n, o, a, r, h, l, c, u, d, p, f, g, m, v, _, b, y, w, k, x, D, C, I, P, T, M, S, z, A, H, N, E, W, O, F, R, j = new Date, L = this._daylightSavingAdjust(new Date(j.getFullYear(), j.getMonth(), j.getDate())), Y = this._get(t, "isRTL"), B = this._get(t, "showButtonPanel"), V = this._get(t, "hideIfNoPrevNext"), K = this._get(t, "navigationAsDateFormat"), U = this._getNumberOfMonths(t), q = this._get(t, "showCurrentAtPos"), Q = this._get(t, "stepMonths"), X = 1 !== U[0] || 1 !== U[1], $ = this._daylightSavingAdjust(t.currentDay ? new Date(t.currentYear, t.currentMonth, t.currentDay) : new Date(9999, 9, 9)), G = this._getMinMaxDate(t, "min"), J = this._getMinMaxDate(t, "max"), Z = t.drawMonth - q, te = t.drawYear; if (0 > Z && (Z += 12, te--), J) for (e = this._daylightSavingAdjust(new Date(J.getFullYear(), J.getMonth() - U[0] * U[1] + 1, J.getDate())), e = G && G > e ? G : e; this._daylightSavingAdjust(new Date(te, Z, 1)) > e;)Z-- , 0 > Z && (Z = 11, te--); for (t.drawMonth = Z, t.drawYear = te, i = this._get(t, "prevText"), i = K ? this.formatDate(i, this._daylightSavingAdjust(new Date(te, Z - Q, 1)), this._getFormatConfig(t)) : i, s = this._canAdjustMonth(t, -1, te, Z) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "e" : "w") + "'>" + i + "</span></a>" : V ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "e" : "w") + "'>" + i + "</span></a>", n = this._get(t, "nextText"), n = K ? this.formatDate(n, this._daylightSavingAdjust(new Date(te, Z + Q, 1)), this._getFormatConfig(t)) : n, o = this._canAdjustMonth(t, 1, te, Z) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + n + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "w" : "e") + "'>" + n + "</span></a>" : V ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + n + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "w" : "e") + "'>" + n + "</span></a>", a = this._get(t, "currentText"), r = this._get(t, "gotoCurrent") && t.currentDay ? $ : L, a = K ? this.formatDate(a, r, this._getFormatConfig(t)) : a, h = t.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(t, "closeText") + "</button>", l = B ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (Y ? h : "") + (this._isInRange(t, r) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + a + "</button>" : "") + (Y ? "" : h) + "</div>" : "", c = parseInt(this._get(t, "firstDay"), 10), c = isNaN(c) ? 0 : c, u = this._get(t, "showWeek"), d = this._get(t, "dayNames"), p = this._get(t, "dayNamesMin"), f = this._get(t, "monthNames"), g = this._get(t, "monthNamesShort"), m = this._get(t, "beforeShowDay"), v = this._get(t, "showOtherMonths"), _ = this._get(t, "selectOtherMonths"), b = this._getDefaultDate(t), y = "", k = 0; U[0] > k; k++) { for (x = "", this.maxRows = 4, D = 0; U[1] > D; D++) { if (C = this._daylightSavingAdjust(new Date(te, Z, t.selectedDay)), I = " ui-corner-all", P = "", X) { if (P += "<div class='ui-datepicker-group", U[1] > 1) switch (D) { case 0: P += " ui-datepicker-group-first", I = " ui-corner-" + (Y ? "right" : "left"); break; case U[1] - 1: P += " ui-datepicker-group-last", I = " ui-corner-" + (Y ? "left" : "right"); break; default: P += " ui-datepicker-group-middle", I = "" }P += "'>" } for (P += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + I + "'>" + (/all|left/.test(I) && 0 === k ? Y ? o : s : "") + (/all|right/.test(I) && 0 === k ? Y ? s : o : "") + this._generateMonthYearHeader(t, Z, te, G, J, k > 0 || D > 0, f, g) + "</div><table class='ui-datepicker-calendar'><thead>" + "<tr>", T = u ? "<th class='ui-datepicker-week-col'>" + this._get(t, "weekHeader") + "</th>" : "", w = 0; 7 > w; w++)M = (w + c) % 7, T += "<th" + ((w + c + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" + "<span title='" + d[M] + "'>" + p[M] + "</span></th>"; for (P += T + "</tr></thead><tbody>", S = this._getDaysInMonth(te, Z), te === t.selectedYear && Z === t.selectedMonth && (t.selectedDay = Math.min(t.selectedDay, S)), z = (this._getFirstDayOfMonth(te, Z) - c + 7) % 7, A = Math.ceil((z + S) / 7), H = X ? this.maxRows > A ? this.maxRows : A : A, this.maxRows = H, N = this._daylightSavingAdjust(new Date(te, Z, 1 - z)), E = 0; H > E; E++) { for (P += "<tr>", W = u ? "<td class='ui-datepicker-week-col'>" + this._get(t, "calculateWeek")(N) + "</td>" : "", w = 0; 7 > w; w++)O = m ? m.apply(t.input ? t.input[0] : null, [N]) : [!0, ""], F = N.getMonth() !== Z, R = F && !_ || !O[0] || G && G > N || J && N > J, W += "<td class='" + ((w + c + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (F ? " ui-datepicker-other-month" : "") + (N.getTime() === C.getTime() && Z === t.selectedMonth && t._keyEvent || b.getTime() === N.getTime() && b.getTime() === C.getTime() ? " " + this._dayOverClass : "") + (R ? " " + this._unselectableClass + " ui-state-disabled" : "") + (F && !v ? "" : " " + O[1] + (N.getTime() === $.getTime() ? " " + this._currentClass : "") + (N.getTime() === L.getTime() ? " ui-datepicker-today" : "")) + "'" + (F && !v || !O[2] ? "" : " title='" + O[2].replace(/'/g, "&#39;") + "'") + (R ? "" : " data-handler='selectDay' data-event='click' data-month='" + N.getMonth() + "' data-year='" + N.getFullYear() + "'") + ">" + (F && !v ? "&#xa0;" : R ? "<span class='ui-state-default'>" + N.getDate() + "</span>" : "<a class='ui-state-default" + (N.getTime() === L.getTime() ? " ui-state-highlight" : "") + (N.getTime() === $.getTime() ? " ui-state-active" : "") + (F ? " ui-priority-secondary" : "") + "' href='#'>" + N.getDate() + "</a>") + "</td>", N.setDate(N.getDate() + 1), N = this._daylightSavingAdjust(N); P += W + "</tr>" } Z++ , Z > 11 && (Z = 0, te++), P += "</tbody></table>" + (X ? "</div>" + (U[0] > 0 && D === U[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""), x += P } y += x } return y += l, t._keyEvent = !1, y }, _generateMonthYearHeader: function (t, e, i, s, n, o, a, r) { var h, l, c, u, d, p, f, g, m = this._get(t, "changeMonth"), v = this._get(t, "changeYear"), _ = this._get(t, "showMonthAfterYear"), b = "<div class='ui-datepicker-title'>", y = ""; if (o || !m) y += "<span class='ui-datepicker-month'>" + a[e] + "</span>"; else { for (h = s && s.getFullYear() === i, l = n && n.getFullYear() === i, y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", c = 0; 12 > c; c++)(!h || c >= s.getMonth()) && (!l || n.getMonth() >= c) && (y += "<option value='" + c + "'" + (c === e ? " selected='selected'" : "") + ">" + r[c] + "</option>"); y += "</select>" } if (_ || (b += y + (!o && m && v ? "" : "&#xa0;")), !t.yearshtml) if (t.yearshtml = "", o || !v) b += "<span class='ui-datepicker-year'>" + i + "</span>"; else { for (u = this._get(t, "yearRange").split(":"), d = (new Date).getFullYear(), p = function (t) { var e = t.match(/c[+\-].*/) ? i + parseInt(t.substring(1), 10) : t.match(/[+\-].*/) ? d + parseInt(t, 10) : parseInt(t, 10); return isNaN(e) ? d : e }, f = p(u[0]), g = Math.max(f, p(u[1] || "")), f = s ? Math.max(f, s.getFullYear()) : f, g = n ? Math.min(g, n.getFullYear()) : g, t.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; g >= f; f++)t.yearshtml += "<option value='" + f + "'" + (f === i ? " selected='selected'" : "") + ">" + f + "</option>"; t.yearshtml += "</select>", b += t.yearshtml, t.yearshtml = null } return b += this._get(t, "yearSuffix"), _ && (b += (!o && m && v ? "" : "&#xa0;") + y), b += "</div>" }, _adjustInstDate: function (t, e, i) { var s = t.drawYear + ("Y" === i ? e : 0), n = t.drawMonth + ("M" === i ? e : 0), o = Math.min(t.selectedDay, this._getDaysInMonth(s, n)) + ("D" === i ? e : 0), a = this._restrictMinMax(t, this._daylightSavingAdjust(new Date(s, n, o))); t.selectedDay = a.getDate(), t.drawMonth = t.selectedMonth = a.getMonth(), t.drawYear = t.selectedYear = a.getFullYear(), ("M" === i || "Y" === i) && this._notifyChange(t) }, _restrictMinMax: function (t, e) { var i = this._getMinMaxDate(t, "min"), s = this._getMinMaxDate(t, "max"), n = i && i > e ? i : e; return s && n > s ? s : n }, _notifyChange: function (t) { var e = this._get(t, "onChangeMonthYear"); e && e.apply(t.input ? t.input[0] : null, [t.selectedYear, t.selectedMonth + 1, t]) }, _getNumberOfMonths: function (t) { var e = this._get(t, "numberOfMonths"); return null == e ? [1, 1] : "number" == typeof e ? [1, e] : e }, _getMinMaxDate: function (t, e) { return this._determineDate(t, this._get(t, e + "Date"), null) }, _getDaysInMonth: function (t, e) { return 32 - this._daylightSavingAdjust(new Date(t, e, 32)).getDate() }, _getFirstDayOfMonth: function (t, e) { return new Date(t, e, 1).getDay() }, _canAdjustMonth: function (t, e, i, s) { var n = this._getNumberOfMonths(t), o = this._daylightSavingAdjust(new Date(i, s + (0 > e ? e : n[0] * n[1]), 1)); return 0 > e && o.setDate(this._getDaysInMonth(o.getFullYear(), o.getMonth())), this._isInRange(t, o) }, _isInRange: function (t, e) { var i, s, n = this._getMinMaxDate(t, "min"), o = this._getMinMaxDate(t, "max"), a = null, r = null, h = this._get(t, "yearRange"); return h && (i = h.split(":"), s = (new Date).getFullYear(), a = parseInt(i[0], 10), r = parseInt(i[1], 10), i[0].match(/[+\-].*/) && (a += s), i[1].match(/[+\-].*/) && (r += s)), (!n || e.getTime() >= n.getTime()) && (!o || e.getTime() <= o.getTime()) && (!a || e.getFullYear() >= a) && (!r || r >= e.getFullYear()) }, _getFormatConfig: function (t) { var e = this._get(t, "shortYearCutoff"); return e = "string" != typeof e ? e : (new Date).getFullYear() % 100 + parseInt(e, 10), { shortYearCutoff: e, dayNamesShort: this._get(t, "dayNamesShort"), dayNames: this._get(t, "dayNames"), monthNamesShort: this._get(t, "monthNamesShort"), monthNames: this._get(t, "monthNames") } }, _formatDate: function (t, e, i, s) { e || (t.currentDay = t.selectedDay, t.currentMonth = t.selectedMonth, t.currentYear = t.selectedYear); var n = e ? "object" == typeof e ? e : this._daylightSavingAdjust(new Date(s, i, e)) : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay)); return this.formatDate(this._get(t, "dateFormat"), n, this._getFormatConfig(t)) }
    }), t.fn.datepicker = function (e) { if (!this.length) return this; t.datepicker.initialized || (t(document).mousedown(t.datepicker._checkExternalClick), t.datepicker.initialized = !0), 0 === t("#" + t.datepicker._mainDivId).length && t("body").append(t.datepicker.dpDiv); var i = Array.prototype.slice.call(arguments, 1); return "string" != typeof e || "isDisabled" !== e && "getDate" !== e && "widget" !== e ? "option" === e && 2 === arguments.length && "string" == typeof arguments[1] ? t.datepicker["_" + e + "Datepicker"].apply(t.datepicker, [this[0]].concat(i)) : this.each(function () { "string" == typeof e ? t.datepicker["_" + e + "Datepicker"].apply(t.datepicker, [this].concat(i)) : t.datepicker._attachDatepicker(this, e) }) : t.datepicker["_" + e + "Datepicker"].apply(t.datepicker, [this[0]].concat(i)) }, t.datepicker = new i, t.datepicker.initialized = !1, t.datepicker.uuid = (new Date).getTime(), t.datepicker.version = "1.10.2", window["DP_jQuery_" + r] = t
}(jQuery), function (t) {
    var e = { buttons: !0, height: !0, maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0, width: !0 }, i = { maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0 }; t.widget("ui.dialog", {
        version: "1.10.2", options: { appendTo: "body", autoOpen: !0, buttons: [], closeOnEscape: !0, closeText: "close", dialogClass: "", draggable: !0, hide: null, height: "auto", maxHeight: null, maxWidth: null, minHeight: 150, minWidth: 150, modal: !1, position: { my: "center", at: "center", of: window, collision: "fit", using: function (e) { var i = t(this).css(e).offset().top; 0 > i && t(this).css("top", e.top - i) } }, resizable: !0, show: null, title: null, width: 300, beforeClose: null, close: null, drag: null, dragStart: null, dragStop: null, focus: null, open: null, resize: null, resizeStart: null, resizeStop: null }, _create: function () { this.originalCss = { display: this.element[0].style.display, width: this.element[0].style.width, minHeight: this.element[0].style.minHeight, maxHeight: this.element[0].style.maxHeight, height: this.element[0].style.height }, this.originalPosition = { parent: this.element.parent(), index: this.element.parent().children().index(this.element) }, this.originalTitle = this.element.attr("title"), this.options.title = this.options.title || this.originalTitle, this._createWrapper(), this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog), this._createTitlebar(), this._createButtonPane(), this.options.draggable && t.fn.draggable && this._makeDraggable(), this.options.resizable && t.fn.resizable && this._makeResizable(), this._isOpen = !1 }, _init: function () { this.options.autoOpen && this.open() }, _appendTo: function () { var e = this.options.appendTo; return e && (e.jquery || e.nodeType) ? t(e) : this.document.find(e || "body").eq(0) }, _destroy: function () { var t, e = this.originalPosition; this._destroyOverlay(), this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(), this.uiDialog.stop(!0, !0).remove(), this.originalTitle && this.element.attr("title", this.originalTitle), t = e.parent.children().eq(e.index), t.length && t[0] !== this.element[0] ? t.before(this.element) : e.parent.append(this.element) }, widget: function () { return this.uiDialog }, disable: t.noop, enable: t.noop, close: function (e) { var i = this; this._isOpen && this._trigger("beforeClose", e) !== !1 && (this._isOpen = !1, this._destroyOverlay(), this.opener.filter(":focusable").focus().length || t(this.document[0].activeElement).blur(), this._hide(this.uiDialog, this.options.hide, function () { i._trigger("close", e) })) }, isOpen: function () { return this._isOpen }, moveToTop: function () { this._moveToTop() }, _moveToTop: function (t, e) { var i = !!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length; return i && !e && this._trigger("focus", t), i }, open: function () { var e = this; return this._isOpen ? (this._moveToTop() && this._focusTabbable(), undefined) : (this._isOpen = !0, this.opener = t(this.document[0].activeElement), this._size(), this._position(), this._createOverlay(), this._moveToTop(null, !0), this._show(this.uiDialog, this.options.show, function () { e._focusTabbable(), e._trigger("focus") }), this._trigger("open"), undefined) }, _focusTabbable: function () { var t = this.element.find("[autofocus]"); t.length || (t = this.element.find(":tabbable")), t.length || (t = this.uiDialogButtonPane.find(":tabbable")), t.length || (t = this.uiDialogTitlebarClose.filter(":tabbable")), t.length || (t = this.uiDialog), t.eq(0).focus() }, _keepFocus: function (e) { function i() { var e = this.document[0].activeElement, i = this.uiDialog[0] === e || t.contains(this.uiDialog[0], e); i || this._focusTabbable() } e.preventDefault(), i.call(this), this._delay(i) }, _createWrapper: function () { this.uiDialog = t("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " + this.options.dialogClass).hide().attr({ tabIndex: -1, role: "dialog" }).appendTo(this._appendTo()), this._on(this.uiDialog, { keydown: function (e) { if (this.options.closeOnEscape && !e.isDefaultPrevented() && e.keyCode && e.keyCode === t.ui.keyCode.ESCAPE) return e.preventDefault(), this.close(e), undefined; if (e.keyCode === t.ui.keyCode.TAB) { var i = this.uiDialog.find(":tabbable"), s = i.filter(":first"), n = i.filter(":last"); e.target !== n[0] && e.target !== this.uiDialog[0] || e.shiftKey ? e.target !== s[0] && e.target !== this.uiDialog[0] || !e.shiftKey || (n.focus(1), e.preventDefault()) : (s.focus(1), e.preventDefault()) } }, mousedown: function (t) { this._moveToTop(t) && this._focusTabbable() } }), this.element.find("[aria-describedby]").length || this.uiDialog.attr({ "aria-describedby": this.element.uniqueId().attr("id") }) }, _createTitlebar: function () { var e; this.uiDialogTitlebar = t("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog), this._on(this.uiDialogTitlebar, { mousedown: function (e) { t(e.target).closest(".ui-dialog-titlebar-close") || this.uiDialog.focus() } }), this.uiDialogTitlebarClose = t("<button></button>").button({ label: this.options.closeText, icons: { primary: "ui-icon-closethick" }, text: !1 }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar), this._on(this.uiDialogTitlebarClose, { click: function (t) { t.preventDefault(), this.close(t) } }), e = t("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar), this._title(e), this.uiDialog.attr({ "aria-labelledby": e.attr("id") }) }, _title: function (t) { this.options.title || t.html("&#160;"), t.text(this.options.title) }, _createButtonPane: function () { this.uiDialogButtonPane = t("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"), this.uiButtonSet = t("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane), this._createButtons() }, _createButtons: function () { var e = this, i = this.options.buttons; return this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), t.isEmptyObject(i) || t.isArray(i) && !i.length ? (this.uiDialog.removeClass("ui-dialog-buttons"), undefined) : (t.each(i, function (i, s) { var n, o; s = t.isFunction(s) ? { click: s, text: i } : s, s = t.extend({ type: "button" }, s), n = s.click, s.click = function () { n.apply(e.element[0], arguments) }, o = { icons: s.icons, text: s.showText }, delete s.icons, delete s.showText, t("<button></button>", s).button(o).appendTo(e.uiButtonSet) }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog), undefined) }, _makeDraggable: function () {
            function e(t) { return { position: t.position, offset: t.offset } } var i = this, s = this.options; this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close", handle: ".ui-dialog-titlebar", containment: "document", start: function (s, n) { t(this).addClass("ui-dialog-dragging"), i._blockFrames(), i._trigger("dragStart", s, e(n)) }, drag: function (t, s) { i._trigger("drag", t, e(s)) }, stop: function (n, o) {
                s.position = [o.position.left - i.document.scrollLeft(), o.position.top - i.document.scrollTop()], t(this).removeClass("ui-dialog-dragging"), i._unblockFrames(), i._trigger("dragStop", n, e(o))
                }
            })
        }, _makeResizable: function () { function e(t) { return { originalPosition: t.originalPosition, originalSize: t.originalSize, position: t.position, size: t.size } } var i = this, s = this.options, n = s.resizable, o = this.uiDialog.css("position"), a = "string" == typeof n ? n : "n,e,s,w,se,sw,ne,nw"; this.uiDialog.resizable({ cancel: ".ui-dialog-content", containment: "document", alsoResize: this.element, maxWidth: s.maxWidth, maxHeight: s.maxHeight, minWidth: s.minWidth, minHeight: this._minHeight(), handles: a, start: function (s, n) { t(this).addClass("ui-dialog-resizing"), i._blockFrames(), i._trigger("resizeStart", s, e(n)) }, resize: function (t, s) { i._trigger("resize", t, e(s)) }, stop: function (n, o) { s.height = t(this).height(), s.width = t(this).width(), t(this).removeClass("ui-dialog-resizing"), i._unblockFrames(), i._trigger("resizeStop", n, e(o)) } }).css("position", o) }, _minHeight: function () { var t = this.options; return "auto" === t.height ? t.minHeight : Math.min(t.minHeight, t.height) }, _position: function () { var t = this.uiDialog.is(":visible"); t || this.uiDialog.show(), this.uiDialog.position(this.options.position), t || this.uiDialog.hide() }, _setOptions: function (s) { var n = this, o = !1, a = {}; t.each(s, function (t, s) { n._setOption(t, s), t in e && (o = !0), t in i && (a[t] = s) }), o && (this._size(), this._position()), this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", a) }, _setOption: function (t, e) { var i, s, n = this.uiDialog; "dialogClass" === t && n.removeClass(this.options.dialogClass).addClass(e), "disabled" !== t && (this._super(t, e), "appendTo" === t && this.uiDialog.appendTo(this._appendTo()), "buttons" === t && this._createButtons(), "closeText" === t && this.uiDialogTitlebarClose.button({ label: "" + e }), "draggable" === t && (i = n.is(":data(ui-draggable)"), i && !e && n.draggable("destroy"), !i && e && this._makeDraggable()), "position" === t && this._position(), "resizable" === t && (s = n.is(":data(ui-resizable)"), s && !e && n.resizable("destroy"), s && "string" == typeof e && n.resizable("option", "handles", e), s || e === !1 || this._makeResizable()), "title" === t && this._title(this.uiDialogTitlebar.find(".ui-dialog-title"))) }, _size: function () { var t, e, i, s = this.options; this.element.show().css({ width: "auto", minHeight: 0, maxHeight: "none", height: 0 }), s.minWidth > s.width && (s.width = s.minWidth), t = this.uiDialog.css({ height: "auto", width: s.width }).outerHeight(), e = Math.max(0, s.minHeight - t), i = "number" == typeof s.maxHeight ? Math.max(0, s.maxHeight - t) : "none", "auto" === s.height ? this.element.css({ minHeight: e, maxHeight: i, height: "auto" }) : this.element.height(Math.max(0, s.height - t)), this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight()) }, _blockFrames: function () { this.iframeBlocks = this.document.find("iframe").map(function () { var e = t(this); return t("<div>").css({ position: "absolute", width: e.outerWidth(), height: e.outerHeight() }).appendTo(e.parent()).offset(e.offset())[0] }) }, _unblockFrames: function () { this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks) }, _allowInteraction: function (e) { return t(e.target).closest(".ui-dialog").length ? !0 : !!t(e.target).closest(".ui-datepicker").length }, _createOverlay: function () { if (this.options.modal) { var e = this, i = this.widgetFullName; t.ui.dialog.overlayInstances || this._delay(function () { t.ui.dialog.overlayInstances && this.document.bind("focusin.dialog", function (s) { e._allowInteraction(s) || (s.preventDefault(), t(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable()) }) }), this.overlay = t("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()), this._on(this.overlay, { mousedown: "_keepFocus" }), t.ui.dialog.overlayInstances++ } }, _destroyOverlay: function () { this.options.modal && this.overlay && (t.ui.dialog.overlayInstances-- , t.ui.dialog.overlayInstances || this.document.unbind("focusin.dialog"), this.overlay.remove(), this.overlay = null) }
    }), t.ui.dialog.overlayInstances = 0, t.uiBackCompat !== !1 && t.widget("ui.dialog", t.ui.dialog, { _position: function () { var e, i = this.options.position, s = [], n = [0, 0]; i ? (("string" == typeof i || "object" == typeof i && "0" in i) && (s = i.split ? i.split(" ") : [i[0], i[1]], 1 === s.length && (s[1] = s[0]), t.each(["left", "top"], function (t, e) { +s[t] === s[t] && (n[t] = s[t], s[t] = e) }), i = { my: s[0] + (0 > n[0] ? n[0] : "+" + n[0]) + " " + s[1] + (0 > n[1] ? n[1] : "+" + n[1]), at: s.join(" ") }), i = t.extend({}, t.ui.dialog.prototype.options.position, i)) : i = t.ui.dialog.prototype.options.position, e = this.uiDialog.is(":visible"), e || this.uiDialog.show(), this.uiDialog.position(i), e || this.uiDialog.hide() } })
}(jQuery), function (t) { var e = /up|down|vertical/, i = /up|left|vertical|horizontal/; t.effects.effect.blind = function (s, n) { var o, a, r, h = t(this), l = ["position", "top", "bottom", "left", "right", "height", "width"], c = t.effects.setMode(h, s.mode || "hide"), u = s.direction || "up", d = e.test(u), p = d ? "height" : "width", f = d ? "top" : "left", g = i.test(u), m = {}, v = "show" === c; h.parent().is(".ui-effects-wrapper") ? t.effects.save(h.parent(), l) : t.effects.save(h, l), h.show(), o = t.effects.createWrapper(h).css({ overflow: "hidden" }), a = o[p](), r = parseFloat(o.css(f)) || 0, m[p] = v ? a : 0, g || (h.css(d ? "bottom" : "right", 0).css(d ? "top" : "left", "auto").css({ position: "absolute" }), m[f] = v ? r : a + r), v && (o.css(p, 0), g || o.css(f, r + a)), o.animate(m, { duration: s.duration, easing: s.easing, queue: !1, complete: function () { "hide" === c && h.hide(), t.effects.restore(h, l), t.effects.removeWrapper(h), n() } }) } }(jQuery), function (t) { t.effects.effect.bounce = function (e, i) { var s, n, o, a = t(this), r = ["position", "top", "bottom", "left", "right", "height", "width"], h = t.effects.setMode(a, e.mode || "effect"), l = "hide" === h, c = "show" === h, u = e.direction || "up", d = e.distance, p = e.times || 5, f = 2 * p + (c || l ? 1 : 0), g = e.duration / f, m = e.easing, v = "up" === u || "down" === u ? "top" : "left", _ = "up" === u || "left" === u, b = a.queue(), y = b.length; for ((c || l) && r.push("opacity"), t.effects.save(a, r), a.show(), t.effects.createWrapper(a), d || (d = a["top" === v ? "outerHeight" : "outerWidth"]() / 3), c && (o = { opacity: 1 }, o[v] = 0, a.css("opacity", 0).css(v, _ ? 2 * -d : 2 * d).animate(o, g, m)), l && (d /= Math.pow(2, p - 1)), o = {}, o[v] = 0, s = 0; p > s; s++)n = {}, n[v] = (_ ? "-=" : "+=") + d, a.animate(n, g, m).animate(o, g, m), d = l ? 2 * d : d / 2; l && (n = { opacity: 0 }, n[v] = (_ ? "-=" : "+=") + d, a.animate(n, g, m)), a.queue(function () { l && a.hide(), t.effects.restore(a, r), t.effects.removeWrapper(a), i() }), y > 1 && b.splice.apply(b, [1, 0].concat(b.splice(y, f + 1))), a.dequeue() } }(jQuery), function (t) { t.effects.effect.clip = function (e, i) { var s, n, o, a = t(this), r = ["position", "top", "bottom", "left", "right", "height", "width"], h = t.effects.setMode(a, e.mode || "hide"), l = "show" === h, c = e.direction || "vertical", u = "vertical" === c, d = u ? "height" : "width", p = u ? "top" : "left", f = {}; t.effects.save(a, r), a.show(), s = t.effects.createWrapper(a).css({ overflow: "hidden" }), n = "IMG" === a[0].tagName ? s : a, o = n[d](), l && (n.css(d, 0), n.css(p, o / 2)), f[d] = l ? o : 0, f[p] = l ? 0 : o / 2, n.animate(f, { queue: !1, duration: e.duration, easing: e.easing, complete: function () { l || a.hide(), t.effects.restore(a, r), t.effects.removeWrapper(a), i() } }) } }(jQuery), function (t) { t.effects.effect.drop = function (e, i) { var s, n = t(this), o = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"], a = t.effects.setMode(n, e.mode || "hide"), r = "show" === a, h = e.direction || "left", l = "up" === h || "down" === h ? "top" : "left", c = "up" === h || "left" === h ? "pos" : "neg", u = { opacity: r ? 1 : 0 }; t.effects.save(n, o), n.show(), t.effects.createWrapper(n), s = e.distance || n["top" === l ? "outerHeight" : "outerWidth"](!0) / 2, r && n.css("opacity", 0).css(l, "pos" === c ? -s : s), u[l] = (r ? "pos" === c ? "+=" : "-=" : "pos" === c ? "-=" : "+=") + s, n.animate(u, { queue: !1, duration: e.duration, easing: e.easing, complete: function () { "hide" === a && n.hide(), t.effects.restore(n, o), t.effects.removeWrapper(n), i() } }) } }(jQuery), function (t) { t.effects.effect.explode = function (e, i) { function s() { b.push(this), b.length === u * d && n() } function n() { p.css({ visibility: "visible" }), t(b).remove(), g || p.hide(), i() } var o, a, r, h, l, c, u = e.pieces ? Math.round(Math.sqrt(e.pieces)) : 3, d = u, p = t(this), f = t.effects.setMode(p, e.mode || "hide"), g = "show" === f, m = p.show().css("visibility", "hidden").offset(), v = Math.ceil(p.outerWidth() / d), _ = Math.ceil(p.outerHeight() / u), b = []; for (o = 0; u > o; o++)for (h = m.top + o * _, c = o - (u - 1) / 2, a = 0; d > a; a++)r = m.left + a * v, l = a - (d - 1) / 2, p.clone().appendTo("body").wrap("<div></div>").css({ position: "absolute", visibility: "visible", left: -a * v, top: -o * _ }).parent().addClass("ui-effects-explode").css({ position: "absolute", overflow: "hidden", width: v, height: _, left: r + (g ? l * v : 0), top: h + (g ? c * _ : 0), opacity: g ? 0 : 1 }).animate({ left: r + (g ? 0 : l * v), top: h + (g ? 0 : c * _), opacity: g ? 1 : 0 }, e.duration || 500, e.easing, s) } }(jQuery), function (t) { t.effects.effect.fade = function (e, i) { var s = t(this), n = t.effects.setMode(s, e.mode || "toggle"); s.animate({ opacity: n }, { queue: !1, duration: e.duration, easing: e.easing, complete: i }) } }(jQuery), function (t) { t.effects.effect.fold = function (e, i) { var s, n, o = t(this), a = ["position", "top", "bottom", "left", "right", "height", "width"], r = t.effects.setMode(o, e.mode || "hide"), h = "show" === r, l = "hide" === r, c = e.size || 15, u = /([0-9]+)%/.exec(c), d = !!e.horizFirst, p = h !== d, f = p ? ["width", "height"] : ["height", "width"], g = e.duration / 2, m = {}, v = {}; t.effects.save(o, a), o.show(), s = t.effects.createWrapper(o).css({ overflow: "hidden" }), n = p ? [s.width(), s.height()] : [s.height(), s.width()], u && (c = parseInt(u[1], 10) / 100 * n[l ? 0 : 1]), h && s.css(d ? { height: 0, width: c } : { height: c, width: 0 }), m[f[0]] = h ? n[0] : c, v[f[1]] = h ? n[1] : 0, s.animate(m, g, e.easing).animate(v, g, e.easing, function () { l && o.hide(), t.effects.restore(o, a), t.effects.removeWrapper(o), i() }) } }(jQuery), function (t) { t.effects.effect.highlight = function (e, i) { var s = t(this), n = ["backgroundImage", "backgroundColor", "opacity"], o = t.effects.setMode(s, e.mode || "show"), a = { backgroundColor: s.css("backgroundColor") }; "hide" === o && (a.opacity = 0), t.effects.save(s, n), s.show().css({ backgroundImage: "none", backgroundColor: e.color || "#ffff99" }).animate(a, { queue: !1, duration: e.duration, easing: e.easing, complete: function () { "hide" === o && s.hide(), t.effects.restore(s, n), i() } }) } }(jQuery), function (t) { t.effects.effect.pulsate = function (e, i) { var s, n = t(this), o = t.effects.setMode(n, e.mode || "show"), a = "show" === o, r = "hide" === o, h = a || "hide" === o, l = 2 * (e.times || 5) + (h ? 1 : 0), c = e.duration / l, u = 0, d = n.queue(), p = d.length; for ((a || !n.is(":visible")) && (n.css("opacity", 0).show(), u = 1), s = 1; l > s; s++)n.animate({ opacity: u }, c, e.easing), u = 1 - u; n.animate({ opacity: u }, c, e.easing), n.queue(function () { r && n.hide(), i() }), p > 1 && d.splice.apply(d, [1, 0].concat(d.splice(p, l + 1))), n.dequeue() } }(jQuery), function (t) { t.effects.effect.puff = function (e, i) { var s = t(this), n = t.effects.setMode(s, e.mode || "hide"), o = "hide" === n, a = parseInt(e.percent, 10) || 150, r = a / 100, h = { height: s.height(), width: s.width(), outerHeight: s.outerHeight(), outerWidth: s.outerWidth() }; t.extend(e, { effect: "scale", queue: !1, fade: !0, mode: n, complete: i, percent: o ? a : 100, from: o ? h : { height: h.height * r, width: h.width * r, outerHeight: h.outerHeight * r, outerWidth: h.outerWidth * r } }), s.effect(e) }, t.effects.effect.scale = function (e, i) { var s = t(this), n = t.extend(!0, {}, e), o = t.effects.setMode(s, e.mode || "effect"), a = parseInt(e.percent, 10) || (0 === parseInt(e.percent, 10) ? 0 : "hide" === o ? 0 : 100), r = e.direction || "both", h = e.origin, l = { height: s.height(), width: s.width(), outerHeight: s.outerHeight(), outerWidth: s.outerWidth() }, c = { y: "horizontal" !== r ? a / 100 : 1, x: "vertical" !== r ? a / 100 : 1 }; n.effect = "size", n.queue = !1, n.complete = i, "effect" !== o && (n.origin = h || ["middle", "center"], n.restore = !0), n.from = e.from || ("show" === o ? { height: 0, width: 0, outerHeight: 0, outerWidth: 0 } : l), n.to = { height: l.height * c.y, width: l.width * c.x, outerHeight: l.outerHeight * c.y, outerWidth: l.outerWidth * c.x }, n.fade && ("show" === o && (n.from.opacity = 0, n.to.opacity = 1), "hide" === o && (n.from.opacity = 1, n.to.opacity = 0)), s.effect(n) }, t.effects.effect.size = function (e, i) { var s, n, o, a = t(this), r = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"], h = ["position", "top", "bottom", "left", "right", "overflow", "opacity"], l = ["width", "height", "overflow"], c = ["fontSize"], u = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], d = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], p = t.effects.setMode(a, e.mode || "effect"), f = e.restore || "effect" !== p, g = e.scale || "both", m = e.origin || ["middle", "center"], v = a.css("position"), _ = f ? r : h, b = { height: 0, width: 0, outerHeight: 0, outerWidth: 0 }; "show" === p && a.show(), s = { height: a.height(), width: a.width(), outerHeight: a.outerHeight(), outerWidth: a.outerWidth() }, "toggle" === e.mode && "show" === p ? (a.from = e.to || b, a.to = e.from || s) : (a.from = e.from || ("show" === p ? b : s), a.to = e.to || ("hide" === p ? b : s)), o = { from: { y: a.from.height / s.height, x: a.from.width / s.width }, to: { y: a.to.height / s.height, x: a.to.width / s.width } }, ("box" === g || "both" === g) && (o.from.y !== o.to.y && (_ = _.concat(u), a.from = t.effects.setTransition(a, u, o.from.y, a.from), a.to = t.effects.setTransition(a, u, o.to.y, a.to)), o.from.x !== o.to.x && (_ = _.concat(d), a.from = t.effects.setTransition(a, d, o.from.x, a.from), a.to = t.effects.setTransition(a, d, o.to.x, a.to))), ("content" === g || "both" === g) && o.from.y !== o.to.y && (_ = _.concat(c).concat(l), a.from = t.effects.setTransition(a, c, o.from.y, a.from), a.to = t.effects.setTransition(a, c, o.to.y, a.to)), t.effects.save(a, _), a.show(), t.effects.createWrapper(a), a.css("overflow", "hidden").css(a.from), m && (n = t.effects.getBaseline(m, s), a.from.top = (s.outerHeight - a.outerHeight()) * n.y, a.from.left = (s.outerWidth - a.outerWidth()) * n.x, a.to.top = (s.outerHeight - a.to.outerHeight) * n.y, a.to.left = (s.outerWidth - a.to.outerWidth) * n.x), a.css(a.from), ("content" === g || "both" === g) && (u = u.concat(["marginTop", "marginBottom"]).concat(c), d = d.concat(["marginLeft", "marginRight"]), l = r.concat(u).concat(d), a.find("*[width]").each(function () { var i = t(this), s = { height: i.height(), width: i.width(), outerHeight: i.outerHeight(), outerWidth: i.outerWidth() }; f && t.effects.save(i, l), i.from = { height: s.height * o.from.y, width: s.width * o.from.x, outerHeight: s.outerHeight * o.from.y, outerWidth: s.outerWidth * o.from.x }, i.to = { height: s.height * o.to.y, width: s.width * o.to.x, outerHeight: s.height * o.to.y, outerWidth: s.width * o.to.x }, o.from.y !== o.to.y && (i.from = t.effects.setTransition(i, u, o.from.y, i.from), i.to = t.effects.setTransition(i, u, o.to.y, i.to)), o.from.x !== o.to.x && (i.from = t.effects.setTransition(i, d, o.from.x, i.from), i.to = t.effects.setTransition(i, d, o.to.x, i.to)), i.css(i.from), i.animate(i.to, e.duration, e.easing, function () { f && t.effects.restore(i, l) }) })), a.animate(a.to, { queue: !1, duration: e.duration, easing: e.easing, complete: function () { 0 === a.to.opacity && a.css("opacity", a.from.opacity), "hide" === p && a.hide(), t.effects.restore(a, _), f || ("static" === v ? a.css({ position: "relative", top: a.to.top, left: a.to.left }) : t.each(["top", "left"], function (t, e) { a.css(e, function (e, i) { var s = parseInt(i, 10), n = t ? a.to.left : a.to.top; return "auto" === i ? n + "px" : s + n + "px" }) })), t.effects.removeWrapper(a), i() } }) } }(jQuery), function (t) { t.effects.effect.shake = function (e, i) { var s, n = t(this), o = ["position", "top", "bottom", "left", "right", "height", "width"], a = t.effects.setMode(n, e.mode || "effect"), r = e.direction || "left", h = e.distance || 20, l = e.times || 3, c = 2 * l + 1, u = Math.round(e.duration / c), d = "up" === r || "down" === r ? "top" : "left", p = "up" === r || "left" === r, f = {}, g = {}, m = {}, v = n.queue(), _ = v.length; for (t.effects.save(n, o), n.show(), t.effects.createWrapper(n), f[d] = (p ? "-=" : "+=") + h, g[d] = (p ? "+=" : "-=") + 2 * h, m[d] = (p ? "-=" : "+=") + 2 * h, n.animate(f, u, e.easing), s = 1; l > s; s++)n.animate(g, u, e.easing).animate(m, u, e.easing); n.animate(g, u, e.easing).animate(f, u / 2, e.easing).queue(function () { "hide" === a && n.hide(), t.effects.restore(n, o), t.effects.removeWrapper(n), i() }), _ > 1 && v.splice.apply(v, [1, 0].concat(v.splice(_, c + 1))), n.dequeue() } }(jQuery), function (t) { t.effects.effect.slide = function (e, i) { var s, n = t(this), o = ["position", "top", "bottom", "left", "right", "width", "height"], a = t.effects.setMode(n, e.mode || "show"), r = "show" === a, h = e.direction || "left", l = "up" === h || "down" === h ? "top" : "left", c = "up" === h || "left" === h, u = {}; t.effects.save(n, o), n.show(), s = e.distance || n["top" === l ? "outerHeight" : "outerWidth"](!0), t.effects.createWrapper(n).css({ overflow: "hidden" }), r && n.css(l, c ? isNaN(s) ? "-" + s : -s : s), u[l] = (r ? c ? "+=" : "-=" : c ? "-=" : "+=") + s, n.animate(u, { queue: !1, duration: e.duration, easing: e.easing, complete: function () { "hide" === a && n.hide(), t.effects.restore(n, o), t.effects.removeWrapper(n), i() } }) } }(jQuery), function (t) { t.effects.effect.transfer = function (e, i) { var s = t(this), n = t(e.to), o = "fixed" === n.css("position"), a = t("body"), r = o ? a.scrollTop() : 0, h = o ? a.scrollLeft() : 0, l = n.offset(), c = { top: l.top - r, left: l.left - h, height: n.innerHeight(), width: n.innerWidth() }, u = s.offset(), d = t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({ top: u.top - r, left: u.left - h, height: s.innerHeight(), width: s.innerWidth(), position: o ? "fixed" : "absolute" }).animate(c, e.duration, e.easing, function () { d.remove(), i() }) } }(jQuery), function (t) { t.widget("ui.menu", { version: "1.10.2", defaultElement: "<ul>", delay: 300, options: { icons: { submenu: "ui-icon-carat-1-e" }, menus: "ul", position: { my: "left top", at: "right top" }, role: "menu", blur: null, focus: null, select: null }, _create: function () { this.activeMenu = this.element, this.mouseHandled = !1, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({ role: this.options.role, tabIndex: 0 }).bind("click" + this.eventNamespace, t.proxy(function (t) { this.options.disabled && t.preventDefault() }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({ "mousedown .ui-menu-item > a": function (t) { t.preventDefault() }, "click .ui-state-disabled > a": function (t) { t.preventDefault() }, "click .ui-menu-item:has(a)": function (e) { var i = t(e.target).closest(".ui-menu-item"); !this.mouseHandled && i.not(".ui-state-disabled").length && (this.mouseHandled = !0, this.select(e), i.has(".ui-menu").length ? this.expand(e) : this.element.is(":focus") || (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer))) }, "mouseenter .ui-menu-item": function (e) { var i = t(e.currentTarget); i.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(e, i) }, mouseleave: "collapseAll", "mouseleave .ui-menu": "collapseAll", focus: function (t, e) { var i = this.active || this.element.children(".ui-menu-item").eq(0); e || this.focus(t, i) }, blur: function (e) { this._delay(function () { t.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(e) }) }, keydown: "_keydown" }), this.refresh(), this._on(this.document, { click: function (e) { t(e.target).closest(".ui-menu").length || this.collapseAll(e), this.mouseHandled = !1 } }) }, _destroy: function () { this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () { var e = t(this); e.data("ui-menu-submenu-carat") && e.remove() }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content") }, _keydown: function (e) { function i(t) { return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") } var s, n, o, a, r, h = !0; switch (e.keyCode) { case t.ui.keyCode.PAGE_UP: this.previousPage(e); break; case t.ui.keyCode.PAGE_DOWN: this.nextPage(e); break; case t.ui.keyCode.HOME: this._move("first", "first", e); break; case t.ui.keyCode.END: this._move("last", "last", e); break; case t.ui.keyCode.UP: this.previous(e); break; case t.ui.keyCode.DOWN: this.next(e); break; case t.ui.keyCode.LEFT: this.collapse(e); break; case t.ui.keyCode.RIGHT: this.active && !this.active.is(".ui-state-disabled") && this.expand(e); break; case t.ui.keyCode.ENTER: case t.ui.keyCode.SPACE: this._activate(e); break; case t.ui.keyCode.ESCAPE: this.collapse(e); break; default: h = !1, n = this.previousFilter || "", o = String.fromCharCode(e.keyCode), a = !1, clearTimeout(this.filterTimer), o === n ? a = !0 : o = n + o, r = RegExp("^" + i(o), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () { return r.test(t(this).children("a").text()) }), s = a && -1 !== s.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : s, s.length || (o = String.fromCharCode(e.keyCode), r = RegExp("^" + i(o), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () { return r.test(t(this).children("a").text()) })), s.length ? (this.focus(e, s), s.length > 1 ? (this.previousFilter = o, this.filterTimer = this._delay(function () { delete this.previousFilter }, 1e3)) : delete this.previousFilter) : delete this.previousFilter }h && e.preventDefault() }, _activate: function (t) { this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(t) : this.select(t)) }, refresh: function () { var e, i = this.options.icons.submenu, s = this.element.find(this.options.menus); s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({ role: this.options.role, "aria-hidden": "true", "aria-expanded": "false" }).each(function () { var e = t(this), s = e.prev("a"), n = t("<span>").addClass("ui-menu-icon ui-icon " + i).data("ui-menu-submenu-carat", !0); s.attr("aria-haspopup", "true").prepend(n), e.attr("aria-labelledby", s.attr("id")) }), e = s.add(this.element), e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({ tabIndex: -1, role: this._itemRole() }), e.children(":not(.ui-menu-item)").each(function () { var e = t(this); /[^\-\u2014\u2013\s]/.test(e.text()) || e.addClass("ui-widget-content ui-menu-divider") }), e.children(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !t.contains(this.element[0], this.active[0]) && this.blur() }, _itemRole: function () { return { menu: "menuitem", listbox: "option" }[this.options.role] }, _setOption: function (t, e) { "icons" === t && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu), this._super(t, e) }, focus: function (t, e) { var i, s; this.blur(t, t && "focus" === t.type), this._scrollIntoView(e), this.active = e.first(), s = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", s.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), t && "keydown" === t.type ? this._close() : this.timer = this._delay(function () { this._close() }, this.delay), i = e.children(".ui-menu"), i.length && /^mouse/.test(t.type) && this._startOpening(i), this.activeMenu = e.parent(), this._trigger("focus", t, { item: e }) }, _scrollIntoView: function (e) { var i, s, n, o, a, r; this._hasScroll() && (i = parseFloat(t.css(this.activeMenu[0], "borderTopWidth")) || 0, s = parseFloat(t.css(this.activeMenu[0], "paddingTop")) || 0, n = e.offset().top - this.activeMenu.offset().top - i - s, o = this.activeMenu.scrollTop(), a = this.activeMenu.height(), r = e.height(), 0 > n ? this.activeMenu.scrollTop(o + n) : n + r > a && this.activeMenu.scrollTop(o + n - a + r)) }, blur: function (t, e) { e || clearTimeout(this.timer), this.active && (this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", t, { item: this.active })) }, _startOpening: function (t) { clearTimeout(this.timer), "true" === t.attr("aria-hidden") && (this.timer = this._delay(function () { this._close(), this._open(t) }, this.delay)) }, _open: function (e) { var i = t.extend({ of: this.active }, this.options.position); clearTimeout(this.timer), this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden", "true"), e.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i) }, collapseAll: function (e, i) { clearTimeout(this.timer), this.timer = this._delay(function () { var s = i ? this.element : t(e && e.target).closest(this.element.find(".ui-menu")); s.length || (s = this.element), this._close(s), this.blur(e), this.activeMenu = s }, this.delay) }, _close: function (t) { t || (t = this.active ? this.active.parent() : this.element), t.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active") }, collapse: function (t) { var e = this.active && this.active.parent().closest(".ui-menu-item", this.element); e && e.length && (this._close(), this.focus(t, e)) }, expand: function (t) { var e = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first(); e && e.length && (this._open(e.parent()), this._delay(function () { this.focus(t, e) })) }, next: function (t) { this._move("next", "first", t) }, previous: function (t) { this._move("prev", "last", t) }, isFirstItem: function () { return this.active && !this.active.prevAll(".ui-menu-item").length }, isLastItem: function () { return this.active && !this.active.nextAll(".ui-menu-item").length }, _move: function (t, e, i) { var s; this.active && (s = "first" === t || "last" === t ? this.active["first" === t ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[t + "All"](".ui-menu-item").eq(0)), s && s.length && this.active || (s = this.activeMenu.children(".ui-menu-item")[e]()), this.focus(i, s) }, nextPage: function (e) { var i, s, n; return this.active ? (this.isLastItem() || (this._hasScroll() ? (s = this.active.offset().top, n = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () { return i = t(this), 0 > i.offset().top - s - n }), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())), undefined) : (this.next(e), undefined) }, previousPage: function (e) { var i, s, n; return this.active ? (this.isFirstItem() || (this._hasScroll() ? (s = this.active.offset().top, n = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () { return i = t(this), i.offset().top - s + n > 0 }), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item").first())), undefined) : (this.next(e), undefined) }, _hasScroll: function () { return this.element.outerHeight() < this.element.prop("scrollHeight") }, select: function (e) { this.active = this.active || t(e.target).closest(".ui-menu-item"); var i = { item: this.active }; this.active.has(".ui-menu").length || this.collapseAll(e, !0), this._trigger("select", e, i) } }) }(jQuery), function (t, e) { function i(t, e, i) { return [parseFloat(t[0]) * (p.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (p.test(t[1]) ? i / 100 : 1)] } function s(e, i) { return parseInt(t.css(e, i), 10) || 0 } function n(e) { var i = e[0]; return 9 === i.nodeType ? { width: e.width(), height: e.height(), offset: { top: 0, left: 0 } } : t.isWindow(i) ? { width: e.width(), height: e.height(), offset: { top: e.scrollTop(), left: e.scrollLeft() } } : i.preventDefault ? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } } : { width: e.outerWidth(), height: e.outerHeight(), offset: e.offset() } } t.ui = t.ui || {}; var o, a = Math.max, r = Math.abs, h = Math.round, l = /left|center|right/, c = /top|center|bottom/, u = /[\+\-]\d+(\.[\d]+)?%?/, d = /^\w+/, p = /%$/, f = t.fn.position; t.position = { scrollbarWidth: function () { if (o !== e) return o; var i, s, n = t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), a = n.children()[0]; return t("body").append(n), i = a.offsetWidth, n.css("overflow", "scroll"), s = a.offsetWidth, i === s && (s = n[0].clientWidth), n.remove(), o = i - s }, getScrollInfo: function (e) { var i = e.isWindow ? "" : e.element.css("overflow-x"), s = e.isWindow ? "" : e.element.css("overflow-y"), n = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth, o = "scroll" === s || "auto" === s && e.height < e.element[0].scrollHeight; return { width: o ? t.position.scrollbarWidth() : 0, height: n ? t.position.scrollbarWidth() : 0 } }, getWithinInfo: function (e) { var i = t(e || window), s = t.isWindow(i[0]); return { element: i, isWindow: s, offset: i.offset() || { left: 0, top: 0 }, scrollLeft: i.scrollLeft(), scrollTop: i.scrollTop(), width: s ? i.width() : i.outerWidth(), height: s ? i.height() : i.outerHeight() } } }, t.fn.position = function (e) { if (!e || !e.of) return f.apply(this, arguments); e = t.extend({}, e); var o, p, g, m, v, _, b = t(e.of), y = t.position.getWithinInfo(e.within), w = t.position.getScrollInfo(y), k = (e.collision || "flip").split(" "), x = {}; return _ = n(b), b[0].preventDefault && (e.at = "left top"), p = _.width, g = _.height, m = _.offset, v = t.extend({}, m), t.each(["my", "at"], function () { var t, i, s = (e[this] || "").split(" "); 1 === s.length && (s = l.test(s[0]) ? s.concat(["center"]) : c.test(s[0]) ? ["center"].concat(s) : ["center", "center"]), s[0] = l.test(s[0]) ? s[0] : "center", s[1] = c.test(s[1]) ? s[1] : "center", t = u.exec(s[0]), i = u.exec(s[1]), x[this] = [t ? t[0] : 0, i ? i[0] : 0], e[this] = [d.exec(s[0])[0], d.exec(s[1])[0]] }), 1 === k.length && (k[1] = k[0]), "right" === e.at[0] ? v.left += p : "center" === e.at[0] && (v.left += p / 2), "bottom" === e.at[1] ? v.top += g : "center" === e.at[1] && (v.top += g / 2), o = i(x.at, p, g), v.left += o[0], v.top += o[1], this.each(function () { var n, l, c = t(this), u = c.outerWidth(), d = c.outerHeight(), f = s(this, "marginLeft"), _ = s(this, "marginTop"), D = u + f + s(this, "marginRight") + w.width, C = d + _ + s(this, "marginBottom") + w.height, I = t.extend({}, v), P = i(x.my, c.outerWidth(), c.outerHeight()); "right" === e.my[0] ? I.left -= u : "center" === e.my[0] && (I.left -= u / 2), "bottom" === e.my[1] ? I.top -= d : "center" === e.my[1] && (I.top -= d / 2), I.left += P[0], I.top += P[1], t.support.offsetFractions || (I.left = h(I.left), I.top = h(I.top)), n = { marginLeft: f, marginTop: _ }, t.each(["left", "top"], function (i, s) { t.ui.position[k[i]] && t.ui.position[k[i]][s](I, { targetWidth: p, targetHeight: g, elemWidth: u, elemHeight: d, collisionPosition: n, collisionWidth: D, collisionHeight: C, offset: [o[0] + P[0], o[1] + P[1]], my: e.my, at: e.at, within: y, elem: c }) }), e.using && (l = function (t) { var i = m.left - I.left, s = i + p - u, n = m.top - I.top, o = n + g - d, h = { target: { element: b, left: m.left, top: m.top, width: p, height: g }, element: { element: c, left: I.left, top: I.top, width: u, height: d }, horizontal: 0 > s ? "left" : i > 0 ? "right" : "center", vertical: 0 > o ? "top" : n > 0 ? "bottom" : "middle" }; u > p && p > r(i + s) && (h.horizontal = "center"), d > g && g > r(n + o) && (h.vertical = "middle"), h.important = a(r(i), r(s)) > a(r(n), r(o)) ? "horizontal" : "vertical", e.using.call(this, t, h) }), c.offset(t.extend(I, { using: l })) }) }, t.ui.position = { fit: { left: function (t, e) { var i, s = e.within, n = s.isWindow ? s.scrollLeft : s.offset.left, o = s.width, r = t.left - e.collisionPosition.marginLeft, h = n - r, l = r + e.collisionWidth - o - n; e.collisionWidth > o ? h > 0 && 0 >= l ? (i = t.left + h + e.collisionWidth - o - n, t.left += h - i) : t.left = l > 0 && 0 >= h ? n : h > l ? n + o - e.collisionWidth : n : h > 0 ? t.left += h : l > 0 ? t.left -= l : t.left = a(t.left - r, t.left) }, top: function (t, e) { var i, s = e.within, n = s.isWindow ? s.scrollTop : s.offset.top, o = e.within.height, r = t.top - e.collisionPosition.marginTop, h = n - r, l = r + e.collisionHeight - o - n; e.collisionHeight > o ? h > 0 && 0 >= l ? (i = t.top + h + e.collisionHeight - o - n, t.top += h - i) : t.top = l > 0 && 0 >= h ? n : h > l ? n + o - e.collisionHeight : n : h > 0 ? t.top += h : l > 0 ? t.top -= l : t.top = a(t.top - r, t.top) } }, flip: { left: function (t, e) { var i, s, n = e.within, o = n.offset.left + n.scrollLeft, a = n.width, h = n.isWindow ? n.scrollLeft : n.offset.left, l = t.left - e.collisionPosition.marginLeft, c = l - h, u = l + e.collisionWidth - a - h, d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0, p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0, f = -2 * e.offset[0]; 0 > c ? (i = t.left + d + p + f + e.collisionWidth - a - o, (0 > i || r(c) > i) && (t.left += d + p + f)) : u > 0 && (s = t.left - e.collisionPosition.marginLeft + d + p + f - h, (s > 0 || u > r(s)) && (t.left += d + p + f)) }, top: function (t, e) { var i, s, n = e.within, o = n.offset.top + n.scrollTop, a = n.height, h = n.isWindow ? n.scrollTop : n.offset.top, l = t.top - e.collisionPosition.marginTop, c = l - h, u = l + e.collisionHeight - a - h, d = "top" === e.my[1], p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0, f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0, g = -2 * e.offset[1]; 0 > c ? (s = t.top + p + f + g + e.collisionHeight - a - o, t.top + p + f + g > c && (0 > s || r(c) > s) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - h, t.top + p + f + g > u && (i > 0 || u > r(i)) && (t.top += p + f + g)) } }, flipfit: { left: function () { t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments) }, top: function () { t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments) } } }, function () { var e, i, s, n, o, a = document.getElementsByTagName("body")[0], r = document.createElement("div"); e = document.createElement(a ? "div" : "body"), s = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" }, a && t.extend(s, { position: "absolute", left: "-1000px", top: "-1000px" }); for (o in s) e.style[o] = s[o]; e.appendChild(r), i = a || document.documentElement, i.insertBefore(e, i.firstChild), r.style.cssText = "position: absolute; left: 10.7432222px;", n = t(r).offset().left, t.support.offsetFractions = n > 10 && 11 > n, e.innerHTML = "", i.removeChild(e) }() }(jQuery), function (t, e) {
    t.widget("ui.progressbar", {
        version: "1.10.2", options: { max: 100, value: 0, change: null, complete: null }, min: 0, _create: function () {
        this.oldValue = this.options.value = this._constrainedValue(), this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({ role: "progressbar", "aria-valuemin": this.min }), this.valueDiv = t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element), this._refreshValue()
        }, _destroy: function () { this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), this.valueDiv.remove() }, value: function (t) { return t === e ? this.options.value : (this.options.value = this._constrainedValue(t), this._refreshValue(), e) }, _constrainedValue: function (t) { return t === e && (t = this.options.value), this.indeterminate = t === !1, "number" != typeof t && (t = 0), this.indeterminate ? !1 : Math.min(this.options.max, Math.max(this.min, t)) }, _setOptions: function (t) { var e = t.value; delete t.value, this._super(t), this.options.value = this._constrainedValue(e), this._refreshValue() }, _setOption: function (t, e) { "max" === t && (e = Math.max(this.min, e)), this._super(t, e) }, _percentage: function () { return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min) }, _refreshValue: function () { var e = this.options.value, i = this._percentage(); this.valueDiv.toggle(this.indeterminate || e > this.min).toggleClass("ui-corner-right", e === this.options.max).width(i.toFixed(0) + "%"), this.element.toggleClass("ui-progressbar-indeterminate", this.indeterminate), this.indeterminate ? (this.element.removeAttr("aria-valuenow"), this.overlayDiv || (this.overlayDiv = t("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))) : (this.element.attr({ "aria-valuemax": this.options.max, "aria-valuenow": e }), this.overlayDiv && (this.overlayDiv.remove(), this.overlayDiv = null)), this.oldValue !== e && (this.oldValue = e, this._trigger("change")), e === this.options.max && this._trigger("complete") }
    })
}(jQuery), function (t) { var e = 5; t.widget("ui.slider", t.ui.mouse, { version: "1.10.2", widgetEventPrefix: "slide", options: { animate: !1, distance: 0, max: 100, min: 0, orientation: "horizontal", range: !1, step: 1, value: 0, values: null, change: null, slide: null, start: null, stop: null }, _create: function () { this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1 }, _refresh: function () { this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue() }, _createHandles: function () { var e, i, s = this.options, n = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"), o = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>", a = []; for (i = s.values && s.values.length || 1, n.length > i && (n.slice(i).remove(), n = n.slice(0, i)), e = n.length; i > e; e++)a.push(o); this.handles = n.add(t(a.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function (e) { t(this).data("ui-slider-handle-index", e) }) }, _createRange: function () { var e = this.options, i = ""; e.range ? (e.range === !0 && (e.values ? e.values.length && 2 !== e.values.length ? e.values = [e.values[0], e.values[0]] : t.isArray(e.values) && (e.values = e.values.slice(0)) : e.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({ left: "", bottom: "" }) : (this.range = t("<div></div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === e.range || "max" === e.range ? " ui-slider-range-" + e.range : ""))) : this.range = t([]) }, _setupEvents: function () { var t = this.handles.add(this.range).filter("a"); this._off(t), this._on(t, this._handleEvents), this._hoverable(t), this._focusable(t) }, _destroy: function () { this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy() }, _mouseCapture: function (e) { var i, s, n, o, a, r, h, l, c = this, u = this.options; return u.disabled ? !1 : (this.elementSize = { width: this.element.outerWidth(), height: this.element.outerHeight() }, this.elementOffset = this.element.offset(), i = { x: e.pageX, y: e.pageY }, s = this._normValueFromMouse(i), n = this._valueMax() - this._valueMin() + 1, this.handles.each(function (e) { var i = Math.abs(s - c.values(e)); (n > i || n === i && (e === c._lastChangedValue || c.values(e) === u.min)) && (n = i, o = t(this), a = e) }), r = this._start(e, a), r === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = a, o.addClass("ui-state-active").focus(), h = o.offset(), l = !t(e.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = l ? { left: 0, top: 0 } : { left: e.pageX - h.left - o.width() / 2, top: e.pageY - h.top - o.height() / 2 - (parseInt(o.css("borderTopWidth"), 10) || 0) - (parseInt(o.css("borderBottomWidth"), 10) || 0) + (parseInt(o.css("marginTop"), 10) || 0) }, this.handles.hasClass("ui-state-hover") || this._slide(e, a, s), this._animateOff = !0, !0)) }, _mouseStart: function () { return !0 }, _mouseDrag: function (t) { var e = { x: t.pageX, y: t.pageY }, i = this._normValueFromMouse(e); return this._slide(t, this._handleIndex, i), !1 }, _mouseStop: function (t) { return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(t, this._handleIndex), this._change(t, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1 }, _detectOrientation: function () { this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal" }, _normValueFromMouse: function (t) { var e, i, s, n, o; return "horizontal" === this.orientation ? (e = this.elementSize.width, i = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (e = this.elementSize.height, i = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), s = i / e, s > 1 && (s = 1), 0 > s && (s = 0), "vertical" === this.orientation && (s = 1 - s), n = this._valueMax() - this._valueMin(), o = this._valueMin() + s * n, this._trimAlignValue(o) }, _start: function (t, e) { var i = { handle: this.handles[e], value: this.value() }; return this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("start", t, i) }, _slide: function (t, e, i) { var s, n, o; this.options.values && this.options.values.length ? (s = this.values(e ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === e && i > s || 1 === e && s > i) && (i = s), i !== this.values(e) && (n = this.values(), n[e] = i, o = this._trigger("slide", t, { handle: this.handles[e], value: i, values: n }), s = this.values(e ? 0 : 1), o !== !1 && this.values(e, i, !0))) : i !== this.value() && (o = this._trigger("slide", t, { handle: this.handles[e], value: i }), o !== !1 && this.value(i)) }, _stop: function (t, e) { var i = { handle: this.handles[e], value: this.value() }; this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("stop", t, i) }, _change: function (t, e) { if (!this._keySliding && !this._mouseSliding) { var i = { handle: this.handles[e], value: this.value() }; this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._lastChangedValue = e, this._trigger("change", t, i) } }, value: function (t) { return arguments.length ? (this.options.value = this._trimAlignValue(t), this._refreshValue(), this._change(null, 0), undefined) : this._value() }, values: function (e, i) { var s, n, o; if (arguments.length > 1) return this.options.values[e] = this._trimAlignValue(i), this._refreshValue(), this._change(null, e), undefined; if (!arguments.length) return this._values(); if (!t.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(e) : this.value(); for (s = this.options.values, n = arguments[0], o = 0; s.length > o; o += 1)s[o] = this._trimAlignValue(n[o]), this._change(null, o); this._refreshValue() }, _setOption: function (e, i) { var s, n = 0; switch ("range" === e && this.options.range === !0 && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), t.isArray(this.options.values) && (n = this.options.values.length), t.Widget.prototype._setOption.apply(this, arguments), e) { case "orientation": this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue(); break; case "value": this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1; break; case "values": for (this._animateOff = !0, this._refreshValue(), s = 0; n > s; s += 1)this._change(null, s); this._animateOff = !1; break; case "min": case "max": this._animateOff = !0, this._refreshValue(), this._animateOff = !1; break; case "range": this._animateOff = !0, this._refresh(), this._animateOff = !1 } }, _value: function () { var t = this.options.value; return t = this._trimAlignValue(t) }, _values: function (t) { var e, i, s; if (arguments.length) return e = this.options.values[t], e = this._trimAlignValue(e); if (this.options.values && this.options.values.length) { for (i = this.options.values.slice(), s = 0; i.length > s; s += 1)i[s] = this._trimAlignValue(i[s]); return i } return [] }, _trimAlignValue: function (t) { if (this._valueMin() >= t) return this._valueMin(); if (t >= this._valueMax()) return this._valueMax(); var e = this.options.step > 0 ? this.options.step : 1, i = (t - this._valueMin()) % e, s = t - i; return 2 * Math.abs(i) >= e && (s += i > 0 ? e : -e), parseFloat(s.toFixed(5)) }, _valueMin: function () { return this.options.min }, _valueMax: function () { return this.options.max }, _refreshValue: function () { var e, i, s, n, o, a = this.options.range, r = this.options, h = this, l = this._animateOff ? !1 : r.animate, c = {}; this.options.values && this.options.values.length ? this.handles.each(function (s) { i = 100 * ((h.values(s) - h._valueMin()) / (h._valueMax() - h._valueMin())), c["horizontal" === h.orientation ? "left" : "bottom"] = i + "%", t(this).stop(1, 1)[l ? "animate" : "css"](c, r.animate), h.options.range === !0 && ("horizontal" === h.orientation ? (0 === s && h.range.stop(1, 1)[l ? "animate" : "css"]({ left: i + "%" }, r.animate), 1 === s && h.range[l ? "animate" : "css"]({ width: i - e + "%" }, { queue: !1, duration: r.animate })) : (0 === s && h.range.stop(1, 1)[l ? "animate" : "css"]({ bottom: i + "%" }, r.animate), 1 === s && h.range[l ? "animate" : "css"]({ height: i - e + "%" }, { queue: !1, duration: r.animate }))), e = i }) : (s = this.value(), n = this._valueMin(), o = this._valueMax(), i = o !== n ? 100 * ((s - n) / (o - n)) : 0, c["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[l ? "animate" : "css"](c, r.animate), "min" === a && "horizontal" === this.orientation && this.range.stop(1, 1)[l ? "animate" : "css"]({ width: i + "%" }, r.animate), "max" === a && "horizontal" === this.orientation && this.range[l ? "animate" : "css"]({ width: 100 - i + "%" }, { queue: !1, duration: r.animate }), "min" === a && "vertical" === this.orientation && this.range.stop(1, 1)[l ? "animate" : "css"]({ height: i + "%" }, r.animate), "max" === a && "vertical" === this.orientation && this.range[l ? "animate" : "css"]({ height: 100 - i + "%" }, { queue: !1, duration: r.animate })) }, _handleEvents: { keydown: function (i) { var s, n, o, a, r = t(i.target).data("ui-slider-handle-index"); switch (i.keyCode) { case t.ui.keyCode.HOME: case t.ui.keyCode.END: case t.ui.keyCode.PAGE_UP: case t.ui.keyCode.PAGE_DOWN: case t.ui.keyCode.UP: case t.ui.keyCode.RIGHT: case t.ui.keyCode.DOWN: case t.ui.keyCode.LEFT: if (i.preventDefault(), !this._keySliding && (this._keySliding = !0, t(i.target).addClass("ui-state-active"), s = this._start(i, r), s === !1)) return }switch (a = this.options.step, n = o = this.options.values && this.options.values.length ? this.values(r) : this.value(), i.keyCode) { case t.ui.keyCode.HOME: o = this._valueMin(); break; case t.ui.keyCode.END: o = this._valueMax(); break; case t.ui.keyCode.PAGE_UP: o = this._trimAlignValue(n + (this._valueMax() - this._valueMin()) / e); break; case t.ui.keyCode.PAGE_DOWN: o = this._trimAlignValue(n - (this._valueMax() - this._valueMin()) / e); break; case t.ui.keyCode.UP: case t.ui.keyCode.RIGHT: if (n === this._valueMax()) return; o = this._trimAlignValue(n + a); break; case t.ui.keyCode.DOWN: case t.ui.keyCode.LEFT: if (n === this._valueMin()) return; o = this._trimAlignValue(n - a) }this._slide(i, r, o) }, click: function (t) { t.preventDefault() }, keyup: function (e) { var i = t(e.target).data("ui-slider-handle-index"); this._keySliding && (this._keySliding = !1, this._stop(e, i), this._change(e, i), t(e.target).removeClass("ui-state-active")) } } }) }(jQuery), function (t) { function e(t) { return function () { var e = this.element.val(); t.apply(this, arguments), this._refresh(), e !== this.element.val() && this._trigger("change") } } t.widget("ui.spinner", { version: "1.10.2", defaultElement: "<input>", widgetEventPrefix: "spin", options: { culture: null, icons: { down: "ui-icon-triangle-1-s", up: "ui-icon-triangle-1-n" }, incremental: !0, max: null, min: null, numberFormat: null, page: 10, step: 1, change: null, spin: null, start: null, stop: null }, _create: function () { this._setOption("max", this.options.max), this._setOption("min", this.options.min), this._setOption("step", this.options.step), this._value(this.element.val(), !0), this._draw(), this._on(this._events), this._refresh(), this._on(this.window, { beforeunload: function () { this.element.removeAttr("autocomplete") } }) }, _getCreateOptions: function () { var e = {}, i = this.element; return t.each(["min", "max", "step"], function (t, s) { var n = i.attr(s); void 0 !== n && n.length && (e[s] = n) }), e }, _events: { keydown: function (t) { this._start(t) && this._keydown(t) && t.preventDefault() }, keyup: "_stop", focus: function () { this.previous = this.element.val() }, blur: function (t) { return this.cancelBlur ? (delete this.cancelBlur, void 0) : (this._stop(), this._refresh(), this.previous !== this.element.val() && this._trigger("change", t), void 0) }, mousewheel: function (t, e) { if (e) { if (!this.spinning && !this._start(t)) return !1; this._spin((e > 0 ? 1 : -1) * this.options.step, t), clearTimeout(this.mousewheelTimer), this.mousewheelTimer = this._delay(function () { this.spinning && this._stop(t) }, 100), t.preventDefault() } }, "mousedown .ui-spinner-button": function (e) { function i() { var t = this.element[0] === this.document[0].activeElement; t || (this.element.focus(), this.previous = s, this._delay(function () { this.previous = s })) } var s; s = this.element[0] === this.document[0].activeElement ? this.previous : this.element.val(), e.preventDefault(), i.call(this), this.cancelBlur = !0, this._delay(function () { delete this.cancelBlur, i.call(this) }), this._start(e) !== !1 && this._repeat(null, t(e.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, e) }, "mouseup .ui-spinner-button": "_stop", "mouseenter .ui-spinner-button": function (e) { return t(e.currentTarget).hasClass("ui-state-active") ? this._start(e) === !1 ? !1 : (this._repeat(null, t(e.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, e), void 0) : void 0 }, "mouseleave .ui-spinner-button": "_stop" }, _draw: function () { var t = this.uiSpinner = this.element.addClass("ui-spinner-input").attr("autocomplete", "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml()); this.element.attr("role", "spinbutton"), this.buttons = t.find(".ui-spinner-button").attr("tabIndex", -1).button().removeClass("ui-corner-all"), this.buttons.height() > Math.ceil(.5 * t.height()) && t.height() > 0 && t.height(t.height()), this.options.disabled && this.disable() }, _keydown: function (e) { var i = this.options, s = t.ui.keyCode; switch (e.keyCode) { case s.UP: return this._repeat(null, 1, e), !0; case s.DOWN: return this._repeat(null, -1, e), !0; case s.PAGE_UP: return this._repeat(null, i.page, e), !0; case s.PAGE_DOWN: return this._repeat(null, -i.page, e), !0 }return !1 }, _uiSpinnerHtml: function () { return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>" }, _buttonHtml: function () { return "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" + "</a>" + "<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" + "<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" + "</a>" }, _start: function (t) { return this.spinning || this._trigger("start", t) !== !1 ? (this.counter || (this.counter = 1), this.spinning = !0, !0) : !1 }, _repeat: function (t, e, i) { t = t || 500, clearTimeout(this.timer), this.timer = this._delay(function () { this._repeat(40, e, i) }, t), this._spin(e * this.options.step, i) }, _spin: function (t, e) { var i = this.value() || 0; this.counter || (this.counter = 1), i = this._adjustValue(i + t * this._increment(this.counter)), this.spinning && this._trigger("spin", e, { value: i }) === !1 || (this._value(i), this.counter++) }, _increment: function (e) { var i = this.options.incremental; return i ? t.isFunction(i) ? i(e) : Math.floor(e * e * e / 5e4 - e * e / 500 + 17 * e / 200 + 1) : 1 }, _precision: function () { var t = this._precisionOf(this.options.step); return null !== this.options.min && (t = Math.max(t, this._precisionOf(this.options.min))), t }, _precisionOf: function (t) { var e = "" + t, i = e.indexOf("."); return -1 === i ? 0 : e.length - i - 1 }, _adjustValue: function (t) { var e, i, s = this.options; return e = null !== s.min ? s.min : 0, i = t - e, i = Math.round(i / s.step) * s.step, t = e + i, t = parseFloat(t.toFixed(this._precision())), null !== s.max && t > s.max ? s.max : null !== s.min && s.min > t ? s.min : t }, _stop: function (t) { this.spinning && (clearTimeout(this.timer), clearTimeout(this.mousewheelTimer), this.counter = 0, this.spinning = !1, this._trigger("stop", t)) }, _setOption: function (t, e) { if ("culture" === t || "numberFormat" === t) { var i = this._parse(this.element.val()); return this.options[t] = e, this.element.val(this._format(i)), void 0 } ("max" === t || "min" === t || "step" === t) && "string" == typeof e && (e = this._parse(e)), "icons" === t && (this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up), this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down)), this._super(t, e), "disabled" === t && (e ? (this.element.prop("disabled", !0), this.buttons.button("disable")) : (this.element.prop("disabled", !1), this.buttons.button("enable"))) }, _setOptions: e(function (t) { this._super(t), this._value(this.element.val()) }), _parse: function (t) { return "string" == typeof t && "" !== t && (t = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(t, 10, this.options.culture) : +t), "" === t || isNaN(t) ? null : t }, _format: function (t) { return "" === t ? "" : window.Globalize && this.options.numberFormat ? Globalize.format(t, this.options.numberFormat, this.options.culture) : t }, _refresh: function () { this.element.attr({ "aria-valuemin": this.options.min, "aria-valuemax": this.options.max, "aria-valuenow": this._parse(this.element.val()) }) }, _value: function (t, e) { var i; "" !== t && (i = this._parse(t), null !== i && (e || (i = this._adjustValue(i)), t = this._format(i))), this.element.val(t), this._refresh() }, _destroy: function () { this.element.removeClass("ui-spinner-input").prop("disabled", !1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), this.uiSpinner.replaceWith(this.element) }, stepUp: e(function (t) { this._stepUp(t) }), _stepUp: function (t) { this._start() && (this._spin((t || 1) * this.options.step), this._stop()) }, stepDown: e(function (t) { this._stepDown(t) }), _stepDown: function (t) { this._start() && (this._spin((t || 1) * -this.options.step), this._stop()) }, pageUp: e(function (t) { this._stepUp((t || 1) * this.options.page) }), pageDown: e(function (t) { this._stepDown((t || 1) * this.options.page) }), value: function (t) { return arguments.length ? (e(this._value).call(this, t), void 0) : this._parse(this.element.val()) }, widget: function () { return this.uiSpinner } }) }(jQuery), function (t, e) { function i() { return ++n } function s(t) { return t.hash.length > 1 && decodeURIComponent(t.href.replace(o, "")) === decodeURIComponent(location.href.replace(o, "")) } var n = 0, o = /#.*$/; t.widget("ui.tabs", { version: "1.10.2", delay: 300, options: { active: null, collapsible: !1, event: "click", heightStyle: "content", hide: null, show: null, activate: null, beforeActivate: null, beforeLoad: null, load: null }, _create: function () { var e = this, i = this.options; this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", i.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function (e) { t(this).is(".ui-state-disabled") && e.preventDefault() }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function () { t(this).closest("li").is(".ui-state-disabled") && this.blur() }), this._processTabs(), i.active = this._initialActive(), t.isArray(i.disabled) && (i.disabled = t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"), function (t) { return e.tabs.index(t) }))).sort()), this.active = this.options.active !== !1 && this.anchors.length ? this._findActive(i.active) : t(), this._refresh(), this.active.length && this.load(i.active) }, _initialActive: function () { var i = this.options.active, s = this.options.collapsible, n = location.hash.substring(1); return null === i && (n && this.tabs.each(function (s, o) { return t(o).attr("aria-controls") === n ? (i = s, !1) : e }), null === i && (i = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === i || -1 === i) && (i = this.tabs.length ? 0 : !1)), i !== !1 && (i = this.tabs.index(this.tabs.eq(i)), -1 === i && (i = s ? !1 : 0)), !s && i === !1 && this.anchors.length && (i = 0), i }, _getCreateEventData: function () { return { tab: this.active, panel: this.active.length ? this._getPanelForTab(this.active) : t() } }, _tabKeydown: function (i) { var s = t(this.document[0].activeElement).closest("li"), n = this.tabs.index(s), o = !0; if (!this._handlePageNav(i)) { switch (i.keyCode) { case t.ui.keyCode.RIGHT: case t.ui.keyCode.DOWN: n++; break; case t.ui.keyCode.UP: case t.ui.keyCode.LEFT: o = !1, n--; break; case t.ui.keyCode.END: n = this.anchors.length - 1; break; case t.ui.keyCode.HOME: n = 0; break; case t.ui.keyCode.SPACE: return i.preventDefault(), clearTimeout(this.activating), this._activate(n), e; case t.ui.keyCode.ENTER: return i.preventDefault(), clearTimeout(this.activating), this._activate(n === this.options.active ? !1 : n), e; default: return }i.preventDefault(), clearTimeout(this.activating), n = this._focusNextTab(n, o), i.ctrlKey || (s.attr("aria-selected", "false"), this.tabs.eq(n).attr("aria-selected", "true"), this.activating = this._delay(function () { this.option("active", n) }, this.delay)) } }, _panelKeydown: function (e) { this._handlePageNav(e) || e.ctrlKey && e.keyCode === t.ui.keyCode.UP && (e.preventDefault(), this.active.focus()) }, _handlePageNav: function (i) { return i.altKey && i.keyCode === t.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : i.altKey && i.keyCode === t.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : e }, _findNextTab: function (e, i) { function s() { return e > n && (e = 0), 0 > e && (e = n), e } for (var n = this.tabs.length - 1; -1 !== t.inArray(s(), this.options.disabled);)e = i ? e + 1 : e - 1; return e }, _focusNextTab: function (t, e) { return t = this._findNextTab(t, e), this.tabs.eq(t).focus(), t }, _setOption: function (t, i) { return "active" === t ? (this._activate(i), e) : "disabled" === t ? (this._setupDisabled(i), e) : (this._super(t, i), "collapsible" === t && (this.element.toggleClass("ui-tabs-collapsible", i), i || this.options.active !== !1 || this._activate(0)), "event" === t && this._setupEvents(i), "heightStyle" === t && this._setupHeightStyle(i), e) }, _tabId: function (t) { return t.attr("aria-controls") || "ui-tabs-" + i() }, _sanitizeSelector: function (t) { return t ? t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "" }, refresh: function () { var e = this.options, i = this.tablist.children(":has(a[href])"); e.disabled = t.map(i.filter(".ui-state-disabled"), function (t) { return i.index(t) }), this._processTabs(), e.active !== !1 && this.anchors.length ? this.active.length && !t.contains(this.tablist[0], this.active[0]) ? this.tabs.length === e.disabled.length ? (e.active = !1, this.active = t()) : this._activate(this._findNextTab(Math.max(0, e.active - 1), !1)) : e.active = this.tabs.index(this.active) : (e.active = !1, this.active = t()), this._refresh() }, _refresh: function () { this._setupDisabled(this.options.disabled), this._setupEvents(this.options.event), this._setupHeightStyle(this.options.heightStyle), this.tabs.not(this.active).attr({ "aria-selected": "false", tabIndex: -1 }), this.panels.not(this._getPanelForTab(this.active)).hide().attr({ "aria-expanded": "false", "aria-hidden": "true" }), this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({ "aria-selected": "true", tabIndex: 0 }), this._getPanelForTab(this.active).show().attr({ "aria-expanded": "true", "aria-hidden": "false" })) : this.tabs.eq(0).attr("tabIndex", 0) }, _processTabs: function () { var e = this; this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist"), this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({ role: "tab", tabIndex: -1 }), this.anchors = this.tabs.map(function () { return t("a", this)[0] }).addClass("ui-tabs-anchor").attr({ role: "presentation", tabIndex: -1 }), this.panels = t(), this.anchors.each(function (i, n) { var o, a, r, h = t(n).uniqueId().attr("id"), l = t(n).closest("li"), c = l.attr("aria-controls"); s(n) ? (o = n.hash, a = e.element.find(e._sanitizeSelector(o))) : (r = e._tabId(l), o = "#" + r, a = e.element.find(o), a.length || (a = e._createPanel(r), a.insertAfter(e.panels[i - 1] || e.tablist)), a.attr("aria-live", "polite")), a.length && (e.panels = e.panels.add(a)), c && l.data("ui-tabs-aria-controls", c), l.attr({ "aria-controls": o.substring(1), "aria-labelledby": h }), a.attr("aria-labelledby", h) }), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel") }, _getList: function () { return this.element.find("ol,ul").eq(0) }, _createPanel: function (e) { return t("<div>").attr("id", e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0) }, _setupDisabled: function (e) { t.isArray(e) && (e.length ? e.length === this.anchors.length && (e = !0) : e = !1); for (var i, s = 0; i = this.tabs[s]; s++)e === !0 || -1 !== t.inArray(s, e) ? t(i).addClass("ui-state-disabled").attr("aria-disabled", "true") : t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled"); this.options.disabled = e }, _setupEvents: function (e) { var i = { click: function (t) { t.preventDefault() } }; e && t.each(e.split(" "), function (t, e) { i[e] = "_eventHandler" }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(this.anchors, i), this._on(this.tabs, { keydown: "_tabKeydown" }), this._on(this.panels, { keydown: "_panelKeydown" }), this._focusable(this.tabs), this._hoverable(this.tabs) }, _setupHeightStyle: function (e) { var i, s = this.element.parent(); "fill" === e ? (i = s.height(), i -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function () { var e = t(this), s = e.css("position"); "absolute" !== s && "fixed" !== s && (i -= e.outerHeight(!0)) }), this.element.children().not(this.panels).each(function () { i -= t(this).outerHeight(!0) }), this.panels.each(function () { t(this).height(Math.max(0, i - t(this).innerHeight() + t(this).height())) }).css("overflow", "auto")) : "auto" === e && (i = 0, this.panels.each(function () { i = Math.max(i, t(this).height("").height()) }).height(i)) }, _eventHandler: function (e) { var i = this.options, s = this.active, n = t(e.currentTarget), o = n.closest("li"), a = o[0] === s[0], r = a && i.collapsible, h = r ? t() : this._getPanelForTab(o), l = s.length ? this._getPanelForTab(s) : t(), c = { oldTab: s, oldPanel: l, newTab: r ? t() : o, newPanel: h }; e.preventDefault(), o.hasClass("ui-state-disabled") || o.hasClass("ui-tabs-loading") || this.running || a && !i.collapsible || this._trigger("beforeActivate", e, c) === !1 || (i.active = r ? !1 : this.tabs.index(o), this.active = a ? t() : o, this.xhr && this.xhr.abort(), l.length || h.length || t.error("jQuery UI Tabs: Mismatching fragment identifier."), h.length && this.load(this.tabs.index(o), e), this._toggle(e, c)) }, _toggle: function (e, i) { function s() { o.running = !1, o._trigger("activate", e, i) } function n() { i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), a.length && o.options.show ? o._show(a, o.options.show, s) : (a.show(), s()) } var o = this, a = i.newPanel, r = i.oldPanel; this.running = !0, r.length && this.options.hide ? this._hide(r, this.options.hide, function () { i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), n() }) : (i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), r.hide(), n()), r.attr({ "aria-expanded": "false", "aria-hidden": "true" }), i.oldTab.attr("aria-selected", "false"), a.length && r.length ? i.oldTab.attr("tabIndex", -1) : a.length && this.tabs.filter(function () { return 0 === t(this).attr("tabIndex") }).attr("tabIndex", -1), a.attr({ "aria-expanded": "true", "aria-hidden": "false" }), i.newTab.attr({ "aria-selected": "true", tabIndex: 0 }) }, _activate: function (e) { var i, s = this._findActive(e); s[0] !== this.active[0] && (s.length || (s = this.active), i = s.find(".ui-tabs-anchor")[0], this._eventHandler({ target: i, currentTarget: i, preventDefault: t.noop })) }, _findActive: function (e) { return e === !1 ? t() : this.tabs.eq(e) }, _getIndex: function (t) { return "string" == typeof t && (t = this.anchors.index(this.anchors.filter("[href$='" + t + "']"))), t }, _destroy: function () { this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(), this.tabs.add(this.panels).each(function () { t.data(this, "ui-tabs-destroy") ? t(this).remove() : t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role") }), this.tabs.each(function () { var e = t(this), i = e.data("ui-tabs-aria-controls"); i ? e.attr("aria-controls", i).removeData("ui-tabs-aria-controls") : e.removeAttr("aria-controls") }), this.panels.show(), "content" !== this.options.heightStyle && this.panels.css("height", "") }, enable: function (i) { var s = this.options.disabled; s !== !1 && (i === e ? s = !1 : (i = this._getIndex(i), s = t.isArray(s) ? t.map(s, function (t) { return t !== i ? t : null }) : t.map(this.tabs, function (t, e) { return e !== i ? e : null })), this._setupDisabled(s)) }, disable: function (i) { var s = this.options.disabled; if (s !== !0) { if (i === e) s = !0; else { if (i = this._getIndex(i), -1 !== t.inArray(i, s)) return; s = t.isArray(s) ? t.merge([i], s).sort() : [i] } this._setupDisabled(s) } }, load: function (e, i) { e = this._getIndex(e); var n = this, o = this.tabs.eq(e), a = o.find(".ui-tabs-anchor"), r = this._getPanelForTab(o), h = { tab: o, panel: r }; s(a[0]) || (this.xhr = t.ajax(this._ajaxSettings(a, i, h)), this.xhr && "canceled" !== this.xhr.statusText && (o.addClass("ui-tabs-loading"), r.attr("aria-busy", "true"), this.xhr.success(function (t) { setTimeout(function () { r.html(t), n._trigger("load", i, h) }, 1) }).complete(function (t, e) { setTimeout(function () { "abort" === e && n.panels.stop(!1, !0), o.removeClass("ui-tabs-loading"), r.removeAttr("aria-busy"), t === n.xhr && delete n.xhr }, 1) }))) }, _ajaxSettings: function (e, i, s) { var n = this; return { url: e.attr("href"), beforeSend: function (e, o) { return n._trigger("beforeLoad", i, t.extend({ jqXHR: e, ajaxSettings: o }, s)) } } }, _getPanelForTab: function (e) { var i = t(e).attr("aria-controls"); return this.element.find(this._sanitizeSelector("#" + i)) } }) }(jQuery), function (t) {
    function e(e, i) { var s = (e.attr("aria-describedby") || "").split(/\s+/); s.push(i), e.data("ui-tooltip-id", i).attr("aria-describedby", t.trim(s.join(" "))) } function i(e) { var i = e.data("ui-tooltip-id"), s = (e.attr("aria-describedby") || "").split(/\s+/), n = t.inArray(i, s); -1 !== n && s.splice(n, 1), e.removeData("ui-tooltip-id"), s = t.trim(s.join(" ")), s ? e.attr("aria-describedby", s) : e.removeAttr("aria-describedby") } var s = 0; t.widget("ui.tooltip", {
        version: "1.10.2", options: { content: function () { var e = t(this).attr("title") || ""; return t("<a>").text(e).html() }, hide: !0, items: "[title]:not([disabled])", position: { my: "left top+15", at: "left bottom", collision: "flipfit flip" }, show: !0, tooltipClass: null, track: !1, close: null, open: null }, _create: function () { this._on({ mouseover: "open", focusin: "open" }), this.tooltips = {}, this.parents = {}, this.options.disabled && this._disable() }, _setOption: function (e, i) { var s = this; return "disabled" === e ? (this[i ? "_disable" : "_enable"](), this.options[e] = i, void 0) : (this._super(e, i), "content" === e && t.each(this.tooltips, function (t, e) { s._updateContent(e) }), void 0) }, _disable: function () { var e = this; t.each(this.tooltips, function (i, s) { var n = t.Event("blur"); n.target = n.currentTarget = s[0], e.close(n, !0) }), this.element.find(this.options.items).addBack().each(function () { var e = t(this); e.is("[title]") && e.data("ui-tooltip-title", e.attr("title")).attr("title", "") }) }, _enable: function () { this.element.find(this.options.items).addBack().each(function () { var e = t(this); e.data("ui-tooltip-title") && e.attr("title", e.data("ui-tooltip-title")) }) }, open: function (e) { var i = this, s = t(e ? e.target : this.element).closest(this.options.items); s.length && !s.data("ui-tooltip-id") && (s.attr("title") && s.data("ui-tooltip-title", s.attr("title")), s.data("ui-tooltip-open", !0), e && "mouseover" === e.type && s.parents().each(function () { var e, s = t(this); s.data("ui-tooltip-open") && (e = t.Event("blur"), e.target = e.currentTarget = this, i.close(e, !0)), s.attr("title") && (s.uniqueId(), i.parents[this.id] = { element: this, title: s.attr("title") }, s.attr("title", "")) }), this._updateContent(s, e)) }, _updateContent: function (t, e) {
            var i, s = this.options.content, n = this, o = e ? e.type : null; return "string" == typeof s ? this._open(e, t, s) : (i = s.call(t[0], function (i) {
                t.data("ui-tooltip-open") && n._delay(function () {
                e && (e.type = o), this._open(e, t, i)
                })
            }), i && this._open(e, t, i), void 0)
        }, _open: function (i, s, n) { function o(t) { l.of = t, a.is(":hidden") || a.position(l) } var a, r, h, l = t.extend({}, this.options.position); if (n) { if (a = this._find(s), a.length) return a.find(".ui-tooltip-content").html(n), void 0; s.is("[title]") && (i && "mouseover" === i.type ? s.attr("title", "") : s.removeAttr("title")), a = this._tooltip(s), e(s, a.attr("id")), a.find(".ui-tooltip-content").html(n), this.options.track && i && /^mouse/.test(i.type) ? (this._on(this.document, { mousemove: o }), o(i)) : a.position(t.extend({ of: s }, this.options.position)), a.hide(), this._show(a, this.options.show), this.options.show && this.options.show.delay && (h = this.delayedShow = setInterval(function () { a.is(":visible") && (o(l.of), clearInterval(h)) }, t.fx.interval)), this._trigger("open", i, { tooltip: a }), r = { keyup: function (e) { if (e.keyCode === t.ui.keyCode.ESCAPE) { var i = t.Event(e); i.currentTarget = s[0], this.close(i, !0) } }, remove: function () { this._removeTooltip(a) } }, i && "mouseover" !== i.type || (r.mouseleave = "close"), i && "focusin" !== i.type || (r.focusout = "close"), this._on(!0, s, r) } }, close: function (e) { var s = this, n = t(e ? e.currentTarget : this.element), o = this._find(n); this.closing || (clearInterval(this.delayedShow), n.data("ui-tooltip-title") && n.attr("title", n.data("ui-tooltip-title")), i(n), o.stop(!0), this._hide(o, this.options.hide, function () { s._removeTooltip(t(this)) }), n.removeData("ui-tooltip-open"), this._off(n, "mouseleave focusout keyup"), n[0] !== this.element[0] && this._off(n, "remove"), this._off(this.document, "mousemove"), e && "mouseleave" === e.type && t.each(this.parents, function (e, i) { t(i.element).attr("title", i.title), delete s.parents[e] }), this.closing = !0, this._trigger("close", e, { tooltip: o }), this.closing = !1) }, _tooltip: function (e) { var i = "ui-tooltip-" + s++, n = t("<div>").attr({ id: i, role: "tooltip" }).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || "")); return t("<div>").addClass("ui-tooltip-content").appendTo(n), n.appendTo(this.document[0].body), this.tooltips[i] = e, n }, _find: function (e) { var i = e.data("ui-tooltip-id"); return i ? t("#" + i) : t() }, _removeTooltip: function (t) { t.remove(), delete this.tooltips[t.attr("id")] }, _destroy: function () { var e = this; t.each(this.tooltips, function (i, s) { var n = t.Event("blur"); n.target = n.currentTarget = s[0], e.close(n, !0), t("#" + i).remove(), s.data("ui-tooltip-title") && (s.attr("title", s.data("ui-tooltip-title")), s.removeData("ui-tooltip-title")) }) }
    })
}(jQuery);
/*!
 * dragtable
 *
 * @Version 2.0.14
 *
 * Copyright (c) 2010-2013, Andres akottr@gmail.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Inspired by the the dragtable from Dan Vanderkam (danvk.org/dragtable/)
 * Thanks to the jquery and jqueryui comitters
 *
 * Any comment, bug report, feature-request is welcome
 * Feel free to contact me.
 */

/* TOKNOW:
 * For IE7 you need this css rule:
 * table {
 *   border-collapse: collapse;
 * }
 * Or take a clean reset.css (see http://meyerweb.com/eric/tools/css/reset/)
 */

/* TODO: investigate
 * Does not work properly with css rule:
 * html {
 *      overflow: -moz-scrollbars-vertical;
 *  }
 * Workaround:
 * Fixing Firefox issues by scrolling down the page
 * http://stackoverflow.com/questions/2451528/jquery-ui-sortable-scroll-helper-element-offset-firefox-issue
 *
 * var start = $.noop;
 * var beforeStop = $.noop;
 * if($.browser.mozilla) {
 * var start = function (event, ui) {
 *               if( ui.helper !== undefined )
 *                 ui.helper.css('position','absolute').css('margin-top', $(window).scrollTop() );
 *               }
 * var beforeStop = function (event, ui) {
 *              if( ui.offset !== undefined )
 *                ui.helper.css('margin-top', 0);
 *              }
 * }
 *
 * and pass this as start and stop function to the sortable initialisation
 * start: start,
 * beforeStop: beforeStop
 */
/*
 * Special thx to all pull requests comitters
 */

(function ($) {
    $.widget("akottr.dragtable", {
        options: {
            revert: false,               // smooth revert
            dragHandle: '.table-handle', // handle for moving cols, if not exists the whole 'th' is the handle
            maxMovingRows: 40,           // 1 -> only header. 40 row should be enough, the rest is usually not in the viewport
            excludeFooter: false,        // excludes the footer row(s) while moving other columns. Make sense if there is a footer with a colspan. */
            onlyHeaderThreshold: 100,    // TODO:  not implemented yet, switch automatically between entire col moving / only header moving
            dragaccept: null,            // draggable cols -> default all
            persistState: null,          // url or function -> plug in your custom persistState function right here. function call is persistState(originalTable)
            restoreState: null,          // JSON-Object or function:  some kind of experimental aka Quick-Hack TODO: do it better
            exact: true,                 // removes pixels, so that the overlay table width fits exactly the original table width
            clickDelay: 10,              // ms to wait before rendering sortable list and delegating click event
            containment: null,           // @see http://api.jqueryui.com/sortable/#option-containment, use it if you want to move in 2 dimesnions (together with axis: null)
            cursor: 'move',              // @see http://api.jqueryui.com/sortable/#option-cursor
            cursorAt: false,             // @see http://api.jqueryui.com/sortable/#option-cursorAt
            distance: 0,                 // @see http://api.jqueryui.com/sortable/#option-distance, for immediate feedback use "0"
            tolerance: 'pointer',        // @see http://api.jqueryui.com/sortable/#option-tolerance
            axis: 'x',                   // @see http://api.jqueryui.com/sortable/#option-axis, Only vertical moving is allowed. Use 'x' or null. Use this in conjunction with the 'containment' setting
            beforeStart: $.noop,         // returning FALSE will stop the execution chain.
            beforeMoving: $.noop,
            beforeReorganize: $.noop,
            beforeStop: $.noop
        },
        originalTable: {
            el: null,
            selectedHandle: null,
            sortOrder: null,
            startIndex: 0,
            endIndex: 0
        },
        sortableTable: {
            el: $(),
            selectedHandle: $(),
            movingRow: $()
        },
        persistState: function () {
            var _this = this;
            this.originalTable.el.find('th').each(function (i) {
                if (this.id !== '') {
                    _this.originalTable.sortOrder[this.id] = i;
                }
            });
            $.ajax({
                url: this.options.persistState,
                data: this.originalTable.sortOrder
            });
        },
        /*
         * persistObj looks like
         * {'id1':'2','id3':'3','id2':'1'}
         * table looks like
         * |   id2  |   id1   |   id3   |
         */
        _restoreState: function (persistObj) {
            for (var n in persistObj) {
                this.originalTable.startIndex = $('#' + n).closest('th').prevAll().size() + 1;
                this.originalTable.endIndex = parseInt(persistObj[n], 10) + 1;
                this._bubbleCols();
            }
        },
        // bubble the moved col left or right
        _bubbleCols: function () {
            var i, j, col1, col2;
            var from = this.originalTable.startIndex;
            var to = this.originalTable.endIndex;
            /* Find children thead and tbody.
             * Only to process the immediate tr-children. Bugfix for inner tables
             */
            var thtb = this.originalTable.el.children();
            if (this.options.excludeFooter) {
                thtb = thtb.not('tfoot');
            }
            if (from < to) {
                for (i = from; i < to; i++) {
                    col1 = thtb.find('> tr > td:nth-child(' + i + ')')
                        .add(thtb.find('> tr > th:nth-child(' + i + ')'));
                    col2 = thtb.find('> tr > td:nth-child(' + (i + 1) + ')')
                        .add(thtb.find('> tr > th:nth-child(' + (i + 1) + ')'));
                    for (j = 0; j < col1.length; j++) {
                        swapNodes(col1[j], col2[j]);
                    }
                }
            } else {
                for (i = from; i > to; i--) {
                    col1 = thtb.find('> tr > td:nth-child(' + i + ')')
                        .add(thtb.find('> tr > th:nth-child(' + i + ')'));
                    col2 = thtb.find('> tr > td:nth-child(' + (i - 1) + ')')
                        .add(thtb.find('> tr > th:nth-child(' + (i - 1) + ')'));
                    for (j = 0; j < col1.length; j++) {
                        swapNodes(col1[j], col2[j]);
                    }
                }
            }
        },
        _rearrangeTableBackroundProcessing: function () {
            var _this = this;
            return function () {
                _this._bubbleCols();
                _this.options.beforeStop(_this.originalTable);
                _this.sortableTable.el.remove();
                restoreTextSelection();
                // persist state if necessary
                if (_this.options.persistState !== null) {
                    $.isFunction(_this.options.persistState) ? _this.options.persistState(_this.originalTable) : _this.persistState();
                }
            };
        },
        _rearrangeTable: function () {
            var _this = this;
            return function () {
                // remove handler-class -> handler is now finished
                _this.originalTable.selectedHandle.removeClass('dragtable-handle-selected');
                // add disabled class -> reorgorganisation starts soon
                _this.sortableTable.el.sortable("disable");
                _this.sortableTable.el.addClass('dragtable-disabled');
                _this.options.beforeReorganize(_this.originalTable, _this.sortableTable);
                // do reorganisation asynchronous
                // for chrome a little bit more than 1 ms because we want to force a rerender
                _this.originalTable.endIndex = _this.sortableTable.movingRow.prevAll().size() + 1;
                setTimeout(_this._rearrangeTableBackroundProcessing(), 50);
            };
        },
        /*
         * Disrupts the table. The original table stays the same.
         * But on a layer above the original table we are constructing a list (ul > li)
         * each li with a separate table representig a single col of the original table.
         */
        _generateSortable: function (e) {
            !e.cancelBubble && (e.cancelBubble = true);
            var _this = this;
            // table attributes
            var attrs = this.originalTable.el[0].attributes;
            var attrsString = '';
            for (var i = 0; i < attrs.length; i++) {
                if (attrs[i].nodeValue && attrs[i].nodeName != 'id' && attrs[i].nodeName != 'width') {
                    attrsString += attrs[i].nodeName + '="' + attrs[i].nodeValue + '" ';
                }
            }

            // row attributes
            var rowAttrsArr = [];
            //compute height, special handling for ie needed :-(
            var heightArr = [];
            this.originalTable.el.find('tr').slice(0, this.options.maxMovingRows).each(function (i, v) {
                // row attributes
                var attrs = this.attributes;
                var attrsString = "";
                for (var j = 0; j < attrs.length; j++) {
                    if (attrs[j].nodeValue && attrs[j].nodeName != 'id') {
                        attrsString += " " + attrs[j].nodeName + '="' + attrs[j].nodeValue + '"';
                    }
                }
                rowAttrsArr.push(attrsString);
                heightArr.push($(this).height());
            });

            // compute width, no special handling for ie needed :-)
            var widthArr = [];
            // compute total width, needed for not wrapping around after the screen ends (floating)
            var totalWidth = 0;
            /* Find children thead and tbody.
             * Only to process the immediate tr-children. Bugfix for inner tables
             */
            var thtb = _this.originalTable.el.children();
            if (this.options.excludeFooter) {
                thtb = thtb.not('tfoot');
            }
            thtb.find('> tr > th').each(function (i, v) {
                var w = $(this).outerWidth();
                widthArr.push(w);
                totalWidth += w;
            });
            if (_this.options.exact) {
                var difference = totalWidth - _this.originalTable.el.outerWidth();
                widthArr[0] -= difference;
            }
            // one extra px on right and left side
            totalWidth += 2

            var sortableHtml = '<ul class="dragtable-sortable" style="position:absolute; width:' + totalWidth + 'px;">';
            // assemble the needed html
            thtb.find('> tr > th').each(function (i, v) {
                var width_li = $(this).outerWidth();
                sortableHtml += '<li style="width:' + width_li + 'px;">';
                sortableHtml += '<table ' + attrsString + '>';
                var row = thtb.find('> tr > th:nth-child(' + (i + 1) + ')');
                if (_this.options.maxMovingRows > 1) {
                    row = row.add(thtb.find('> tr > td:nth-child(' + (i + 1) + ')').slice(0, _this.options.maxMovingRows - 1));
                }
                row.each(function (j) {
                    // TODO: May cause duplicate style-Attribute
                    var row_content = $(this).clone().wrap('<div></div>').parent().html();
                    if (row_content.toLowerCase().indexOf('<th') === 0) sortableHtml += "<thead>";
                    sortableHtml += '<tr ' + rowAttrsArr[j] + '" style="height:' + heightArr[j] + 'px;">';
                    sortableHtml += row_content;
                    if (row_content.toLowerCase().indexOf('<th') === 0) sortableHtml += "</thead>";
                    sortableHtml += '</tr>';
                });
                sortableHtml += '</table>';
                sortableHtml += '</li>';
            });
            sortableHtml += '</ul>';
            this.sortableTable.el = this.originalTable.el.before(sortableHtml).prev();
            // set width if necessary
            this.sortableTable.el.find('> li > table').each(function (i, v) {
                $(this).css('width', widthArr[i] + 'px');
            });

            // assign this.sortableTable.selectedHandle
            this.sortableTable.selectedHandle = this.sortableTable.el.find('th .dragtable-handle-selected');

            var items = !this.options.dragaccept ? 'li' : 'li:has(' + this.options.dragaccept + ')';
            this.sortableTable.el.sortable({
                items: items,
                stop: this._rearrangeTable(),
                // pass thru options for sortable widget
                revert: this.options.revert,
                tolerance: this.options.tolerance,
                containment: this.options.containment,
                cursor: this.options.cursor,
                cursorAt: this.options.cursorAt,
                distance: this.options.distance,
                axis: this.options.axis
            });

            // assign start index
            this.originalTable.startIndex = $(e.target).closest('th').prevAll().size() + 1;

            this.options.beforeMoving(this.originalTable, this.sortableTable);
            // Start moving by delegating the original event to the new sortable table
            this.sortableTable.movingRow = this.sortableTable.el.find('> li:nth-child(' + this.originalTable.startIndex + ')');

            // prevent the user from drag selecting "highlighting" surrounding page elements
            disableTextSelection();
            // clone the initial event and trigger the sort with it
            this.sortableTable.movingRow.trigger($.extend($.Event(e.type), {
                which: 1,
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                screenX: e.screenX,
                screenY: e.screenY
            }));

            // Some inner divs to deliver the posibillity to style the placeholder more sophisticated
            var placeholder = this.sortableTable.el.find('.ui-sortable-placeholder');
            if (!placeholder.height() <= 0) {
                placeholder.css('height', this.sortableTable.el.find('.ui-sortable-helper').height());
            }

            placeholder.html('<div class="outer" style="height:100%;"><div class="inner" style="height:100%;"></div></div>');
        },
        bindTo: {},
        _create: function () {
            this.originalTable = {
                el: this.element,
                selectedHandle: $(),
                sortOrder: {},
                startIndex: 0,
                endIndex: 0
            };
            // bind draggable to 'th' by default
            this.bindTo = this.originalTable.el.find('th');
            // filter only the cols that are accepted
            if (this.options.dragaccept) {
                this.bindTo = this.bindTo.filter(this.options.dragaccept);
            }
            // bind draggable to handle if exists
            if (this.bindTo.find(this.options.dragHandle).size() > 0) {
                this.bindTo = this.bindTo.find(this.options.dragHandle);
            }
            // restore state if necessary
            if (this.options.restoreState !== null) {
                $.isFunction(this.options.restoreState) ? this.options.restoreState(this.originalTable) : this._restoreState(this.options.restoreState);
            }
            var _this = this;
            this.bindTo.mousedown(function (evt) {
                // listen only to left mouse click
                if (evt.which !== 1) return;
                if (_this.options.beforeStart(_this.originalTable) === false) {
                    return;
                }
                clearTimeout(this.downTimer);
                this.downTimer = setTimeout(function () {
                    _this.originalTable.selectedHandle = $(this);
                    _this.originalTable.selectedHandle.addClass('dragtable-handle-selected');
                    _this._generateSortable(evt);
                }, _this.options.clickDelay);
            }).mouseup(function (evt) {
                clearTimeout(this.downTimer);
            });
        },
        redraw: function () {
            this.destroy();
            this._create();
        },
        destroy: function () {
            this.bindTo.unbind('mousedown');
            $.Widget.prototype.destroy.apply(this, arguments); // default destroy
            // now do other stuff particular to this widget
        }
    });

    /** closure-scoped "private" functions **/

    var body_onselectstart_save = $(document.body).attr('onselectstart'),
        body_unselectable_save = $(document.body).attr('unselectable');

    // css properties to disable user-select on the body tag by appending a <style> tag to the <head>
    // remove any current document selections

    function disableTextSelection() {
        // jQuery doesn't support the element.text attribute in MSIE 8
        // http://stackoverflow.com/questions/2692770/style-style-textcss-appendtohead-does-not-work-in-ie
        var $style = $('<style id="__dragtable_disable_text_selection__" type="text/css">body { -ms-user-select:none;-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;user-select:none; }</style>');
        $(document.head).append($style);
        $(document.body).attr('onselectstart', 'return false;').attr('unselectable', 'on');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else {
            document.selection.empty(); // MSIE http://msdn.microsoft.com/en-us/library/ms535869%28v=VS.85%29.aspx
        }
    }

    // remove the <style> tag, and restore the original <body> onselectstart attribute

    function restoreTextSelection() {
        $('#__dragtable_disable_text_selection__').remove();
        if (body_onselectstart_save) {
            $(document.body).attr('onselectstart', body_onselectstart_save);
        } else {
            $(document.body).removeAttr('onselectstart');
        }
        if (body_unselectable_save) {
            $(document.body).attr('unselectable', body_unselectable_save);
        } else {
            $(document.body).removeAttr('unselectable');
        }
    }

    function swapNodes(a, b) {
        var aparent = a.parentNode;
        var asibling = a.nextSibling === b ? a : a.nextSibling;
        b.parentNode.insertBefore(a, b);
        aparent.insertBefore(b, asibling);
    }
})(jQuery);
