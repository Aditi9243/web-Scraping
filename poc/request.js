// npm install request=>. npm playstore => local machine 
// console.log("hello");
// use => require
// include import require 
// /logic => implementation => libraray => function 
let request=require("request");
// npm install cheerio 
let cheerio=require("cheerio");
// preinstalled
let fs=require("fs");
let path=require("path");
//  input => url , fn
// AllMatch URL 
request("https://www.espncricinfo.com/series/_/id/8048/season/2020/indian-premier-league",MainMatchCb)
function MainMatchCb(err,res,html){
    let sTool= cheerio.load(html);
    let allmatchPageUrl=  sTool("a[data-hover='View All Results']").attr("href");
    let fUrl="https://www.espncricinfo.com"+allmatchPageUrl;
    AllMatchPage(fUrl);
}
function AllMatchPage(fUrl){
    request (fUrl,getAMUrl);
    function getAMUrl(err,resp,html){
        // console.log(html);
     let sTool= cheerio.load(html);
      let allmatchUrlElem=  sTool("a[data-hover='Scorecard']");
      for(let i=0;i<allmatchUrlElem.length;i++){
      let href=    sTool(allmatchUrlElem[i]).attr("href");
     let fUrl="https://www.espncricinfo.com"+href;
     findDataofAMatch(fUrl);
      }
    }
}

function findDataofAMatch(url){
    request(url,whenDataArrive);
    function whenDataArrive(err,resp,html){
        // console.log(html);
        // create file => content 
        console.log("recieved html");
        // function => speceific paramater => data
        // browser=> parse => ui show 
        // nodejs => parse => extract 
        
        // single entry
    //   let resultElem=sTool("div.desc.text-truncate");
    
    //   console.log(resultElem.text());
    // /html => element
    // css syntax 
    let sTool= cheerio.load(html);
    let tableElem=sTool("div.card.content-block.match-scorecard-table .Collapsible");
    console.log(tableElem.length);
    // let Inninghtml="<table>";
    let count=0;
    for(let i=0;i<tableElem.length;i++){
        // text ,cheerio=> wrap
        // html => element html
        let rowsOfATeam=sTool(tableElem[i]).find(".table.batsman").find("tbody tr");
        let teamName= sTool(tableElem[i]).find("h5.header-title.label").text();
        // Royal Challengers Bangalore Innings (20 overs maximum)
        // [Royal Challengers Bangalore , (20 overs maximum)]
       let teamStrArr= teamName.split("Innings");
       teamName=teamStrArr[0].trim();
        console.log(teamName);
    for(let j=0;j<rowsOfATeam.length;j++){
       let  rCols=sTool(rowsOfATeam[j]).find("td"); 
       let isBatsManRow= sTool(rCols[0]).hasClass("batsman-cell");
        if(isBatsManRow==true){
        count++;
        let pName= sTool(rCols[0]).text().trim();
        let runs= sTool(rCols[2]).text().trim();
        let balls= sTool(rCols[3]).text().trim();
        let fours= sTool(rCols[5]).text().trim();
        let sixes= sTool(rCols[6]).text().trim();
        let sr= sTool(rCols[7]).text().trim();
        
        // console.log(`Name:${pName} Runs: ${runs} Balls: ${balls} Fours: ${fours} Sixes: ${sixes} Sr:${sr}`);
        processPlayer(teamName,pName,runs,balls,fours,sixes,sr);
        }
    }
    // console.log("No of batsman of in a team",count);
    count=0;
    //   console.log(cInning.html());
    //   Inninghtml+=psOfATeam;
      console.log("***********************************************************************");
    }
    } 
}

function processPlayer(team,name,runs,balls,fours,sixes,sr){
// teamName=> does this entry belongs to an existing team
let dirPath=team;
let  pMatchStats={
    Team:team,
    Name:name,
    Balls:balls,
    Fours:fours,
    Sixes:sixes,
    Sr:sr,
    Runs:runs
}
if (fs.existsSync(dirPath)) {
    // file check 
// console.log("Folder exist")
}else{
    // create folder 
    // create file
    // add data
    fs.mkdirSync(dirPath);
}
let playerFilePath= path.join(dirPath,name+".json");
let pData=[];
if(fs.existsSync(playerFilePath)){
    
 pData=require(`./${playerFilePath}`);
 pData.push(pMatchStats);
}else{
// create file
console.log("File of player",playerFilePath,"created");
pData=[pMatchStats];
}
fs.writeFileSync(playerFilePath,JSON.stringify(pData));



// if => file exist=> append : create ,add data

//=>   check if player's excel file exist or not
// exist=> data append
// create new new file and add data




}

 
