const products = [
 {id:1,name:"Oversized Studio Tee",category:"Kläder",price:349,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",tag:"POPULÄR"},
 {id:2,name:"Everyday Knit",category:"Kläder",price:699,image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",tag:"NYHET"},
 {id:3,name:"Minimal Watch",category:"Elektronik",price:1299,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",tag:"UTVALD"},
 {id:4,name:"Wireless Headphones",category:"Elektronik",price:899,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",tag:""},
 {id:5,name:"City Runner",category:"Skor",price:1099,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",tag:"POPULÄR"},
 {id:6,name:"Classic Low Sneaker",category:"Skor",price:949,image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",tag:""},
 {id:7,name:"Personlig styling",category:"Tjänster",price:499,image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",tag:"BOKNINGSBAR"},
 {id:8,name:"Teknikhjälp 60 min",category:"Tjänster",price:599,image:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=80",tag:"BOKNINGSBAR"}
];
let activeCategory="Alla", cart={};
const money = n => new Intl.NumberFormat("sv-SE",{style:"currency",currency:"SEK",maximumFractionDigits:0}).format(n);
const grid=document.getElementById("product-grid");
function renderProducts(){
 const term=document.getElementById("search").value.trim().toLowerCase();
 const shown=products.filter(p=>(activeCategory==="Alla"||p.category===activeCategory)&&(`${p.name} ${p.category}`).toLowerCase().includes(term));
 grid.innerHTML=shown.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.opacity='.15'">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="add-btn" data-add="${p.id}" aria-label="Lägg ${p.name} i kundvagnen">+</button></div><div class="product-meta"><div><h3>${p.name}</h3><div class="product-category">${p.category}</div></div><span class="price">${money(p.price)}</span></div></article>`).join("");
 document.getElementById("empty-state").hidden=shown.length>0;
}
function setCategory(cat){
 activeCategory=cat;
 document.querySelectorAll("[data-category]").forEach(el=>el.classList.toggle("active",el.dataset.category===cat));
 renderProducts();
}
document.querySelectorAll("[data-category]").forEach(el=>el.addEventListener("click",()=>setCategory(el.dataset.category)));
document.querySelectorAll("[data-nav]").forEach(el=>el.addEventListener("click",()=>{setCategory(el.dataset.nav);document.querySelector(".desktop-nav").classList.remove("open")}));
document.getElementById("search").addEventListener("input",renderProducts);
document.getElementById("search-focus").addEventListener("click",()=>{document.getElementById("search").focus();document.getElementById("shop").scrollIntoView({behavior:"smooth"})});
document.querySelector("[data-service-link]").addEventListener("click",()=>setCategory("Tjänster"));
grid.addEventListener("click",e=>{const id=Number(e.target.dataset.add);if(id){cart[id]=(cart[id]||0)+1;renderCart();openCart()}});
function renderCart(){
 const entries=Object.entries(cart).filter(([,q])=>q>0);
 const count=entries.reduce((s,[,q])=>s+q,0), total=entries.reduce((s,[id,q])=>s+products.find(p=>p.id===Number(id)).price*q,0);
 document.getElementById("cart-count").textContent=count;
 document.getElementById("drawer-count").textContent=`(${count})`;
 document.getElementById("subtotal").textContent=money(total);
 document.getElementById("cart-items").innerHTML=entries.length?entries.map(([id,q])=>{const p=products.find(x=>x.id===Number(id));return `<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-qty="${id}" data-delta="-1" aria-label="Minska antal">−</button><span>${q}</span><button data-qty="${id}" data-delta="1" aria-label="Öka antal">+</button></div></div><strong>${money(p.price*q)}</strong></div>`}).join(""):'<p class="cart-empty">Din kundvagn är tom.</p>';
}
document.getElementById("cart-items").addEventListener("click",e=>{if(e.target.dataset.qty){const id=e.target.dataset.qty;cart[id]=Math.max(0,(cart[id]||0)+Number(e.target.dataset.delta));if(!cart[id])delete cart[id];renderCart()}});
const drawer=document.getElementById("cart-drawer"),overlay=document.getElementById("overlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("open");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open");drawer.setAttribute("aria-hidden","true")}
document.getElementById("cart-open").addEventListener("click",openCart);document.getElementById("cart-close").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
document.getElementById("checkout").addEventListener("click",()=>{if(Object.keys(cart).length)document.getElementById("checkout-dialog").showModal()});
document.getElementById("checkout-close").addEventListener("click",()=>document.getElementById("checkout-dialog").close());
document.getElementById("continue-shopping").addEventListener("click",()=>{document.getElementById("checkout-dialog").close();closeCart()});
document.getElementById("menu-toggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();