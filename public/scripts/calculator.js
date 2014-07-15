/*GA*/
var calcused = false;
var calcallow = false;
var fireonce1 = false;
var fireonce2 = false;
var sms_addr = '';
var blockCalc = false;
var calc_mode = 2;

var deposit = new Object();
deposit.payment = 0;
deposit.percent = 0;
deposit.name = '';
deposit.error = false;
deposit.errors = '';
var stakes;
// $.getJSON({"scripts/stakes.json").done(function(data) {stakes = data});
var stakes = JSON.parse('{"max":{"rub":[[0.075,0.0825,0.0935,0.095,0.096,0.097]],"dol":[[0.0075,0.01,0.0175,0.02,0.025,0.03]],"eur":[[0.005,0.008,0.015,0.018,0.023,0,2]]},"free":{"rub":[[0.05,0.06,0.065,0.07],[0.055,0.065,0.07,0.075],[0.06,0.07,0.075,0.08]],"dol":[[0.002,0.005,0.0115,0.0135],[0.0035,0.007,0.0135,0.015],[0.005,0.008,0.015,0.018]],"eur":[[0.001,0.0025,0.008,0.01],[0.0025,0.004,0.01,0.012],[0.003,0.005,0.013,0.015]]},"rost":{"rub":[0.095],"dol":[0.0275],"eur":[0.025]},"y20":{"rub":[0.102,0.106]}}');

var changeCurrency = function(elem) {
	var id = $(elem).attr('id');

	if(id == 'cv_0') {
		$('#calc_currency').val('0');
		$('#currency_add').text("рублей");
	} else if (id == 'cv_1') {
		$('#calc_currency').val('1');
		$('#currency_add').text("долларов");
	} else {
		$('#calc_currency').val('2');
		$('#currency_add').text("евро");
	}

	$("[id^=cv_]").removeClass('selected');

	$(elem).addClass('selected');
	useCalc();
}



function block_render_request(id, location, callback, data){
	var data = data || {};
	var back = callback || false;
	data.bid = id;
	// $.ajax({
	// 	type: 'POST',
	// 	url: '/ajax/block_render',
	// 	data: data,
	// 	async: true,
	// 	dataType: 'json',
	// 	error: function (data, a, b) {
	// 		console.log(b);
	// 	},
	// 	success: function (data) {
	// 		$(location).html(data.html);
	// 		if (data.log) console.log(data.log);
	// 		if (typeof(callback) == 'function') back();				
	// 	}
	// });
	
}
/* ------------------------------------ */

	var time_counter = 0;
	var activity_counter = 0;
	var activity_time = 0;
	var activity_1 = 0;
	var activity_2 = 0;
	var cursestime = 0;
	function activity() {
		if ((document.cookie).indexOf('ActivityCounter') + 1) {
			activity_counter = parseInt(getCookieData('ActivityCounter')) + 1;
		} else {
			activity_counter = 1;
		}
		document.cookie = 'ActivityCounter=' + activity_counter;
	}
	function time() {
		if ((document.cookie).indexOf('CurSesTime') + 1) {
			cursestime = parseInt(getCookieData('CurSesTime')) + 1;
		} else {
			cursestime = 1;
		}
		document.cookie = 'CurSesTime=' + cursestime;
		if (cursestime == 1) {
			activity_1 = activity_counter;
		}
		if (cursestime % 10 == 0) {
			activity_2 = activity_counter;
			if (activity_2 - activity_1 > 0) {
				if ((document.cookie).indexOf('ActivityTime') + 1) {
					activity_time = parseInt(getCookieData('ActivityTime')) + 10;
				} else {
					activity_time = 10;
				}
				document.cookie = 'ActivityTime=' + activity_time;
			}
			activity_1 = activity_2;
		}
		if (activity_time == 60) {
			document.cookie = 'StopTimer=Stop';
			// _gaq.push(['_trackEvent', 'Action', '60_sec', 'Deposit_60_sec']);
		}
		if ((document.cookie).indexOf('StopTimer') + 1) {} else { setTimeout('time()',1000); }
	}
	function getCookieData(labelName) {
		var labelLen = labelName.length;
		var cookieData = document.cookie;
		var cLen = cookieData.length;
		var i = 0;
		var cEnd;
		while (i < cLen) {
		var j = i + labelLen;
			if (cookieData.substring(i,j) == labelName ) {
				cEnd = cookieData.indexOf(';',j);
				if (cEnd == -1) {
					cEnd = cookieData.length;
				}
				return unescape(cookieData.substring(j+1, cEnd));
			}
			i++;
		}
		return '';
	}

var curCity;
var ScrollCounter = 0;

var deposits = new Object();

var rostErrors = new Object();
rostErrors.sum = 0;
rostErrors.currency = 0;
rostErrors.time = 0;
rostErrors.flags = 0;

var deposit = new Object();
deposit.payment = 0;
deposit.percent = 0;
deposit.name = '';
deposit.error = false;
deposit.errors = '';

function getCurrency(cur){
	cur = parseInt(cur);
	switch (cur){
		case 2: return 'евро';
		case 1: return 'дол.';
		default: return 'руб.';
	}
}
/*
function getIncome(sum,currency,time,additional){
	//reset
	deposit.payment = 0;
	deposit.percent = 0;
	deposit.name = '';
	deposit.error = false;
	deposit.errors = '';
	rostErrors.sum = 0;
	rostErrors.currency = 0;
	rostErrors.time = 0;
	rostErrors.flags = 0;
	var q = 1;
	if (checkRost2012(sum,currency,time,additional) && hasRost){
	//rost2012
		if (rostErrors.sum==2) showRostErrors(); //4,5kk
		
		$("#yearoption").html("370 дней");
		if ($("#yeartimestamp")){	
			$("#yeartimestamp").html("<span>370</span>&nbsp;");
		}
		deposit.name = deposits.rost2012.name;
		c0:
		for (var i=0; i<1; i++){
				if (sum>=deposits.rost2012.frames[currency][i].from && sum<=deposits.rost2012.frames[currency][i].to){
					deposit.percent = deposits.rost2012.frames[currency][i].days[0].percent;
					break c0;
				}
				
			}
		
		if (additional.capitalization) {
			deposit.payment = sum;
			q = deposit.percent/12;
			for (var i=0; i<12; i++) {
				deposit.payment += deposit.payment*q;
			}
			q = deposit.percent/365;
			for (var i=0; i<5; i++){
				deposit.payment += deposit.payment*q;
			}
		}else{
			deposit.payment = sum+sum*deposit.percent;//+sum*deposit.percent/365*5;
		}

		var month = (time+5)/30.41;
 		deposit.percent = additional.capitalization?(Math.pow(1+deposit.percent/12,month)-1)*100/(month/12):deposit.percent*100;//(deposit.payment/sum-1)*100;

 		return;

	}else{
		$("#yearoption").html("1 год");
		if (hasRost) {
			if ($("#yeartimestamp")){	
				$("#yeartimestamp").html("<span>365</span>&nbsp;");
			}
			showRostErrors();
		}else{
			$("#correction_link").hide();
		}
		if (time == 731 && sum>=1500000) {$("#correction_link").hide();}
		var error = false;
		
		if (additional.flag2){
			//free
			deposit.name = deposits.free.name;
			var j = 0;
			c1:
			for (var i=0; i<3; i++){
				if (sum>=deposits.free.frames[currency][i].from && sum<=deposits.free.frames[currency][i].to){
					for (j=0; j<3; j++){
						if (time>=deposits.free.frames[currency][i].days[j].from && time<=deposits.free.frames[currency][i].days[j].to){
							deposit.percent = deposits.free.frames[currency][i].days[j].percent;
						}
					}
					if (deposit.percent==0){
						error = true;
						if (time<90){
							deposit.errors = 'При возможности снятия / пополнения вклада<br/> без потери процента, срок вклада должен быть не меньше 91 дня.<br/><ul><li><a href="#" class="correction_link" onclick="resetFree(); return false;">Cнять галочку «Снятия / пополнения вклада без потери процента»</a></li><li><a href="#" class="correction_link" onclick="setTime(91); return false;">Увеличить срок вклада до 91 дня</a></li></ul>';
						}
						if (time>365){
							deposit.errors = 'При возможности снятия / пополнения вклада<br/> без потери процента, срок вклада должен быть не более 1 года.<br/><ul><li><a href="#" class="correction_link" onclick="resetFree(); return false;">Cнять галочку «Снятия / пополнения вклада без потери процента»</a></li><li><a href="#" class="correction_link" onclick="setTime(365); return false;">Уменьшить срок вклада до 1 года</a></li></ul>';
						}
					}
					break c1;
				}
			}
			if (j==0){
				error = true;
				if (sum<deposits.free.frames[currency][0].from){
					deposit.errors = 'При возможности снятия / пополнения вклада без потери процента, сумма вклада должна быть не меньше '+number_to_str(deposits.free.frames[currency][0].from)+' '+getCurrency(currency)+'<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.free.frames[currency][0].from+'); return false;">Увеличить сумму вклада до '+number_to_str(deposits.free.frames[currency][0].from)+' '+getCurrency(currency)+'</a></li></ul>';
				}
				if (sum>deposits.free.frames[currency][2].to){
					deposit.errors = 'При возможности снятия / пополнения вклада без потери процента, сумма вклада должна быть не больше '+number_to_str(deposits.free.frames[currency][2].to)+' '+getCurrency(currency)+'<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.free.frames[currency][2].to+'); return false;">Уменьшить сумму вклада до '+number_to_str(deposits.free.frames[currency][2].to)+' '+getCurrency(currency)+'</a></li></ul>';
				}
				//ошибка суммы
			}
		}else{
			//free
			deposit.name = deposits.max.name;
			var j = 0;
			c2:
			for (var i=0; i<3; i++){
				if (sum>=deposits.max.frames[currency][i].from && sum<=deposits.max.frames[currency][i].to){
					for (j=0; j<6; j++){
						if (time>=deposits.max.frames[currency][i].days[j].from && time<=deposits.max.frames[currency][i].days[j].to){
							deposit.percent = deposits.max.frames[currency][i].days[j].percent;
						}
					}
					if (deposit.percent==0){
						error = true;
						//ошибка сроков
					}
					break c2;
				}
			}
			if (j==0){
				error = true;
				//ошибка суммы
				if (sum<deposits.max.frames[currency][0].from){
					deposit.errors = 'Сумма вклада слишком мала<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.max.frames[currency][0].from+'); return false;">Увеличить сумму вклада до '+number_to_str(deposits.max.frames[currency][0].from)+' '+getCurrency(currency)+'</a></li></ul>';
				}
				if (sum>deposits.max.frames[currency][2].to){
					deposit.errors = 'Сумма вклада слишком велика<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.max.frames[currency][2].to+'); return false;">Уменьшить сумму вклада до '+number_to_str(deposits.max.frames[currency][2].to)+' '+getCurrency(currency)+'</a></li></ul>';
				}
			}
		}
		if (error){
			deposit.error = error;
			return;
		}
		
		if (additional.capitalization){
			deposit.payment = sum;
			q = deposit.percent/12;
			for (var i=0; i<Math.floor(time/30); i++){
				deposit.payment += deposit.payment*q;
			}
		}else{
			deposit.payment = sum+sum*deposit.percent/365*time;
		}
		
		
		
		month = parseInt(time / 30);
		deposit.percent = (additional.capitalization)?(Math.pow(1+deposit.percent/12,month)-1)*100/(month/12):deposit.percent*100;
		
		if (additional.flag1)
		{
			deposit.payment += parseInt($("#calc_add").val().replace(/ /g,''))*month;
		}
	};
	return;
}*/

