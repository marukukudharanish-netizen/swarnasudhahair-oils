
// ====== CONFIG: replace these with your real payment details ======
const RAZORPAY_PAYMENT_LINK = "https://rzp.io/i/your-payment-link"; // create a Razorpay Payment Link in your dashboard
const PAYPAL_BUSINESS_EMAIL = "your-paypal-email@example.com"; // PayPal email (for INR, ensure PayPal supports it for your account)
const WHATSAPP_NUMBER = "919000000000"; // no leading +

// ====== CART LOGIC ======
function getCart(){
  try{ return JSON.parse(localStorage.getItem('ss_cart')||'[]'); }catch(e){return []}
}
function setCart(items){
  localStorage.setItem('ss_cart', JSON.stringify(items));
  updateCartCount();
}
function updateCartCount(){
  const count = getCart().reduce((a,i)=>a+i.qty,0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}
function currencyINR(n){ return '₹' + n.toFixed(0); }

function addToCart(id, name, price, qty){
  qty = parseInt(qty||1,10);
  let cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += qty; }
  else { cart.push({id,name,price,qty}); }
  setCart(cart);
  alert('Added to cart!');
}

function removeFromCart(id){
  let cart = getCart().filter(i=>i.id!==id);
  setCart(cart);
  renderCart();
}

function clearCart(){
  localStorage.removeItem('ss_cart');
  updateCartCount();
  renderCart();
}

function renderCart(){
  const table = document.getElementById('cart-table');
  const empty = document.getElementById('cart-empty');
  const body = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  const actions = document.getElementById('checkout-actions');
  if(!body){ updateCartCount(); return; }
  const cart = getCart();
  if(cart.length===0){
    table.style.display='none'; actions.style.display='none'; empty.style.display='block';
    return;
  }
  empty.style.display='none'; table.style.display='table'; actions.style.display='flex';
  body.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    const sub = item.price * item.qty;
    total += sub;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td>
      <td>${currencyINR(item.price)}</td>
      <td><input type="number" min="1" value="${item.qty}" style="width:70px" onchange="updateQty('${item.id}', this.value)"></td>
      <td>${currencyINR(sub)}</td>
      <td><button class="btn btn-outline" onclick="removeFromCart('${item.id}')">Remove</button></td>`;
    body.appendChild(tr);
  });
  totalEl.textContent = currencyINR(total);
}

function updateQty(id, qty){
  qty = Math.max(1, parseInt(qty||1,10));
  let cart = getCart();
  const it = cart.find(i=>i.id===id);
  if(it){ it.qty = qty; }
  setCart(cart);
  renderCart();
}

// ====== CHECKOUT FLOWS ======
// Razorpay: open a generic Payment Link. User enters total manually in notes or you preset link amount per SKU.
function getCartTotal(){ return getCart().reduce((a,i)=>a+i.price*i.qty,0); }

function checkoutRazorpay(){
  const total = getCartTotal();
  if(!total){ alert('Cart is empty'); return; }
  // Option A: open your single payment link, buyer pays total and shares order details via WhatsApp.
  window.open(RAZORPAY_PAYMENT_LINK, '_blank');
  setTimeout(()=>checkoutWhatsApp(true), 500);
}

// PayPal: redirect to a simple Buy Now with total as a single item (ensure your account supports INR or switch to USD)
function checkoutPayPal(){
  const total = getCartTotal();
  if(!total){ alert('Cart is empty'); return; }
  const form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://www.paypal.com/cgi-bin/webscr';
  form.target = '_blank';
  form.innerHTML = `
    <input type="hidden" name="cmd" value="_xclick">
    <input type="hidden" name="business" value="${PAYPAL_BUSINESS_EMAIL}">
    <input type="hidden" name="item_name" value="Swarnasudha Hair Oil Order">
    <input type="hidden" name="amount" value="${total}">
    <input type="hidden" name="currency_code" value="INR">
  `;
  document.body.appendChild(form);
  form.submit();
  setTimeout(()=>checkoutWhatsApp(true), 500);
}

// WhatsApp order: send cart details to your WhatsApp
function checkoutWhatsApp(afterPay=false){
  const cart = getCart();
  if(!cart.length){ alert('Cart is empty'); return; }
  const total = getCartTotal();
  const lines = cart.map(i=>`• ${i.name} x ${i.qty} = ₹${i.price*i.qty}`);
  const msg = encodeURIComponent(`${afterPay?'Payment initiated. ':'Order enquiry:'}%0A${lines.join('%0A')}%0ATotal: ₹${total}%0AName:%0AAddress:%0APincode:%0APhone:`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

function openWhatsAppFromForm(form){
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  const msg = encodeURIComponent(`Enquiry from website:%0AName: ${name}%0APhone: ${phone}%0AMessage: ${message}`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  renderCart();
});
