function showGlobalModalWindow(height,width) {
    const body = document.querySelector("body");
let html = `<div class="modalwindow-parent">
<div class="modalwindow-for-all">

<div class="close-modalwindow-parent">
  <img class="close-modalwindow" width="25px" src="./close-square-svgrepo-com.svg" alt="">
</div>

<div class="searchforstock">
<select id="searchtypes">
<option>Small-Mid-LargeCap</option>
<option>Penny Stocks</option>
<option>ETF's</option>
</select>
<input type="text" class="enternames" placeholder="Small-Mid-LargeCap">
<img width="25px" src="./search-svgrepo-com.svg" alt="">
</div>
<div class="empty-state">
<img width="150px" src="./empty-box-svgrepo-com.svg" alt="">
</div>
<div class="for-data"></div>
</div>
</div>`;
body.insertAdjacentHTML("afterbegin", html);

if(width !== undefined){
document.querySelector(`.modalwindow-for-all`).style.width=width;
}
if(height !== undefined){
document.querySelector(`.modalwindow-for-all`).style.height=height;
}

document.querySelector(`.enternames`).focus()
document.querySelector(`.close-modalwindow`).addEventListener('click',function () {
    document.querySelector(`.modalwindow-parent`).remove()
    
})

document.querySelector(`#searchtypes`).addEventListener('change',function () {
  document.querySelector(`.searchforstock>input`).value='';
  document.querySelector(`.searchforstock>input`).placeholder=document.querySelector('#searchtypes').options[document.querySelector('#searchtypes').selectedIndex].textContent;

})


document.querySelector(`.searchforstock>img`).addEventListener('click',function () {

  if(document.querySelector(`.searchforstock>input`).value!=''&&document.querySelector(`.searchforstock>input`).value.includes('.')===false){
  let datatofetch=document.querySelector(`.searchforstock>input`).value.toUpperCase().split(',');
  document.querySelector(`.searchforstock>input`).value='';
  if(document.querySelector(`.empty-state`)!==null){
  document.querySelector(`.empty-state`).remove()
  }

  let selectElement = document.querySelector(".modalwindow-for-all");
let html = `<div class="modal-loding-parent">
<div class="modal-loding"></div>
</div>`;
selectElement.insertAdjacentHTML("beforeend", html);
if(document.querySelector('#searchtypes').selectedIndex===0){fetchData(datatofetch)}
if(document.querySelector('#searchtypes').selectedIndex===1){fetchPennyData(datatofetch)}
if(document.querySelector('#searchtypes').selectedIndex===2){fetchEtfData(datatofetch)}

}
else{alert(`write ${document.querySelector('#searchtypes').options[document.querySelector('#searchtypes').selectedIndex
].textContent} name and do not include dot '.'`)}
})
}



document.querySelector(`.search-data`).addEventListener('click',function () {
    
    if(document.querySelector('.modalwindow-parent')==null){
    showGlobalModalWindow(undefined,undefined)
   
  }
})


