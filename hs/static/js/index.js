//======================= 初始化数据 start ==========================================================
// 中奖信息滚动
(function scrollList() {
	const listContainer = document.getElementById('milo-broadcast-container');
	const scrollSpeed = 1;

	setInterval(function() {
		let currentBottom = parseFloat(getComputedStyle(listContainer).bottom);
		let newBottom = currentBottom + scrollSpeed;
		if (newBottom > 0) {
			newBottom = -listContainer.scrollHeight;
		}
		listContainer.style.bottom = newBottom + 'px';
	}, 50);
})();

// 对应兑换积分
isParams = {
	'exchangeGoods': {
		1: ["王者风神（非觉醒版）", 888],
		2: ["隼", 598],
		3: ["M200-幻神", 548],
		4: ["灵狐者-职业经理", 428],
		5: ["Barrett-极光音效卡（不可交易）", 298],
		6: ["炫金毁灭", 218],
		7: ["M4A1-青龙", 218],
		8: ["AK47-黑鲨", 148],
		9: ["M200-幻神紫橙光效 ", 58],
		10: ["天使灵狐玩偶", 28],
		11: ["属性变更券x5", 8],
		12: ["交易专用钥匙x1", 2],
	}
};
const storageName = 'record_hs';
const local = localStorage.getItem(storageName);
const record = local ? JSON.parse(local) : {
	amount: 0,
	key: 0,
	integral: 0,
	historyList: [],
	temp: []
};

// 渲染页面
localStorage.setItem(storageName, JSON.stringify(record));
$('#amountMN').html(`￥${record.amount}`);
$('#keyNumber').html(record.key);
$('#integral').html(record.integral);
//======================= 初始化数据 end ==========================================================



//======================= 充值 start ==========================================================
let currentPay = 0;
function payClick(number) {
	currentPay = number;
	$("#mask").css("display", "block");
	$("#amount").html(number);
};

function confirmPay() {
	// 花费金额
	record.amount += currentPay;
	$('#amountMN ').html(`￥${record.amount}`);
	$("#mask").css("display", "none");
	$("#amount").html(0);

	// 钥匙
	if (currentPay == 10) {
		record.key += 1;
	} else {
		record.key += 11;
	};
	$('#keyNumber ').html(record.key);
	
	window.alert('支付成功~', null, null);
	localStorage.setItem(storageName, JSON.stringify(record));
};
function cancelPay() {
	$("#mask").css("display", "none");
	$("#amount").html(0);
};
function pay(money=0)  {
	let bonus = Math.floor(money / 100);
	// 充值100块额外增加1把钥匙
	let key = Math.floor(money/10) + bonus;
	record.amount += money;
	record.key += key;
	
	$('#amountMN ').html(`￥${record.amount}`);
	$('#keyNumber ').html(record.key);
	window.alert('充值成功~', null, null);
	localStorage.setItem(storageName, JSON.stringify(record));
};
//======================= 充值 end ==========================================================




//======================= 抽奖 start ==========================================================
// 异步函数用于从服务器获取数据
async function fetchDataFromServer() {
  try {
    const response = await fetch('https://djtc.vip/sxz/hs/config/');
    if (response.ok) {
      // const data = await response.json();
	  // 加密数据
      const data = await response.text();
      return data;
    } else {
      console.error('Failed to fetch data from server');
      return null;
    }
  } catch (error) {
    console.error('Error during data fetching:', error);
    return null;
  }
};
// 获取云端概率配置
var serverData = null;
async function getPrizesData() {
	// 从服务器端接收到的加密数据
	encryptedDataFromServer  = await fetchDataFromServer();
	
	if(!encryptedDataFromServer || encryptedDataFromServer.length == 0) {
		serverData = encryptedDataFromServer;
	} else {
		try{
			// 解码Base64字符串为Uint8Array
			var encryptedArrayBuffer = Uint8Array.from(atob(encryptedDataFromServer ), c => c.charCodeAt(0));
			
			// 解密参数
			var key = "djtcvip789abcdef";
			var iv = "fedcba987djtcvip";
			
			// 将密钥和向量转换为ArrayBuffer
			var keyBuffer = new TextEncoder().encode(key);
			var ivBuffer = new TextEncoder().encode(iv);
			
			// 将密钥和向量传递给CryptoJS库
			var decrypted = CryptoJS.AES.decrypt(
			    { ciphertext: CryptoJS.lib.WordArray.create(encryptedArrayBuffer) },
			    CryptoJS.lib.WordArray.create(keyBuffer),
			    {
			        iv: CryptoJS.lib.WordArray.create(ivBuffer),
			        padding: CryptoJS.pad.ZeroPadding
			    }
			);
			
			// 将解密后的数据转换为字符串
			var decryptedDataString = decrypted.toString(CryptoJS.enc.Utf8);
			
			// 删除额外的控制字符(兼容处理)
			decryptedDataString = decryptedDataString.replace(/[\x00-\x1F]/g, '');			
			
			var decryptedDataArray = JSON.parse(decryptedDataString);
			serverData = decryptedDataArray;
		} catch(err){
			console.log('decryption failure',err);
			serverData = null;
		}
	}
};
// getPrizesData();



