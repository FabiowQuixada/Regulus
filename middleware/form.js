const { validationResult } = require('express-validator');

// TODO Put this function in /util/form.js?
const getFormData = req => {
    const errorData   = validationResult(req);
    const userInput   = {};
    const fieldErrors = {};

    for (const prop in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, prop)) {
            userInput[prop] = req.body[prop];
        }
    }

    errorData.errors.forEach(error => {
        fieldErrors[error.path] = error.msg;
    });

    return {
        userInput,
        fieldErrors,
        hasErrors : () => errorData.errors.length > 0
    };
};

const validateForm = viewPath => {
    return (req, res, next) => {
        const formData = getFormData(req);

        if (formData.hasErrors()) {
            res
                .status(402)
                .render(viewPath, { ...formData });
            return;
        }

        next();
    };
};

module.exports = {
    validateForm,
    getFormData
};