function fetchData(stocks) {
  console.log(stocks)
let countertoremoveloading=0;
  for (let i = 0; i < stocks.length; i++) {
    fetch(`${originurl}/stocksdata?stockName=${stocks[i]}`)
    .then(response => response.json())
    .then(data => {
  console.log(data)
  if(data.error===undefined){

    let summaryData=data.data2.data.summaryData;
    let underOrOver;
    let underOrOverValue;
    let difference;
    try{
     
if(!(Number(summaryData.PERatio.value)<=0) || !(Number(summaryData.EarningsPerShare.value.replace('$',''))<=0)){

   underOrOver=Number(summaryData.PERatio.value)*Number(summaryData.EarningsPerShare.value.replace('$',''));
   console.log(summaryData.PERatio.value,summaryData.EarningsPerShare.value)
    if(underOrOver<=data.lastPrice){underOrOverValue='underValued'}
    if(underOrOver>data.lastPrice){underOrOverValue='overValued'}

console.log('k',data.lastPrice,underOrOver)
    difference = Math.abs(data.lastPrice-underOrOver);
    difference=Math.floor(difference * 100) / 100;
    difference=difference.toFixed(2);
    }
    else{underOrOverValue='$NA'}
  }catch(error){
    console.log(error)
  }
console.log(summaryData,underOrOverValue,difference)
countertoremoveloading++;
if(countertoremoveloading==stocks.length){
document.querySelector(`.modal-loding-parent`).remove()
  }
let selectElement = document.querySelector(".for-data");
let html = `<div class="datap1">
<div class="script">
  <h2 class="scriptnam">&nbsp;&nbsp;${data.stockName}&nbsp;&nbsp;</h2>
</div>

<div class="heading">
  <h2 class="heading2">&nbsp;&nbsp;Fundamental Data&nbsp;&nbsp;</h2>
</div>

<div class="data2-2 flex mt15">
        <h3 class="child marginb">Last Price</h3>
        <h3 class="child marginb" style="color: white">$${data.lastPrice} <sup> $${difference!==undefined?difference:'NA'} </sup> <sup class=${underOrOverValue}> ${underOrOverValue}</sup></h3>
        </div>

        <div class="data2-2 flex">
<h3 class="child marginb">PE Ratio</h3>
<h3 class="child marginb" style="color: white">${summaryData.PERatio.value}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Earnings Per Share</h3>
<h3 class="child marginb" style="color: white">${summaryData.EarningsPerShare.value}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Ex Dividend Date</h3>
<h3 class="child marginb" style="color: white">${summaryData.ExDividendDate.value}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Share Volume</h3>
<h3 class="child marginb" style="color: white">${summaryData.ShareVolume.value}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Average Volume</h3>
<h3 class="child marginb" style="color: white">${summaryData.AverageVolume.value}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">PEG Ratio</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.pegr.pegValue}</h3>
</div>

${data.data1.data.gr.peGrowthChart.length>0?`<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.gr.peGrowthChart[0].x} ${data.data1.data.gr.peGrowthChart[0].z}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.gr.peGrowthChart[0].y}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.gr.peGrowthChart[1].x} ${data.data1.data.gr.peGrowthChart[1].z}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.gr.peGrowthChart[1].y}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.gr.peGrowthChart[2].x} ${data.data1.data.gr.peGrowthChart[2].z}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.gr.peGrowthChart[2].y}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.gr.peGrowthChart[3].x} ${data.data1.data.gr.peGrowthChart[3].z}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.gr.peGrowthChart[3].y}</h3>
</div>`:''}

${data.data1.data.per.peRatioChart.length>0?`<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.per.peRatioChart[0].x}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.per.peRatioChart[0].y}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.per.peRatioChart[1].x}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.per.peRatioChart[1].y}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.per.peRatioChart[2].x}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.per.peRatioChart[2].y}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">${data.data1.data.per.peRatioChart[3].x}</h3>
<h3 class="child marginb" style="color: white">${data.data1.data.per.peRatioChart[3].y}</h3>
</div>`:''}

<div class="data2-2 flex">
<h3 class="child marginb">Float</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[0]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">% Held by Insiders</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[1]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">% Held by Institutions</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[2]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Total Debt</h3>
<h3 class="child marginb" style="color: white">$${data.otherdata[3]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Total Cash</h3>
<h3 class="child marginb" style="color: white">$${data.otherdata[4]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Net Income</h3>
<h3 class="child marginb" style="color: white">$${data.otherdata[5]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Current Ratio</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[6]}</h3>
</div>

</div>`;
selectElement.insertAdjacentHTML("beforeend", html);


  }else{
    document.querySelector(`.modal-loding-parent`).remove()
alert(`data for ${data.stockName} is not available`)
  }
    })
    
  }
}