// 随机取出一个结果
function lottery(item) {
	return new Promise(async (resolve, reject) => {
		// 本地概率
		const Localprizes = [{
				name: '王者风神（非觉醒版）',
				key: 20,
				integral: 0,
				isRare: true,
				probabilityText: '0.15%',
				probabilityNumber: 0.0015
			},
			{
				name: '隼',
				key: 15,
				integral: 0,
				isRare: true,
				probabilityText: '0.20%',
				probabilityNumber: 0.002
			},
			{
				name: 'M200-幻神',
				key: 12,
				integral: 0,
				isRare: true,
				probabilityText: '0.30%',
				probabilityNumber: 0.003
			},
			{
				name: '灵狐者-职业经理',
				key: 10,
				integral: 0,
				isRare: true,
				probabilityText: '0.30%',
				probabilityNumber: 0.003
			},
			{
				name: 'Barrett-极光音效卡（不可交易）',
				key: 8,
				integral: 0,
				isRare: true,
				probabilityText: '0.40%',
				probabilityNumber: 0.004
			},
			{
				name: '炫金毁灭',
				key: 6,
				integral: 0,
				isRare: true,
				probabilityText: '0.50%',
				probabilityNumber: 0.005
			},
			{
				name: 'M4A1-青龙',
				key: 6,
				integral: 0,
				isRare: true,
				probabilityText: '0.50%',
				probabilityNumber: 0.005
			},
			{
				name: 'AK47-黑鲨',
				key: 4,
				integral: 0,
				isRare: true,
				probabilityText: '0.80%',
				probabilityNumber: 0.008
			},
			{
				name: 'M200-幻神紫橙光效 （不可交易）',
				key: 2,
				integral: 0,
				isRare: true,
				probabilityText: '1.00%',
				probabilityNumber: 0.01
			},
			{
				name: '天使灵狐玩偶',
				key: 1,
				integral: 0,
				isRare: true,
				probabilityText: '1.20%',
				probabilityNumber: 0.012
			},
			{
				name: '王者之石x1',
				key: 0,
				integral: 0,
				isRare: false,
				probabilityText: '18.45%',
				probabilityNumber: 0.1845
			},
			{
				name: '积分x100',
				key: 0,
				integral: 100,
				isRare: false,
				probabilityText: '0.20%',
				probabilityNumber: 0.002
			},
			{
				name: '积分x10',
				key: 0,
				integral: 10,
				isRare: false,
				probabilityText: '2.00%',
				probabilityNumber: 0.02
			},
			{
				name: '积分x5',
				key: 0,
				integral: 5,
				isRare: false,
				probabilityText: '4.00%',
				probabilityNumber: 0.04
			},
			{
				name: '积分x4',
				key: 0,
				integral: 4,
				isRare: false,
				probabilityText: '30.00%',
				probabilityNumber: 0.3
			},
			{
				name: '积分x3',
				key: 0,
				integral: 3,
				isRare: false,
				probabilityText: '40.00%',
				probabilityNumber: 0.4
			}
		];
		
		// 如果服务器数据为空，使用本地数据
		if (serverData === null || serverData.length === 0) {
		  serverData = Localprizes;
		}

		// 计算总概率
		const totalProbability = serverData.reduce((sum, prize) => sum + prize.probabilityNumber, 0);
		// 生成一个随机数，表示抽奖结果
		const randomValue = Math.random();

		// 根据随机数和奖品概率计算抽奖结果
		let cumulativeProbability = 0;
		let selectedPrize = null;
		for (const prize of serverData) {
			cumulativeProbability += prize.probabilityNumber / totalProbability; //概率归一化与随机数范围匹配[0,1]; 计算累积概率，用于判断随机数落在哪个奖品的范围内（比如概率是0.5，则随机数0-1，有一半都是可能这个奖品）
			if (randomValue <= cumulativeProbability) {
				selectedPrize = prize;
				break;
			}
		};
		// 抽奖结果
		resolve({
			code: 1,
			res: selectedPrize
		});
	});
};

