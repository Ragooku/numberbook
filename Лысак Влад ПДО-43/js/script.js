'use strict';
// Variables
let modalBtnAddContact = document.querySelector('.block__add'),
    modalBtnCancel = document.querySelector('.btn-secondary'),
    modal = document.querySelector('#modalContacts'),
    parentClass = document.querySelector('.block-contacts'),
    search = document.querySelector('.input-search'),
    blockError = document.querySelector('.container-errors');
    
    let name = document.getElementById('name'),
        phone = document.getElementById('phone'),
        idContact = 0;
    
    let emptyBlock= document.querySelector('.empty');
    
    emptyBlock.style.display = "none"
    
    const forms = document.querySelector('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Контакт добавлен!',
        failure: 'Произошла ошибка добавления контакта'
    };

    let contactsUsers = new Array();
    let error = new Array();

    // Clicks: "Open and Close modal"
    modalBtnAddContact.addEventListener('click', openModal);
    modalBtnCancel.addEventListener('click', closeModal);

    // Submit form contact user

    forms.addEventListener('submit', (e) => {
        e.preventDefault(); 
        addContactList();
    });
    
    // Search contact user
    search.addEventListener('input', searchContacts);

//                   Function: "Open and Close modal"

function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    modal.style.background = "rgba(0,0,0,.2)";
    document.body.style.overflow = 'hidden';
}

//                           CheckingBoxFav

    let checkingBox = 0;
    let favorite = document.getElementById('flexCheckDefault');
    favorite.addEventListener('change', () => {
        favorite.checked ? checkingBox = 1 : checkingBox = 0;
    });

//                               Function: Searching

    function searchContacts(){
        answerErrorNull();
        let checkSearch = checkInputs(search, search.value, 'search');
        if(checkSearch){
            if(contactsUsers.length > 1){
                let val = this.value.trim();
                let counterRemote = contactsUsers.length;
                if(val != ''){
                    for (let i = 0; i < contactsUsers.length; i++){
                        let block = "div[id='" + contactsUsers[i][3] + "']";

                        if (contactsUsers[i][0].search(val) == -1){
                            document.querySelector(block).style.display = "none";
                            counterRemote--;
                        }else {
                            document.querySelector(block).style.display = "flex";
                        }
                    }

                    if(counterRemote == 0) {
                        checkInputsErrors (search, 'yellow');
                        showCloseNFC(emptyBlock, "block");
                    }else {
                        checkInputsErrors (search, 'grey');
                        showCloseNFC(emptyBlock, "none");
                    }

                }else {
                    showCloseNFC(emptyBlock, "none");
                    for (let i = 0; i < contactsUsers.length; i++){
                        let block = "div[id='" + contactsUsers[i][3] + "']";
                        document.querySelector(block).style.display = "flex";
                    }
                }
            }
        }
    }

//                             Function: answerValNullInput

    function answerValNull(input) { input.value = ""; }

//                            Function:    answerErrors

    function answerErrors(er) { error.push(er); }

//                             Function:   answerErrorsOutput

    function answerErrorsOutput() {
        let alert = document.querySelector('.alert')
        for (let i = 0; i < error.length; i++){
                blockError.innerHTML += "<span class='error'>" + error[i] + "</span>";
        }
        error.length === 0 ? alert.style.display = "none" : alert.style.display = "block";
        
    }

//                             Function:    answerErrorNull

    function answerErrorNull() {
        error = [];
        blockError.innerHTML = "";
        checkInputsErrors(name, 'grey');
        checkInputsErrors(phone, 'grey');
    }

//                              Function:     Showing/Closing not found contacts 

    function showCloseNFC(input, type) {
        input.style.cssText = `display: ${type}`; 
    }

//                               Function:    checkInputsErrors

    function checkInputsErrors (input, color){
        if (color == 'red'){
            input.style.border='1px solid #E15562';
        }else if(color == 'grey'){
            input.style.border='1px solid #D8DADB';
        }else if(color == 'yellow'){
            input.style.border='1px solid #FFC107';
        }
    }

