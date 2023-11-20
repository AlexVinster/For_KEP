var tab;
var tabContent;

window.onload = function () {
    tabContent = document.getElementsByClassName('tabContent');
    tab = document.getElementsByClassName('tab');
    hideTabsContent(1);
}

function hideTabsContent(a) {
    for (var i = a; i < tabContent.length; i++) {
        tabContent[i].classList.remove('show');
        tabContent[i].classList.add('hide');
        tab[i].classList.remove('whiteborder');
    }
}

document.getElementById('tabs').onclick = function (event) {
    var target = event.target;
    if (target.className == 'tab') {
        for (var i = 0; i < tab.length; i++) {
            if (target == tab[i]) {
                showTabsContent(i);
                break;
            }
        }
    }
}

function showTabsContent(b) {
    if (tabContent[b].classList.contains('hide')) {
        hideTabsContent(0);
        tab[b].classList.add('whiteborder');
        tabContent[b].classList.remove('hide');
        tabContent[b].classList.add('show');
    }
}

var rtl = document.getElementById('rtl');
var rtr = document.getElementById('rtr');
var rbr = document.getElementById('rbr');
var rbl = document.getElementById('rbl');
var ttl = document.getElementById('ttl');
var ttr = document.getElementById('ttr');
var tbr = document.getElementById('tbr');
var tbl = document.getElementById('tbl');
var block = document.getElementById('block');
var cssCode = document.getElementById('cssCode');
var mtr = document.getElementById('mtr');
var mrr = document.getElementById('mrr');
var mbr = document.getElementById('mbr');
var mlr = document.getElementById('mlr');
var mtb = document.getElementById('mtb');
var mrb = document.getElementById('mrb');
var mbb = document.getElementById('mbb');
var mlb = document.getElementById('mlb');

function generate() {
    cssCode.value = "";

    var topLeft = rtl.value + "px";
    var topRight = rtr.value + "px";
    var bottomRight = rbr.value + "px";
    var bottomLeft = rbl.value + "px";
    ttl.value = rtl.value;
    ttr.value = rtr.value;
    tbr.value = rbr.value;
    tbl.value = rbl.value;
    block.style.borderRadius = topLeft + " " + topRight + " " + bottomRight + " " + bottomLeft;
    cssCode.value += `border-radius: ${topLeft} ${topRight} ${bottomRight} ${bottomLeft};\n`;
}

function generateMargin() {
    const marg = document.getElementById('marg');

    var top = mtr.value + "px";
    var right = mrr.value + "px";
    var bottom = mbr.value + "px";
    var left = mlr.value + "px";

    mtb.value = mtr.value;
    mrb.value = mrr.value;
    mbb.value = mbr.value;
    mlb.value = mlr.value;

    marg.style.margin = top + " " + right + " " + bottom + " " + left;

    const cssCode = `margin: ${top} ${right} ${bottom} ${left}; \n`;
    document.getElementById('cssCode2').value = cssCode;
}

function generateMaxHeight() {
    const block = document.getElementById('block');
    const blockWrapper = document.getElementById('blockWrapper');
    const maxHeightRange = document.getElementById('maxHeightRange');
    const maxHeightValue = document.getElementById('maxHeightValue');

    const maxHeight = `${maxHeightRange.value}px`;
    block.style.maxHeight = maxHeight;
    maxHeightValue.value = maxHeightRange.value;

    const cssCode = `max-height: ${maxHeight};`;
    document.getElementById('cssCode3').value = cssCode;

    blockWrapper.style.maxHeight = maxHeight;
}