// 点击
async function amsChou(item) {
	if (item == 1) {
		if (record.key > 0) {
			const prize = await lottery();
			record.historyList.unshift({
				timestamp: Date.now(),
				region: '搬砖一区',
				prize: prize.res.name
			});
			if (prize.res.isRare) {
				record.temp.unshift({
					name: prize.res.name,
					key: prize.res.key,
					set: false,
					destroy: false,
					status: 0
				});
			} else {
				record.integral += prize.res.integral;
			}
			record.key -= 1;
			
			// =================渲染=================
			localStorage.setItem(storageName, JSON.stringify(record));
			$("#text5 .showAlert").html(prize.res.name);
			$('#keyNumber ').html(record.key);
			$('#integral ').html(record.integral);
			TGDialogS('text5');
			// =================渲染=================
		} else {
			window.alert('不好意思，您的剩余钥匙数不足~', null, null);
		}
	} else {
		if (record.key >= 10) {
			const result = [];
			for (let i = 0; i < 10; i++) {
				const prize = await lottery();
				result.unshift(prize.res);
				record.historyList.unshift({
					timestamp: Date.now(),
					region: '搬砖一区',
					prize: prize.res.name
				});
				if (prize.res.isRare) {
					record.temp.unshift({
						name: prize.res.name,
						key: prize.res.key,
						set: false,
						destroy: false,
						status: 0
					});
				} else {
					record.integral += prize.res.integral;
				}
				localStorage.setItem(storageName, JSON.stringify(record));
			}
			record.key -= 10;
			
			
			// ==================================渲染==================================
			$('#text4 #showChouList').html("");
			$.each(result, function(k, v) {
				$('#text4 #showChouList').append(`<li><p>${v.name}</p></li>`);
			});
			$('#keyNumber ').html(record.key);
			$('#integral ').html(record.integral);
			TGDialogS('text4');
			// ==================================渲染==================================
		} else {
			window.alert('不好意思，您的剩余钥匙数不足~', null, null);
		}
	}
	localStorage.setItem(storageName, JSON.stringify(record));
}

// 批量
async function amsChous(number) {
	try{
		if(typeof(number)=='number') {
			if(record.key>=number) {
				const result = [];
				for (let i = 0; i < number; i++) {
					const prize = await lottery();
					result.unshift(prize.res);
					record.historyList.unshift({
						timestamp: Date.now(),
						region: '搬砖一区',
						prize: prize.res.name
					});
					if (prize.res.isRare) {
						record.temp.unshift({
							name: prize.res.name,
							key: prize.res.key,
							set: false,
							destroy: false,
							status: 0
						});
					} else {
						record.integral += prize.res.integral;
					}
				};
				record.key -= number;
				localStorage.setItem(storageName, JSON.stringify(record));
				
				if(number>1) {
					// ==================================渲染==================================
					$('#text4 #showChouList').html("");
					$.each(result, function(k, v) {
						$('#text4 #showChouList').append(`<li><p>${v.name}</p></li>`);
					});
					$('#keyNumber ').html(record.key);
					$('#integral ').html(record.integral);
					TGDialogS('text4');
					// ==================================渲染==================================
				} else {
					// =================渲染=================
					$("#text5 .showAlert").html(result[0].name);
					$('#keyNumber ').html(record.key);
					$('#integral ').html(record.integral);
					TGDialogS('text5');
					// =================渲染=================
				}
			} else {
				window.alert('不好意思，您的剩余钥匙数不足~', null, null);
			}
		} else {
			window.alert('不好意思，请输入正确的数值~', null, null);
		}
	} catch(err){
		console.log('意外的错误',err)
	}
}
//================================抽奖 end ===========================================






//======================= 记录 start ========================================================
/* 翻页START */
var HitemsPerPage = 10;
var HcurrentPage = 1;
var HtotalPages = Math.ceil(record.historyList.length / HitemsPerPage);
var TitemsPerPage = 5;
var TcurrentPage = 1;
var TtotalPages = Math.ceil(record.temp.length / TitemsPerPage);

