javascript:(/* @version 3.1 @author Golden_Dragon @description only for site Mangalib.me*/function() 
{
	let maxLengthPage = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	  );
	let step = 1000;
	let jumpCounts = Math.floor(maxLengthPage / step); let currentStep=0;
	let startNumber=0; let endNumber=0;
	let chapterSet = new Set();
	
	CommitUserData(prompt('Введите с какой главы скачивать:'));	
	
	function GetChapterObject(element)
	{
		let chapterHref = element.querySelector('.link-default').href;
		let hrefArray = chapterHref.split('/');
		let chapterNumber= parseFloat(hrefArray[hrefArray.length-1].substring(1));
		let chapterTom = parseFloat(hrefArray[hrefArray.length-2].substring(1));
		let chapterbtn = element.getElementsByClassName('media-chapter__icon media-chapter__icon_download tooltip')[0];
		return {chapterTom, chapterNumber, chapterbtn, chapterHref};
	}

	function ScrollDown()
	{
		return new Promise((resolve)=>
		{
			window.scrollBy(0,maxLengthPage);
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
						let maxValueOfChapter = Math.max(...mass.map(element =>
							{
								let chapterHref = element.querySelector('.link-default').href;
								let hrefArray = chapterHref.split('/');
								return parseFloat(hrefArray[hrefArray.length-1].substring(1));
							}));
						resolve(maxValueOfChapter);
						document.querySelector('.media-chapters-list__scroller-top-button').click();
					});
			}
			else return chapterNumber;
		
	}
	function ReadChapters()
	{
		let chapterArray = [...document.querySelectorAll('.vue-recycle-scroller__item-view')];
		chapterArray.forEach(chapterSet.add, chapterSet);
		[...chapterSet].forEach(element=>{
			let oneObj =GetChapterObject(element);
			AutoClick(oneObj);
		});
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
				/*console.log(`Tom:${element.chapterTom}, Num: ${element.chapterNumber}`); */
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
		}
	}, 300); 
	
})()