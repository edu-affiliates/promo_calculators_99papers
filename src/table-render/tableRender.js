'use strict';

import $ from "jquery";
import { generalOptions } from "../generalOtions/generalOptions";
var tableRender = (function() {
	var tableRender = {};

	tableRender.render = function(data) {
		renderTable(data);
		popupFromTablePrice();
	};

	function renderTable(data) {
		var $tableDiv = document.getElementById("renderTable");
		var $templatePopUp = '<div class="popup"><div class="date"><p>Estimate date:</p><p id="js-estimate-data">02.07.2016</p>\n\t\t\t\t\t\t\t  </div><div class="pages"><p>Number of pages:</p><div><button id="decBut">&#8212;</button><p id="pagesCount">1</p>\n\t\t\t\t\t\t\t  <button id="incBut">&#43;</button></div></div><div class="priceTotal"><p>Estimate price:</p><div class="price-count">\n\t\t\t\t\t\t\t  <p>&#36;</p><p id="priceofp">0</p></div></div><button id="JSpriceButton">order now!</button><span class="cross__pop-up"></span></div>';

		var $templateTable = '<table id="pricing-table" cellspacing="0" cellpadding="0"><thead><tr class="headrow1"><th>deadline</th><th colspan="5">academic level</th>\n\t\t\t\t\t</tr><tr><th></th>';

		for (var nameEssey in data.level) {
			if (nameEssey == 'Undergraduate (1st and 2nd year)') {
				$templateTable += '<th>Undergrad. <br> (yrs 1-2)</th>';
			} else if (nameEssey == 'Undergraduate (3rd and 4th year)') {
				$templateTable += '<th>Undergrad. <br> (yrs 3-4)</th>';
			} else {
				$templateTable += '<th>' + nameEssey + '</th>';
			}
		}

		$templateTable += '</tr></thead><tbody>';

		var arrayDeadline = {};

		for (var _nameEssey in data.level) {

			for (var deadline in data.level[_nameEssey].deadline) {

				if (arrayDeadline[deadline]) {} else {
					arrayDeadline[deadline] = deadline;
					$templateTable += '<tr><th>' + deadline + '</th>';
					for (var _nameEssey2 in data.level) {
						$templateTable += '<td data-service="' + data.id + '" data-level="' + data.level[_nameEssey2].id + '" \n\t\t\t\t\t\t\t\t\t\t\tdata-pricing="' + data.level[_nameEssey2].deadline[deadline].id + '">$ ' + data.level[_nameEssey2].deadline[deadline].price + '</td>';
					}
					$templateTable += '</tr>';
				}
			}
		}
		$templateTable += '</tbody></table>';

		$tableDiv.insertAdjacentHTML("afterbegin", $templatePopUp);
		$tableDiv.insertAdjacentHTML("afterbegin", $templateTable);
	}

	function popupFromTablePrice() {

		var numOfPages = 1,
		    sourceBottom,
		    priceOfPage,
		    priceOfPageTotal;
		var form = document.getElementById('pricing-table');
		var body = document.querySelector('body');
		var popup = $(".popup");
		var popup2 = document.getElementsByClassName('popup2')[0];
		var but1 = document.getElementById('decBut');
		var but2 = document.getElementById('incBut');
		var pages = document.getElementById('pagesCount');
		var prices = document.getElementById('priceofp');
		var estimateDate = document.getElementById('js-estimate-data');
		var width = $(window).width();
		var tr = $("tr");
		var trodd = $("tr:odd td");
		var treven = $("tr:even td");
		var sendButton = document.getElementById('JSpriceButton');
		var crossPopup = document.getElementsByClassName('cross__pop-up')[0];

		var dataObject = {
			numOfPages: 1
		};

		crossPopup.addEventListener('click', function () {
			popup[0].style.display = "none";
			// trodd.css("background", "#fff");
			// treven.css("background", "#f2f0e2");
            trodd.removeClass('selectedTd');
            treven.removeClass('selectedTd');
		});

		body.onclick = function (event) {
			var leftCoor, topCoor;
			if (searchElem("pricing-table")) {
				if (event.target.tagName == "TD") {
					sourceBottom = window.pageYOffset;
					if (width >= 767) {
						leftCoor = event.target.offsetLeft - 0.5 * popup.width() + 0.5 * event.target.offsetWidth ;
						sourceBottom = 857;
						showPopUp(sourceBottom, leftCoor);
						dataObject.service = event.srcElement.getAttribute("data-service");
						dataObject.level = event.srcElement.getAttribute("data-level");
						dataObject.price = event.srcElement.getAttribute("data-pricing");
					} else {
						leftCoor = ($(document).width() - popup.width()) / 2;
						showPopUp(sourceBottom, leftCoor);
					}
				} else if (searchPath(popup[0], event.path)) {} else {
					popup[0].style.display = "none";
					// trodd.css("background", "#fff");
					// treven.css("background", "#f2f0e2");
                    trodd.removeClass('selectedTd');
                    treven.removeClass('selectedTd');
				}
			}
		};

		function searchPath(elem, path) {
			var key = (elem.toString() + path.toString()).hashCode();

			if (searchPath.cache.hasOwnProperty(key)) {
				return searchPath.cache[key];
			} else {
				for (var i = 0; i < path.length; i++) {
					if (path[i] == elem) {
						searchPath.cache[key] = true;
						return true;
					}
				}
				searchPath.cache[key] = false;
				return false;
			}
		}

		searchPath.cache = {};

		function searchElem(elementId) {
			var searchedElement = document.getElementById(elementId);
			if (searchedElement) {
				return true;
			} else {
				return false;
			}
		}

		function decThis() {
			if (numOfPages <= 1) {
				numOfPages = 1;
			} else {
				numOfPages -= 1;
				priceOfPageTotal -= priceOfPage;
			}
			dataObject.numOfPages = numOfPages;
			pages.innerHTML = numOfPages;
			prices.innerHTML = priceOfPageTotal;
		}

		function incThis() {
			if (numOfPages >= 200) {
				numOfPages = 200;
			} else {
				numOfPages += 1;
				priceOfPageTotal += priceOfPage;
			}
			dataObject.numOfPages = numOfPages;
			pages.innerHTML = numOfPages;
			prices.innerHTML = priceOfPageTotal;
		}

		function redirectToMy() {
            let redirectTo  = generalOptions.siteMyUrl+'/order.html?csi=' + dataObject.service + '&cli=' + dataObject.level + '&cdi=' + dataObject.price + '&ccu=' + dataObject.numOfPages;
            if (generalOptions.apiMode !== 'M') {
                redirectTo += `&rid=${generalOptions.rid}`
            }
            location.href = redirectTo;
		}

		function showPopUp(sourceBottom, leftCoor) {
			var pricesVal = event.target.innerHTML;

			var timeDeadline = event.target.parentElement.children[0].innerText;

			estimateDate.innerText = setTime(timeDeadline);

			var sourceBottom = sourceBottom;
			numOfPages = 1;
			priceOfPage = +pricesVal.replace(/[^-0-9]/gim, '');
			priceOfPageTotal = +pricesVal.replace(/[^-0-9]/gim, '');
			pages.innerHTML = numOfPages;
			prices.innerHTML = pricesVal.substring(2);
			var leftCoor = leftCoor;

			var topCoor = event.target.offsetTop - 256;

			// trodd.css("background", "#fff");
			// treven.css("background", "#f2f0e2");
			trodd.removeClass('selectedTd');
            treven.removeClass('selectedTd');
			popup.css({
				'left': leftCoor + "px",
				'top': topCoor + "px",
				'display': "flex",
				'position': "absolute"
			});

			if (popup[0].offsetTop < sourceBottom) {
				$('html, body').animate({
					scrollTop: $(".popup").offset().top - 150
				}, 350);
			}

			event.target.classList.add('selectedTd');

			but1.addEventListener("click", decThis, false);
			but2.addEventListener("click", incThis, false);
			sendButton.addEventListener("click", redirectToMy);
		}

		function setTime(timeDeadline) {
			var timeToAdd = timeDeadline.split(' ');
			var someDate = new Date();
			if (timeToAdd[1] == 'days') {
				someDate.setDate(someDate.getDate() + +timeToAdd[0]);
			} else if (timeToAdd[1] == 'hours') {
				someDate.setHours(someDate.getHours() + +timeToAdd[0]);
			}
			var dd = someDate.getDate();
			var mm = someDate.getMonth() + 1;
			var y = someDate.getFullYear();
			var someFormattedDate = dd + '.' + mm + '.' + y;

			return someFormattedDate;
		}

		String.prototype.hashCode = function () {
			var hash = 0,
			    i,
			    chr,
			    len;
			if (this.length === 0) return hash;
			for (i = 0, len = this.length; i < len; i++) {
				chr = this.charCodeAt(i);
				hash = (hash << 5) - hash + chr;
				hash |= 0;
			}
			return hash;
		};
	};

	return tableRender;
}());

export {tableRender};