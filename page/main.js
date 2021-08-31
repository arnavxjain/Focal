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
const items = document.getElementsByClassName("items")[0];
const moreItems = document.getElementsByClassName("more-items-page")[0];
const moreItemsMore = document.getElementsByClassName("more-items")[0];
let scriptDomains; 
let mainHTML;
const back = document.getElementsByClassName("fa-chevron-left")[0];


// chrome.storage.sync.set( { domains: [] } );

const input = document.getElementById("new-res");

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