function fetchEtfData(etf) {
  console.log(etf)
let countertoremoveloading=0;
  for (let i = 0; i < etf.length; i++) {
    fetch(`${originurl}/etfdata?etfName=${etf[i]}`)
    .then(response => response.json())
    .then(data => {
  console.log(data)
  if(data.error==undefined){

    countertoremoveloading++;
    if(countertoremoveloading==etf.length){
    document.querySelector(`.modal-loding-parent`).remove()
      }
    let selectElement = document.querySelector(".for-data");
    let html = `<div class="datap1">
    <div class="script">
      <h2 class="scriptnam">&nbsp;&nbsp;${data.etfName}&nbsp;&nbsp;</h2>
    </div>
    
    <div class="heading">
      <h2 class="heading2">&nbsp;&nbsp;Fundamental Data&nbsp;&nbsp;</h2>
    </div>

    <div class="data2-2 flex">
    <h3 class="child marginb">last price</h3>
    <h3 class="child marginb" style="color: white">${data.lastPrice}</h3>
    </div>
    
    <div class="data2-2 flex">
    <h3 class="child marginb">Volume</h3>
    <h3 class="child marginb" style="color: white">${data.vol}</h3>
    </div>
    
    <div class="data2-2 flex">
    <h3 class="child marginb">Avg. Volume</h3>
    <h3 class="child marginb" style="color: white">${data.avgvol}</h3>
    </div>
    
    <div class="data2-2 flex">
    <h3 class="child marginb">NAV</h3>
    <h3 class="child marginb" style="color: white">$${data.nav}</h3>
    </div>
    
    <div class="data2-2 flex">
    <h3 class="child marginb">Yield</h3>
    <h3 class="child marginb" style="color: white">$${data.yield}</h3>
    </div>
    
    </div>`;
    selectElement.insertAdjacentHTML("beforeend", html);

  }else{
    document.querySelector(`.modal-loding-parent`).remove()
alert(`data for ${data.etfName} is not available`)
  }
    })
    
  }
}



function fetchPennyData(stocks) {
  console.log(stocks)
let countertoremoveloading=0;
  for (let i = 0; i < stocks.length; i++) {
    fetch(`${originurl}/pennystocks?pennyStockName=${stocks[i]}`)
    .then(response => response.json())
    .then(data => {
  console.log(data)
  if(data.error===undefined){

    let underOrOver;
    let underOrOverValue;
    let difference;
    try{
      if(!(Number(data.pe)<=0) || !(Number(data.eps.replace('$',''))<=0)){
   underOrOver=Number(data.pe)*Number(data.eps);
    
    if(underOrOver<=data.lastPrice){underOrOverValue='underValued'}
    if(underOrOver>data.lastPrice){underOrOverValue='overValued'}

    difference = Math.abs(data.lastPrice-underOrOver);
    difference=Math.floor(difference * 100) / 100;
    difference=difference.toFixed(2);
      }
      else{underOrOverValue='$NA'}
  }catch(error){
    console.log(error)
  }
console.log(data,underOrOverValue,difference)
countertoremoveloading++;
if(countertoremoveloading===stocks.length){
document.querySelector(`.modal-loding-parent`).remove()
  }
let selectElement = document.querySelector(".for-data");
let html = `<div class="datap1">
<div class="script">
  <h2 class="scriptnam">&nbsp;&nbsp;${data.pennyStockName}&nbsp;&nbsp;</h2>
</div>

<div class="heading">
  <h2 class="heading2">&nbsp;&nbsp;Fundamental Data&nbsp;&nbsp;</h2>
</div>

<div class="data2-2 flex mt15">
        <h3 class="child marginb">Last Price</h3>
        <h3 class="child marginb" style="color: white">$${data.lastPrice} <sup> $${difference!==undefined?difference:'NA'} </sup> <sup class=${underOrOverValue}> ${underOrOverValue}</sup></h3>
        </div>

        <div class="data2-2 flex">
<h3 class="child marginb">PE Ratio</h3>
<h3 class="child marginb" style="color: white">${data.pe}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Earnings Per Share</h3>
<h3 class="child marginb" style="color: white">${data.eps}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Ex Dividend Date</h3>
<h3 class="child marginb" style="color: white">${data.exdividend}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Share Volume</h3>
<h3 class="child marginb" style="color: white">${data.vol}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Average Volume</h3>
<h3 class="child marginb" style="color: white">${data.avgvol}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">PEG Ratio</h3>
<h3 class="child marginb" style="color: white">${data.pegratio}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Float</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[0]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">% Held by Insiders</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[1]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">% Held by Institutions</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[2]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Total Debt</h3>
<h3 class="child marginb" style="color: white">$${data.otherdata[3]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Total Cash</h3>
<h3 class="child marginb" style="color: white">$${data.otherdata[4]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Net Income</h3>
<h3 class="child marginb" style="color: white">$${data.otherdata[5]}</h3>
</div>

<div class="data2-2 flex">
<h3 class="child marginb">Current Ratio</h3>
<h3 class="child marginb" style="color: white">${data.otherdata[6]}</h3>
</div>

</div>`;
selectElement.insertAdjacentHTML("beforeend", html);


  }else{
    document.querySelector(`.modal-loding-parent`).remove()
alert(`data for ${data.pennyStockName} is not available`)
  }
    })
    
  }
}