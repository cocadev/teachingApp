const functions = require('firebase-functions')
const admin = require('firebase-admin')
const moment = require('moment');

admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.testkey)



exports.stripeCharge = functions.database
                                .ref('/payments/{userId}/{paymentId}')
                                .onWrite(event => {

                                  

  const payment = event.data.val();
  const timePrem = payment.months;
  const now = new Date();
  var currentDate = moment().format('DD-MM-YYYY');
  var futureMonth = moment().add(timePrem, 'M').format('DD-MM-YYYY');

  
  console.log(payment);
  const userId = event.params.userId;
  const paymentId = event.params.paymentId;


  
 
                                
  console.log(paymentId);
  console.log(userId);
  // console.log(timePrem);
  // console.log(PremiumEnds);

  // checks if payment exists or if it has already been charged
  if (!payment || payment.charge) return;

  return admin.database()
      .ref(`/payments/${userId}`)
      .once('value')
      .then(snapshot => {
          return snapshot.val();
        })
        .then(customerIs => {

          
          const amount = payment.amount;
          
          // const PremiumEnds  = now.setMonth(now.getMonth()+timePrem);


          const idempotency_key = paymentId;  // prevent duplicate charges
          const source = payment.token.tokenId;
          // console.log(source);
          let tomorrow = new Date().get;
          const currency = 'usd';
          const charge = {amount, currency, source};

          return stripe.charges.create(charge, { idempotency_key });

        })

        .then(charge => {

        if (!charge) return;

          let updates = {}
          const dayOfEnd = now.setMonth(now.getMonth()+timePrem);
          // const dateNice = dayOfEnd.getFullYear() + '-' + dayOfEnd.getMonth() + '-' + dayOfEnd.getDate(); 

          // updates[`/payments/${userId}/${paymentId}/charge`] = charge

          if (charge.paid) {
            updates[`/users/${userId}/premium/paid`] = true;
            updates[`/users/${userId}/premium/until`] = dayOfEnd;
            updates[`/users/${userId}/premium/untilNice`] = futureMonth;
          } else {
            updates[`/users/${userId}/premium/paid`] = false
          }

          updates[`/payments/${userId}/${paymentId}/charge`] = charge

          // if (charge.paid) {
          //   updates[`/users/123/premium/paid`] = true;
          //   updates[`/users/123/premium/until`] = PremiumEnds;
          // } else {
          //   updates[`/users/123/premium/paid`] = false
          // }

          // Run atomic update
          admin.database().ref().update(updates)

          //  admin.database()
          //       .ref(`/payments/${userId}/${paymentId}/charge`)
          //       .set(charge)
          // })


          })
                                })