function getIncome(sum,currency,time,additional){
	//reset
	
	deposit.payment = 0;
	deposit.percent = 0;
	deposit.name = '';
	deposit.error = false;
	deposit.errors = '';
	rostErrors.sum = 0;
	rostErrors.currency = 0;
	rostErrors.time = 0;
	rostErrors.flags = 0;
	var q = 1;
	/*if (checkRost2012(sum,currency,time,additional)){
	//rost2012
		if (rostErrors.sum==2) showRostErrors(); //4,5kk
		
		$("#yearoption").html("370 дней");
		if ($("#yeartimestamp")){	
			$("#yeartimestamp").html("<span>370</span>&nbsp;");
		}
		/*deposit.name = deposits.rost2012.name;
		c0:
		for (var i=0; i<1; i++){
				if (sum>=deposits.rost2012.frames[currency][i].from && sum<=deposits.rost2012.frames[currency][i].to){
					deposit.percent = deposits.rost2012.frames[currency][i].days[0].percent;
					break c0;
				}
				
			}
		
		if (additional.capitalization) {
			deposit.payment = sum;
			q = deposit.percent/12;
			for (var i=0; i<12; i++) {
				deposit.payment += deposit.payment*q;
			}
			q = deposit.percent/365;
			for (var i=0; i<5; i++){
				deposit.payment += deposit.payment*q;
			}
		}else{
			deposit.payment = sum+sum*deposit.percent;
		}
		if (lead_type==3 && sum>=300000) {
		//	deposit.percent += 0.005;
			deposit.payment += sum*0.005;
		}
 		deposit.percent = additional.capitalization?(Math.pow(1+deposit.percent/12,12)-1)*100:deposit.percent*100;//(deposit.payment/sum-1)*100;

 		return;
*
	}else{*/
		//$("#yearoption").html("365 дней");
		if ($("#yeartimestamp")){	
			$("#yeartimestamp").html("<span>365</span>&nbsp;");
		}
		/*showRostErrors();
		if (time == 731 && sum>=1500000) {$("#correction_link").hide();}*/
		/*if (time<90){
			deposit.errors = 'При возможности снятия / пополнения вклада<br/> без потери процента, срок вклада должен быть не меньше 91 дня.<br/><ul><li><a href="#" class="correction_link" onclick="resetFree(); return false;">Cнять галочку «Снятия / пополнения вклада без потери процента»</a></li><li><a href="#" class="correction_link" onclick="setTime(91); return false;">Увеличить срок вклада до 91 дня</a></li></ul>';
		}
		if (time>365){
			deposit.errors = 'При возможности снятия / пополнения вклада<br/> без потери процента, срок вклада должен быть не более 1 года.<br/><ul><li><a href="#" class="correction_link" onclick="resetFree(); return false;">Cнять галочку «Снятия / пополнения вклада без потери процента»</a></li><li><a href="#" class="correction_link" onclick="setTime(365); return false;">Уменьшить срок вклада до 1 года</a></li></ul>';
		}*/
		/*if (sum<deposits.free.frames[currency][0].from){
			deposit.errors = 'При возможности снятия / пополнения вклада без потери процента, сумма вклада должна быть не меньше '+number_to_str(deposits.free.frames[currency][0].from)+' '+getCurrency(currency)+'<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.free.frames[currency][0].from+'); return false;">Увеличить сумму вклада до '+number_to_str(deposits.free.frames[currency][0].from)+' '+getCurrency(currency)+'</a></li></ul>';
		}
		if (sum>deposits.free.frames[currency][2].to){
			deposit.errors = 'При возможности снятия / пополнения вклада без потери процента, сумма вклада должна быть не больше '+number_to_str(deposits.free.frames[currency][2].to)+' '+getCurrency(currency)+'<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.free.frames[currency][2].to+'); return false;">Уменьшить сумму вклада до '+number_to_str(deposits.free.frames[currency][2].to)+' '+getCurrency(currency)+'</a></li></ul>';
		}
		if (sum<deposits.max.frames[currency][0].from){
			deposit.errors = 'Сумма вклада слишком мала<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.max.frames[currency][0].from+'); return false;">Увеличить сумму вклада до '+number_to_str(deposits.max.frames[currency][0].from)+' '+getCurrency(currency)+'</a></li></ul>';
		}
		if (sum>deposits.max.frames[currency][2].to){
			deposit.errors = 'Сумма вклада слишком велика<br/><ul><li><a href="#" class="correction_link" onclick="setSumm('+deposits.max.frames[currency][2].to+'); return false;">Уменьшить сумму вклада до '+number_to_str(deposits.max.frames[currency][2].to)+' '+getCurrency(currency)+'</a></li></ul>';
		}*/
				
		
	//};
	calculateSequenceStart();
	
	/*var month = parseInt(parseInt($("#calc_time").val()) / 30);
	
	if (additional.flag1)
	{
		deposit.payment += parseInt($("#calc_add").val().replace(/\s/g,''))*month;
	}*/
		
	return;
}

function calculateSequenceStart(){
	/*$("#error_row").hide();
	$("#results_row").show();
	$("#results_row2").show();*/
	var sum = parseInt($("#calc_summ").val().replace(/\D/g,''));
	var capitalization = $("#calc_percent_1").length && $("#calc_percent_1").is(":checked");
	var funding = $("#free_add").length && $("#free_add").is(":checked");
	var withdraw = $("#free_take").length && $("#free_take").is(":checked");
	var monthly_add = funding?parseInt($("#calc_add").val().replace(/\D/g,'')):0;
	/*deposit = */calculator_main($("#calc_currency").val(), parseInt($("#calc_time").val()), sum, capitalization, funding, monthly_add, withdraw);
	/*if (!deposit) return;
	$("#calc_tarif").html(deposit.name).data("tarif",deposit.tarifid);
	$("#calc_income").html(format_number(deposit.income));
	$("#calc_result").html(format_number(deposit.payment));
	$("#calc_percent").html(deposit.percent.toFixed(2).replace('.',',').replace(/0$/,''));*/
	return;
}