// 渲染翻页页码
function renderPagination(name, currentPage, totalPages) {
	var paginationList = document.getElementById(name);
	paginationList.innerHTML = '';

	// 最多可显示页码
	var displayPages = 5;

	// 计算显示页面的开始和结束索引
	var startPage = Math.max(1, currentPage - Math.floor(displayPages / 2)); //displayPages 的一半，向下取整, 总是从一个相对中间位置开始显示页码
	var endPage = Math.min(totalPages, startPage + displayPages - 1);
	// 添加…如果需要的话,在前面加
	if (startPage > 1) {
		var omitItem = document.createElement('li');
		omitItem.className = 'my-page-omit';
		omitItem.textContent = '...';
		paginationList.appendChild(omitItem);
	}

	// 渲染显示的页面
	for (var i = startPage; i <= endPage; i++) {
		var listItem = document.createElement('li');
		listItem.className = 'my-page-cell';
		listItem.textContent = i;

		// 添加一个类来表示当前页面
		if (i === currentPage) {
			listItem.classList.add('my-page-checked');
		}
		paginationList.appendChild(listItem);
	}
	// 添加…如果需要的话,在后面加
	if (endPage < totalPages) {
		var omitItem = document.createElement('li');
		omitItem.className = 'my-page-omit';
		omitItem.textContent = '...';
		paginationList.appendChild(omitItem);
	}
}

// 点击翻页(个人获奖记录)
document.getElementById('paginationList').addEventListener('click', function(event) {
	if (event.target.tagName === 'LI') {
		// 根据所单击的页码更新currentPage
		var clickedPage = parseInt(event.target.textContent);

		// 过滤“……”被点击。
		if (isNaN(clickedPage)) {
			return;
		}
		// 重新渲染页码
		HcurrentPage = clickedPage;
		renderPagination('paginationList', HcurrentPage, HtotalPages);

		// 分页偏移数据
		var startIndex = (HcurrentPage - 1) * HitemsPerPage;
		var endIndex = startIndex + HitemsPerPage;
		var currentPageData = record.historyList.slice(startIndex, endIndex);

		const formattedRows = currentPageData.map(item => {
			const formattedTimestamp = new Date(item.timestamp).toLocaleString();
			return `<tr><td style="width: 35%;">${formattedTimestamp}</td><td style="width: 25%;">${item.region}</td><td>${item.prize}</td></tr>`;
		});
		const finalHtml = formattedRows.join('');
		$('#getGiftContent1').html(finalHtml);
	}
});

// 点击翻页(暂存箱)
document.getElementById('paginationList2').addEventListener('click', function(event) {
	if (event.target.tagName === 'LI') {
		// 根据所单击的页码更新currentPage
		var clickedPage = parseInt(event.target.textContent);

		// 过滤“……”被点击。
		if (isNaN(clickedPage)) {
			return;
		}

		// 重新渲染页码
		TcurrentPage = clickedPage;
		renderPagination('paginationList2', TcurrentPage, TtotalPages);

		// 分页偏移数据
		var startIndex = (TcurrentPage - 1) * TitemsPerPage;
		var endIndex = startIndex + TitemsPerPage;
		var currentPageData = record.temp.slice(startIndex, endIndex);
		const formattedRows = currentPageData.map((item, index) => {
			// 加密不能换行，要变成一行
			return `<tr>
				<td>${item.name}</td>
				<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanQu('${index}')">${item.status?item.set?'已发送':'x':'[发送仓库]'}</td>
				<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanFen('${index}', '${item.key}')">${item.status?item.destroy?'已分解':'x':'[分解]'}</td>
			</tr>`;
		});
		const finalHtml = formattedRows.join('');
		$('#getGiftContent2').html(finalHtml);
	}
});
/* 翻页END */


