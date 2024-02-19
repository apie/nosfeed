let catCount = {}
const categories = new Set();
const DEBUG = new URLSearchParams(window.location.search).get('debug') === 'true';
const maxItemsPerFeed = localStorage.getItem('maxItemsPerFeed') || 10;
const maxItems = localStorage.getItem('maxItems') || 20;
const hideSeenDays = 5;
[10, 20, 50, 100].forEach((m) => {
    var btn = btnTmpl.content.cloneNode(true).querySelector('button')
    btn.textContent = m;
    if (m == maxItemsPerFeed) btn.classList.add('active');
    btnContainer.append(btn);
});
[10, 20, 50, 100].forEach((m) => {
    var btn = maxMsgBtnTmpl.content.cloneNode(true).querySelector('button')
    btn.textContent = m;
    if (m == maxItems) btn.classList.add('active');
    maxMsgBtnContainer.append(btn);
});

blacklistInput.value = localStorage.getItem('blackList') || '';
function saveBlackList(e) {
    localStorage.setItem('blackList', e.value);
};

function toggleItemsPerFeed(e) {
    localStorage.setItem('maxItemsPerFeed', e.textContent);
    Array.from(e.parentElement.children).forEach((c) => c.classList.remove('active'));
    e.classList.toggle('active');
    //window.location.reload();
};

function toggleMaxItems(e) {
    localStorage.setItem('maxItems', e.textContent);
    Array.from(e.parentElement.children).forEach((c) => c.classList.remove('active'));
    e.classList.toggle('active');
    //window.location.reload();
};

function toggleHideSeen(e) {
    localStorage.setItem('hideSeen', e.checked);
};

let ignoredCategories = JSON.parse(localStorage.getItem('ignoredCategories') || '{}');
function toggleCategory(e) {
    ignoredCategories[e.innerText] = !Boolean(ignoredCategories[e.innerText]);
    localStorage.setItem('ignoredCategories', JSON.stringify(ignoredCategories));
    e.classList.toggle('negeren');
    //window.location.reload();
};

function markSeen(e) {
    if (localStorage.getItem('hideSeen') !== 'true') return;
    if (DEBUG) console.log('marking as seen '+e.href);
    // expire in a few days
    document.cookie = `${e.href}=seen; max-age=${60*60*24*hideSeenDays}; SameSite=Strict;`;
    // hide the card
    e.parentElement.parentElement.style.display="none";
}
var seen = new Set();
if (localStorage.getItem('hideSeen') === 'true') {
    hideseencheckbox.checked = true;
    // Load opened items from cookie and add to seen-set
    let c = document.cookie;
    c.split(';').map((c) => c.split('=')[0].trim()).forEach((u) => seen.add(u));
};

function addItem(item) {
    const title = item.getElementsByTagName('title')[0].textContent;
    if (blacklistInput.value.split(',').filter((b) => title.toLowerCase().indexOf(b.trim().toLowerCase()) !== -1 && b).length > 0) {
        if (DEBUG) console.log('ignoring item '+title);
        return;
    };

    const link = item.getElementsByTagName('link')[0].textContent;
    if (seen.has(link)) {
        if (DEBUG) console.log('seen '+title);
        return;
    }
    seen.add(link);

    const category = item.getElementsByTagName('category')[0].textContent;
    categories.add(category);
    if (ignoredCategories[category]) {
        if (DEBUG) console.log('IGNORING '+category);
        return
    };
    if (!catCount.hasOwnProperty(category)) catCount[category] = 0;
    catCount[category] += 1;
    if (catCount[category] > maxItemsPerFeed) return;

    const description = item.getElementsByTagName('description')[0].textContent;
    const enclosure = item.getElementsByTagName('enclosure');
    const pubDate = item.getElementsByTagName('pubDate')[0].textContent;

    var it = cardTmpl.content.cloneNode(true)
    it.querySelector('h5').innerText = title;
    it.querySelector('p').innerText = description.trim().replaceAll('<p>', '').replaceAll('</p>', '').substr(0, 100)+'...';
    if(enclosure.length) it.querySelector('img').setAttribute('src', enclosure[0].getAttribute('url'));
    it.querySelector('img').setAttribute('title', category);
    it.querySelector('a').setAttribute('href', link);
    it.querySelector('small.pubdate').innerText = timeSince(new Date(pubDate))+' geleden';
    it.querySelector('small.pubdate').setAttribute('title', pubDate);
    it.querySelector('small.category').innerText = category;
    container.append(it);
    return true;
}

function printCategories () {
    categories.forEach((name) => {
        var cat = catTmpl.content.cloneNode(true)
        cat.querySelector('li').innerText = name;
        if (ignoredCategories[name]) {
            if (DEBUG) console.log('ignoring '+name);
            cat.querySelector('li').classList.add('negeren');
        };
        categoriesul.append(cat);
    });
};


async function readFeed() {
    let resp= await fetch('combined.rss')
    let inStr = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(inStr, "application/xml");
    loader.remove();

    items = doc.documentElement.getElementsByTagName('channel')[0].getElementsByTagName('item');
    visibleItems = 0;
    for(p = 0; p < items.length; p++) {
        if (addItem(items[p])) visibleItems++;
        if (visibleItems >= maxItems) break;
    }
    printCategories();
};

