import $ from "jquery";
import { helper } from '../helper/helper'
import { generalOptions } from '../generalOtions/generalOptions';

var workWithApi = (function () {
	var workWithApi = {};
	var params = window
		.location
		.search
		.replace('?', '')
		.split('&')
		.reduce(
			function (p, e) {
				var a = e.split('=');
				p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
				return p;
			}, {}
		);

	var myDefault = {
		urlApi: helper.getApiURL(generalOptions.hostname),
		rid: params['rid'],
		ref_id: params['ref_id'],
		sid: params['sid'],
		sub_id: params['sub_id'],
		dsc: params['dsc'],
		user_rid: params['user_rid'] ,
		user_id: params['user_id'],
		segment_id: params['segment_id'],
		url: window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search + window.location.hash,
		_xsrf: 'none'
	};

	workWithApi.init = function() {
		if (!helper.getCookie("_xrsf")) {
			getXsrf();
		} else {
            sendStats();
			sendStatsOld();
		}

	};

	function getXsrf() {
		$.ajax({
			url: myDefault.urlApi + '/api/v2/auth/check_access',
			type: 'GET',
			data: {},
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function (response) {
				var response = JSON.parse(response);
				myDefault._xsrf = response.info.token;
				helper.setCookie('_xsrf', myDefault._xsrf, 0);
                sendStats();
				sendStatsOld();

			}

		});
	}

	function sendStatsOld() {
		$.ajax({
			url: myDefault.urlApi + '/api/v2/auth/log_ref_stats',
			type: 'POST',
			data: {
				'rid': myDefault.rid || myDefault.ref_id,
				'sid': myDefault.sid || myDefault.sub_id,
				'url': document.referrer,
				'_xsrf': myDefault._xsrf
			},
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function (response) {
			}
		});
	}

	function sendStats() {
		$.ajax({
			url: myDefault.urlApi + '/api/v2/statistic/hit',
			type: 'POST',
			data: {
				'rid': myDefault.rid,
				'ref_id': myDefault.ref_id,
				'sid': myDefault.sid,
				'sub_id': myDefault.sub_id,
				'dsc': myDefault.dsc,
				'user_rid': myDefault.user_rid,
				'user_id': myDefault.user_id,
				'referrer_url': document.referrer,
				'origin_url': myDefault.url,
				'segment_id': myDefault.segment_id,
				'_xsrf': myDefault._xsrf
			},
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function (response) {
			}
		});
	}
	return workWithApi

})();

export {workWithApi};