//                               Function:       checkMaskInput

    function checkMaskInput(input, name) {
        let masks;

        if (name == "phone"){
            masks = /^\+7 \(\d\d\d\) \d\d\d-\d\d-\d\d$/;
        }else if(name == "name" || name == "search") {
            masks = /^[a-zA-Zа-яА-Я']{1,10}?$/;
        }

        let valid = masks.test(input);
        return valid;
    }

//                                Function:          Check

    function checkInputs(input, val, type) {
        let key;
        if(type == "name" || type == "phone"){
            if(!checkMaskInput(val, type)) {
                checkInputsErrors(input, 'red');
                type == "name" ? answerErrors("The name must contain only letters!") : answerErrors("The phone is entered incorrectly!");
                return false;
            }else  {
                checkInputsErrors(input, 'grey');
            }

            type == "name" ? key = 0 : type == "phone" ? key = 1 : 0;

            for (let i = 0; i < contactsUsers.length; i++) {
                if(contactsUsers[i][key] == val) {
                    checkInputsErrors(input, 'red');
                    type == "name" ? answerErrors("The name already exists!") : answerErrors("The phone already exists!");
                    return false;
                }else  {
                    checkInputsErrors(input, 'grey');
                }
            }
            return true;
        }else if(type == "search"){
            if (val != "") {
                if (!checkMaskInput(val, type)) {
                    checkInputsErrors(input, 'red');
                    answerErrors("The search must contain only letters!");
                    return false;
                } else {
                    checkInputsErrors(input, 'grey');
                }
            }else {
                checkInputsErrors(input, 'grey');
            }
            return true;
        }else {
            alert('err');
        }
    }

//                                  Function:       contactSort

    function contactSort() {
        // Sorting by name
        let contactArrName = new Array(); // Sorted array of names

        //Copying names from the source array

        for (let i = 0; i < contactsUsers.length; i++){
            contactArrName[i] = contactsUsers[i][0];
        }

        contactArrName.sort((a, b) => a.localeCompare(b));

        //sorting by template (contactArrName)
        for (let i = 0; i < contactsUsers.length; i++){
            for (let j = 0; j < contactArrName.length; j++){
                if (contactsUsers[i][0] == contactArrName[j]) {
                    let z = contactsUsers[j];
                    contactsUsers[j] = contactsUsers[i];
                    contactsUsers[i] = z;
                }
            }
        }

        //                  Sort by favorites
        for (let i = 0; i < contactsUsers.length; i++){
            for (let j = 0; j < contactsUsers.length-1; j++){
                if (contactsUsers[j][2] < contactsUsers[j + 1][2]) {
                    let r = contactsUsers[j];
                    contactsUsers[j] = contactsUsers[j + 1];
                    contactsUsers[j + 1] = r;
                }
            }
        }
    }

//                                   Function: contact with the rendering map

    function renderCardContact() {
        answerErrorNull();
    parentClass.innerHTML = "";
    
        for (let i = 0; i < contactsUsers.length; i++){
            let favorite, idFav;
            if(contactsUsers[i][2] > 0) {
                favorite = "enable"
                idFav = contactsUsers[i][3] 
            } else {
                favorite = "disable"
                idFav = contactsUsers[i][3]
            }
            parentClass.innerHTML += `
            <div id = ${contactsUsers[i][3]} class="block__item flex">
                <img class="user" src="img/user.svg" alt="Icon">
                <div class="block__dscr">
                    <h2 class="block__name">${contactsUsers[i][0]}</h2>
                    <div class="block__phone">${contactsUsers[i][1]}</div>
                </div>
                
                <div class="block__elem flex">
                    <button class="dagger" id="${contactsUsers[i][3]}" onclick="removeContactList(this.id)"'></button>
                    <button class="favorite ${favorite}" id = "${idFav}" onclick="favoriteContact(this.id)"></button>
                </div>
            </div>
            `;
        }
    }

//                                   Function: MaskInputPhone

    function MaskInputPhone() {

        function mask(event) {
            const keyCode = event.keyCode;
            let pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            let matrix = "+7 (___) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5)  this.value = ""
        }
    
        phone.addEventListener("input", mask, false);
        phone.addEventListener("focus", mask, false);
        phone.addEventListener("blur", mask, false);
        phone.addEventListener("keydown", mask, false)
    
    }
    MaskInputPhone ();

    answerValNull(search);

    // Function: removeContactList
    function removeContactList(clicked_id) {
        for (let i = 0; i < contactsUsers.length; i++) {

            if(contactsUsers[i][3] == clicked_id) {
                contactsUsers.splice(i, 1);
                renderCardContact();
            }
            if(contactsUsers.length == 0) {
                parentClass.innerHTML = `            
                <div class="block__none">
                    <span>Вы удалили все контакты.</span>
                </div>`;
            }
        }

        answerValNull(search);
    }

    // Function: added favoriteContact
    function favoriteContact(clicked_id) {
        for (let i = 0; i < contactsUsers.length; i++) {
            if(contactsUsers[i][3] == clicked_id) {
                if(contactsUsers[i][2] == 0){
                    contactsUsers[i][2] = 1;
                }else if(contactsUsers[i][2] == 1){
                    contactsUsers[i][2] = 0;
                }else {
                    alert("err");
                }
            }
        }
        contactSort();
        renderCardContact();
        answerValNull(search);
    }

// Function: AddContact
    function addContactList(){

        let nameValue = name.value,
            phoneValue = phone.value,
            checkPhone, checkName;

        if(phoneValue === ""){
            answerErrors("The phone should not be empty!");
            checkInputsErrors(phone, 'red');
        }else {
            checkPhone = checkInputs(phone, phoneValue, 'phone');
        }

        if(nameValue === ""){
            answerErrors("The name should not be empty!");
            checkInputsErrors(name, 'red');
        }else {
            if(nameValue.length < 3){
                answerErrors("Name too small (min of 3 letters)!");
                checkInputsErrors(name, 'red');
            }else if(nameValue.length > 10){
                answerErrors("Name too large (max of 10 letters)!");
                checkInputsErrors(name, 'red');
            }else {
                checkName = checkInputs(name, nameValue, 'name');
            }
        }

        if(checkName && checkPhone){
            contactsUsers.push([nameValue, phoneValue, checkingBox, idContact++]);
            showThanksModal(message.success)
            answerValNull(name);
            answerValNull(phone);

            contactSort();
            renderCardContact();
        } else {
            showThanksModal(message.failure)
        }
        answerErrorsOutput();
        
    }

// Function: "Answer user"

    function showThanksModal(message) {
                
        modal.classList.add('hide');

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal-container').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            modal.classList.add('show');
            modal.classList.remove('hide');
            closeModal('.modal-container');
        }, 1000)
    }
