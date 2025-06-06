const container = document.getElementById("container");
const header = document.getElementById("header");
const yehorButton = document.querySelectorAll(`#${container.id} div`)[1];
const emiilButton = document.querySelectorAll(`#${container.id} div`)[2];
const xYehorButton = document.getElementById("credit-yehor-x");
const xEmiilButton = document.getElementById("credit-emiil-x");
const creditYehor = document.getElementById("credit-yehor");
const creditEmiil = document.getElementById("credit-emiil");

function buttonClicked(which) {
    [header, yehorButton, emiilButton].forEach((v, i) => {
        v.style.display = "none";
    });

    if (which === "YEHOR") creditYehor.style.display = "flex";
    else if (which === "EMIIL") creditEmiil.style.display = "flex";
}

function xButtonClicked(which) {
    [header, yehorButton, emiilButton].forEach((v) => {
        v.style.display = "flex";
        if (v.id === "header") v.style.display = "block";
        else v.style.justifyContent = "center";
    });

    if (which === "YEHOR") creditYehor.style.display = "none";
    else if (which === "EMIIL") creditEmiil.style.display = "none";
}

yehorButton.addEventListener("click", () => {buttonClicked("YEHOR");});
emiilButton.addEventListener("click", () => {buttonClicked("EMIIL");});

xYehorButton.addEventListener("click", () => {xButtonClicked("YEHOR");});
xEmiilButton.addEventListener("click", () => {xButtonClicked("EMIIL");});

function loadHomePage() {
    document.location.href = "http://127.0.0.1:3000/index.html";
}