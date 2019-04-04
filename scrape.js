const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

var URL = '';

facultyScraper('cis');
function facultyScraper(setDepartment){
    URL = 'https://www.bmcc.cuny.edu/academics/departments/' + setDepartment + '/faculty/';
    startJSONBuilder();
}

function startJSONBuilder()
{
    (async () => {
        const response = await request ({
                uri: URL,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'Host': 'www.bmcc.cuny.edu',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36',
                }, 
                gzip:true
            }
        );
        let $;
        try {
         $ = cheerio.load(response);
        } catch (error) {
            console.log(error);
        }
        
        let facultyNames = [];
        let name='';
        $('div.wpb_wrapper div.user_group').last().find('div.faculty p a').each((i,elm) => {
            try {                
                name = $(elm).text();
                facultyNames.push(({name}));
            } catch (error) {
                console.log(error);
            }
        });

        $('div.wpb_wrapper div.user_group').last().find('div.faculty.alt p a').each((i,elm) => {
            try {                
                name = $(elm).text();
                facultyNames.push({name});
            } catch (error) {
                console.log(error);
            }
        });
    
        let j = 0;
        let facultyInfo = [];
        let eMail, phone, roomNumber, officeHours = '';
        $('div.wpb_wrapper div.user_group').last().find('div.faculty div.email a[href="#"] span').each((i,elm) => {
            eMail = $(elm).text().match('(?<=Email:)(.*)(?=Phone:)')[0].trim();
            phone = $(elm).text().match('(?<=Phone:)(.*)(?=Room:)')[0].trim();
            roomNumber = $(elm).text().match('(?<=Room:)(.*)(?=Office Hours:)')[0].trim();
            officeHours = $(elm).text().match('(?<=.*Office Hours:)(.*)')[0].trim();
            try { 
                facultyInfo.push({
                        eMail,
                        phone,
                        roomNumber,
                        officeHours,
                });
            } catch (error) {
                console.log(error);
            }
        });
    
        $('div.wpb_wrapper div.user_group').last().find('div.faculty.alt div.email a[href="#"] span').each((i,elm) => {
            eMail =  $(elm).text().match('(?<=Email:)(.*)(?=Phone:)')[0].trim();
            phone = $(elm).text().match('(?<=Phone:)(.*)(?=Room:)')[0].trim();
            roomNumber = $(elm).text().match('(?<=Room:)(.*)(?=Office Hours:)')[0].trim();
            officeHours = $(elm).text().match('(?<=.*Office Hours:)(.*)')[0].trim();
            try {
                facultyInfo.push({
                    eMail,
                    phone,
                    roomNumber,
                    officeHours,
                });
            } catch (error) {
                console.log(error);
            }
        });


    
        var facultyInfoArray = new Array(facultyNames.length);
        for (var i = 0; i < facultyInfoArray.length; i++)
        {
            facultyInfoArray[i] = new Array(2);
            for (var x = 0; x < 2; x++)
            {
                if (x==0)
                {
                    try {
                        facultyInfoArray[i][x]=facultyNames[i];
                    } catch (error) {
                        console.log(error);
                    }
                }
                if (x==1)
                {
                    try{
                        facultyInfoArray[i][x]= facultyInfo[i];
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }

        try {
            fs.writeFileSync('data.json',JSON.stringify(facultyInfoArray), 'utf-8');
        } catch (error) {
            console.log(error);
        }
    })();
}