// $(document).ready(function(){
//     $(".payment").on('click',(e)=>{
//         var tourId = this.id
//         alert('Wait for sec',tourId,{
//           key:PUBLISHABLE_KEY
//         })
        
//       })
// })

// Create a token or display an error when the form is submitted.
var form = document.getElementById('tourId');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});
