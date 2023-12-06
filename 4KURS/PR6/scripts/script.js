const header = document.querySelector('header')
const section = document.querySelector('section')

const requestURL = 'https://ruslantuz.github.io/lab_js/pr_6/json/index.json';

const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';

request.send();

request.onload = function(){
    const superHeroes = request.response;
    populateHeader(superHeroes);
    showHeroes(superHeroes);
}

function populateHeader(superHeroes){
    const squadName = document.createElement('h1');
    const squadinfo = document.createElement('p');

    squadName.textContent = superHeroes.squadName;
    squadinfo.textContent = "Hometown: " + superHeroes.homeTown + " // Formed: " + superHeroes.formed;
    
    header.appendChild(squadName);
    header.appendChild(squadinfo);
}
function showHeroes(superHeroes){
    superHeroes.members.forEach(
        (member) => {
            const article = document.createElement('article');

            const memberName = document.createElement('h2');
            memberName.textContent = member.name;
            
            const secretIdentity = document.createElement('p');
            secretIdentity.textContent = "Secret Identity: " + member.secretIdentity;
            
            const age = document.createElement('p');
            age.textContent = "Age: " + member.age;
            
            const superPowersHead = document.createElement('p');
            superPowersHead.textContent = "Superpowers:";
            
            const powerList = document.createElement('ul');

            member.powers.forEach((power) => {
                const powerInfo = document.createElement('li');
                powerInfo.textContent = power;
                powerList.appendChild(powerInfo);
            })

            article.append(memberName, secretIdentity, age, superPowersHead, powerList);
            section.appendChild(article);
        }); 
}