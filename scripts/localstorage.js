function saveToLocalStorage(name) {
    console.log("Saving to local storage: ", name);
    let nameArr = getFromLocalStorage();
    if (!nameArr.includes(name)) {
        nameArr.push(name);
    }
    localStorage.setItem('favorites', JSON.stringify(nameArr));
}

function getFromLocalStorage() {
    let localStorageData = localStorage.getItem('favorites');
    if (localStorageData === null) {
        return [];
    }
    return JSON.parse(localStorageData);
}

function removeFromLocalStorage(name) {
    let localStorageData = getFromLocalStorage();
    let nameIndex = localStorageData.indexOf(name);
    if (nameIndex !== -1) {
        localStorageData.splice(nameIndex, 1);
        localStorage.setItem('favorites', JSON.stringify(localStorageData));
    }
}

export { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage };