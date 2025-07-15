function displayItem(){
    const el= document.getElementsByTagName("h3");
    const p=document.querySelector("p");
    p.innerHTML = el[0].innerHTML;
}