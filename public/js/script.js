(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // document.getElementById('search-btn').addEventListener('click', () => {
  //   console.log('Button is clicked');
   
  // });
  
  // function search(){
  //   let filter = document.getElementById("find").value.toUpperCase();

  //   let item = document.getElementById("products");

  //   let p = document.getElementsByTagName('p')

  //   for(var i= 0 ; i<=p.length; i++){
  //     let a = item[i].getElementsByTagName('p')[0];

  //     let value = a.innerHTML|| a.innerText || a.textContent;

  //     if (value.toUpperCase().indexOf(filter) > -1) {
  //       item[i].style.display = "";
  //     }
  //     else{
  //       item[i].style.display = "none";
  //     }
  //   }
  // }