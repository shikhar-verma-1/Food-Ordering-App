import menuArray from "./data.js";

const spanApp = document.getElementById('span-app');
const discountEl = document.getElementById('bill-discount');                    
const checkOutContainer = document.getElementById('checkOut-container');           

let orderArray = [];
let targetItemObj = {};
let removeItemObj = {};

let orderTotal = 0;


document.addEventListener('click',function(e){

    // Handles operation of increment button in the menu list.
    if(e.target.dataset.increase){         
        handleIncreaseClick(Number(e.target.dataset.increase));     
        orderOperation();
    }



    // Handles operation of decrement button in the menu list.
    else if(e.target.dataset.decrease){   
        handleDecreaseClick(Number(e.target.dataset.decrease));    
        orderOperation();
    }



    // Handles operation of remove button in the order section.
    else if(e.target.dataset.remove){                                          
       removeItem(Number(e.target.dataset.remove));                
    }
   


    // Handles operation of proceed to pay button in the order section.
    else if((e.target.id === "proceed-to-pay-button")||(e.target.id === "container-close-btn")){     
        if (orderTotal!==0){
            checkOutContainer.classList.toggle("hidden"); 
            spanApp.classList.toggle('blur');         
        }         
                                           
    }



    // Handles operation of close button in the checkout section.
    else if(e.target.id === "container-close-btn"){                            
        checkOutContainer.style.display="none"; 
        spanApp.classList.toggle('blur');                                                   
    }
        
    

    // Handles operation of submit button of form in the checkout section.
    else if(e.target.id === "form-button"){   

        formOperation();   

    };
    
});



// Contains all the functions related to order section.

function orderOperation(){           

    renderOrder();           
    renderOrderTotal();      
    discountOperation();     

};



// Increments item quantity.

function handleIncreaseClick(itemID){   

    targetItemObj = menuArray.filter((item)=>{return item.id === itemID})[0];

    if(!orderArray.includes(targetItemObj)){

        targetItemObj.quantity = 1;
        targetItemObj.total = targetItemObj.price * targetItemObj.quantity;
        orderArray.push(targetItemObj);

    }

    else{

        targetItemObj.quantity++;
        targetItemObj.total = targetItemObj.price * targetItemObj.quantity;

    };
    
    document.getElementById(`quantity-display-${itemID}`).textContent = targetItemObj.quantity;  
};



// Decreases item qunatity only when quantity !== 0;

function handleDecreaseClick(itemID){  
     
    targetItemObj = menuArray.filter((item)=>{return item.id === itemID})[0];
    
    if(targetItemObj.quantity!==0){

        targetItemObj.quantity--; 
        targetItemObj.total = targetItemObj.price * targetItemObj.quantity;  

    };
   
    document.getElementById(`quantity-display-${itemID}`).textContent = targetItemObj.quantity;
      
};




// Renders all the items in menu section from the menu array.

function getFeedhtml(){  

    let html="";

    menuArray.map((item)=>{
        const{name,ingredients,id,emoji,price} = item;    
        html+= `<div class="menu-item" id=${id}">
                    <div class="item-emoji">${emoji}</div>
                    <div class="item-details">
                        <h3>${name}</h3>
                        <h4>${ingredients}</h4>
                        <h3>$${price}</h3>
                    </div>               
                     <div class="item-button-container" id="${id}">
                        <button class="item-button" id="decrease-btn-${id}" data-decrease="${id}">-</button>
                        <h2 class="item-quantity-display" id="quantity-display-${id}">0</h2>
                        <button class="item-button" id="increase"  data-increase="${id}">+</button>
                    </div>
                </div>
            
                `
    }).join("");

    document.getElementById('menu-list').innerHTML= html;
};

getFeedhtml();



// Renders all the selected items in the orders section.

function renderOrder(){  

    let html="";
    orderArray.map((item)=>{
        const{name,quantity,id,total} = item;
            if(quantity!==0){
                html+= `<div class="bill-item" id="bill-item">
                            
                            <h3 class="bill-item-detail">${name} x ${quantity}</h3>
                            <button id="remove-btn" data-remove="${id}">remove</button>
                            <h4 class="item-final-price bill-item-detail" id="${id}">$${total}</h4>
                              
                            
                        </div>
                        ` 
                
            };
    });

    document.getElementById('bill-content').innerHTML = html;
    
};



// Removes particular item from the order section.

function removeItem(itemID){

    removeItemObj = orderArray.filter((item)=>{return item.id === itemID})[0];
    orderArray = orderArray.filter((item)=> item.id!==removeItemObj.id);
    orderOperation();
    document.getElementById(`quantity-display-${itemID}`).textContent = 0;
   
};



// Renders total order amount.

function renderOrderTotal(){

    orderTotal = orderArray.reduce(function(total,itemTotal){
        return total + itemTotal.total
    },0);
    document.getElementById('total-amount').textContent = "$"+orderTotal;

};



// Renders final checkout amount after reducing applicable discount % from the total order amount.

function discountOperation(){

    const discountPercentage = document.getElementById('discount-percentage');
    let checkOutAmount = 0;
    let message="";
    
    if(orderTotal<100){
        discountEl.classList.add('hidden');
        message = `Proceed to Pay : $${orderTotal}`;
    }
    else if(orderTotal>=100 && orderTotal<=200){
        discountEl.classList.remove('hidden');
        discountPercentage.textContent = "-10%";
        checkOutAmount = Math.floor(orderTotal - (orderTotal * 0.10));
        message = `Proceed to Pay : $${checkOutAmount}`;

    }else if(orderTotal>=200 && orderTotal<=300){
        discountEl.classList.remove('hidden');
        discountPercentage.textContent = "-15%";
        checkOutAmount = Math.floor(orderTotal - (orderTotal * 0.15));
        message = `Proceed to Pay : $${checkOutAmount}`;

    }else if(orderTotal>=300){
        discountEl.classList.remove('hidden');
        discountPercentage.textContent = "-20%";
        checkOutAmount = Math.floor(orderTotal - (orderTotal * 0.20));
        message = `Proceed to Pay : $${checkOutAmount}`;

    }

   document.getElementById("proceed-to-pay-button").textContent = message;

};



// Handles form operation.

function formOperation(){

    const checkoutForm = document.getElementById('checkout-form');

    checkoutForm.addEventListener('submit',function(e){
        e.preventDefault();
    });
    const checkoutFormData = new FormData(checkoutForm);
    const userName = checkoutFormData.get('customer-name');

    let html="";
    html = `<img class="check-gif" src="images/372103860_CHECK_MARK_400px.gif">
            <h2 id="thanks-message">Dear <span id="thanks-message-name">${userName}</span> ,<br> Thanks for ordering!<br> Your order will be delivered under<br> 30 minutes.</h2>`
    document.getElementById("checkOut-container-inner").innerHTML = html;

};










