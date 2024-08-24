// TODO Put in environment variable;
const stripe = Stripe('pk_test_51Po8PdFDBwKaWQBp0jD0H4vLsoEvOGhPWaKIl9iXVBkALUWCysYLHXNtvngK4QPzq5vtwEMEcFc1cNYHI1PfHW9U00zGn7D286');

$('button.set-payment-instrument').on('click', () => {
    const stripeSessionId = $('#stripe-session-id').val();

    stripe.redirectToCheckout({
        sessionId : stripeSessionId
    });
});

$('input[name="shipping-address-id"]').on('change', () => {
    const selectedValue = $('input[name="shipping-address-id"]:checked').val();

    if (selectedValue == -1) {
        $('.shipping-address-form-ctnr').attr('status', 'selected');
    } else {
        $('.shipping-address-form-ctnr').attr('status', 'unselected');
    }
});

$('form.shipping-form').on('submit', e => {
    e.preventDefault();

    const $form = $(e.target);
    const addressId = $form.find('input:radio[name="shipping-address-id"]:checked').val();
    const isNewAddress = addressId == -1;
    const data = {};

    if (isNewAddress) {
        data.addressId = addressId;
        data.name              = $form.find('.name').val();
        data.street            = $form.find('.street').val();
        data.city              = $form.find('.city').val();
        data.state             = $form.find('.state').val();
        data.zip               = $form.find('.zip').val();
        data.country           = $form.find('.country').val();
        data.shouldSaveAddress = $form.find('.should-save-address').is(':checked');
        data.shouldSetAsMain   = $form.find('.should-set-as-main').is(':checked');
    } else {
        data.addressId = addressId;
    }

    $.ajax({
        url     : $form.attr('action'),
        type    : 'POST',
        data    : data,
        success : function(result) {
        }});
});
