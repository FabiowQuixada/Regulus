const stripe = Stripe('pk_test_51Po8PdFDBwKaWQBp0jD0H4vLsoEvOGhPWaKIl9iXVBkALUWCysYLHXNtvngK4QPzq5vtwEMEcFc1cNYHI1PfHW9U00zGn7D286');

$('input[name="shipping-address-id"]').on('change', () => {
    const isSavedAddressSelected = $('input[name="shipping-address-id"]:checked').val() != -1;
    $('.new-shipping-address-form-ctnr').toggleClass('d-none', isSavedAddressSelected);
});

$('form.shipping-address-form').on('submit', e => {
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
            if (result.success) {
                $('.selected-shipping-address-id').val(result.shippingAddressId);
            }
        }
    });
});

$('form.shipping-method-form').on('submit', e => {
    e.preventDefault();

    const $form            = $(e.target);
    const shippingMethodId = $form.find('input:radio[name="shipping-method-id"]:checked').val();

    $.ajax({
        url     : $form.attr('action'),
        type    : 'POST',
        data    : {
            shippingMethodId
        },
        success : function(result) {
        }
    });
});

$('.use-same-as-shipping-address').on('change', () => {
    const isChecked = $('.use-same-as-shipping-address').is(':checked');

    $('.billing-form-fields').toggleClass('d-none', isChecked);
});

$('form.billing-address-form').on('submit', e => {
    e.preventDefault();

    const $form        = $(e.target);
    const isNewAddress = !$form.find('.use-same-as-shipping-address').is(':checked');
    const data         = {};

    if (isNewAddress) {
        data.addressId         = -1;
        data.name              = $form.find('.name').val();
        data.street            = $form.find('.street').val();
        data.city              = $form.find('.city').val();
        data.state             = $form.find('.state').val();
        data.zip               = $form.find('.zip').val();
        data.country           = $form.find('.country').val();
        data.shouldSaveAddress = $form.find('.should-save-address').is(':checked');
        data.shouldSetAsMain   = $form.find('.should-set-as-main').is(':checked');
    } else {
        data.addressId = $('.selected-shipping-address-id').val();
    }

    $.ajax({
        url     : $form.attr('action'),
        type    : 'POST',
        data    : data,
        success : function(result) {
            const stripeSessionId = $('#stripe-session-id').val();

            if (result.success) {
                stripe.redirectToCheckout({
                    sessionId : stripeSessionId
                });
            }
        }
    });
});
