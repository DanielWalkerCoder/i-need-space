let addressFields = document.querySelectorAll('.fullAddress')
let satInfo = document.querySelector('ul')
let locations = []

document.querySelector('#search1').addEventListener('click', () =>{
    satInfo.innerHTML = ''
    locations = []
    let fetchURL = addressURL(addressFields[0].value, addressFields[1].value, addressFields[2].value, addressFields[3].value, addressFields[4].value, addressFields[5].value, addressFields[6].value)
    console.log(fetchURL)
    getAnswer(fetchURL, addressFields[7].value)
})

function makeUsable(strb){
    if(strb !== ''){
            let usableStrb = '';
            for(let i = 0; i < strb.length; i++){
                if(strb[i] === ' '){
                    usableStrb += '+'
                } else
                if(strb[i] !== '.' && strb[i] !== ','){
                    usableStrb += strb[i]
                }
            }
            return usableStrb
            }
}

function addressURL(str1, str2, str3, str4, str5, str6, str7){
    if(str1 === ''){
        return `https://geocode.maps.co/search?street=${makeUsable(str2)}+${makeUsable(str3)}&city=${makeUsable(str4)}&state=${makeUsable(str5)}&postalcode=${makeUsable(str6)}&country=${makeUsable(str7)}`
    } else{
        let resURL = 'https://geocode.maps.co/search?q=' + makeUsable(str1)
        let strArr = [str2, str3, str4, str5, str6, str7]
        for(strMember of strArr){
            if(strMember !== ''){
                resURL += '+'
                resURL += makeUsable(strMember)
            }
        }
        return resURL
    }
}

// function getAnswer(url, satNum){
//     fetch(url)
//         .then(res => res.json())
//         .then(result =>{
//             locations = result
//             for(let i = 0; i < result.length; i++){
//                 fetch `https://satellites.fly.dev/passes/${satNum}?lat=${result[i].lat}&lon=${result[i].lon}&limit=1&days=15&visible_only=true`
//                     .then(res => res.json())
//                     .then(stuff =>{
//                         let newLI = document.createElement('li')
//                         let newP = document.createElement('p')
//                         newP.innerText = `At the location of "${locations[i]['display_name']}", the next satellite visible to the naked eye will appear on the horizon at ${stuff[0].rise.utc_datetime} UTC and set at ${stuff[0].set.utc_datetime}.`
//                         newLI.appendChild(newP)
//                         satInfo.appendChild(newLI)
//                     })    
//             }
//         })
// }

function getAnswer(url, satNum){
    fetch(url)
        .then(res => res.json())
        .then(result =>{
            locations = result
            let latitude = result[0].lat
            let longitude = result[0].lon
            return `https://satellites.fly.dev/passes/${satNum}?lat=${latitude}&lon=${longitude}&limit=1&days=15&visible_only=true`
        })
        .then(finalURL =>{
            console.log(finalURL)
            fetch(finalURL)
                .then(res => res.json())
                .then(result =>{
                    console.log(result)
                    console.log(locations)
                    let newLI = document.createElement('li')
                    let newP = document.createElement('p')
                    newP.innerText = `At the location of "${locations[0]['display_name']}", the next satellite visible to the naked eye will appear on the horizon at ${result[0].rise.utc_datetime} UTC and set at ${result[0].set.utc_datetime}. It will travel from ${result[0].rise.az_octant} to ${result[0].culmination.az_octant} to ${result[0].set.az_octant}.`
                    newLI.appendChild(newP)
                    satInfo.appendChild(newLI)
                })
        })
}