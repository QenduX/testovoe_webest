{
    const products = document.querySelectorAll('.product-card');
    const btnsShow = document.querySelectorAll('.product-card__add-to-cart');
    const modal = document.querySelector('.popup');
    const modalBg = document.querySelector('.popup-bg');
    const cartCount = document.querySelector('.cart-count');

    function fetchData(searchProduct) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", window.location.href);
        xhr.responseType = "document";
        xhr.send();

        xhr.onload = function() {
            if (xhr.status != 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {
                const res = xhr.responseXML;

                const docProduct = document.querySelector(`#${searchProduct}`); //товар из документа
                const docCounter = docProduct.querySelector('.counter__input');

                const product = res.querySelector(`#${searchProduct}`); //товар из запроса
                const counter = product.querySelector('.counter__input'); 
                const btn = product.querySelector('.product-card__add-to-cart');

                product.querySelector('.product-card__description').removeAttribute('hidden');
                counter.value = docCounter.value;
                btn.innerText = 'Добавить в корзину';

                const modalWrapper = document.querySelector('.popup-wrapper'); // добавление товара в модалку
                modalWrapper.append(product);

                productCounter(product);

                addToCart(btn, counter, searchProduct, docProduct);
            }
        };
    }

    btnsShow.forEach(btn => {
        btn.addEventListener('click', function (e) {
            modal.classList.add('popup--active');
            fetchData(this.parentElement.id)
        })
    })

    modalBg.onclick = () =>  hideModal();

    products.forEach(el => { 
        productCounter(el);
    });

    function addToCart(btn, counter, productId, docProduct) {
        btn.addEventListener('click', function() {
            const storage = JSON.parse(localStorage.getItem('cart'));
            let products = []
            const product = {
                id: productId,
                count: counter.value,
            }

            if (storage) { //Добавление товара в storage
                if (storage.find(prod => prod.id.toLowerCase() === product.id.toLowerCase())) {
                    storage.splice(storage.findIndex(prod => prod.id.toLowerCase() === product.id.toLowerCase()), 1, product);
                    localStorage.setItem('cart', JSON.stringify(storage));
                    cartCounter(storage);
                }
                else {
                    products = [...storage, product];
                    localStorage.setItem('cart', JSON.stringify(products));
                    cartCounter(products);
                } 
            }
            else {
                products.push(product);
                localStorage.setItem('cart', JSON.stringify(products));
                cartCounter(products);
            }

            docProduct.querySelector('.counter__input').value = counter.value;
            hideModal()
        })
    }

    function hideModal() {
        modal.classList.remove('popup--active');
        modal.querySelector('.popup-wrapper').innerHTML = '';
    }

    function productCounter(product) { //счеткич на товар
        const counter = product.querySelector('.counter__input');
        const btnCountMinus = product.querySelector('.counter__decrease');
        const btnCountPlus = product.querySelector('.counter__increase');

        countMinus(btnCountMinus, counter);
        countPlus(btnCountPlus, counter)
    }

    function countMinus(btn, counter) {
        btn.onclick = () => {
            counter.value <= 1 ?  counter.value = 1 : counter.value--;
        }
    }

    function countPlus(btn, counter) {
        btn.onclick = () => {
            counter.value++
        }
    }
    function cartCounter(arr) { // обновление счетчика корзины
        if (arr) {
            let count = arr.reduce((sum, current) => sum + Number(current.count), 0)
            cartCount.innerText = count;
        }
    }

    window.addEventListener('load', function() { // обновление товаров из storage
        const storage = JSON.parse(localStorage.getItem('cart'));
        
        if (storage) {
            cartCounter(storage);
            products.forEach(el => {
                storage.forEach(prod => {
                    if (prod.id.toLowerCase() === el.id.toLowerCase()) {
                        el.querySelector('.counter__input').value = prod.count;
                    }
                })
            })
        }
    })
}