function calculator_getPercents(currency, period, sum, capitalization, funding, monthly_add, withdraw){
/*	if (multivar) {
		var pc = 0;
		switch (currency) {
			case 1: pc = sum<10000000?0.09:0.096; break;
			case 2: pc = sum<500000?0.042:0.045; break;
			case 3: pc = sum<500000?0.03:0.036; break;
		}
		var result = {percent: pc, tarif: "multivar"};
		return result;
	}*/
	var found = false;
	var result = {percent: calc_mode==3?new Array():0, tarif: ''};
	for (var runningTarif in deposits) { //iterate all tarifs
		if (!deposits[runningTarif].frames[currency]) continue;	//currency not avaliable
		if (capitalization && !deposits[runningTarif].capitalization) continue; //capitalization not availiable but required
		if (funding && !deposits[runningTarif].funding) continue; //funding not availiable but required
		if (withdraw && !deposits[runningTarif].withdraw) continue; //withdraw not availiable but required
		//if (funding && monthly_add<tarifs_info[runningTarif].min_funding) continue; //too low funding
		for (var runningSum in deposits[runningTarif].frames[currency]){ //iterate availiable sum milestones in current currency
			if (deposits[runningTarif].frames[currency][runningSum]['from'] > sum) { 
				if (found) return result;
				break;
			}
			if (sum > deposits[runningTarif].frames[currency][runningSum]['to']) continue;
			for (var runningPeriod in deposits[runningTarif].frames[currency][runningSum].days){
				/*if (calc_mode==3) {
					result.percent = tarifs_count[runningTarif][currency][runningSum];
					result.tarif = runningTarif;
					found = true;
					break;
				}*/
				if (deposits[runningTarif].frames[currency][runningSum].days[runningPeriod].from > period) {
					if (found) return result;
					break;
				}
				if (deposits[runningTarif].frames[currency][runningSum].days[runningPeriod].from <= period && deposits[runningTarif].frames[currency][runningSum].days[runningPeriod].to >= period){
					if (calc_mode==1) {
						result.tarif = runningTarif;
						result.percent = deposits[runningTarif].frames[currency][runningSum].days[runningPeriod].percent;
						found = true;
						continue;
					}
					if (calc_mode==2) {
						if (result.percent<deposits[runningTarif].frames[currency][runningSum].days[runningPeriod].percent){
							result.tarif = runningTarif;
							result.percent = deposits[runningTarif].frames[currency][runningSum].days[runningPeriod].percent;
						}
					}
				}
			}
		}
	}
	return result;
}

function calculator_main(currency, period, sum, capitalization, funding, monthly_add, withdraw){
	var result = 0;
	//calc_mode = 3; //test
	var tdata = calculator_getPercents(currency, period, sum, capitalization, funding, monthly_add, withdraw);
	var percent = tdata.percent;
	deposit.percent = percent;
	var currentTarif = tdata.tarif;
	
	if (!currentTarif) {
		//calculator_error(currency, period, sum, capitalization, funding, monthly_add, withdraw);
		deposit.error = true;
		return;
	}
	//var deposit = new Object();
	var q = 0;
	if (currentTarif == "5") period = 370;
	//var max_funding_time = tarifs_info[currentTarif].max_time_funding;
	var max_funding_time= Math.floor((period - 31)/30.41);//max_funding_time?max_funding_time+1:10000;
	var funds_count = 0;
	var monthly = true;//tarifs_info[currentTarif].monthly;
	var counts = jQuery.extend(true, {}, percent);
	var days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (calc_mode==3) {
		var first = true;
		for (var i in counts){
			if (first) {
				counts[i].from = 0;
				percent[i].from = 0;
				first = false;
			}
		}
		counts[i].to = 100000000;
	}
	if (capitalization) {
		deposit.payment = sum;
		q = percent/365;
		var month = period/30.41;
		var days = 0;
		for (var i=0; i<month; i++) {
			days += days_in_month[i%12];
			if (i>0&&i<max_funding_time) funds_count++;
			if (calc_mode==3) q = calculator_getDayPercent(counts,days);
			deposit.payment += ((i>0&&i<max_funding_time?monthly_add:0)+deposit.payment) *q*(days_in_month[i%12]) + (i>0&&i<max_funding_time?monthly_add:0);
		}
		var addpayment = deposit.payment*(q * (period-days));
		deposit.payment += addpayment;
	}else{
		if ((!funding || (funding && !monthly)) && calc_mode!=3) {
			month = parseInt(period / 30.41);
			month = month<1?1:(month>max_funding_time?max_funding_time:month);
			deposit.payment = sum+(monthly_add*(month-1))+(sum+(monthly_add*(month-1)))*percent/365*period;
		}else{
			var dep = sum;
			deposit.payment = 0;
			q = percent/365;
			var month = period/30.41;
			var days = 0;
			for (var i=0; i<month-1; i++) {
				days += days_in_month[i%12];
				if (calc_mode==3) q = calculator_getDayPercent(counts,days);
				dep += i>0&&i<max_funding_time?monthly_add:0;
				if (i>0&&i<max_funding_time) funds_count++;
				deposit.payment += (dep) * q * days_in_month[i%12];
			}
			var addpayment = dep*(q * (period-days));
			deposit.payment += addpayment + dep;
		}
	}
	/*month = parseInt(period / 30);
	deposit.percent = (period>=365&&capitalization)?((deposit.payment/(sum+monthly_add*(month-2))-1)*100)/(month/12):percent*100;*/
	month = Math.round(period / 30.41);//((deposit.payment/(sum+monthly_add*(month-2))-1)*100)/(month/12)
	
	if (calc_mode==3) {
		if ((period>=365)&&capitalization) {
			//fundings = month<1?1:(month>max_funding_time?max_funding_time:month);
			deposit.percent = -(1 - deposit.payment / (sum+monthly_add*(funds_count)))*100;
		}else{
			deposit.percent = 0;
			if (period< 365) {
				deposit.percent = percent["1"].percent;
			}else{
			for (var z in percent){
				if (percent[z].from > period) break;				
				deposit.percent += percent[z].percent * (percent[z].to - percent[z].from)/period;
			}
			}
			deposit.percent = deposit.percent*100;
		}
	}else{
		deposit.percent = (/*(period>=365)&&*/capitalization)?(Math.pow(1+percent/12,month)-1)*100/(month/12):percent*100;
	}
	deposit.name = deposits[currentTarif].name;
	deposit.tarifid = currentTarif;
	//month = month>max_funding_time?max_funding_time:month;
	deposit.income = deposit.payment - sum - monthly_add*(funds_count);
	//if (allowCalcEvent) fireCalcEvent();
	return;
}

function number_to_str(number) {
	var result1 = 0;
	var i1 = 0;
	var i2 = 0;
	var result1str = '';
	var result1fin = '';
	var i = 0;
	var str = '';
	result1 = Math.round(number);
	result1str = result1 + '';
	i1 = result1str.length % 3;
	i2 = result1str.length - i1;
	if (i1 > 0)	result1fin = result1str.substring(0,i1);
	i = i1;
	while(i < result1str.length)
		{
			result1fin = result1fin + ' ' + result1str.substring(i,i+3);
			i = i + 3;
		}
	if (result1fin.substring(0,1) == ' ') result1fin = result1fin.substring(1,result1fin.length);
	str = result1fin;
	return str;
}

function print_city(city){
	var w = window.open('','Результаты');  
	var d = w.document;
	wdata = 'calc='+(!deposit.error?1:0)+'&city='+city+'&promocode='+$("#promocode").html()+'&sum='+$("#calc_summ").val()+
		'&currency='+parseInt($("#calc_currency").val())+'&time='+$("#calc_time option:selected").html()+
		'&cap='+($("#calc_percent_1").is(":checked")?1:0)+'&flag1='+($("#free_add").is(":checked")?1:0)+
		'&flag2='+($("#free_take").is(":checked")?1:0)+'&result='+$("#calc_result").html()+
		'&income='+$("#deposit_income").html()+'&percent='+$("#effective_stake").html()+
		'&name='+$("#deposit_name").html()+($('#'+city+'-info .phones strong').html()=='Скоро открытие!'?'&closed=1':'');

	wdata += '&kedr=1&phone='+$('#'+city+'-info .phones span').html()+'&address='+$('#'+city+'-info .address').text()
		+'&sched='+$('#'+city+'-info .timetable').html().replace(/&nbsp;/g,' ')+'&oname='+$('#'+city+'-link-span').text();
	
	var html = $.ajax({
		type: 'POST',
		url: 'ajax/newlead_print',
		data: wdata,//+(isKazan?'&kazan=rost':''),
		async: false
	}).responseText;
	html = eval('(' + html + ')');
	d.open();
	d.write(html.head);
	window.setTimeout(function () {d.write(html.html);d.close();},300);
	return false;
}

