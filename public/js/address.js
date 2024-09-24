$('form.user-address').on('submit', e => {
    e.preventDefault();

    const $form = $(e.target);
    const data  = {
        addressId       : $form.find('[name="id"]').val(),
        name            : $form.find('[name="name"]').val(),
        street          : $form.find('[name="street"]').val(),
        city            : $form.find('[name="city"]').val(),
        state           : $form.find('[name="state"]').val(),
        zip             : $form.find('[name="zip"]').val(),
        country         : $form.find('[name="country"]').val(),
        shouldSetAsMain : $form.find('[name="should-set-as-main"]').is(':checked')
    };

    $.ajax({
        url     : $form.attr('action'),
        type    : 'POST',
        data    : data,
        success : function(response) {
            if (response.success) {
            } else {
                response.errorList.forEach(error => {
                    const $inputContainer = $form.find(`.${error.field}-ctnr`);

                    $inputContainer.find('input').addClass('invalid');
                    $inputContainer.find('.error-msg').html(error.msg);
                });
            }
        }
    });
});
