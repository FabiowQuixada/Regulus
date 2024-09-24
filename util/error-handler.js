const handle = error => {
    const result = [];

    if (error.name == 'SequelizeValidationError') {
        error.errors.forEach(e => {
            result.push({
                field : e.path,
                msg   : e.message
            });
        });
    }

    return result;
};

export default {
    handle
};
