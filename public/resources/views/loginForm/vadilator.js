// Viết mã JS tại đây
function Validator(options){

  var selectorRule = {};

  function getParent(element, selector) {
    while(element.parentElement){
      if(element.parentElement.matches(selector)){
          return element.parentElement;
      }
      element = element.parentElement;
    }
  }

    var formElement = document.querySelector(options.form);
    if(formElement){
      formElement.onsubmit = function(e){
        e.preventDefault();
      }
    }

    //validate
    function validate(inputElement, rule){
      var errMess;
      var errElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message')

      var rules = selectorRule[rule.selector]; 

      for(var i = 0;i<rules.length;++i){
          switch(inputElement.type){
            case 'radio':
            case 'checkbox':
              errMess = rules[i](
                formElement.querySelector(rule.selector + ':checked')
                );
                break;
            default:
              errMess = rules[i](inputElement.value);
          }

          if(errMess) break;
      }

      if(errMess){
          errElement.innerText = errMess;
           getParent(inputElement, options.formGroupSelector).classList.add('invalid')
      }
      else{
        errElement.innerText = '';
        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
      }
      return !errMess
    }

    if(formElement){

      formElement.onsubmit = function(e){
        e.preventDefault();

        var isSuccess =true;

        //lap qua tung rule va validate
        options.rules.forEach(function(rule){
          var inputElement = formElement.querySelector(rule.selector);
          var isValid = validate(inputElement, rule);
          if(!isValid){
            isSuccess = false;
          }
        });


        if(isSuccess){
          //submit with js
          if(typeof options.onSubmit === 'function'){
            var formEnableInput = formElement.querySelectorAll('[name]:not([disable])');
            var formValue = Array.from(formEnableInput).reduce(function(values, input){
              switch (input.type){
                case 'radio':
                case 'checkbox': 
                  values[input.name] = formElement.querySelector('input[name="' + input.name +'"]:checked').value;
                  break;
                default :
                values[input.name] = input.value;
              }
              return values;
              
            }, {});
            options.onSubmit(formValue)
          }
          //submit with default
          else{
            formElement.submit();
          }
        }
      }
      options.rules.forEach(function(rule){

        //save rule 
        if(Array.isArray(selectorRule[rule.selector])){
          selectorRule[rule.selector].push(rule.test)
        }else{
           selectorRule[rule.selector] = [rule.test]
        }

        var inputElements = formElement.querySelectorAll(rule.selector);

        Array.from(inputElements).forEach(function (inputElement) {
          inputElement.onblur = function(){
            validate(inputElement, rule);
//            console.log(rule);
          }
          // inputElement.oninput = function() {
          //   var errElement = getParent(inputElemen,options.formGroupSelector).querySelector('.form-message');
          //   errElement.innerText ='';
          //   getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
          // }
        })

      });
    }
    
  }
  // khi có lỗi => trả ra mes có lỗi
  // khi hợp lệ => ko trả j (underfined)
  // trim : loại bỏ mọi khoảng trắng
  Validator.isRequired = function(selector) {
    return {
      selector: selector, 
      test: function(value){
          return value  ? undefined : "vui lòng nhập lại"
      }
    };
  }
  
  Validator.isEmail = function(selector) {
     return {
      selector: selector, 
      test: function(value){
          var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          return regex.test(value) ? undefined : "cần nhập email"
      }
    };
  }

  Validator.minLength = function(selector, min) {
    return {
     selector: selector, 
     test: function(value){
         return value.length >= min ? undefined : "cần nhập mật khẩu"
     }
   };
 }

 Validator.isConfirmed = function(selector, confirmValue) {
  return {
   selector: selector, 
   test: function(value){
     return value === confirmValue() ? undefined : 'giá trị nhập vào không đúng'
   }
 };
}