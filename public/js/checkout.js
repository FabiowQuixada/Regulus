// TODO Put in environment variable;
const stripe = Stripe('pk_test_51Po8PdFDBwKaWQBp0jD0H4vLsoEvOGhPWaKIl9iXVBkALUWCysYLHXNtvngK4QPzq5vtwEMEcFc1cNYHI1PfHW9U00zGn7D286');

$('button.set-payment-instrument').on('click', () => {
    const stripeSessionId = $('#stripe-session-id').val();

    stripe.redirectToCheckout({
        sessionId : stripeSessionId
    });
});
