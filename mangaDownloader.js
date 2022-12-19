javascript:(/* @version 3.1 @author Golden_Dragon @description only for site Mangalib.me*/function() 
{
	let maxLengthPage = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	  );
	let step = 1000;
	let jumpCounts = Math.floor(maxLengthPage / step); let currentStep=0;
	let outputArray=[]; let startNumber=0; let endNumber=0;
	
	CommitUserData(prompt('Введите с какой главы скачивать:'));	
	
	function CheckBtnSort()
	{
		return new Promise((resolve)=>
		{
			let {chapterNumber, chapterTom}= GetTomAndChapterNumbers(document.querySelector('.vue-recycle-scroller__item-view'));
			
			if(chapterTom==1)
			{
				document.getElementsByClassName('button button_sm button_light media-chapters-sort')[0].click();
				resolve('Swap');
			}else{
				let chapterValue= chapterNumber;
				resolve(chapterValue);
			}
		});
	}
	async function CalculateMaxValueOfChapter()
	{
		let result = await CheckBtnSort();
		if(result=='Swap')
		{
			let chapterArray = document.querySelectorAll('.vue-recycle-scroller__item-view');
			let maxValue=0;
			chapterArray.forEach(element => {
				let {chapterValue} = GetTomAndChapterNumbers(element);
				if(chapterValue> maxValue)
				{
					maxValue=chapterValue;
				}
			});
			return maxValue;
		}
		else
		{
			return result;
		}	
	}

	function ReadChapters()
	{
		let chapterArray = document.querySelectorAll('.vue-recycle-scroller__item-view');
		for(let i=0; i<chapterArray.length; i++)
		{
			let oneObj = CreateChapterObject(chapterArray[i]);
			if(outputArray.find(item => item.chapterHref == oneObj.chapterHref)==undefined)
			{
				outputArray.push(oneObj);
				AutoClick(oneObj);
			}
		}
		console.log(outputArray);
	}

	function GetTomAndChapterNumbers(element)
	{
		let chapterHref = element.querySelector('.link-default').href;
		let hrefArray = chapterHref.split('/');
		let chapterNumber= parseFloat(hrefArray[hrefArray.length-1].substring(1));
		let chapterTom = parseFloat(hrefArray[hrefArray.length-2].substring(1));
		return {chapterNumber, chapterTom};
	}

	function CreateChapterObject(element)
	{
		let {chapterNumber, chapterTom}= GetTomAndChapterNumbers(element);
		let chapterHref = element.querySelector('.link-default').href;
		let chapterbtn = element.getElementsByClassName('media-chapter__icon media-chapter__icon_download tooltip')[0];
		return {chapterTom, chapterNumber, chapterbtn, chapterHref};
	}

	async function CommitUserData(txt)
	{
		endNumber= await CalculateMaxValueOfChapter();
		
		if(txt=='')
		{

		} else if(txt.includes('-'))
		{
			startNumber=parseFloat(txt.split('-')[0]);
			endNumber=parseFloat(txt.split('-')[1]);
		}
		else
		{
			startNumber=parseFloat(txt);
		}
	}

	function AutoClick(element)
	{
			if(element.chapterNumber>=startNumber && element.chapterNumber<=endNumber)
			{
				element.chapterbtn.click();
			}
	}
	
	let intervalJump=	setInterval(function()
	{
		ReadChapters();
		window.scrollBy(0,step);
		currentStep++;
    	if(jumpCounts == currentStep)
		{
			document.querySelector('.media-chapters-list__scroller-top-button').click();
			clearInterval(intervalJump);
			console.log(outputArray);
		}
	}, 300); 
	
})()