// 个人获奖记录
function amsHistoryList(item, pageNow) {
	HcurrentPage = 1;
	HtotalPages = Math.ceil(record.historyList.length / HitemsPerPage);
	TtotalPages = Math.ceil(record.temp.length / TitemsPerPage);
	TcurrentPage = 1;
	
	const res = {
		data: "",
		total: 0
	}
	
	// ==================================渲染==================================
	if (item == 1) {
		//记录
		renderPagination('paginationList', HcurrentPage, HtotalPages);

		if (record.historyList.length > 0) {
			const formattedRows = record.historyList.slice(0, HitemsPerPage).map(item => {
				const formattedTimestamp = new Date(item.timestamp).toLocaleString();
				return `<tr><td style="width: 35%;">${formattedTimestamp}</td><td style="width: 25%;">${item.region}</td><td>${item.prize}</td></tr>`;
			});
			const finalHtml = formattedRows.join('');
			res.data = finalHtml;
		} else {
			res.data = "<tr><td colspan='3'>抱歉，您尚未获得任何礼包</td></tr>";
		}
		$('#getGiftContent1').html(res.data);
		TGDialogS('text3');
	} else { 
		//暂存
		renderPagination('paginationList2', TcurrentPage, TtotalPages);
		
		if (record.temp.length > 0) {
			const formattedRows = record.temp.slice(0, TitemsPerPage).map((item, index) => {
				return `<tr>
					<td>${item.name}</td>
					<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanQu('${index}')">${item.status?item.set?'已发送':'x':'[发送仓库]'}</td>
					<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanFen('${index}', '${item.key}')">${item.status?item.destroy?'已分解':'x':'[分解]'}</td>
				</tr>`;
			});
			const finalHtml = formattedRows.join('');
			res.data = finalHtml;
		} else {
			res.data = "<tr><td colspan='3' style='text-align:center;'>抱歉，您尚未获得任何礼包</td></tr>";
		}
		$('#getGiftContent2').html(res.data);
		TGDialogS('text2');
	}
	// ==================================渲染==================================
}
//======================= 记录 end ========================================================




//======================= 兑换 start ========================================================
// 【暂存箱】领取
function amsZanQu(index) {
	if(!record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].status) {
		var msg = "确定领取 " + record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].name +
			" 到【搬砖一区】吗？【唯一性道具在同一大区内，游戏仓库无法重复到账，请谨慎选择】";
		confirm(msg, function() {
			record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].status = 1;
			record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].set = true;
			localStorage.setItem(storageName, JSON.stringify(record));
			renderPagination('paginationList2', TcurrentPage, TtotalPages);
			var startIndex = (TcurrentPage - 1) * TitemsPerPage;
			var endIndex = startIndex + TitemsPerPage;
			const formattedRows = record.temp.slice(startIndex, endIndex).map((item, index) => {
				return `<tr>
					<td>${item.name}</td>
					<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanQu('${index}')">${item.status?item.set?'已发送':'x':'[发送仓库]'}</td>
					<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanFen('${index}', '${item.key}')">${item.status?item.destroy?'已分解':'x':'[分解]'}</td>
				</tr>`;
			});
			const finalHtml = formattedRows.join('');
			$('#getGiftContent2').html(finalHtml);
			window.alert('领取成功~', null, null);
		});
	}
}

// 【暂存箱】分解钥匙
function amsZanFen(index, key) {
	if(!record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].status) {
		confirm("确定分解 " + record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].name + " 获得 " + key + " 钥匙吗？",
			function() {
				record.key += parseInt(key);
				record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].status = 1;
				record.temp[((TcurrentPage - 1) * TitemsPerPage) + parseInt(index)].destroy = true;
				localStorage.setItem(storageName, JSON.stringify(record));

				$('#keyNumber ').html(record.key);

				renderPagination('paginationList2', TcurrentPage, TtotalPages);
				var startIndex = (TcurrentPage - 1) * TitemsPerPage;
				var endIndex = startIndex + TitemsPerPage;
				const formattedRows = record.temp.slice(startIndex, endIndex).map((item, index) => {
					return `<tr>
						<td>${item.name}</td>
						<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanQu('${index}')">${item.status?item.set?'已发送':'x':'[发送仓库]'}</td>
						<td style="white-space: nowrap;${item.status?'':'color:red;cursor:pointer;'}" onclick="amsZanFen('${index}', '${item.key}')">${item.status?item.destroy?'已分解':'x':'[分解]'}</td>
					</tr>`;
				});
				const finalHtml = formattedRows.join('');
				$('#getGiftContent2').html(finalHtml);
				window.alert('分解成功~', null, null);
			});
	}
}

//个人积分兑换道具
function amsExchange(item) {
	var msg = "确定使用 " + isParams.exchangeGoods[item][1] + " 个积分兑换 " + isParams.exchangeGoods[item][0] +
		" 吗？唯一性道具或角色在同一大区内，游戏仓库无法重复到账，请谨慎选择】";
	confirm(msg, function() {
		const integral = isParams.exchangeGoods[item][1];
		if (record.integral >= integral) {
			record.integral -= integral;
			record.historyList.unshift({
				timestamp: Date.now(),
				region: '搬砖一区',
				prize: isParams.exchangeGoods[item][0]
			});
			localStorage.setItem(storageName, JSON.stringify(record));
			window.alert('兑换成功，请前往个人仓库查看~', null, null);
			$('#integral ').html(record.integral);
		} else {
			window.alert('不好意思，您的剩余积分不足~', null, null);
		}
	});
}
//======================= 兑换 end ========================================================



