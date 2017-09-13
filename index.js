console.log('Programm Start....');


// Demodaten
var orderItem = {id: 1, Article: 1, quantity: 56};
var article = {name: "Article 1", id: 1};
var comodityCodes = [{quantity: 100, id: 1, article: 1}, {quantity: 50, id: 2, article: 1}, {quantity: 25, id: 3, article: 1}, {quantity: 150, id: 4, article: 1},{quantity: 20, id: 5, article: 1}];

var stocks = [{id: 1, comodityCodeId: 1, stock: 0},{id: 2, comodityCodeId: 2, stock: 10},{id: 3, comodityCodeId: 3, stock: 10},{id: 4, comodityCodeId: 4, stock: 10},{id: 5, comodityCodeId: 5, stock: 10}];


// Start
console.log('Start -> CC sortieren...');
comodityCodes.sort(function(a, b) {
    return parseInt(b.quantity) - parseInt(a.quantity);
});
console.log('Fertig -> CC sortieren. Ergebnis: ' + JSON.stringify(comodityCodes));
console.log('----------------------------------------------------------------------------');


console.log('Start -> PZN Berechnen...');
var mengeUebrig = orderItem.quantity;
var ccAuslagern = [];
comodityCodes.forEach((comodityCode, index, array) => {
    console.log('-----------');
    console.log('Aktuelles: ' + comodityCode.quantity + " | " + mengeUebrig);
    // if CC ist noch verfügbar
    var mengeIstGroeßerAlsCC = (mengeUebrig >= comodityCode.quantity);
    if (mengeIstGroeßerAlsCC) {
        var menge = mengeUebrig / comodityCode.quantity;
        console.log('Menge: ' + menge);
        
        console.log('Stock -> '  + comodityCode.quantity + ' - ' + getStock(comodityCode, stocks));
        if (getStock(comodityCode, stocks) === 0) { return; }
        mengeUebrig -=comodityCode.quantity*Math.floor(menge);
        console.log('Menge Theoretisch Übrig: ' + mengeUebrig);
        
        var mengeUebrigGroeßerAlsCC = !(comodityCode.quantity <= mengeUebrig);
        if (mengeUebrigGroeßerAlsCC) {
            menge =+ Math.floor(menge);
            console.log('Menge abgerundet: ' + menge);   
            mengeUebrig /= menge;
            console.log('Menge Übrig: ' + mengeUebrig);
            ccAuslagern.push({comodityCode: comodityCode.quantity, menge: menge});
        } else {
            menge =+ Math.ceil(menge);
            console.log('Menge aufgerundet: ' + menge);   
            mengeUebrig /= menge;
            console.log('Menge Übrig: ' + mengeUebrig);
            ccAuslagern.push({comodityCode: comodityCode.quantity, menge: menge});
        }
    }
    
});
if (mengeUebrig < comodityCodes[comodityCodes.length-1].quantity || (mengeUebrig !== 0)) {
    comodityCodes.forEach((item, index, array) => {
        if (mengeUebrig >= item.quantity && array[index-1] !== undefined && mengeUebrig <= array[index-1].quantity) {
            ccAuslagern.push({comodityCode: array[index-1].quantity, menge: 1});
        }
    });
}
// Wenn alle Packungsgrößen größer als Quantity von OrderItem wird die kleinste in passender Menge ausgegeen
if (ccAuslagern.length === 0) {
    comodityCodes.sort(function(a, b) {
        return parseInt(a.quantity) - parseInt(b.quantity);
    });
    var comodityCode = comodityCodes[0];
    var menge = Math.ceil(orderItem.quantity / comodityCode.quantity);
    ccAuslagern.push({comodityCode: comodityCode.quantity, menge: menge});
}
console.log('Fertig -> PZN Berechnen. Ergebnis: '  + JSON.stringify(ccAuslagern));
console.log('----------------------------------------------------------------------------');


function getStock(comodityCode, stocks) {
    var result = 0;
    for (i = 0; i <= stocks.length-1; i++) {
        if (comodityCode.id === stocks[i].comodityCodeId) {
            result = stocks[i].stock;
        }
    }
    return result;
}