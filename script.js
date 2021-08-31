let domains = [];

chrome.storage.sync.get('domains', (data) => {
    domains = data.domains;
    console.log(document.domain);
    console.log(domains);
    console.log(domains.includes(document.domain));

    if (domains.includes(document.domain)) {
        console.log("closing now!");
        window.close();
    }
});