$(document).ready(function() {

	$("#free_add").click(function() {
		$(".newl").toggle(this.checked);
	});

	deposits.max = new Object();
	deposits.max.name = '«Cберегательный»';
	deposits.max.capitalization = true;
	deposits.max.funding = false;
	deposits.max.withdraw = false;
	deposits.max.frames = new Array();
	deposits.max.frames[0] = {//rubles
	  0 : {
		'from' : 3000,
		'to' : 99999999,
		'days': {
		  0 : {
			'from' : 65,
			'to' : 94,
			'percent' : stakes.max.rub[0][0]
		  },
		  1 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.max.rub[0][1]
		  },
		  2 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.max.rub[0][2]
		  },
		  3 : {
			'from' : 367,
			'to' : 544,
			'percent' : stakes.max.rub[0][3]
		  },
		  4 : {
			'from' : 545,
			'to' : 729,
			'percent' : stakes.max.rub[0][4]
		  },
		  5 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.max.rub[0][5]
		  }
		}
	  }
	};
	deposits.max.frames[1] = {//dollars
	  0 : {
		'from' : 100,
		'to' : 99999999,
		'days': {
		  0 : {
			'from' : 65,
			'to' : 94,
			'percent' : stakes.max.dol[0][0]
		  },
		  1 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.max.dol[0][1]
		  },
		  2 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.max.dol[0][2]
		  },
		  3 : {
			'from' : 367,
			'to' : 544,
			'percent' : stakes.max.dol[0][3]
		  },
		  4 : {
			'from' : 545,
			'to' : 729,
			'percent' : stakes.max.dol[0][4]
		  },
		  5 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.max.dol[0][5]
		  }
		}
	  }
	};
	deposits.max.frames[2] = {//euros
	  0 : {
		'from' : 100,
		'to' : 99999999,
		'days': {
		  0 : {
			'from' : 65,
			'to' : 94,
			'percent' : stakes.max.eur[0][0]
		  },
		  1 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.max.eur[0][1]
		  },
		  2 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.max.eur[0][2]
		  },
		  3 : {
			'from' : 367,
			'to' : 544,
			'percent' : stakes.max.eur[0][3]
		  },
		  4 : {
			'from' : 545,
			'to' : 729,
			'percent' : stakes.max.eur[0][4]
		  },
		  5 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.max.eur[0][5]
		  }
		}
	  }
	};
	deposits.free = new Object();
	deposits.free.name = '«Универсальный»';
	deposits.free.capitalization = false;
	deposits.free.funding = true;
	deposits.free.withdraw = true;
	deposits.free.frames = new Array();
	deposits.free.frames[0] = {
	  0 : {
		'from' : 50000,
		'to' : 99999,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.rub[0][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.rub[0][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.rub[0][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.rub[0][3]
		  }
		}
	  },
	  1 : {
		'from' : 100000,
		'to' : 499999,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.rub[1][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.rub[1][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.rub[1][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.rub[1][3]
		  }
		}
	  },
	  2 : {
		'from' : 500000,
		'to' : 300000000,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.rub[2][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.rub[2][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.rub[2][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.rub[2][3]
		  }
		}
	  }
	};
	deposits.free.frames[1] = {
	  0 : {
		'from' : 100,
		'to' : 4999,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.dol[0][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.dol[0][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.dol[0][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.dol[0][3]
		  }
		}
	  },
	  1 : {
		'from' : 5000,
		'to' : 19999,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.dol[1][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.dol[1][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.dol[1][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.dol[1][3]
		  }
		}
	  },
	  2 : {
		'from' : 20000,
		'to' : 300000000,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.dol[2][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.dol[2][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.dol[2][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.dol[2][3]
		  }
		}
	  }
	};
	deposits.free.frames[2] = {
	  0 : {
		'from' : 100,
		'to' : 4999,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.eur[0][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.eur[0][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.eur[0][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.eur[0][3]
		  }
		}
	  },
	  1 : {
		'from' : 5000,
		'to' : 19999,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.eur[1][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.eur[1][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.eur[1][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.eur[1][3]
		  }
		}
	  },
	  2 : {
		'from' : 20000,
		'to' : 300000000,
		'days': {
		  0 : {
			'from' : 95,
			'to' : 184,
			'percent' : stakes.free.eur[2][0]
		  },
		  1 : {
			'from' : 185,
			'to' : 366,
			'percent' : stakes.free.eur[2][1]
		  },
		  2 : {
			'from' : 367,
			'to' : 729,
			'percent' : stakes.free.eur[2][2]
		  },
		  3 : {
			'from' : 730,
			'to' : 730,
			'percent' : stakes.free.eur[2][3]
		  }
		}
	  }
	};
	deposits.rost2012 = new Object();
	deposits.rost2012.name = '«Накопительный»';
	deposits.rost2012.capitalization = true;
	deposits.rost2012.funding = true;
	deposits.rost2012.withdraw = false;
	deposits.rost2012.frames = new Array();
	deposits.rost2012.frames[0] = {
		0 : {
		'from' : 3000,
		'to' : 300000000,
		'days': {
			  0 : {
				'from' : 730,
				'to' : 730,
				'percent' : stakes.rost.rub[0]
			  }
			}
		}
	};
	
	deposits.rost2012.frames[1] = {
		0 : {
		'from' : 100,
		'to' : 300000000,
		'days': {
			  0 : {
				'from' : 730,
				'to' : 730,
				'percent' : stakes.rost.dol[0]
			  }
			}
		}
	};
	
	deposits.rost2012.frames[2] = {
		0 : {
		'from' : 100,
		'to' : 300000000,
		'days': {
			  0 : {
				'from' : 730,
				'to' : 730,
				'percent' : stakes.rost.eur[0]
			  }
			}
		}
	};



	//block_render_request(198,'#city_info_dummy');
	block_render_request(210,'#dep_info');
	
	
	$("#sms_popup .popup_message").html('<h3>Спасибо!</h3><p>Адрес офиса успешно отправлен.</p>');
	$("#email_popup .popup_message").html('<h3>Спасибо!</h3><p>Письмо с промо-кодом отправлено.</p>');
	$("#fbform_sent").prepend('<h3>Спасибо!</h3><p>Наш специалист свяжется с Вами в указанное время.</p>');
	//if (document.location.pathname=='/deposition/lead3'){
		var list = '';
		var list2 = '';
		var check = $("#contacts_wrap .right_col .overwrap");
		if (check.length > 1){
			var item = '';
			check.each(function (i,e){
				item = ($(e).find(".map-link3 a").attr("onclick")).replace(/print_city\('(.*)'\); return false;/,'$1');
				list += '<li><input class="choose_office" type="radio" name="cof" id="of_'+item+'" value="'+item
				+'"><label for="of_'+item+'">'+$(e).find(".office-title").find("span").html()+'</label></li>';
				list2 += '<li><input class="choose_office" type="radio" name="cof2" id="of2_'+item+'" value="'+item
				+'"><label for="of2_'+item+'">'+$(e).find(".office-title").find("span").html()+'</label></li>';
			});
			$("#choose_office ul").html(list);
			if (lead_type == 3) {
				$("#sms_popup .popup_content").prepend('<div class="choose_sms_office">'+
					'<h3>Выберите ближайший к Вам офис</h3>'+
					'<ul id="sms_choose_office">'+
						list2+
					'</ul>'+
				'</div>');
			}
		}else{
			check.addClass("active");
			check.find(".office-title").addClass("act");
			$("#choose_office").remove();
		}
		if ($(".overwrap").length==1){
			$(".overwrap").css("border","none");
			$(".office-info").show();
		}
	//}
	// $("#fb_phone, #sms_number").val(Drupal.settings.phonehint);
	if (document.location.search.indexOf('deposition=max')+1){
		$("#cv_1").addClass("active");
		$("#cv_0").removeClass("active");
		$("#calc_summ").val('10 000');
		$("#calc_currency").val(1);
	}

	$("#fl10").click(function () {
		$("#fl10-info").slideToggle();
	});
	$("#fb_email").val('');
	$("#free_take").click(function (){
		if ($(this).is(":checked")){
			$("#free_add").attr("checked","checked");
			$(".newl").show();
			$("#re_flag1").show();
			rostErrors.flags = 3;
		}
	});
	if ($("body").hasClass("ver2")){
		var cv_stop = false;
		$(".cv").click(function () {
			var obj = this;
			$(".cv").removeClass("active");
			$(obj).addClass("active");
			$("#currency_add").html($(this).find(".cv_underline").html().toLowerCase());
			//cv_stop = true;
			$("#calc_currency").val(($(obj).attr("id")).replace(/cv_/,''));
			//cv_stop = false;
			useCalc();
		});
		
	}
	


	if (location.hash.indexOf('investAmount=') + 1){
		href_pars = location.hash;
		pos_investAmount = (href_pars).indexOf('investAmount');
		pos_investCurrency = (href_pars).indexOf('investCurrency');
		pos_investPeriod = (href_pars).indexOf('investPeriod');
		pos_userScroll = (href_pars).indexOf('userScroll');
		val_investAmount = (href_pars).substring(14, pos_investCurrency - 1);
		val_investCurrency = (href_pars).substring(pos_investCurrency + 15, pos_investPeriod - 1);
		if (pos_userScroll>-1){
			val_investPeriod = (href_pars).substring(pos_investPeriod + 13,pos_userScroll - 1);
		}else{
			val_investPeriod = (href_pars).substring(pos_investPeriod + 13);
		}
		$('#calc_summ').val(number_to_str(val_investAmount));
		$('#calc_currency').val(parseInt(val_investCurrency));
		$("#cv_0").removeClass("active");
		$("#cv_"+val_investCurrency).addClass("active");
		/*if (val_investCurrency == 'usd') $('#calc_currency').val(1);
		else if (val_investCurrency == 'rub') $('#calc_currency').val(0);
		else if (val_investCurrency == 'eur') $('#calc_currency').val(2);*/
		$("#calc_time").val(val_investPeriod);
		// if (pos_userScroll > 0) {
		// 	$('html:not(:animated)'+(! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#calc_wrap').position().top-100}, 500);
		// }
	}
	$('#print_also1').click(function() {
		fireGRM_map();
		// _gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_Print_Results']);
		if (window.yaCounter4395838) yaCounter4395838.reachGoal('View_Map');
		return true;
	});
	
	
	
	// $('#link1, #view_deps').click(function () {
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#info_content').position().top-310}, 500);
	// 	$("#tab1").click();
	// 	return false;
	// });
	// $('#link2, .calc-link').click(function () {
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#calc_wrap').position().top-100}, 500);
	// 	return false;
	// });
	// $('#link3, #event_info_link span').click(function () {
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#info_content').position().top-310}, 500);
	// 	$("#tab3").click();
	// 	return false;
	// });
	// $('#link4').click(function () {
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#bank_info').position().top-110}, 500);
	// 	return false;
	// });
	// $('#link5, #view_contacts, .location-link').click(function () {
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#contacts_wrap').position().top-80}, 500);
	// 	_gaq.push(['_trackEvent', 'Action', 'Click', 'Deposit_Contacts']);
	// 	if (window.yaCounter4395838) yaCounter4395838.reachGoal('services/calculate/contacts'); return false;
	// });
	// $('#ask_quest').click(function (){
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#feedback_form').position().top-100}, 500);
	// 	return false;
	// });
	// $('#visit_btn').click(function (){
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#contacts_wrap').position().top-100}, 500);
	// 	_gaq.push(['_trackEvent', 'Action', 'Click', 'Deposit_View_Map_Button']);
	// 	return false;
	// });
	// $('#promolink1').click(function (){
	// 	$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('#calc_unsurance_logo').position().top+40}, 500);
	// 	return false;
	// });
	/* Modals */
	$("#info_tabs .itab").click(function(){
		$("#info_tabs .itab,#info_content .icont").removeClass("active");
		var id = ($(this).attr("id")).charAt(3);
		$(this).addClass("active");
		$("#info"+id).addClass("active");
	});

	$(".sms_send_link").click(function (){
		sms_addr = '';
		$("#sms_popup").addClass('type3');
		ShowModal("sms_popup");
		$("#sms_number").focus();
		fireGRM_promo();
		// _gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_lead_Msk_Promo_SMS_Link']);
		return false;
	});
	$(".email_send_link").click(function (){
		ShowModal("email_popup");
		fireGRM_promo();
		$("#email_val").focus();
		// _gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_lead_Msk_Promo_Email_Link']);
		return false;
	});

	$("#correction_link").click(function (){
		ShowModal("gain");
		return false;
	});
	// $("#deposit_name").live("click", function (){
	$("#deposit_name").click(function (){
		var id = $(this).attr("class");
		// $("#"+id).click();
		var tab = (parseInt(id.slice(-1)) - 1);
		toggleDepositPopup(""+ tab);
	});
	// $(".dep_info_link").live("click", function (){
	$(".dep_info_link").click(function (){
		ShowModal("dep_info");
		$(".m3_tabs").removeClass("active");
		$(".dep_info_tab").removeClass("active");
		$("#dep_info #t"+$(this).attr("id")).addClass("active");
		$("#dep_info #t"+$(this).attr("id")+"_info").addClass("active");
	});
	
	$("#compare").click(function (){
		ShowModal("dep_info");
		return false;
	});

	// $(".m3_tabs").live("click", function () {
	// 	$(".m3_tabs").removeClass("active");
	// 	$(".dep_info_tab").removeClass("active");
	// 	$(this).addClass("active");
 //     	$("#dep_info #"+$(this).attr("id")+"_info").addClass("active");
	// });

	// $(".photo_link").click(function (){
	// 	ShowModal("photo");
	// 	fireGRM_promo();
	// 	_gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_lead_Msk_Promo_Photo_Link']);
	// 	return false;
	// });
	
	// $(".print_promo_link").click(function () {
	// 	fireGRM_promo();
	// 	_gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_lead_Msk_Promo_Print_Link']);
	// 	return false;
	// });

	// $("#overlay").click(function (){
	// 	HideModal('all');
	// });

	// $(".variants .normalvar").live("click", function (){
	// 	$(".dep_info_tab.active table.normal").show();
	// 	$(".dep_info_tab.active table.short").hide();
	// 	$(".dep_info_tab.active .variants .var").removeClass("active");
	// 	$(this).addClass("active");
	// });

	// $(".variants .shortvar").live("click", function (){
	// 	$(".dep_info_tab.active table.normal").hide();
	// 	$(".dep_info_tab.active table.short").show();
	// 	$(".dep_info_tab.active .variants .var").removeClass("active");
	// 	$(this).addClass("active");
	// });

	// $(".close_btn").live("click", function () {
	// 	HideModal($(this).parent().attr("id"));
	// });

	$("#stake_info").hover(function () {$("#calc_hint").fadeIn();}, function () {$("#calc_hint").fadeOut();});

	// $(".dep_close").live("click", function(){HideModal("dep_info");});
	$("#decline_gain").click(function() {HideModal("gain");});
	/* Calc */
	$("#calc_summ,#calc_currency,#calc_time,input[name='calc_percent'],#free_add,#free_take").change(function(){
		useCalc();
	});
	
	$("#calc_summ, #calc_add").keyup(function (e){
		var key = e.which || e.keyCode;
		if (key==37 || key==39) {return true;}
		var pos = doGetCaretPosition(this);
		
		var val = $(this).val();
		var min = val.match(/\s/g);
		if (min){
			pos = pos-min.length;
		}
		val = val.replace(/[^0-9]/g,'');
		//if (val != ""){
			val = number_to_str(val);
		//}
		$(this).val(val);
		var min = val.match(/\s/g);
		if (min){
			pos = pos+min.length;
		}
		setCaretPosition(this,pos);
		
		useCalc();
	}).blur(function () {if($(this).val()=="")$(this).val(0); useCalc();});

	/* sms */
	$("#sms_send").click(function (){
		$("#sms_send").attr("disabled","disabled");
		$("#sms_send").html('<img src="/sites/all/modules/newlead/images/preloader.png"/>');
		if ($('#sms_number').val() == '(495) 123 45 67'){
			$('#sms_number').val('');
		}
		$("#sms_popup").find(".popup_error").html();
		
		if ($("#sms_choose_office").is(":visible") && !$("#sms_choose_office input:checked").length) {
			$("#sms_popup").find(".popup_error").html('Укажите офис');
			$("#sms_send").removeAttr("disabled");
			$("#sms_send").html('<span>Отправить SMS</span>');
			return false;
		}
		
		var num = '';
		if (num = checkPhone($("#sms_number").val())){
			if (!sms_addr && $("#sms_choose_office").is(":visible")) {
				sms_addr = ($('#' + $("#sms_choose_office input:checked").val() + '-info').find('.address').html()).replace(/[<brBR>]/gi,'');
			}
			var sms_text = '«РОСТ БАНК»: '+sms_addr+ ' Тел.: 8 800 250-88-88';
			if (lead_type==3) {sms_text += '. Промо-код: '+Drupal.settings.promocode;}
			var res = sms_send_send('7'+num, sms_text);
			if (res.status==0) {
				$("#sms_popup").find(".popup_content").hide();
				$("#sms_popup").find(".popup_message").show();
				setTimeout('HideModal("sms_popup")',3000);
				// _gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_'+Drupal.settings.domain+'_Promo_SMS_Send']);
				if (window.yaCounter4395838) yaCounter4395838.reachGoal('View_Map');
				$("#sms_send").removeAttr("disabled");
				$("#sms_send").html('<span>Отправить SMS</span>');
			}
			else {$("#sms_popup").find(".popup_error").html(res.data);}
			return true;
		}else{
			$("#sms_popup").find(".popup_error").html('Номер телефона должен состоять из 10 цифр и включать код оператора');
		}
		$("#sms_send").removeAttr("disabled");
		$("#sms_send").html('<span>Отправить SMS</span>');
	});
	// $("#email_send").click(function (){
	// 	$("#email_send").attr("disabled","disabled");
	// 	$("#email_send").html('<img src="/sites/all/modules/newlead/images/preloader.png"/>');
	// 	$("#email_popup").find(".popup_error").html();
	// 	_gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_lead_'+Drupal.settings.domain+'_Promo_Email_Send']);
	// 	if (checkEmail($("#email_val").val())){
	// 		//_gaq.push(['_trackEvent', 'Action', 'View_Map', 'Deposit_lead_Msk_Promo_SMS_Link']);
	// 		var res = email_send($("#email_val").val(),'Спасибо за Ваш интерес!<br/>Ваш промо-код: '+Drupal.settings.promocode+'<br/><br/>Будем рады видеть Вас в нашем офисе!<br/><a href="http://depo.rostbank.ru'+document.location.pathname+'">Наши офисы в Москве и области</a><br/>ОАО «РОСТ БАНК», 1994-2014. Генеральная лицензия ЦБ РФ №2888', 'Ваш промо-код');
	// 		if (res.status==0) {$("#email_popup").find(".popup_content").hide();
	// 		$("#email_popup").find(".popup_message").show();
	// 		setTimeout('HideModal("email_popup")',3000);}
	// 		else {$("#email_popup").find(".popup_error").html(res.data);}
	// 	}else{
	// 		$("#email_popup").find(".popup_error").html('Введен неправильный адрес e-mail');
	// 	}
	// 	$("#email_send").removeAttr("disabled");
	// 	$("#email_send").html('<span>Отправить</span>');
	// });
/*
	$("#accept_gain").click(function(){
		blockCalc = true;
		
		if (rostErrors.currency == 1) {$("#calc_currency").val(0);}
		if (rostErrors.sum == 1) {$("#calc_summ").val("50 000");}
		if (rostErrors.sum == 2) {$("#calc_summ").val("4 500 000");}
		if (rostErrors.sum == 3) {$("#calc_summ").val($("#dol_sum").html());}
		if (rostErrors.sum == -1) {$("#calc_summ").val("30 000 000");}
		if (rostErrors.time == 1) {$("#calc_time").val(365);}
		if (rostErrors.time == 2) {$("#calc_time").val(731);}
		if (rostErrors.flags == 1 || rostErrors.flags == 3) {$("#free_add").removeAttr("checked");}
		if (rostErrors.flags == 2 || rostErrors.flags == 3) {$("#free_take").removeAttr("checked");}
		HideModal("gain");

		blockCalc = false;
		if ($("body").hasClass("ver2")){
			$(".cv").removeClass("active");
			$("#cv_0").addClass("active");
		}
		useCalc();
	});*/
	useCalc();
	$('#fb_submit').click(function(){
		$("#fb_submit").attr("disabled","disabled");
		
		if ($('#fb_phone').val() == Drupal.settings.phonehint){
			$('#fb_phone').val('');
		}
		var num = '';
		var oldnum = $('#fb_phone').val();
		if (!(num = checkPhone($('#fb_phone').val()))) {
			$('#fbform .error').html('Телефон должен содержать код города / оператора.');
			$("#fb_submit").removeAttr("disabled");
		}else{
			$("#fb_submit").html('<img src="/sites/all/modules/newlead/images/preloader.png"/>');
			$('#fb_phone').val(num);
			$('#fbform').ajaxSubmit(function() {
				$('#fb_phone').css('border-color','#ccc');
				$('#fb_sent_name').html($("#fb_name").val());
				$('#fb_sent_phone').html('+7 '+oldnum);
				$('#fb_phone').val(oldnum);
				if ($('#fb_ctime1').is(':checked')){
					$("#fb_sent_time").html('сейчас');
				}else{
					$("#fb_sent_time").html($('#fb_cdayf').val() + ' в ' + $('#fb_ctimef').val());
				}
				$('#fb_sent_q').html($('#fb_question').val());
				$('#fb_submit').attr("disabled","disabled").hide();
				$('#fbform').hide();
				$('#fbform_sent').show();
			});		
			// _gaq.push(['_trackEvent', 'Action', 'FormSend_Ask', 'Deposit_Ask']);
			if (window.yaCounter4395838) yaCounter4395838.reachGoal('deposition_sendask'); return true;
		}
		
		
	});
	
	// $(".cut_text").live('click', function () {
	// 	$(this).next('.undercut').slideToggle();
	// 	return false;
	// });
	
	$("#reset_fb_form").click(function () {
		$('#fbform').show();
		$('#fbform_sent').hide();
		$("#fb_question").val('Ваш вопрос');
		$('#fb_submit').removeAttr("disabled").show();
		$("#fb_submit").html('Отправить');
	});
	$('#fb_submit').removeAttr("disabled");
	
	$('#fb_phone').keyup(function(e) {
		var key = e.which || e.keyCode;
		if (key==37 || key==39) {return true;}
		var askphone = $(this).val();
		var newaskphone = '';
		var pos = doGetCaretPosition(this);
		
		askphone = askphone.replace(/[^0-9 ()-]/g,'');
		
		var askphone_l = askphone.length;
		var nc = 0;
		newaskphone = askphone;
		for (var i=0; i<askphone_l; i++) {
			if (/[0-9]/.test(askphone.charAt(i))){
				nc++;
			}
			if (nc>10){
				newaskphone = newaskphone.replace(new RegExp(askphone.charAt(i)+'$'),'');
			}
		}	
		if (checkPhone(newaskphone)){
			$("#fb_phone_ok").html('Введено верно');
			$("#fbform .error").html('');
		}else{
			$("#fb_phone_ok").html('');
			//Телефон должен содержать код города / оператора.
		}
		$(this).val(newaskphone);
		setCaretPosition(this, pos);
	});
	$('#sms_number').keyup(function(e) {
		var key = e.which || e.keyCode;
		if (key==37 || key==39) {return true;}
		var pos = doGetCaretPosition(this);
		var askphone = $(this).val();
		var newaskphone = '';
		askphone = askphone.replace(/[^0-9 ()-]/g,'');
		var askphone_l = askphone.length;
		var nc = 0;
		newaskphone = askphone;
		for (var i=0; i<askphone_l; i++) {
			if (/[0-9]/.test(askphone.charAt(i))){
				nc++;
			}
			if (nc>10){
				newaskphone = newaskphone.replace(new RegExp(askphone.charAt(i)+'$'),'');
			}
		}	
		if (checkPhone(newaskphone)){
			$("#sms_popup .popup_error").addClass('ok').html('Введено верно');
		}else{
			$("#sms_popup .popup_error").removeClass('ok');//Номер телефона должен состоять из 10 цифр и включать код оператора
			if ($("#sms_popup .popup_error").html()=='Введено верно'){$("#sms_popup .popup_error").html('');}
		}
		$(this).val(newaskphone);
		setCaretPosition(this, pos);
	});
	
	$("#sms_number").keyup(function (event) {
		if (event.keyCode == 13){
			$("#sms_send").click();
		}
	});
	
	$("#fb_name,#fb_phone,#fb_cdayf").keyup(function (event) {
		if (event.keyCode == 13){
			$("#fb_submit").click();
		}
	});
	/*
	$("#email_val").keyup(function (event) {
		if (event.keyCode == 13){
			$("#email_send").click();
		}
		if (checkEmail($(this).val())){
			$("#email_popup .popup_error").addClass('ok').html('Введено верно');
		}else{
			$("#email_popup .popup_error").removeClass('ok');
			if ($("#email_popup .popup_error").html()=='Введено верно'){$("#email_popup .popup_error").html('');}
		}
	});
	*/
	$("#print_also1,.print_promo_link").click(function () {
		if ($("#choose_office").length==1) {
			ShowModal("choose_office");
			$("#choose_office").css({top: $(this).offset().top - $(window).height()/2 + "px"});
		} else {
			var item = ($(".overwrap").find(".map-link3 a").attr("onclick")).replace(/print_city\('(.*)'\); return false;/,'$1');
			print_city(item);
		}
		return false;
	});
	$('#sms_number,#fb_phone').focus(function () {//
		if ($(this).val() == Drupal.settings.phonehint || $(this).val()==''){
			$(this).css("color","#000000");
			$(this).val('');
			return;
		}
	});
	$('#sms_number,#fb_phone').blur(function () {//#sms_number, 
		if ($(this).val() == '') {
			$(this).css("color","#cccccc");
			$(this).val(Drupal.settings.phonehint);
			return;
		}
	});
	// var pos1 = $('#footer').position().top;
	// var pos2 = $('#info_content').position().top-310;
	// var pos3 = $('#contacts_wrap').position().top-80;
	// var pos4 = $('#bank_info').position().top-110;
	$(window).scroll(function () {
		var html;
		// if ($.browser.safari) {
		// 	html = document.body;
 	// 	} else {
			html = document.documentElement;
		// }
		var bodyheight = $('body').height();
		var windowheight = $(window).height();
		// if ($.browser.opera) windowheight = html.clientHeight;
		var scrollheight = html.scrollTop;

		if (scrollheight < 100){$(".hmenu span").removeClass("active");}
		else
		if (scrollheight < pos2){$(".hmenu span").removeClass("active"); $("#link2").addClass("active");}
		else
		if (scrollheight < pos3){
			$(".hmenu span").removeClass("active"); 
			if ($("#tab1").hasClass("active")){$("#link1").addClass("active");}
			if ($("#tab3").hasClass("active")){$("#link3").addClass("active");}
		}
		else
		if (scrollheight < pos4){$(".hmenu span").removeClass("active"); $("#link5").addClass("active");}
		else
		if (scrollheight < pos1){$(".hmenu span").removeClass("active"); $("#link4").addClass("active");}
		
		if ((bodyheight - windowheight - scrollheight < 300)&&(ScrollCounter == 0)) {
			ScrollCounter = ScrollCounter + 1;
			// _gaq.push(['_trackEvent', 'Action', 'ScrollPage', 'Deposit_ScrollPage']);
			if (window.yaCounter4395838) yaCounter4395838.reachGoal('/scrollpage'); return true;
		}
    });

	/*$('.city-name-zel span').click(function() {
		openmap('msk-zel');
		$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('.block-cof').position().top-80}, 500);
	});
	$('.city-name-sval span').click(function() {
		openmap('msk-sval');
		$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('.block-cof').position().top-80}, 500);
	});
	$('.city-name-odintsovo span').click(function() {
		openmap('msk-odintsovo');
		$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('.block-cof').position().top-80}, 500);
	});*/
	/*$('.logo-small').click(function() {
		openmap($(this).attr('id'));
	});*/
	


		time();
		$(window).bind('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error', function() {
			activity();
		});


	generateTimeVars(0,24,30);

	$("#fb_cdayf").datepicker({
			showOn: "button",
			buttonImage: 'images/calendar.png',
			buttonImageOnly: true,
			dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'] ,
			dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] ,
			dayNamesShort: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
			firstDay: 1,
			monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'] ,
			monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
			nextText: 'Позднее',
			prevText: 'Ранее',
			selectOtherMonths: true,
			showOtherMonths: true,
			dateFormat: 'dd.mm.yy',
			changeMonth: true,
			changeYear: true,
			minDate: new Date(),
			yearRange: '2012:2014'
		}).click(function(){$("#fb_cdayf").datepicker('show');});
		var d = new Date();
		var month = 1+d.getMonth();
	$("#fb_cdayf").val(((String(d.getDate()).length == 1) ? "0" + d.getDate() : d.getDate()) + "." + ((String(month).length == 1) ? "0" + month : month) + "." + d.getFullYear());
	$("#fb_ctimef").val('10:00');
	$("#fb_cdayf").change(function(){$("#fb_ctime2").click();});
	$("#fb_ctimef").change(function(){$("#fb_ctime2").click();});
	var calcclick = true;
	$("#calc_summ").click(function () {
		if (calcclick) {
			$("#calc_summ").val("");
			calcclick = false;
		}
	});
	$("#fb_question").focus(function () {
		if ($(this).val()=='Ваш вопрос'){
			$(this).val('');
		}
	});
	$("#fb_question").blur(function () {
		if ($(this).val()==''){
			$(this).val('Ваш вопрос');
		}
	});
	// if ($.browser.mozilla) {$("#calc_currency").css("top","-5px");}
	
	if (document.location.search.indexOf('utm_keyword=usd')+1){
		$(".title_text > p").text('До 4,59% с капитализацией. Вклады застрахованы государством');
		$("#cv_1").click();
		$("#calc_summ").val('10 000');
		useCalc();
	}
	
	switch (document.location.hash) {
		case '#1':
		case '#calc': $('html,body').scrollTop($('#calc_wrap').position().top-80); break;
		case '#2':
		case '#stavki':
		case '#terms': $('html,body').scrollTop($('#infoblocks').position().top-100); break;
		case '#3':
		case '#contacts': $('html,body').scrollTop($('#contacts_wrap').position().top-80); break;
		case '#4':
		case '#safety': {
			$("#tab2").click();
			$('html,body').animate({scrollTop: $('#tab2').position().top+80}, 500);
		}
		case '#5':
		case '#about_bank': $('html,body').scrollTop($('#bank_info').position().top-80); break;
	}
	
	calcused = false;
	calcallow = true;
	setTimeout("updatePromo()",1000);
	//if ($("#social_icons").length) setTimeout("addSocial()",2000);
	$('body').keyup(function (event){
		if (event.keyCode == 27) {
			HideModal('all');
		}
	});
	$("#close_photo").click(function () {
		HideModal("photo");
	});
	
	$(".splash").click(function () {
		$('html:not(:animated)'+( ! $.browser.opera ? ',body:not(:animated)' : '')).animate({scrollTop: $('.promo_cod_block').position().top+120}, 500);
		return false;
	});
	
});
function addSocial(){
FB.Event.subscribe('edge.create', function(targetUrl) {
	// _gaq.push(['_trackSocial', 'facebook', 'subscribe', targetUrl]);
	});
	FB.Event.subscribe('edge.remove', function(targetUrl) {
	// _gaq.push(['_trackSocial', 'facebook', 'unsubscribe', targetUrl]);
	});
	twttr.events.bind('tweet', function(event) {
	if (event) {
		var targetUrl;
		if	 (event.target && event.target.nodeName == 'IFRAME') {
		targetUrl = extractParamFromUri(event.target.src, 'url');
		}
		// _gaq.push(['_trackSocial', 'twitter', 'tweet', targetUrl]);
	}
	});
	function track_gplusone(obj){
		// _gaq.push(['_trackSocial', 'googleplus', 'plusone', obj.state]);
	}
	VK.Observer.subscribe('widgets.like.liked', function(targetUrl){
		// _gaq.push(['_trackSocial', 'vkontakte', 'subscribe', targetUrl]);
	});
	VK.Observer.unsubscribe('widgets.like.unliked', function(targetUrl){
		// _gaq.push(['_trackSocial', 'vkontakte', 'unsubscribe', targetUrl]);
	});
}
function generateTimeVars(min, max, interval){
	var res = new String();
	var i,v,h,m;
	for (i = min; i<max; i++){
	    if (i<10) h = "0"+i.toString(); else h = i.toString();
		for (v = 0; v<60; v += interval){
			if (v<10) m = "0"+v.toString(); else m = v.toString();
			res += "<option val='"+h+":"+m+"'>"+h+":"+m+"</option>";
		}
	}
	$("#fb_ctimef").html(res);
}

function ShowModal(id){
	$("#overlay").show();
	$("#"+id).show();
	$("#"+id).find(".popup_content").show();
	$("#"+id).find(".popup_message").hide();
	if (id == 'dep_info'){
		$("#dep_info").css("top",$(window).scrollTop()+$(window).height()*0.15+'px');
	}
}

function HideModal(id){
	if (id=='all'){
		$("#hidden_modal").children().hide();
	}
	$("#"+id).hide();
	$("#sms_popup").removeClass('type3');
	if (!$("#sms_popup").is(":visible") && !$("#gain").is(":visible")
	 && !$("#dep_info").is(":visible") && !$("#email_popup").is(":visible")
	 && !$("#photo").is(":visible") && !$("#choose_office").is(":visible"))
	$("#overlay").hide();
}

function useCalc(){
	if (blockCalc) return;
	$("#correction_link").hide();
	var sum = parseInt(($("#calc_summ").val()).replace(/ /g,''));
	var currency = parseInt($("#calc_currency").val());
	var time = parseInt($("#calc_time").val());
	var additional = new Object();
	additional.flag1 = $("#free_add").is(":checked")?1:0;
	additional.flag2 = $("#free_take").is(":checked")?1:0;
	additional.capitalization  = $("input[name='calc_percent']:checked").val()=="1";
	
	if (sum < 0)
		return;
	
	// if (isKazan)
	// 	getIncomeKazan(sum,currency,time,additional);
	
	else getIncome(sum,currency,time,additional);
	var dep_code = 1;
	
	switch (deposit.tarifid)
	{
		case 'rost2012': dep_code=1; break;
		case 'max': dep_code=2; break;
		case 'free': dep_code=3; break;
	}
	
	/*if((isKazan)&&(deposit.name=="«Максимальный рост»"))
	{
		$("#free_take").removeAttr('disabled', '');
		
		$("#free_take").attr('style', 'display: none;');
		$("#free_take_label").attr('style', 'display: none;');
	}
	else
	{
		$("#free_take").attr('style', '');
		$("#free_take_label").attr('style', '');
	}*/
			
	$("#deposit_name").html(deposit.name).removeClass().addClass("ab"+dep_code);
	if (deposit.error){
		$("#errors").show();
		$("#result").hide();
		if ($("#free_take").is(":checked") && $("#calc_percent_1").is(":checked")) {
			deposit.errors = 'Для возможности снятия части вклада<br/> без потери процента, нужно отказаться от капитализации.<br/>'+
			'<ul><li><a href="#" class="correction_link" onclick="resetFree(); return false;">Cнять галочку «Частичное снятие средств без потери процента»</a></li>'+
			'<li><a href="#" class="correction_link" onclick="resetCap(); return false;">Отказаться от капитализации</a></li></ul>';
		} else
		if ($("#free_add").is(":checked") && $("#calc_percent_1").is(":checked") && $("#calc_time").val() < 730) {
			deposit.errors = 'Для возможности пополнения вклада с капитализацией<br/> нужно выбрать вклад на 2 года.<br/>'+
			'<ul><li><a href="#" class="correction_link" onclick="resetFund(); return false;">Cнять галочку «Ежемесячное пополнение вклада»</a></li>'+
			'<li><a href="#" class="correction_link" onclick="setTime(730); return false;">Установить срок вклада 2 года</a></li></ul>';
		}
		
		$("#errors").html(deposit.errors);
	}else{
		$("#errors").hide();
		$("#result").show();
		
		$("#effective_stake").html((deposit.percent).toFixed(2)+"%");
		var currencyStr;
		switch (currency){
			case 0: currencyStr = "<img src=\"images/ruble.svg\" height=\"50\">"; $("#deposit_currency").html("руб."); break;
			case 1: currencyStr = "$"; $("#deposit_currency").html("$"); break;
			case 2: currencyStr = "€"; $("#deposit_currency").html("€"); break;
			break;
		}

		$("#calc_result").html(number_to_str(deposit.payment) + " " + currencyStr);
		var income = deposit.income;
		$("#deposit_income").html(number_to_str(income<0?0:income));
		if (/*time>=365 && */additional.capitalization) {
			$("#stake_info").show();
			$("#stake_type").html("Эффективная ставка:");
		}else{
			$("#stake_info").hide();
			$("#stake_type").html("Процентная ставка:");
		}
	}
	if (calcallow) {
		calcallow = false; calcused = true;

		// _gaq.push(['_trackEvent', 'Action', 'Calculate', 'Deposit_Calc_All']);
		if (window.yaCounter4395838) yaCounter4395838.reachGoal('deposition_calculate'); return true;
	}
	return true;
}

function checkPhone(number){
	number = number.replace(/[^0-9]/g,'');
	return /[0-9]{10}/.test(number)?number:false;
}

function checkEmail(mail){
	return /^[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})$/.test(mail);
}

function email_send(email, message, subject){
	var x = $.ajax({
		type: 'POST',
		url: 'ajax/email_send',
		data: 'email='+email+'&message='+message+'&subject='+subject,
		async: false
	}).responseText;
	return eval('(' + x + ')');;
}

function setTime(time){
	$("#calc_time").val(time);
	useCalc();
	return false;
}

function setSumm(sum){
	$("#calc_summ").val(number_to_str(sum));
	useCalc();
	return false;
}

function resetFree(){
	$("#free_take").removeAttr("checked");
	useCalc();
	return false;
}

function resetCap(){
	$("#calc_percent_2").click();
	useCalc();
	return false;
}

function resetFund(){
	$("#free_add").removeAttr("checked");
	useCalc();
	return false;
}

function updatePromo(){
	/*var promo = unserialize(getCookie('analadvanced'));*/
	
	// Человек пришел с куками
	//if (promo.promo != 'no+GA+cookies'){
	//	$('.promo_cod_block').show();
	//}
	/*$("#promocode, .i3_promo, #photo_promo").html(urldecode(promo.promo));
	Drupal.settings.promocode = urldecode(promo.promo);*/
}
function unserialize (data) {
    // http://kevin.vanzonneveld.net
    var that = this;
    var utf8Overhead = function (chr) {
        // http://phpjs.org/functions/unserialize:571#comment_95906
        var code = chr.charCodeAt(0);
        if (code < 0x0080) {
            return 0;
        }
        if (code < 0x0800) {
            return 1;
        }
        return 2;
    };


    var error = function (type, msg, filename, line) {
        throw new that.window[type](msg, filename, line);
    };
    var read_until = function (data, offset, stopchr) {
        var buf = [];
        var chr = data.slice(offset, offset + 1);
        var i = 2;
        while (chr != stopchr) {
            if ((i + offset) > data.length) {
                error('Error', 'Invalid');
            }
            buf.push(chr);
            chr = data.slice(offset + (i - 1), offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };
    var read_chrs = function (data, offset, length) {
        var buf;

        buf = [];
        for (var i = 0; i < length; i++) {
            var chr = data.slice(offset + (i - 1), offset + i);
            buf.push(chr);
            length -= utf8Overhead(chr);
        }
        return [buf.length, buf.join('')];
    };
    var _unserialize = function (data, offset) {
        var readdata;
        var readData;
        var chrs = 0;
        var ccount;
        var stringlength;
        var keyandchrs;
        var keys;

        if (!offset) {
            offset = 0;
        }
        var dtype = (data.slice(offset, offset + 1)).toLowerCase();

        var dataoffset = offset + 2;
        var typeconvert = function (x) {
            return x;
        };

        switch (dtype) {
        case 'i':
            typeconvert = function (x) {
                return parseInt(x, 10);
            };
            readData = read_until(data, dataoffset, ';');
            chrs = readData[0];
            readdata = readData[1];
            dataoffset += chrs + 1;
            break;
        case 'b':
            typeconvert = function (x) {
                return parseInt(x, 10) !== 0;
            };
            readData = read_until(data, dataoffset, ';');
            chrs = readData[0];
            readdata = readData[1];
            dataoffset += chrs + 1;
            break;
        case 'd':
            typeconvert = function (x) {
                return parseFloat(x);
            };
            readData = read_until(data, dataoffset, ';');
            chrs = readData[0];
            readdata = readData[1];
            dataoffset += chrs + 1;
            break;
        case 'n':
            readdata = null;
            break;
        case 's':
            ccount = read_until(data, dataoffset, ':');
            chrs = ccount[0];
            stringlength = ccount[1];
            dataoffset += chrs + 2;

            readData = read_chrs(data, dataoffset + 1, parseInt(stringlength, 10));
            chrs = readData[0];
            readdata = readData[1];
            dataoffset += chrs + 2;
            if (chrs != parseInt(stringlength, 10) && chrs != readdata.length) {
                error('SyntaxError', 'String length mismatch');
            }

            // Length was calculated on an utf-8 encoded string
            // so wait with decoding
            readdata = that.utf8_decode(readdata);
            break;
        case 'a':
            readdata = {};

            keyandchrs = read_until(data, dataoffset, ':');
            chrs = keyandchrs[0];
            keys = keyandchrs[1];
            dataoffset += chrs + 2;

            for (var i = 0; i < parseInt(keys, 10); i++) {
                var kprops = _unserialize(data, dataoffset);
                var kchrs = kprops[1];
                var key = kprops[2];
                dataoffset += kchrs;

                var vprops = _unserialize(data, dataoffset);
                var vchrs = vprops[1];
                var value = vprops[2];
                dataoffset += vchrs;

                readdata[key] = value;
            }

            dataoffset += 1;
            break;
        default:
            error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
            break;
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)];
    };

    return _unserialize((data + ''), 0)[2];
}

function utf8_decode (str_data) {
    // http://kevin.vanzonneveld.net
    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 > 191 && c1 < 224) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return tmp_arr.join('');
}

function sms_with_addr(){
	sms_addr = ($(".current_address").html()).replace(/[<brBR>]/gi,'');
	ShowModal("sms_popup");
	return false;
}

function fireGRM_map(){
	if (!fireonce1){
		fireonce1 = true;
		if (document.location.host == 'www.rostbank.ru'||
		document.location.host == 'odintsovo.rostbank.ru'||
		document.location.host == 'zelenograd.rostbank.ru') $('body').append('<div style="display:inline"><img height="1" width="1" style="border-style:none;" alt="" src="http://www.googleadservices.com/pagead/conversion/1037372488/?label=KuzRCPqZ3gIQyJjU7gM&amp;guid=ON&amp;script=0"/></div>');
		if (document.location.host == 'spb.rostbank.ru'||
		document.location.host == 'vyborg.rostbank.ru')$('body').append('<div style="display:inline"><img height="1" width="1" style="border-style:none;" alt="" src="http://www.googleadservices.com/pagead/conversion/988721459/?label=q62WCM2e9QMQs-K61wM&amp;guid=ON&amp;script=0"/></div>');
	}
}

function fireGRM_promo(){
	if (!fireonce2){
		fireonce2 = true;
		$('body').append('<div style="display:inline"><img height="1" width="1" style="border-style:none;" alt="" src="http://www.googleadservices.com/pagead/conversion/1037372488/?label=GRAsCIKlqAIQyJjU7gM&amp;guid=ON&amp;script=0"/></div>');
	}
}

function doGetCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}
function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

function urldecode(url) {
  return decodeURIComponent(url.replace(/\+/g, ' '));
}