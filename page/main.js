document.addEventListener("DOMContentLoaded", function () {
    console.log(document.domain);//It outputs id of extension to console
    chrome.tabs.query({ //This method output active URL 
        "active": true,
        "currentWindow": true,
        "status": "complete",
        "windowType": "normal"
    }, function (tabs) {
        for (tab in tabs) {
            console.log(tabs[tab].url);
        }
    });
});

const noRes = document.getElementsByClassName("nores")[0];
const moreLink = document.getElementsByClassName("more")[0];
const moreLink2 = document.getElementsByClassName("more")[1];
const items = document.getElementsByClassName("items")[0];
const moreItems = document.getElementsByClassName("more-items-page")[0];
const moreItemsMore = document.getElementsByClassName("more-items")[0];
let scriptDomains; 
let mainHTML;
const back = document.getElementsByClassName("fa-chevron-left")[0];

const timer = document.getElementsByClassName("timer")[0];

const input = document.getElementById("new-res");

chrome.storage.sync.get('dist', (dist) => {
    console.log(dist.dist);
    if (dist.dist < 0) {
        timer.style.display = "none";
    } else {
        console.log('not less than 0');
        chrome.storage.sync.get('timer', (timers) => {
            runTimer(timers);
            console.log(timers.timer);
        });
    } 
});

chrome.storage.sync.get('domains', (data) => {
    console.log('domains', data.domains);
    moreLink.style.display = "none"
    scriptDomains = data.domains;
    if (scriptDomains.length === 0) {
        noRes.textContent = "No Restrictions!"
    } else {
        noRes.textContent = scriptDomains.length === 1 ? `1 Restriction` : `${scriptDomains.length} Restrictions`;

        const reversedItems = scriptDomains.map(function iterateItems(item) {
            return item; // or any logic you want to perform
        }).reverse();

        console.log(reversedItems);

        for (let x = 0; x < reversedItems.length; x++) {
            items.innerHTML += 
            `
            <div class="restricted-item">
                <span>${reversedItems[x]}</span>
                <i class="fas fa-trash" id="item-${x}" onclick="deleteRes(this.id)"></i>
            </div>
            `;

            if (x === 2) { break };
        }

        if (scriptDomains.length > 3) {
            moreLink.style.display = "block";
            // moreLink.textContent = `View ${scriptDomains.length - 3} More`
        }
    }
});

moreLink.addEventListener("click", () => {
    moreItems.style.display = "flex";

    for (let x = 0; x < scriptDomains.length; x++) {
        moreItemsMore.innerHTML += `
        <div class="restricted-item">
            <span>${scriptDomains[x]}</span>
            <i class="fas fa-trash"></i>
        </div>
        `;
    }
});

moreLink2.addEventListener("click", () => {
    moreItems.style.display = "flex";

    for (let x = 0; x < scriptDomains.length; x++) {
        moreItemsMore.innerHTML += `
        <div class="restricted-item">
            <span>${scriptDomains[x]}</span>
            <i class="fas fa-trash"></i>
        </div>
        `;
    }
});

back.addEventListener("click", () => {
    moreItems.style.animation = "slidein 0.3s"
    setTimeout(() => {
        moreItems.style.display = "none";
        moreItemsMore.innerHTML = '';
        moreItems.style.animation = "slide 0.3s"
    }, 300)
});

input.addEventListener("keypress", (e) => {
    if (e.which == 13 || e.keyCode == 13) {
        if (!e.target.value.includes("www.") || !e.target.value.includes(".")) {
            // don't add
        } else {
            console.log("pushing!", e.target.value);
            scriptDomains.push(e.target.value);

            chrome.storage.sync.set( { domains: scriptDomains } );
            
            if (scriptDomains.length < 3) {
                items.innerHTML += 
            `
                <div class="restricted-item">
                    <span>${e.target.value}</span>
                    <i class="fas fa-trash"></i>
                </div>
                `;
            } 

            if (moreLink.style.display != "none") {
                chrome.storage.sync.get('domains', (data) => {
                    scriptDomains = data.domains;
                    // moreLink.textContent = `View ${scriptDomains.length - 3} More`
                });
            }
        }
    }
});

// const hour = document.getElementById("hour");
// const minutes = document.getElementById("minutes");
// const seconds = document.getElementById("seconds");
const timeLarge = document.getElementsByClassName("time-large")[0];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const runTimer = (time) => {
    let date = new Date();
    let month = months[date.getMonth()];
    let dateDay = date.getDate();
    let year = date.getFullYear();

    const statement = `${month} ${dateDay}, ${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const statement2 = `${month} ${dateDay}, ${year} ${date.getHours()}:${date.getMinutes() + time}:${date.getSeconds()}`;
    
    var countDownDate = new Date(statement2).getTime();

    timer.style.display = "none";

    setInterval(() => {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var hour2 = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes2 = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds2 = Math.floor((distance % (1000 * 60)) / 1000);

        console.log(hour2, minutes2, seconds2);
        timeLarge.textContent = `${hour2}:${minutes2}:${seconds2}`;
        chrome.storage.sync.set( { timer: `${hour2}:${minutes2}:${seconds2}` } );
        chrome.storage.sync.set( { dist: distance } );

        if (distance < 0) {
            clearInterval(runTimer);
            timer.style.display = "none";
        }
    }, 1000);
}

const startBtn = document.getElementById("start-btn");
const timeValue = document.getElementById("time-value");
let time;

startBtn.addEventListener("click", () => {
    time = parseInt(timeValue.value);
    runTimer(time);
});