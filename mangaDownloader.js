javascript:(/* @version 3.4 @author Golden_Dragon @description only for site Mangalib.me*/function() 
{
	let maxLengthPage = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	  );
	let step = 1000;
	let jumpCounts = Math.ceil(maxLengthPage / step); let currentStep=0;
	let scrlBtn = document.querySelector('.media-chapters-list__scroller-top-button');
	let chapterSet = new Set(); let fAutoClick;
	let config = {
		needTom:false,
		startTom:1,
		startChapterNumber:0,
		endTom:1,
		endChapterNumber:0
	};
	
	CommitUserData(prompt('Введите с какой главы скачивать:'));	
	
	function GetChapterObject(element)
	{
		let chapterHref = element.querySelector('.link-default').href;
		let hrefArray = chapterHref.split('/');
		let chapterNumber= parseFloat(hrefArray[hrefArray.length-1].substring(1));
		let chapterTom = parseFloat(hrefArray[hrefArray.length-2].substring(1));
		let chapterbtn = element.getElementsByClassName('media-chapter__icon media-chapter__icon_download tooltip')[0];
		return {chapterTom, chapterNumber, chapterbtn};
	}

	function ScrollDown()
	{
		return new Promise((resolve)=>
		{
			window.scrollBy(0, maxLengthPage);
			setTimeout(()=>{resolve();}, 500);
		});
	}
	async function CalculateMaxValueOfChapter()
	{
			let {chapterNumber, chapterTom}= GetChapterObject(document.querySelectorAll('.vue-recycle-scroller__item-view')[0]);
			if(chapterTom==1)
			{
				await ScrollDown();
					return new Promise((resolve)=>
					{
						let mass = [...document.querySelectorAll('.vue-recycle-scroller__item-view')];
						let maxValueOfTom = Math.max(...mass.map(element =>
							{
								let chapterHref = element.querySelector('.link-default').href;
								let hrefArray = chapterHref.split('/');
								return parseFloat(hrefArray[hrefArray.length-2].substring(1));
							}));
						let maxValueOfChapter = Math.max(...mass.map(element =>
							{
								let chapterHref = element.querySelector('.link-default').href;
								let hrefArray = chapterHref.split('/');
								return parseFloat(hrefArray[hrefArray.length-1].substring(1));
							}));
						resolve({endTom:maxValueOfTom, endChapterNumber: maxValueOfChapter});
						document.querySelector('.media-chapters-list__scroller-top-button').click();
					});
			}
			else return {endChapterNumber: chapterNumber, endTom: chapterTom};
	}

	function ReadChapters()
	{
		let chapterArray = [...document.querySelectorAll('.vue-recycle-scroller__item-view')];
		chapterArray.forEach(chapterSet.add, chapterSet);
		[...chapterSet].forEach(element=>{
			let oneObj =GetChapterObject(element);
			fAutoClick(oneObj);
		});
	}

	function GetParts(line)
	{
		if(line.includes('-'))
		{
			let mass =line.split('-');
			return mass;
		}
		else
		{
			return [line];
		}
	}

	function SecondStep(line)
	{
		let customObj={activeTom:false, tom:1, chNum:0};
		if(line.includes('/'))
		{
			let mass = line.split('/');
			customObj.activeTom=true;
			customObj.tom=parseFloat(mass[0]); 
			customObj.chNum=parseFloat(mass[1]);
		}
		else
		{
		   customObj.chNum=parseFloat(line);
		}
		return customObj;
	}
	async function CalculateEndValues()
	{
		let {endTom , endChapterNumber} = await CalculateMaxValueOfChapter();
		config.endTom = endTom;
		config.endChapterNumber = endChapterNumber;
	}
	async function CommitUserData(txt)
	{	
		await CalculateEndValues();	
		if(!txt=='' && !isNaN(parseFloat(txt)))
		{
			let arr = GetParts(txt);
			arr.forEach((element, i)=>
			{
				let {activeTom, tom, chNum} = SecondStep(element);
				config.needTom = activeTom;
				if(i==1)
				{
					config.endTom = tom; 
					config.endChapterNumber = chNum;
				}
				else
				{
					config.startTom = tom;  
					config.startChapterNumber = chNum;				
				}
			});
		}
		if(config.needTom==false)
		{
			fAutoClick = function(element){OnlyChaptersCheck(element);};
		}
		else
		{
			fAutoClick = function(element){FullCheck(element);};
		}
		console.log(config); 
		StartMechanism();
	}

	function CheckChapters(element)
	{
		return (element.chapterNumber>=config.startChapterNumber && element.chapterNumber<=config.endChapterNumber);
	}

	function CheckToms(element)
	{
		if(element.chapterTom>config.startTom && element.chapterTom!=config.endTom && element.chapterTom<config.endTom)
		{
			return true;
		}
		else if(element.chapterTom==config.startTom)
		{
			if(element.chapterNumber>=config.startChapterNumber)
			return true;
		}
		if(element.chapterTom==config.endTom)
		{
			if(element.chapterNumber<=config.endChapterNumber)
			return true;
		}
		return false;
	}
	
	function FullCheck(element)
	{
		if(CheckToms(element))
		{
			element.chapterbtn.click(); 
		}
	}

	function OnlyChaptersCheck(element)
	{
		if(CheckChapters(element))
		{
			element.chapterbtn.click();
		}
	}

	function StartMechanism()
	{
		let intervalJump=	setInterval(function()
		{
			ReadChapters();
			window.scrollBy(0,step);
			currentStep++;
			if(jumpCounts <= currentStep)
			{
				if(scrlBtn!=null)
				scrlBtn.click();
				clearInterval(intervalJump);
			}
		}, 300);
	}
})()