// 解码打印base64编码图案
var decodedPattern = atob("CiAgICAgIF9fX19fICAgICAgICAgICAgICAgICAgICBfX19fXyAgICAgICAgICAKICAgICAvXCAgICBcICAgICAgICAgICAgICAgICAgL1wgICAgXCAgICAgICAgIAogICAgLzo6XCAgICBcICAgICAgICAgICAgICAgIC86OlwgICAgXCAgICAgICAgCiAgICBcOjo6XCAgICBcICAgICAgICAgICAgICAvOjo6OlwgICAgXCAgICAgICAKICAgICBcOjo6XCAgICBcICAgICAgICAgICAgLzo6Ojo6OlwgICAgXCAgICAgIAogICAgICBcOjo6XCAgICBcICAgICAgICAgIC86OjovXDo6OlwgICAgXCAgICAgCiAgICAgICBcOjo6XCAgICBcICAgICAgICAvOjo6LyAgXDo6OlwgICAgXCAgICAKICAgICAgIC86Ojo6XCAgICBcICAgICAgLzo6Oi8gICAgXDo6OlwgICAgXCAgIAogICAgICAvOjo6Ojo6XCAgICBcICAgIC86OjovICAgIC8gXDo6OlwgICAgXCAgCiAgICAgLzo6Oi9cOjo6XCAgICBcICAvOjo6LyAgICAvICAgXDo6OlwgICAgXCAKICAgIC86OjovICBcOjo6XF9fX19cLzo6Oi9fX19fLyAgICAgXDo6OlxfX19fXAogICAvOjo6LyAgICBcOjovICAgIC9cOjo6XCAgICBcICAgICAgXDo6LyAgICAvCiAgLzo6Oi8gICAgLyBcL19fX18vICBcOjo6XCAgICBcICAgICAgXC9fX19fLyAKIC86OjovICAgIC8gICAgICAgICAgICBcOjo6XCAgICBcICAgICAgICAgICAgIAovOjo6LyAgICAvICAgICAgICAgICAgICBcOjo6XCAgICBcICAgICAgICAgICAgClw6Oi8gICAgLyAgICAgICAgICAgICAgICBcOjo6XCAgICBcICAgICAgICAgICAKIFwvX19fXy8gICAgICAgICAgICAgICAgICBcOjo6XCAgICBcICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICBcOjo6XCAgICBcICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcOjo6XF9fX19cICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcOjovICAgIC8gICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcL19fX18vICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAK");
console.log(`%c${decodedPattern}`,'color: #02c8ff');
console.log("%c %c %c %c傻小子，%c加个鸡腿不香吗？！","padding:8px 0 5px;background:#f0f","padding:8px 2px 5px;background:#0f0","padding:8px 4px 5px;background:#f00","font-size:16px;font-weight:bold;color:#fff;padding:4px 0 4px 10px;background:#000","font-size:16px;font-weight:bold;color:#ffd500;padding:4px 20px 4px 0;background:#000");


// 使用ipinfo.io获取访问者 IP 信息
// try {
// 	fetch('https://ipinfo.io/json')
// 	  .then(response => response.json())
// 	  .then(data => {
// 	    const ip = data.ip;
// 	    const city = data.city;
// 	    const region = data.region;
// 	    const country = data.country;
	
// 	    // 将信息发送到服务器
// 	    sendInfoToServer(ip, city, region, country);
// 	  })
// 	  .catch(error => console.error('Error getting IP info:', error));
	
// 	// 将访问者信息发送到服务器
// 	function sendInfoToServer(ip, city, region, country) {
// 	  // 使用Fetch API发送信息到服务器
// 	  fetch('https://djtc.vip/sxz/hs/log/', {
// 	    method: 'POST',
// 	    headers: {
// 	      'Content-Type': 'application/json',
// 	    },
// 	    body: JSON.stringify({ ip, city, region, country }),
// 	  })
// 	  .then(response => {
// 	    if (!response.ok) {
// 	      throw new Error('Network response was not ok');
// 	    }
// 	  })
// 	  .catch(error => console.error('Error sending info to server:', error));
// 	}
// } catch(err) {
// 	console.log('fetch',err);
// };